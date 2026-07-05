import { pgTable, serial, text, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").notNull().default(1),
  plateNumber: text("plate_number").notNull(),
  model: text("model").notNull(),
  defaultRateInside: integer("default_rate_inside").notNull(),
  defaultRateOutside: integer("default_rate_outside").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("cars_tenant_plate_idx").on(t.tenantId, t.plateNumber),
]);

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true, createdAt: true, tenantId: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;
