"use client";

import { useState, Suspense } from "react";
import MapComponent from "../components/map";
import { WasteJobList } from "../components/waste-job-list";
import { WasteDeliveryPointType, WasteJobType } from "@/src/db/schema";

interface ZleceniaContentProps {
    pickupPoints: WasteJobType[];
    deliveryPoints: WasteDeliveryPointType[];
}

export default function ZleceniaContent({
    pickupPoints,
    deliveryPoints,
}: ZleceniaContentProps) {
    const [routeRequest, setRouteRequest] = useState<{
        startingPoint: { longitude: number; latitude: number };
        targetCategory: WasteDeliveryPointType["category"];
    } | null>(null);

    const handleShowRoute = (
        location: { latitude: number; longitude: number },
        category: string
    ) => {
        setRouteRequest({
            startingPoint: location,
            targetCategory: category as WasteDeliveryPointType["category"],
        });
    };

    return (
        <div className="relative h-full">
            {/* 1. Mapa Tła - Ograniczona do 3/4 szerokości (w-3/4) */}
            <div className="fixed top-0 right-0 w-4/5 h-full">
                <Suspense
                    fallback={
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
                            Ładowanie mapy...
                        </div>
                    }
                >
                    {/* Używamy full height/width wewnątrz kontenera w-3/4 */}
                    <MapComponent
                        deliveryPoints={[]}
                        pickupPoints={pickupPoints}
                        startingPoint={routeRequest?.startingPoint}
                        targetCategory={routeRequest?.targetCategory}
                    />
                </Suspense>
            </div>

            {/* 2. Warstwa z Efektem Rozmycia/Gradientu - Bardziej Gwałtowna */}
            {/* Ograniczamy gradient do lewej strony ekranu (tej, która ma być biała) */}
            <div
                className="fixed inset-0 w-full h-full -z-0 pointer-events-none"
                style={{
                    // Zmieniono przejście z (35% -> 40%) na (30% -> 45%) dla płynniejszego efektu
                    background:
                        "linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0) 55%)",
                }}
            />

            {/* 3. Kontener Formularza */}
            {/* Używamy flex, aby formularz był z lewej, a 3/4 ekranu (mapa) z prawej */}

            <div className="absolute top-5 left-5 h-[calc(100vh-100px)] z-[200]">
                <WasteJobList onShowRoute={handleShowRoute} />
            </div>
        </div>
    );
}
