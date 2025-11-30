"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge
} from "./ui";
import { MapPin, Calendar, Package2 } from "lucide-react";
import { wasteCategory, wasteJobStatus } from "@/src/db/schema";
import { VariantProps, cva } from "class-variance-authority";
import { cn, getBase64Image } from "@/src/lib/utils";
import CategoryIcon from "./category-icon";

export type WasteJob = {
  id: number;
  title: string;
  category: (typeof wasteCategory.enumValues)[number];
  description: string | null;
  imageData: string;
  status: (typeof wasteJobStatus.enumValues)[number];
  createdAt: string; // Date in ISO format
  pickupLatitude: string;
  pickupLongitude: string;
  // The following fields would need to be added to the DTO or calculated on the frontend
  distance?: number; // Distance in km
  address?: string; // Address, e.g., from geocoding
};

// Variants for the job status to match the colors from the image
const badgeVariants = cva("absolute top-4 right-4", {
  variants: {
    variant: {
      draft: "bg-gray-500",
      active: "bg-green-500",
      claimed: "bg-yellow-500 text-black", // "In Progress"
      completed: "bg-blue-500",
    },
  },
  defaultVariants: {
    variant: "draft",
  },
});

interface WasteJobCardProps extends VariantProps<typeof badgeVariants> {
  wasteJob: WasteJob;
}

// Mapping statuses to English text
const statusTranslations: Record<WasteJob["status"], string> = {
  draft: "Draft",
  active: "Active",
  claimed: "In Progress",
  completed: "Completed",
};

// Mapping categories to English names and icons
const categoryDetails: Record<
  WasteJob["category"],
  { name: string; icon: React.ReactNode }
> = {
  pszok: { name: "PSZOK", icon: <Package2 className="h-8 w-8" /> },
  electronics: { name: "Elektronika", icon: <Package2 className="h-8 w-8" /> },
  expired_medications: {
    name: "leki",
    icon: <Package2 className="h-8 w-8" />,
  },
  small_electronics: {  
    name: "Mała elektronika",
    icon: <Package2 className="h-8 w-8" />,
  },
};

export function WasteJobCard({ wasteJob }: WasteJobCardProps) {
  const {
    title,
    category,
    description,
    status,
    createdAt,
    distance,
    address,
    imageData,
  } = wasteJob;

  const categoryInfo =
    categoryDetails[category] || categoryDetails["pszok"];

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US");

  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-lg transition-shadow relative overflow-hidden">
      <Badge className={cn(badgeVariants({ variant: status }), "z-10")}>
        {statusTranslations[status]}
      </Badge>
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="grow space-y-3">
            <div className="flex items-center gap-3">
              <div className="shrink-0 bg-purple-100 text-purple-600 p-2 rounded-full">
                <CategoryIcon category={category}/>
              </div>
              <div>
                <CardTitle className="text-lg font-bold leading-tight">{title}</CardTitle>
                <p className="text-sm text-gray-500">{categoryInfo.name}</p>
              </div>
            </div>
            
            <p className="text-gray-700 text-sm">{description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-xs pt-1">
              {distance && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{distance} km</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formattedDate}</span>
              </div>
              {address && <span className="truncate max-w-[200px]">{address}</span>}
            </div>
          </div>
          
          <div className="shrink-0 self-center">
            <img
              src={getBase64Image(imageData)}
              alt={title}
              className="w-28 h-28 object-cover rounded-lg shadow-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}