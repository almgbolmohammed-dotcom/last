import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants";

export const tenantNotificationsTable = pgTable("tenant_notifications", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TenantNotification = typeof tenantNotificationsTable.$inferSelect;
export type InsertTenantNotification = typeof tenantNotificationsTable.$inferInsert;
