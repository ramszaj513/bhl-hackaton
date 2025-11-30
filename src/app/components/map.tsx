"use client";

import { useRef } from 'react';
import MapProvider from './mapbox/provider';
import Marker from './mapbox/marker';
import CategoryIcon from './category-icon';

interface WasteDeliveryPoint {
    id: string;
    lat: string;
    lon: string;
    description: string;
    category: string;
}

interface MapComponentProps {
    points: WasteDeliveryPoint[];
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
                    <Marker
                        key={point.id}
                        longitude={parseFloat(point.lon)}
                        latitude={parseFloat(point.lat)}
                        data={point}
                    >
                        <div
                            className={`cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`}
                            title={`${point.description} (${point.category})`}
                        >
                            <CategoryIcon category={point.category} />
                        </div>
                    </Marker>
                ))}
            </MapProvider>
        </div>
    );
}
