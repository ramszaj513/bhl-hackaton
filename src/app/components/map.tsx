"use client";

import { useRef } from 'react';
import MapProvider from './mapbox/provider';

import { WasteDeliveryPointType } from '@/src/db/schema';
import WastePointMarker from './waste-point-marker';

interface MapComponentProps {
    points: WasteDeliveryPointType[];
}

export default function MapComponent({ points }: MapComponentProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden relative">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                    longitude: 21.0122, // Default to Warsaw
                    latitude: 52.2297,
                    zoom: 11
                }}
            >
                {points.map(point => (
                    <WastePointMarker key={point.id} point={point} />
                ))}
            </MapProvider>
        </div>
    );
}
