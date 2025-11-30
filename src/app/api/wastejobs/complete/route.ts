import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { completeWasteJob } from "@/src/lib/waste-jobs";

export async function PUT(request: Request) {
  try {
    await auth.protect();
    
    const body = await request.json();
    const { wastejobId } = body;
    
    if (!wastejobId) {
      return NextResponse.json(
        { error: "Missing required field: wastejobId" },
        { status: 400 }
      );
    }
    
    const updatedWastejob = await completeWasteJob(wastejobId);
    
    if (!updatedWastejob) {
      return NextResponse.json(
        { error: "Wastejob not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedWastejob);
  } catch (error) {
    console.error("Error in PUT /api/wastejobs/complete:", error);
    return NextResponse.json(
      { error: "Failed to complete wastejob" },
      { status: 500 }
    );
  }
}
