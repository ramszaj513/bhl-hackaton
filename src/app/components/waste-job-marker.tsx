import { WasteJobType } from "@/src/db/schema";
import Marker from "./mapbox/marker";
import CategoryIcon from "./category-icon";

export default function WastePointMarker({
    point,
}: {
    point: WasteJobType;
}) {
    return (
        <Marker
            longitude={parseFloat(point.pickupLongitude)}
            latitude={parseFloat(point.pickupLatitude)}
        >
            <div className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-center" title={point.description ?? undefined}>
                <CategoryIcon category={point.category} className="border-red-500" />
            </div>
        </Marker>
    );
}