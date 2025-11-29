
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { WasteJob } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const wasteRouter = {
  /**
   * Create a new waste disposal job.
   */
  create: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string().url(),
        location: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
        // Category can be optional if we want to determine it on the backend
        category: z
          .enum(["plastic", "paper", "glass", "bio", "electronics", "mixed"])
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newJob = await ctx.db
        .insert(WasteJob)
        .values({
          photoUrl: input.photoUrl,
          lat: input.location.lat.toString(),
          lon: input.location.lon.toString(),
          requesterId: ctx.session.user.id,
          category: input.category ?? null,
        })
        .returning();
      return newJob[0];
    }),

  /**
   * List available waste disposal jobs within a certain radius.
   */
  list: publicProcedure
    .input(
      z.object({
        userLocation: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
        radius: z.number().positive(), 
      })
    )
    .query(({ input, ctx }) => {
      // TODO: Implement logic to find jobs within radius from the database
      // and calculate distance.
      // This is a placeholder and does not filter by location.
      console.log("Listing waste jobs near:", input.userLocation);
      return ctx.db.query.WasteJob.findMany({
        where: eq(WasteJob.status, "open"),
      });
    }),

  /**
   * Get details for a single waste disposal job.
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.db.query.WasteJob.findFirst({
        where: eq(WasteJob.id, input.id),
      });
    }),

  /**
   * Accept a waste disposal job.
   */
  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.db
        .update(WasteJob)
        .set({
          contractorId: ctx.session.user.id,
          status: "accepted",
        })
        .where(eq(WasteJob.id, input.id));
    }),

  /**
   * Complete a waste disposal job.
   */
  complete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completionPhotoUrl: z.string().url(),
        completionLocation: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
      })
    )
    .mutation(({ input, ctx }) => {
      // TODO: Validate completion (e.g., location)
      return ctx.db
        .update(WasteJob)
        .set({
          status: "completed",
          completionPhotoUrl: input.completionPhotoUrl,
          completionLat: input.completionLocation.lat.toString(),
          completionLon: input.completionLocation.lon.toString(),
        })
        .where(eq(WasteJob.id, input.id));
    }),
} satisfies TRPCRouterRecord;
