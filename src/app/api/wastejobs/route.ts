import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getWastejobs, createWastejob } from "@/src/lib/waste-jobs";
import { CreateWastejobDto } from "@/src/lib/types/create-wastejob.dto";

export async function GET() {
  try {
    await auth.protect();
    
    const wastejobs = await getWastejobs();
    return NextResponse.json(wastejobs);
  } catch (error) {
    console.error("Error in GET /api/wastejobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch wastejobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth.protect();
    
    const body: CreateWastejobDto = await request.json();
    
    // Validate required fields
    if (!body.imageData || !body.pickupLatitude || !body.pickupLongitude) {
      return NextResponse.json(
        { error: "Missing required fields: imageData, pickupLatitude, pickupLongitude" },
        { status: 400 }
      );
    }
    
    const newWastejob = await createWastejob(userId, body);
    return NextResponse.json(newWastejob, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/wastejobs:", error);
    return NextResponse.json(
      { error: "Failed to create wastejob" },
      { status: 500 }
    );
  }
}