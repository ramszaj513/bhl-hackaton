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
} from "./ui";
import { convertFileToBase64 } from "@/src/lib/utils";
import CategoryIcon from "./category-icon";

export function WasteJobForm() {
  const [formData, setFormData] = useState<Partial<CreateWastejobDto>>({
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"pszok" | "small_electronics" | "electronics" | "expired_medications" | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  interface WasteCategory {
    id: string; 
    name: string;
    description?: string; 
    iconKey: string; 
  }

  const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: "pszok",
    name: "PSZOK",
    description: "Odpady wielkogabarytowe, budowlane lub inne problematyczne",
    iconKey: "pszok",
  },
  {
    id: "small_electronics",
    name: "Mała Elektronika",
    description: "Np. telefony, ładowarki, małe AGD.",
    iconKey: "small_electronics",
  },
  {
    id: "electronics",
    name: "Duża Elektronika",
    description: "Np. telewizory, monitory, pralki, lodówki.",
    iconKey: "electronics",
  },
  {
    id: "expired_medications",
    name: "Lekarstwa i Odpady Medyczne",
    description: "Przeterminowane leki i inne odpady farmaceutyczne.",
    iconKey: "expired_medications",
  },
];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!file) {
      setError("Picture is required.");
      setIsLoading(false);
      return;
    }

    try {
      const imageData = await convertFileToBase64(file);

      // Mock location for now
      const pickupLatitude = "52.2297";
      const pickupLongitude = "21.0122";

      const data: CreateWastejobDto = {
        description: formData.description,
        imageData: imageData,
        pickupLatitude,
        pickupLongitude,
      };

      if(selectedCategory) { data.category = selectedCategory };

      const response = await fetch("/api/wastejobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create waste job");
      }

      setSuccess("Waste job created successfully!");
      setFormData({ title: "", description: "" });
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "pszok" | "small_electronics" | "electronics" | "expired_medications";
    setSelectedCategory(value);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Waste Job</CardTitle>
        <CardDescription>
          Fill out the details below to post a new job.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Attach a Picture</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-48 w-auto rounded-md"
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
                <div className="flex text-sm">
                  <Label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <Input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </Label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Any additional details about the waste"
            />
          </div>
          <div className="space-y-4">
            <Label>Kategoria Śmieci</Label>
            <div className="grid grid-cols-2 gap-4">
              {WASTE_CATEGORIES.map((category) => (
                <Label
                  key={category.id}
                  htmlFor={`category-${category.id}`}
                  className={`
                    flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all
                    ${
                      selectedCategory === category.id
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-gray-200 hover:border-gray-300"
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
                    className="sr-only" // Ukrywa domywny radio button
                    required
                  />
                  <div className="flex-shrink-0">
                    <CategoryIcon category={category.iconKey} className="!w-8 !h-8" />
                  </div>
                  <div className="flex-grow">
                    <span className="font-semibold text-sm block">
                      {category.name}
                    </span>
                    {category.description && (
                      <span className="text-xs text-muted-foreground block">
                        {category.description}
                      </span>
                    )}
                  </div>
                  {/* Własny znacznik wyboru */}
                  <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                    {selectedCategory === category.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </Label>
              ))}
            </div>
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Create Waste Job"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
