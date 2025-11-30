export type CreateWastejobDto = {
  title?: string;
  description?: string;
  category?: "pszok" | "small_electronics" | "electronics" | "expired_medications",
  imageData: string;
  pickupLatitude: string;
  pickupLongitude: string;
};