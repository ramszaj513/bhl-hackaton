"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/app/components/ui/dialog";
import { Button } from "@/src/app/components/ui/button";
import { LocationPicker } from "@/src/app/components/location-picker";

export function SubmitJobDialog({ wasteJobId }: { wasteJobId: number }) {
    const [open, setOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLocationSelect = (value: any) => {
        console.log("Selected location:", value);
        setSelectedLocation(value);
    };

    const handleConfirm = async () => {
        if (!selectedLocation || !wasteJobId) return;

        // Geoapify returns GeoJSON Feature. Coordinates are in geometry.coordinates [lon, lat]
        // Or sometimes properties.lat/lon depending on configuration, but geometry is standard.
        // Let's try to safely extract.
        let lat: number | undefined;
        let lon: number | undefined;

        if (selectedLocation.properties && selectedLocation.properties.lat && selectedLocation.properties.lon) {
            lat = selectedLocation.properties.lat;
            lon = selectedLocation.properties.lon;
        } else if (selectedLocation.geometry && selectedLocation.geometry.coordinates) {
            lon = selectedLocation.geometry.coordinates[0];
            lat = selectedLocation.geometry.coordinates[1];
        }

        if (lat === undefined || lon === undefined) {
            console.error("Could not extract coordinates from selection");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/wastejobs/activate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wastejobId: wasteJobId.toString(), // API expects string
                    lat,
                    lon,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to activate job");
            }

            setOpen(false);
            // Optionally refresh data or notify user
        } catch (error) {
            console.error("Error activating job:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Zleć</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zleć</DialogTitle>
                    <DialogDescription>
                        Wybierz lokalizację odbioru.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedLocation || !wasteJobId || isLoading}
                    >
                        {isLoading ? "Aktywowanie..." : "Potwierdź Lokację"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
