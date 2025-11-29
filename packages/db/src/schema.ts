import { sql } from "drizzle-orm";
import {
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { user } from "./auth-schema";

export * from "./auth-schema";

export const Post = pgTable("post", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const wasteCategory = pgEnum("waste_category", [
  "plastic",
  "paper",
  "glass",
  "bio",
  "electronics",
  "mixed",
]);
export const jobStatus = pgEnum("job_status", [
  "open",
  "accepted",
  "completed",
  "cancelled",
]);

export const WasteJob = pgTable("waste_job", {
  id: uuid("id").notNull().primaryKey().default(sql`gen_random_uuid()`),
  photoUrl: varchar("photo_url", { length: 256 }).notNull(),
  lat: decimal("lat", { precision: 9, scale: 6 }).notNull(),
  lon: decimal("lon", { precision: 9, scale: 6 }).notNull(),
  category: wasteCategory("category"),
  status: jobStatus("status").default("open").notNull(),

  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id),
  contractorId: text("contractor_id").references(() => user.id),

  completionPhotoUrl: varchar("completion_photo_url", { length: 256 }),
  completionLat: decimal("completion_lat", {
    precision: 9,
    scale: 6,
  }),
  completionLon: decimal("completion_lon", {
    precision: 9,
    scale: 6,
  }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});