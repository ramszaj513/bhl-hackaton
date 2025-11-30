import { WasteDeliveryPointType } from "@/src/db/schema";
import Marker from "./mapbox/marker";
import CategoryIcon from "./category-icon";

export default function WastePointMarker({
    point,
}: {
    point: WasteDeliveryPointType;
}) {
    return (
        <Marker
            longitude={parseFloat(point.lon)}
            latitude={parseFloat(point.lat)}
        >
            <div
                className="cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                title={`${point.description} (${point.category})`}
            >
                <CategoryIcon category={point.category} />
            </div>
        </Marker>
    );
}