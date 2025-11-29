export type CreateWastejobDto = {
  title: string;
  description?: string;
  initialPhotoUrl: string;
  pickupLatitude: string;
  pickupLongitude: string;
};