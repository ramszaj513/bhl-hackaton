"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "./ui";
import { LocationPicker } from "./location-picker";
import { MapPin, Users } from "lucide-react";

interface WasteJobFindProps {
  onComplete?: () => void;
  jobId?: string | null;
}

export function WasteJobFind({ onComplete, jobId }: WasteJobFindProps) {
  const [showAddressPicker, setShowAddressPicker] = useState<"find" | "delegate" | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    console.log("Selected location:", location);
  };

  const handleFindNearest = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement find nearest waste delivery point logic
      const { lat, lon } = selectedLocation.properties;
      console.log("Finding nearest point for:", lat, lon);
      
      // Placeholder for actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowAddressPicker(null);
      onComplete?.();
    } catch (error) {
      console.error("Error finding nearest point:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelegate = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    try {
      const { lat, lon } = selectedLocation.properties;
      
      const response = await fetch("/api/wastejobs/activate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wastejobId: jobId,
          pickupLatitude: lat.toString(),
          pickupLongitude: lon.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate waste job");
      }

      setShowAddressPicker(null);
      onComplete?.();
    } catch (error) {
      console.error("Error delegating job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Co chcesz zrobić z odpadem?</CardTitle>
        <CardDescription>
          Wybierz jedną z opcji, aby kontynuować
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddressPicker === null ? (
          <>
            <Button
              onClick={() => setShowAddressPicker("find")}
              className="w-full h-auto py-6 flex flex-col items-center gap-2"
              variant="outline"
            >
              <MapPin className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold text-lg">Wpisz adres i znajdź najbliższy punkt</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Znajdziemy dla Ciebie najbliższy punkt zbiórki odpadów
                </div>
              </div>
            </Button>

            <Button
              onClick={() => setShowAddressPicker("delegate")}
              className="w-full h-auto py-6 flex flex-col items-center gap-2"
              variant="outline"
            >
              <Users className="h-8 w-8" />
              <div className="text-center">
                <div className="font-semibold text-lg">Zleć komuś innemu</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Pozwól innym użytkownikom odebrać Twoje odpady
                </div>
              </div>
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {showAddressPicker === "find"
                  ? "Wprowadź adres do wyszukania punktu"
                  : "Wprowadź adres odbioru"}
              </label>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowAddressPicker(null);
                  setSelectedLocation(null);
                }}
                variant="outline"
                className="flex-1"
              >
                Anuluj
              </Button>
              <Button
                onClick={showAddressPicker === "find" ? handleFindNearest : handleDelegate}
                disabled={!selectedLocation || isLoading}
                className="flex-1"
              >
                {isLoading
                  ? "Przetwarzanie..."
                  : showAddressPicker === "find"
                  ? "Znajdź punkt"
                  : "Aktywuj zlecenie"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}