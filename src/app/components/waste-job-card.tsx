import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button, // Dodano Button
  CardFooter, // Dodano CardFooter
} from "./ui";
import { MapPin, Calendar, Package2, Clock, CheckCircle } from "lucide-react"; // Dodano Clock i CheckCircle
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
// 1. Zaktualizowane warianty statusu i tłumaczenia
// ----------------------------------------------------

// Warianty dla statusu (kolory)
const badgeVariants = cva(
  "absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full shadow-md",
  {
    variants: {
      variant: {
        draft: "bg-gray-500 text-white",
        active: "bg-green-600 text-white",
        claimed: "bg-yellow-400 text-gray-800", // Zmieniony kolor, aby pasował do "In Progress"
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
  onClaimJob: (jobId: number) => void; // Dodana prop do obsługi akcji
  isButtonDisabled?: boolean; // Prop do ewentualnego wyłączania przycisku
}

// Mapowanie statusów na POLSKI tekst
const statusTranslations: Record<WasteJob["status"], string> = {
  draft: "Szkic",
  active: "Aktywne",
  claimed: "W Realizacji",
  completed: "Zakończone",
};

// Mapowanie kategorii na POLSKIE nazwy i ikonę (używamy CategoryIcon, ale nazwy też się przydadzą)
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

export function WasteJobCard({ wasteJob, onClaimJob, isButtonDisabled }: WasteJobCardProps) {
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
  
  // ----------------------------------------------------
  // 2. Ulepszony wygląd komponentu
  // ----------------------------------------------------

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden">
      
      {/* Badge Statusu - na górze po prawej */}
      <Badge className={cn(badgeVariants({ variant: status }), "z-10")}>
        {status === "claimed" ? <Clock className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
        {statusTranslations[status]}
      </Badge>

      <div className="flex flex-col md:flex-row">
        
        {/* Lewa Strona - Zdjęcie */}
        <div className="md:w-1/3 shrink-0 p-4 border-r border-gray-100">
          <img
            src={getBase64Image(imageData)}
            alt={title}
            className="w-full h-full md:h-40 object-cover rounded-lg shadow-inner border border-gray-200"
          />
        </div>

        {/* Prawa Strona - Treść */}
        <div className="md:w-2/3 grow">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
                <div className={cn("shrink-0 p-2 rounded-full", categoryInfo.color === "text-purple-600" ? "bg-purple-100" : categoryInfo.color === "text-red-600" ? "bg-red-100" : categoryInfo.color === "text-blue-600" ? "bg-blue-100" : "bg-amber-100")}>
                    <CategoryIcon category={category} className={cn("!w-6 !h-6", categoryInfo.color)} />
                </div>
                <div>
                    <CardTitle className="text-xl font-extrabold leading-snug">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{categoryInfo.name}</p>
                </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-3">
            
            {/* Opis */}
            {description && (
                <CardDescription className="text-gray-700 text-sm italic line-clamp-2">
                    "{description}"
                </CardDescription>
            )}

            {/* Metadane */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 text-xs pt-1 border-t pt-2 mt-2">
              {distance && (
                <div className="flex items-center font-medium">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                  <span>{distance.toFixed(1)} km stąd</span>
                </div>
              )}
              <div className="flex items-center font-medium">
                <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" />
                <span>Utworzono: {formattedDate}</span>
              </div>
              {address && (
                <span className="truncate max-w-[200px] text-gray-600">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 inline-block" />
                    {address}
                </span>
              )}
            </div>
          </CardContent>
          
          {/* Stopka z przyciskiem akcji */}
          <CardFooter className="p-4 border-t bg-gray-50">
            <Button 
                onClick={() => onClaimJob(id)}
                disabled={!isClaimable || isButtonDisabled}
                className="w-full transition-all duration-300"
                variant={isClaimable ? "default" : "secondary"}
            >
                {isClaimable ? "Wypełnij Zlecenie" : `Status: ${statusTranslations[status]}`}
            </Button>
          </CardFooter>

        </div>
      </div>
    </Card>
  );
}