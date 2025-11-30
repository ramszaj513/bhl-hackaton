import { auth } from "@clerk/nextjs/server";
import { getWastejobs } from "@/src/lib/waste-jobs";
import { getWasteDeliveryPoints } from "@/src/lib/waste-delivery-points";
import ZleceniaContent from "./content";

export default async function Home() {
  await auth.protect();

  const pickupPoints = await getWastejobs();
  const deliveryPoints = await getWasteDeliveryPoints();

  return (
    <ZleceniaContent pickupPoints={pickupPoints} deliveryPoints={deliveryPoints} />
  );
}