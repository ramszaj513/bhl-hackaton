"use client";

import { useRef, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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


export default function MapComponent({ deliveryPoints, pickupPoints, startingPoint = MOCK_START_POINT, targetCategory, showDeliveryPoints = true }: {
    deliveryPoints: WasteDeliveryPointType[];
    pickupPoints: WasteJobType[];
    targetCategory?: WasteDeliveryPointType['category'];
    startingPoint?: { longitude: number; latitude: number };
    showDeliveryPoints?: boolean;
}) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState<Feature<LineString> | null>(null);
    const searchParams = useSearchParams();

    const urlCategory = searchParams.get('category') as WasteDeliveryPointType['category'] | null;
    const activeCategory = targetCategory || urlCategory;

    // Filter points if a category is selected
    const visibleDeliveryPoints = useMemo(() => {
        if (!activeCategory) return deliveryPoints;
        return deliveryPoints.filter(p => p.category === activeCategory);
    }, [deliveryPoints, activeCategory]);

    useEffect(() => {
        console.log(startingPoint, activeCategory)
        if (!activeCategory) {
            setRouteGeoJSON(null);
            return;
        }

        const categoryPoints = deliveryPoints.filter(p => p.category === activeCategory);
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
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${startingPoint.longitude},${startingPoint.latitude};${nearestPoint.lon},${nearestPoint.lat}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
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

    }, [startingPoint, activeCategory, deliveryPoints]);

    console.log(routeGeoJSON);

    const initialViewState = useMemo(() => ({
        longitude: MOCK_START_POINT.longitude,
        latitude: MOCK_START_POINT.latitude,
        zoom: 13
    }), []);

    return (
        <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden relative">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
            <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={initialViewState}
            >
                {showDeliveryPoints && visibleDeliveryPoints.map(point => (
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
