import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  CardFooter,
} from "./ui";
import { MapPin, Calendar, Package2, Clock, CheckCircle } from "lucide-react";
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
  distance?: number; // Distance in km
  address?: string; // Address, e.g., from geocoding
};

// ----------------------------------------------------
// Variants and Translations
// ----------------------------------------------------

const badgeVariants = cva(
  "text-xs font-semibold px-3 py-1 rounded-full shadow-md", // Removed absolute positioning here, handled in layout
  {
    variants: {
      variant: {
        draft: "bg-gray-500 text-white",
        active: "bg-green-600 text-white",
        claimed: "bg-yellow-400 text-gray-800",
        completed: "bg-blue-600 text-white",
      },
    },
    defaultVariants: {
      variant: "draft",
    },
  }
);

interface WasteJobCardProps extends VariantProps<typeof badgeVariants> {
  wasteJob: WasteJob;
  onClaimJob: (jobId: number) => void;
  isButtonDisabled?: boolean;
  onShowRoute?: (
    location: { latitude: number; longitude: number },
    category: string
  ) => void;
}

const statusTranslations: Record<WasteJob["status"], string> = {
  draft: "Szkic",
  active: "Aktywne",
  claimed: "W Realizacji",
  completed: "Zakończone",
};

const categoryTranslations: Record<
  WasteJob["category"],
  { name: string; color: string }
> = {
  pszok: { name: "Gabaryty/PSZOK", color: "text-purple-600" },
  electronics: { name: "Duża Elektronika", color: "text-red-600" },
  expired_medications: {
    name: "Lekarstwa/Medyczne",
    color: "text-blue-600",
  },
  small_electronics: {
    name: "Mała Elektronika",
    color: "text-amber-600",
  },
};

export function WasteJobCard({
  wasteJob,
  onClaimJob,
  isButtonDisabled,
  onShowRoute,
}: WasteJobCardProps) {
  const {
    id,
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
    categoryTranslations[category] || categoryTranslations["pszok"];

  const formattedDate = new Date(createdAt).toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const isClaimable = status === "active";

  return (
    <Card className="group w-full h-50 mx-auto overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
      {/* Changed layout to strictly 'flex-row' (horizontal) 
         and 'h-full' to ensure internal divs stretch 
      */}
      <div className="flex flex-row h-full">
        
        {/* Image Section: 
           - w-1/3: Strictly one third of width
           - h-full: Covers full height
        */}
        <div className="relative w-1/3 h-full shrink-0 overflow-hidden">
          <img
            src={getBase64Image(imageData)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Optional: Dark overlay for better contrast if you add text over image */}
          <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Content Section:
           - w-2/3: Takes remaining width
        */}
        <div className="flex flex-col w-2/3 p-5">
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-1 overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium border-0 bg-opacity-10 whitespace-nowrap",
                    categoryInfo.color === "text-purple-600"
                      ? "bg-purple-100 text-purple-700"
                      : categoryInfo.color === "text-red-600"
                      ? "bg-red-100 text-red-700"
                      : categoryInfo.color === "text-blue-600"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  )}
                >
                  {categoryInfo.name}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formattedDate}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 leading-tight truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
            </div>

            {/* Status Badge - Always visible in top right corner of content */}
            <div className="shrink-0 ml-2">
              <Badge className={cn(badgeVariants({ variant: status }))}>
                {statusTranslations[status]}
              </Badge>
            </div>
          </div>

          {/* Description with line clamping to respect fixed height */}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-3 mb-4 grow">
              {description}
            </p>
          )}

          {/* Footer actions */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-sm text-gray-500 min-w-0">
              {distance !== undefined && (
                <div className="flex items-center text-gray-700 font-medium whitespace-nowrap">
                  <MapPin className="w-4 h-4 mr-1.5 text-primary shrink-0" />
                  {distance.toFixed(1)} km stąd
                </div>
              )}
              {address && (
                <div className="text-xs text-gray-400 truncate max-w-[180px]">
                  {address}
                </div>
              )}
            </div>

            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              {onShowRoute && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none px-3"
                  onClick={() =>
                    onShowRoute(
                      {
                        latitude: parseFloat(wasteJob.pickupLatitude),
                        longitude: parseFloat(wasteJob.pickupLongitude),
                      },
                      wasteJob.category
                    )
                  }
                >
                  <MapPin className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Trasa</span>
                </Button>
              )}

              {isClaimable && (
                <Button
                  size="sm"
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 px-3"
                  onClick={() => onClaimJob(id)}
                  disabled={isButtonDisabled}
                >
                  <Package2 className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Odbierz</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}