import { getWasteDeliveryPoints } from "@/src/lib/waste-delivery-points";
import MapComponent from "@/src/app/components/map";
import { auth } from "@clerk/nextjs/server";

export default async function MapPage() {
    await auth.protect();

    const points = await getWasteDeliveryPoints();

    return (
        <div className="w-full h-full p-4">
            <h1 className="text-2xl font-bold mb-4">Waste Delivery Points</h1>
            <div className="w-full h-[calc(100vh-200px)]">
                <MapComponent points={points} targetCategory="small_electronics" />
            </div>
        </div>
    );
}
