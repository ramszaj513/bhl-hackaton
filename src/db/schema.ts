import { relations, sql } from "drizzle-orm";
import {
  decimal,
  foreignKey,
  index,
  integer,
  numeric,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
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

export const wastejob = pgTable('wastejob', {
  id: serial('id').primaryKey(),
  // clientId: integer('client_id').notNull().references(() => users.id), // Zleceniodawca (kto prosi)
  // runnerId: integer('runner_id').references(() => users.id), // Zleceniobiorca (kto się podjął)
  // categoryId: integer('category_id').notNull().references(() => wasteCategories.id), // Kategoria śmieci (z rozpoznawania AI)
  // targetPointId: integer('target_point_id').references(() => disposalPoints.id), // Docelowy punkt odbioru (znaleziony przez appkę)


  // DANE ZLECENIA
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  initialPhotoUrl: varchar('initial_photo_url', { length: 512 }).notNull(), // Zdjęcie śmieci od klienta


  // LOKALIZACJA ODBIORU (skąd odebrać śmieci)
  pickupLatitude: numeric('pickup_latitude', { precision: 10, scale: 7 }).notNull(),
  pickupLongitude: numeric('pickup_longitude', { precision: 10, scale: 7 }).notNull(),
});