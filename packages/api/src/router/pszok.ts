
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// Mock PSZOK data. In a real application, this would come from a database
// or an external API.
const pszokPoints = [
  {
    id: "pszok-1",
    name: "PSZOK Warszawa-Bielany",
    location: { lat: 52.28, lon: 20.93 },
    categories: ["plastic", "paper", "glass", "electronics"],
  },
  {
    id: "pszok-2",
    name: "PSZOK Warszawa-Mokotów",
    location: { lat: 52.18, lon: 21.03 },
    categories: ["plastic", "paper", "glass", "bio"],
  },
];

export const pszokRouter = createTRPCRouter({
  /**
   * Finds the nearest PSZOK point that accepts a given waste category.
   */
  findNearest: publicProcedure
    .input(
      z.object({
        category: z.string(),
        userLocation: z.object({
          lat: z.number(),
          lon: z.number(),
        }),
      })
    )
    .query(({ input }) => {
      // TODO: Implement proper geo-distance calculation.
      // This is a simplified version.
      const compatiblePoints = pszokPoints.filter((p) =>
        p.categories.includes(input.category)
      );

      if (compatiblePoints.length === 0) {
        return null;
      }

      // Simplified distance calculation for demonstration purposes
      let nearestPoint = compatiblePoints[0];
      let minDistance = Number.MAX_VALUE;

      for (const point of compatiblePoints) {
        const distance = Math.sqrt(
          Math.pow(point.location.lat - input.userLocation.lat, 2) +
            Math.pow(point.location.lon - input.userLocation.lon, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
        }
      }

      return {
        ...nearestPoint,
        // This is not a real distance in km, for real implementation use Haversine formula
        distance: minDistance * 111, // Rough approximation
      };
    }),
});
