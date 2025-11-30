"use client";

import { useEffect } from "react";
import { useMap } from "./context";
import { Feature, LineString } from "geojson";

interface RouteLayerProps {
    routeGeoJSON: Feature<LineString> | null;
}

export default function RouteLayer({ routeGeoJSON }: RouteLayerProps) {
    const { map } = useMap();

    useEffect(() => {
        if (!map || !routeGeoJSON) return;

        const sourceId = "route-source";
        const layerId = "route-layer";

        if (map.getSource(sourceId)) {
            (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
        } else {
            map.addSource(sourceId, {
                type: "geojson",
                data: routeGeoJSON,
            });

            map.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#3b82f6", // blue-500
                    "line-width": 5,
                    "line-opacity": 0.75,
                },
            });
        }

        return () => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, routeGeoJSON]);

    return null;
}
