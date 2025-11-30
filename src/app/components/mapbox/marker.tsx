
"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "./context";

type Props = {
    longitude: number;
    latitude: number;
    children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
    children,
    latitude,
    longitude,
    ...props
}: Props) {
    const { map } = useMap();
    const markerRef = useRef<HTMLDivElement | null>(null);
    let marker: mapboxgl.Marker | null = null;

    useEffect(() => {
        const markerEl = markerRef.current;
        if (!map || !markerEl || longitude === undefined || latitude === undefined) return;

        // Marker options
        const options = {
            element: markerEl,
            ...props,
        };

        console.log(map);
        marker = new mapboxgl.Marker(options)
            .setLngLat([longitude, latitude])
            .addTo(map);

        return () => {
            // Cleanup on unmount
            if (marker) marker.remove();
        };
    }, [map, longitude, latitude, props]);

    return (
        <div>
            <div ref={markerRef}>{children}</div>
        </div>
    );
}