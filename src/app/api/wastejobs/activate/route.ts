import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { activateWasteJob } from "@/src/lib/waste-jobs";

export async function PUT(request: Request) {
  try {
    await auth.protect();

    const body = await request.json();
    const { wastejobId, lat, lon } = body;

    if (!wastejobId || lat === undefined || lon === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: wastejobId, lat, or lon" },
        { status: 400 }
      );
    }

    const updatedWastejob = await activateWasteJob(wastejobId, lat, lon);

    if (!updatedWastejob) {
      return NextResponse.json(
        { error: "Wastejob not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedWastejob);
  } catch (error) {
    console.error("Error in PUT /api/wastejobs/activate:", error);
    return NextResponse.json(
      { error: "Failed to activate wastejob" },
      { status: 500 }
    );
  }
}
