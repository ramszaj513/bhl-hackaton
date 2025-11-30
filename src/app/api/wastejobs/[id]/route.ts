import { NextRequest, NextResponse } from "next/server";
import { getWastejobById } from "@/src/lib/waste-jobs";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params
    try {
        const idInt = parseInt(id);
        if (isNaN(idInt)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const wasteJob = await getWastejobById(idInt);

        if (!wasteJob) {
            return NextResponse.json(
                { error: "Waste job not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(wasteJob);
    } catch (error) {
        console.error("Error fetching waste job:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
