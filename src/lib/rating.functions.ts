import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({ idToken: z.string().min(10), gameId: z.string().min(1) });

/**
 * Client entry point for rating updates. All of the logic (and the only write
 * access to ratings) lives in trusted server code.
 */
export const submitRatedResult = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => input.parse(data))
  .handler(async ({ data }) => {
    const { applyRatedResult } = await import("@/lib/rating.server");
    return applyRatedResult(data.idToken, data.gameId);
  });
