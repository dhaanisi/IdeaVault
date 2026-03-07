import posthog from "posthog-js";
import { keys } from "./keys";

export const initializeAnalytics = () => {
  const env = keys();

  if (!env.NEXT_PUBLIC_POSTHOG_KEY || !env.NEXT_PUBLIC_POSTHOG_HOST) {
    return;
  }

  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-05-24",
  });
};
