import { auth } from "@clerk/nextjs/server";
import { getWasteDeliveryPoints } from "../lib/waste-delivery-points";
import HomeContent from "./home-content";

export default async function Home() {
  await auth.protect();

  // Asynchroniczne pobieranie punktów dostawy odpadów
  const deliveryPoints = await getWasteDeliveryPoints();

  return <HomeContent deliveryPoints={deliveryPoints} />;
}