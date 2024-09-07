import { NextResponse } from "next/server";
import OpenAI from "openai";

// Set OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TODO: Describe an Appropriate System Prompt
const systemPrompt = ``;

// TODO: Describe an Appropriate Model
const model = ``;

export async function POST({ req }: { req: Request }) {
    const data = await req.json();

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            ...lastDataWithoutLastMessage,
            { role: "user", content: lastMessageContent },
        ],
        model: model,
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();

            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta.content;

                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                controller.error(error);

            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream);
}