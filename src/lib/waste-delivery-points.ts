import { db } from "@/src/db";
import { WasteDeliveryPoint } from "@/src/db/schema";

export async function getWasteDeliveryPoints() {
    try {
        const points = await db.select().from(WasteDeliveryPoint);
        return points;
    } catch (error) {
        console.error("Error fetching waste delivery points:", error);
        throw new Error("Failed to fetch waste delivery points");
    }
}
