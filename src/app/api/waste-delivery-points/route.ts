import { NextResponse } from "next/server";
import { getWasteDeliveryPoints } from "@/src/lib/waste-delivery-points";

export async function GET() {
    try {
        const points = await getWasteDeliveryPoints();
        return NextResponse.json(points);
    } catch (error) {
        console.error("Error in GET /api/waste-delivery-points:", error);
        return NextResponse.json(
            { error: "Failed to fetch waste delivery points" },
            { status: 500 }
        );
    }
}
