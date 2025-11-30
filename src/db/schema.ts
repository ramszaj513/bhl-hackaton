import {
  decimal,
  numeric,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const wasteCategory = pgEnum("waste_category", [
  "pszok",
  "small_electronics",
  "electronics",
  "expired_medications",
]);

export interface OpeningHours {
  Monday?: [string, string];
  Tuesday?: [string, string];
  Wednesday?: [string, string];
  Thursday?: [string, string];
  Friday?: [string, string];
  Saturday?: [string, string];
  Sunday?: [string, string];
}

export const WasteDeliveryPoint = pgTable("waste_delivery_point", {
  id: text("id").primaryKey(),
  lat: decimal("lat", { precision: 14, scale: 7 }).notNull(),
  lon: decimal("lon", { precision: 14, scale: 7 }).notNull(),
  description: text("description").notNull(),
  openingHours: json("opening_hours").$type<OpeningHours>(),
  category: wasteCategory("category").notNull(),
});

export const wasteJobStatus = pgEnum("waste_job_status", [
  "draft",
  "active",
  "claimed",
  "completed",
])

export const wastejob = pgTable('wastejob', {
  id: serial('id').primaryKey(),
  createdById: text('created_by_id').notNull(),
  claimedById: text('claimed_by_id'), 
  status: wasteJobStatus('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  // DANE ZLECENIA
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  imageData: text('imageData').notNull(),
  category: wasteCategory('category').notNull(),

  // LOKALIZACJA ODBIORU (skąd odebrać śmieci)
  pickupLatitude: numeric('pickup_latitude', { precision: 10, scale: 7 }).notNull(),
  pickupLongitude: numeric('pickup_longitude', { precision: 10, scale: 7 }).notNull(),
});