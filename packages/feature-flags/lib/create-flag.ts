import { analytics } from "@repo/analytics/server";
import { auth } from "@repo/auth/server";
import { flag } from "flags/next";

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const { userId } = await auth();

      if (!userId) {
        return false;
      }

      const isEnabled = await analytics?.isFeatureEnabled(key, userId);

      return isEnabled ?? false;
    },
  });
