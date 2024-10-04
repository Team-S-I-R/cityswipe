"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

function initPostHog() {
    if (typeof window !== "undefined" && !posthog.__loaded) {
        posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
            api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
            person_profiles: "identified_only",
            capture_pageview: true,
        })
    }
}

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        initPostHog()
    }, [])

    if (typeof window === "undefined") {
        return <>{children}</>
    }

    return (
        <PostHogProvider client={ posthog }>{ children }</PostHogProvider>
    )
}