import { WasteDeliveryPointType } from "@/src/db/schema";
import Marker from "./mapbox/marker";
import CategoryIcon from "./category-icon";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { WasteJob } from "./waste-job-card";

export default function WastePointMarker({
    point,
}: {
    point: WasteJob;
}) {
    return (
        <Marker
            longitude={parseFloat(point.pickupLongitude)}
            latitude={parseFloat(point.pickupLatitude)}
        >
            <div className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-center" title={point.description ?? undefined}>
                <CategoryIcon category={point.category} className="border-red-500" />
            </div>
        </Marker>
    );
}