import { 
  type Customer, type InsertCustomer,
  type Product, type InsertProduct,
  type Invoice, type InsertInvoice,
  type Settings, type InsertSettings
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: InsertCustomer): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;

  getSettings(): Promise<Settings | undefined>;
  upsertSettings(settings: InsertSettings): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private products: Map<string, Product>;
  private invoices: Map<string, Invoice>;
  private settings: Settings | undefined;

  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.invoices = new Map();
    this.settings = undefined;
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      gstin: insertCustomer.gstin || null
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, insertCustomer: InsertCustomer): Promise<Customer | undefined> {
    if (!this.customers.has(id)) {
      return undefined;
    }
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      gstin: insertCustomer.gstin || null
    };
    this.customers.set(id, customer);
    return customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, insertProduct: InsertProduct): Promise<Product | undefined> {
    if (!this.products.has(id)) {
      return undefined;
    }
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = { 
      ...insertInvoice,
      id,
      customerGstin: insertInvoice.customerGstin || null,
      createdAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }

  async upsertSettings(insertSettings: InsertSettings): Promise<Settings> {
    const id = this.settings?.id || randomUUID();
    const settings: Settings = { ...insertSettings, id };
    this.settings = settings;
    return settings;
  }
}

export const storage = new MemStorage();
