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

export function SubmitJobDialog() {
    const [open, setOpen] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const handleLocationSelect = (value: any) => {
        console.log("Selected location:", value);
        setSelectedLocation(value);
        // You might want to do something more with the location here,
        // like passing it to a parent component or storing it in a form state.
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Submit Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit Waste Job</DialogTitle>
                    <DialogDescription>
                        Select the location for pickup.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                    {selectedLocation && (
                        <div className="text-sm text-muted-foreground">
                            Selected: {selectedLocation.properties?.formatted || "Unknown location"}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
