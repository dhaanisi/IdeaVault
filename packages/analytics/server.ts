import "server-only";
import { PostHog } from "posthog-node";
import { keys } from "./keys";

const env = keys();

export const analytics =
  env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST
    ? new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: env.NEXT_PUBLIC_POSTHOG_HOST,

        // serverless safe
        flushAt: 1,
        flushInterval: 0,
      })
    : null;
