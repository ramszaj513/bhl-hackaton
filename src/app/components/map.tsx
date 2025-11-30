"use client";

import { useRef, useState, useEffect } from 'react';
import MapProvider from './mapbox/provider';

import { WasteDeliveryPointType, WasteJobType } from '@/src/db/schema';
import WastePointMarker from './waste-point-marker';
import RouteLayer from './mapbox/route-layer';
import { Feature, LineString } from 'geojson';

import WasteJobMarker from './waste-job-marker';


const MOCK_START_POINT = {
    longitude: 21.0122, // Warsaw center
    latitude: 52.2297
};


export default function MapComponent({ deliveryPoints, pickupPoints, startingPoint = MOCK_START_POINT, targetCategory }: {
    deliveryPoints: WasteDeliveryPointType[];
    pickupPoints: WasteJobType[];
    targetCategory?: WasteDeliveryPointType['category'];
    startingPoint?: { longitude: number; latitude: number };
}) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState<Feature<LineString> | null>(null);

    useEffect(() => {
        if (!targetCategory) {
            setRouteGeoJSON(null);
            return;
        }

        const categoryPoints = deliveryPoints.filter(p => p.category === targetCategory);
        if (categoryPoints.length === 0) {
            setRouteGeoJSON(null);
            return;
        }

        // Find nearest point using simple Euclidean distance for approximation
        let nearestPoint = categoryPoints[0];
        let minDistance = Infinity;

        categoryPoints.forEach(point => {
            const dist = Math.sqrt(
                Math.pow(parseFloat(point.lon) - startingPoint.longitude, 2) +
                Math.pow(parseFloat(point.lat) - startingPoint.latitude, 2)
            );
            if (dist < minDistance) {
                minDistance = dist;
                nearestPoint = point;
            }
        });

        // Fetch route from Mapbox Directions API
        const fetchRoute = async () => {
            try {
                const query = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${MOCK_START_POINT.longitude},${MOCK_START_POINT.latitude};${nearestPoint.lon},${nearestPoint.lat}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
                    { method: 'GET' }
                );
                const json = await query.json();
                if (json.routes && json.routes.length > 0) {
                    const data = json.routes[0];
                    const route = data.geometry;

                    setRouteGeoJSON({
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    });
                }
            } catch (error) {
                console.error("Error fetching route:", error);
            }
        };

        fetchRoute();

    }, [targetCategory, deliveryPoints]);

    return (
        <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden relative">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                    longitude: startingPoint.longitude,
                    latitude: startingPoint.latitude,
                    zoom: 13
                }}
            >
                {deliveryPoints.map(point => (
                    <WastePointMarker key={point.id} point={point} />
                ))}
                {pickupPoints.map(point => (
                    <WasteJobMarker key={point.id} point={point} />
                ))}
                <RouteLayer routeGeoJSON={routeGeoJSON} />
            </MapProvider>
        </div>
    );
}
