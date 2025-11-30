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

  const getLatLon = () => {
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
      return { lat: undefined, lon: undefined };
    }

    return { lat, lon };
  }

  const handleFindNearest = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    try {
      const { lat, lon } = getLatLon();
      console.log("Finding nearest point for:", lat, lon);

      setShowAddressPicker(null);
      onComplete?.();
    } catch (error) {
      console.error("Error finding nearest point:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelegate = async () => {
    if (!selectedLocation || !jobId) return;

    setIsLoading(true);
    try {
      const { lat, lon } = getLatLon();
      const response = await fetch("/api/wastejobs/activate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wastejobId: jobId.toString(),
          lat,
          lon,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate job");
      }
    } catch (error) {
      console.error("Error activating job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl w-120">
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
              <LocationPicker onLocationSelect={setSelectedLocation} />
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