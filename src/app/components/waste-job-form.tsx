"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { CreateWastejobDto } from "@/src/lib/types/create-wastejob.dto";
import {
  Textarea,
  Label,
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator, // Dodano Separator dla lepszej wizualnej separacji
} from "./ui";
import { convertFileToBase64 } from "@/src/lib/utils";
import CategoryIcon from "./category-icon";
import { Loader2, Zap } from "lucide-react"; // Dodano ikonę Zap
import { WasteJobFind } from "./waste-job-find";

type CategoryId = "pszok" | "small_electronics" | "electronics" | "expired_medications";
  
interface WasteCategory {
  id: CategoryId;
  name: string;
  description: string; // Krótki opis do tooltipa
  iconKey: string;
}

const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: "pszok",
    name: "Gabaryty/PSZOK",
    description: "Duże odpady, budowlane, itp.",
    iconKey: "pszok",
  },
  {
    id: "small_electronics",
    name: "Mała Elektronika",
    description: "Telefony, ładowarki, małe AGD.",
    iconKey: "small_electronics",
  },
  {
    id: "electronics",
    name: "Duża Elektronika",
    description: "Telewizory, lodówki, pralki.",
    iconKey: "electronics",
  },
  {
    id: "expired_medications",
    name: "Lekarstwa i opdady medyczne",
    description: "Przeterminowane leki.",
    iconKey: "expired_medications",
  },
];

// -----------------------------------------------------------------
// Komponent Formularza
// -----------------------------------------------------------------

export function WasteJobForm() {
  const [formData, setFormData] = useState<Partial<CreateWastejobDto>>({
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [showNextStep, setShowNextStep] = useState(false);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Walidacja, że zdjęcie jest wymagane, nie zmienia się
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Zdjęcie nadal jest wymagane
    if (!file) {
      setError("Wymagane jest załączenie zdjęcia odpadu.");
      setIsLoading(false);
      return;
    }

    try {
      const imageData = await convertFileToBase64(file);

      // Mock location for now
      const pickupLatitude = "52.2297";
      const pickupLongitude = "21.0122";

      const data: CreateWastejobDto = {
        description: formData.description || "", // Opis jest teraz opcjonalny
        imageData: imageData,
        pickupLatitude,
        pickupLongitude,
      };

      // Kategoria jest teraz opcjonalna
      if (selectedCategory) {
        data.category = selectedCategory;
      }

      // Symulacja wysyłania do API
      const response = await fetch("/api/wastejobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nie udało się utworzyć zlecenia.");
      }

      const result = await response.json();
      setCreatedJobId(result.id?.toString() || null);
      setSuccess("Pomyślnie wysłano zapytanie! Wybierz co chcesz zrobić dalej.");
      setShowNextStep(true);

    } catch (err: any) {
      setError(err.message || "Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as CategoryId;
    setSelectedCategory(value);
  };

  const handleComplete = () => {
    // Reset all form state
    setFormData({ description: "" });
    setFile(null);
    setPreview(null);
    setSelectedCategory(null);
    setShowNextStep(false);
    setCreatedJobId(null);
    setSuccess(null);
    setError(null);
  };

  if (showNextStep) {
    return <WasteJobFind onComplete={handleComplete} jobId={createdJobId} />;
  }

  return (
    <Card className="max-w-xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Znajdź Gdzie Wyrzucić Odpad
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3 pt-1">
          
          {/* Sekcja Zdjęcie (wymagane) */}
          <div className="space-y-2">
            <Label className="font-semibold text-base">
                Załącz zdjęcie odpadu
            </Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary/50 transition-colors duration-200">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Podgląd załączonego pliku"
                    className="mx-auto h-20 w-auto rounded-md object-contain shadow-md"
                  />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm justify-center">
                  <Label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span>Prześlij plik</span>
                    <Input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Label>
                  <p className="pl-1 text-gray-600">lub przeciągnij i upuść</p>
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG do 10MB</p>
              </div>
            </div>
          </div>

          <Separator />
          
          {/* Sekcja Opis (OPCJONALNA) */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-semibold text-base flex items-center justify-between">
              <span>Opis</span>
              <span className="text-xs text-primary flex items-center">
                  <Zap className="h-3 w-3 mr-1" /> AI może wypełnić to za Ciebie!
              </span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Np. 'Stary telewizor, działa, ale ma pęknięty ekran'. Pomoże nam to lepiej go sklasyfikować."
              rows={3}
            />
          </div>

          <Separator />

          {/* Sekcja Kategoria Śmieci (OPCJONALNA, mniejsze przyciski) */}
          <div className="space-y-4">
            <Label className="font-semibold text-base flex items-center justify-between">
              <span>Wybierz Kategorię Odpadu</span>
              <span className="text-xs text-primary flex items-center">
                  <Zap className="h-3 w-3 mr-1" /> AI może rozpoznać to ze zdjęcia!
              </span>
            </Label>
            
            {/* Zmiana z grid-cols-2 na grid-cols-4 na dużych ekranach i mniejszy padding */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WASTE_CATEGORIES.map((category) => (
                <Label
                  key={category.id}
                  htmlFor={`category-${category.id}`}
                  className={`
                    flex flex-col items-center justify-center space-y-1 p-3 border rounded-lg cursor-pointer transition-all h-24
                    ${
                      selectedCategory === category.id
                        ? "border-primary ring-2 ring-primary/50 bg-primary/10"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <Input
                    type="radio"
                    id={`category-${category.id}`}
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={handleCategoryChange}
                    className="sr-only"
                    // Usunięto 'required'
                  />
                  <CategoryIcon category={category.iconKey} className="!w-6 !h-6" />
                  <span className="font-medium text-xs text-center block">
                    {category.name}
                  </span>
                </Label>
              ))}
            </div>
            
            {/* Opcjonalne: przycisk resetujący wybór kategorii */}
            {selectedCategory && (
                <div className="text-right">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setSelectedCategory(null)}
                        className="text-xs text-muted-foreground hover:text-primary h-auto p-0"
                    >
                        Anuluj wybór kategorii
                    </Button>
                </div>
            )}
          </div>
          
          {/* Komunikaty o błędach i sukcesie */}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={isLoading} className="w-full text-lg h-12">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Przesyłanie...
                </>
            ) : (
                "Znajdź gdzie wyrzucić przedmiot"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}