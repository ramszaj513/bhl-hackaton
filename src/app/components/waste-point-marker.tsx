import { WasteDeliveryPointType } from "@/src/db/schema";
import Marker from "./mapbox/marker";
import CategoryIcon from "./category-icon";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export default function WastePointMarker({
    point,
}: {
    point: WasteDeliveryPointType;
}) {
    return (
        <Marker
            longitude={parseFloat(point.lon)}
            latitude={parseFloat(point.lat)}
        >
            <div className="relative group focus:outline-none" tabIndex={0}>
                <div className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-center" title={point.description}>
                    <CategoryIcon category={point.category} />
                </div>
                {/* <div className={cn("absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-100 hidden group-hover:block group-focus-within:block z-[200]", isFocused && "block")}>
                    <div className="bg-popover text-popover-foreground rounded-md border p-4 shadow-md outline-hidden">
                        <p className="text-md text-muted-foreground whitespace-pre-wrap">
                            {point.description}
                        </p>
                    </div>
                </div> */}
            </div>
        </Marker>
    );
}