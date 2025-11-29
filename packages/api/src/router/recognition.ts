
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { WasteJob } from "@acme/db/schema";

import { publicProcedure } from "../trpc";

export const recognitionRouter = {
  /**
   * Analyzes an image and returns the most likely waste category.
   * This is a mock implementation.
   */
  categorizeImage: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        jobId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Categorizing image:", input.imageUrl);

      // const prompt = `Based on the image, what is the most appropriate waste category for this item?
      // Possible categories are: plastic, paper, glass, bio, electronics, mixed.
      // Return only the category name.`;

      // TODO: call the google gemini api

      // const response = await callGeminiApi(input.imageUrl, prompt);
      // const category = response.category;
      const category = "electronics"; // Mock response

      await ctx.db
        .update(WasteJob)
        .set({ category: category })
        .where(eq(WasteJob.id, input.jobId));

      return { category: category };
    }),
} satisfies TRPCRouterRecord;
