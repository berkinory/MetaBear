import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  client: {
    PUBLIC_WWW_URL: z.string().url().optional(),
  },
  clientPrefix: "PUBLIC_",
  emptyStringAsUndefined: true,
  runtimeEnv: {
    PUBLIC_WWW_URL:
      (typeof process !== "undefined"
        ? process.env.PUBLIC_WWW_URL
        : undefined) ||
      ((import.meta as unknown as { env?: Record<string, string> }).env
        ?.PUBLIC_WWW_URL as string | undefined),
  },
});
