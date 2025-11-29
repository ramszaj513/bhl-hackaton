import { db } from "@/src/db";
import { wastejob } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { CreateWastejobDto } from "@/src/lib/types/create-wastejob.dto";

export async function getWastejobs() {
  try {
    const wastejobs = await db.query.wastejob.findMany({
      with: {
        statement: true,
        tags: {
          with: {
            tag: true,
          },
        },
        aopsMetadata: true,
      },
    });
    return wastejobs;
  } catch (error) {
    console.error("Error fetching wastejobs:", error);
    throw new Error("Failed to fetch wastejobs");
  }
}

export async function getWastejobById(id: number) {
  try {
    const result = await db.query.wastejob.findFirst({
      where: eq(wastejob.id, id),
      with: {
        statement: true,
        tags: {
          with: {
            tag: true,
          },
        },
        aopsMetadata: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching wastejob:", error);
    throw new Error("Failed to fetch wastejob");
  }
}

export async function createWastejob(data: CreateWastejobDto) {
  try {
    const [result] = await db.insert(wastejob).values({
      title: data.title,
      description: data.description,
      initialPhotoUrl: data.initialPhotoUrl,
      pickupLatitude: data.pickupLatitude,
      pickupLongitude: data.pickupLongitude,
    }).returning();
    return result;
  } catch (error) {
    console.error("Error creating wastejob:", error);
    throw new Error("Failed to create wastejob");
  }
}
