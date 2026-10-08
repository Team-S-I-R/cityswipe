import { APICallError, RetryError } from "ai";
import logger from "./logger";

// Google retires dated Gemini releases, so the primary model is the rolling "latest"
// alias rather than a pinned version that will 404 once it is sunset.
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "models/gemini-flash-latest";

// Gemini quotas are counted per model. When the primary model's daily free-tier
// allowance is spent (HTTP 429) or the model is retired (HTTP 404), one of these
// can still answer. Override with a comma-separated GEMINI_FALLBACK_MODELS.
// Flash-Lite answers in a few seconds, which keeps the action well inside serverless time limits.
const DEFAULT_FALLBACK_MODELS = "models/gemini-3.5-flash-lite,models/gemini-3.5-flash";

export const GEMINI_MODELS = Array.from(new Set([
  GEMINI_MODEL,
  ...(process.env.GEMINI_FALLBACK_MODELS ?? DEFAULT_FALLBACK_MODELS)
    .split(",").map((model) => model.trim()).filter(Boolean),
]));

export function isGeminiConfigured() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  return Boolean(key) && key !== "...";
}

type ApiFailure = { statusCode?: number; message: string };

function isNamed(error: unknown, name: string): error is Error & Record<string, unknown> {
  return error instanceof Error && error.name === name;
}

// `ai` and `@ai-sdk/google` bundle different `@ai-sdk/provider` releases, so the
// `isInstance` markers do not always match the thrown error; the error name is the
// stable signal across versions.
function apiError(error: unknown): ApiFailure | undefined {
  const cause = RetryError.isInstance(error) || isNamed(error, "AI_RetryError")
    ? (error as { lastError?: unknown }).lastError
    : error;
  return APICallError.isInstance(cause) || isNamed(cause, "AI_APICallError")
    ? (cause as ApiFailure)
    : undefined;
}

export function isQuotaError(error: unknown) {
  return apiError(error)?.statusCode === 429;
}

/** Errors another model may still get past: quota spent, model retired, or service overloaded. */
export function isModelUnavailable(error: unknown) {
  const status = apiError(error)?.statusCode;
  return status === 429 || status === 404 || status === 503;
}

export function describeGeminiError(error: unknown) {
  const api = apiError(error);
  if (api) return `HTTP ${api.statusCode ?? "?"}: ${api.message}`.slice(0, 400);
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}

/** Runs a Gemini request, moving to the next configured model while the current one is unavailable. */
export async function withGeminiFallback<T>(
  run: (modelId: string) => Promise<T>,
  models: string[] = GEMINI_MODELS,
): Promise<T> {
  let lastError: unknown;
  for (let index = 0; index < models.length; index++) {
    try {
      return await run(models[index]);
    } catch (error) {
      lastError = error;
      const next = models[index + 1];
      if (!next || !isModelUnavailable(error)) throw error;
      logger.warn(`Gemini model ${models[index]} unavailable (${describeGeminiError(error)}); trying ${next}`);
    }
  }
  throw lastError;
}
