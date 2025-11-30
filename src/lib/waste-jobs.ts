import { db } from "@/src/db";
import { wastejob } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { CreateWastejobDto } from "@/src/lib/types/create-wastejob.dto";
import { getCategoryPrediction } from "./recognition";

export async function getWastejobs() {
  try {
    const wastejobs = await db.query.wastejob.findMany({
      where: eq(wastejob.status, "active"),
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
    });
    return result;
  } catch (error) {
    console.error("Error fetching wastejob:", error);
    throw new Error("Failed to fetch wastejob");
  }
}

export async function createWastejob(id: string, data: CreateWastejobDto) {

  let category = data.category;

  const { predictedCategory, title } =  await getCategoryPrediction(data.imageData, data.description)

  if(category && predictedCategory != category){
    console.error("Error: the predicted category doesnt match the chosen one");
    throw new Error("Failed to create wastejob");
  }

  if(!category){
    category = predictedCategory;
  }

  if(!category){
    console.error("Error");
    throw new Error("Failed to create wastejob");
  }  

  try {
    const [result] = await db.insert(wastejob).values({
      createdById: id,
      status: "draft",
      category: category,
      title: title,
      description: data.description,
      imageData: data.imageData,
      pickupLatitude: data.pickupLatitude,
      pickupLongitude: data.pickupLongitude,
    }).returning();
    return result;
  } catch (error) {
    console.error("Error creating wastejob:", error);
    throw new Error("Failed to create wastejob");
  }
}


type wasteJobStatus = 
  "draft" |
  "active" |
  "claimed" |
  "completed";


export async function activateWasteJob(wasteJobId: string) {
  try {
    const [result] = await db.update(wastejob)
      .set({ status: "active" })
      .where(eq(wastejob.id, parseInt(wasteJobId)))
      .returning();
    return result;
  } catch (error) {
    console.error("Error updating wastejob status:", error);
    throw new Error("Failed to update wastejob status");
  }
}

export async function assignWasteJob(wasteJobId: string, claimedById: string) {
  try {
    const [result] = await db.update(wastejob)
      .set({ status: "claimed", claimedById: claimedById })
      .where(eq(wastejob.id, parseInt(wasteJobId)))
      .returning();
    return result;
  } catch (error) {
    console.error("Error updating wastejob status:", error);
    throw new Error("Failed to update wastejob status");
  }
}

export async function completeWasteJob(wasteJobId: string) {
  try {
    const [result] = await db.update(wastejob)
      .set({ status: "completed" })
      .where(eq(wastejob.id, parseInt(wasteJobId)))
      .returning();
    return result;
  } catch (error) {
    console.error("Error updating wastejob status:", error);
    throw new Error("Failed to update wastejob status");
  }
}