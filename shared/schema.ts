import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  gstin: text("gstin"),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  itemCode: text("item_code").notNull().unique(),
  hsnCode: text("hsn_code").notNull(),
  gstRate: real("gst_rate").notNull(),
  retailPrice: real("retail_price").notNull(),
  wholesalePrice: real("wholesale_price").notNull(),
  stock: integer("stock").notNull().default(0),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  billNumber: text("bill_number").notNull().unique(),
  customerId: varchar("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  customerGstin: text("customer_gstin"),
  items: text("items").notNull(),
  subtotal: real("subtotal").notNull(),
  cgst: real("cgst").notNull(),
  sgst: real("sgst").notNull(),
  igst: real("igst").notNull(),
  discount: real("discount").notNull().default(0),
  roundOff: real("round_off").notNull().default(0),
  total: real("total").notNull(),
  priceMode: text("price_mode").notNull(),
  gstBreakup: text("gst_breakup").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopName: text("shop_name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  gstin: text("gstin").notNull(),
  billPrefix: text("bill_prefix").notNull().default("INV"),
  nextBillNumber: integer("next_bill_number").notNull().default(1),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  gstin: z.string().optional(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Product name is required"),
  itemCode: z.string().min(1, "Item code is required"),
  hsnCode: z.string().min(1, "HSN code is required"),
  gstRate: z.number().min(0).max(100, "GST rate must be between 0 and 100"),
  retailPrice: z.number().min(0, "Price must be positive"),
  wholesalePrice: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
}).extend({
  billNumber: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  customerGstin: z.string().optional(),
  items: z.string().min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  cgst: z.number().min(0),
  sgst: z.number().min(0),
  igst: z.number().min(0),
  discount: z.number().min(0),
  roundOff: z.number(),
  total: z.number().min(0),
  priceMode: z.enum(["retail", "wholesale"]),
  gstBreakup: z.string(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
}).extend({
  shopName: z.string().min(1, "Shop name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  gstin: z.string().min(15, "GSTIN must be 15 characters"),
  billPrefix: z.string().min(1, "Bill prefix is required"),
  nextBillNumber: z.number().int().min(1, "Next bill number must be at least 1"),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export interface InvoiceItem {
  productId: string;
  productName: string;
  itemCode: string;
  hsnCode: string;
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
  total: number;
}

export interface GSTBreakupItem {
  gstRate: number;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
}
