# 🧾 GST Billing Software

A professional GST-compliant billing system for managing **customers, products, and invoices** with automatic GST calculations (CGST/SGST/IGST). Built with **Node.js and React** — runs locally on your network with no internet required.

---

## 🚀 Features

* 👥 Customer management with GSTIN tracking
* 📦 Product management with HSN codes and dual pricing (Retail / Wholesale)
* 🧾 Invoice generator with live GST calculations
* 🏷️ Auto-incrementing bill numbers with custom prefix
* 📊 Dashboard with sales metrics and recent transactions
* 🖨️ Professional A4 printable invoice layout
* 🔁 CGST + SGST for intrastate / IGST for interstate — auto detected
* 💾 Data saved locally — works fully offline
* 📱 Accessible from phones and tablets on the same WiFi

---

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **React 18**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI**
* **TanStack Query**
* **Zod** (validation)

---

## 📂 Project Structure

```text
gst-billing/
├── 📁 client/
│   └── 📁 src/
│       ├── 📁 pages/
│       │   ├── 📄 dashboard.tsx
│       │   ├── 📄 customers.tsx
│       │   ├── 📄 products.tsx
│       │   ├── 📄 invoice-generator.tsx
│       │   ├── 📄 invoice-history.tsx
│       │   ├── 📄 settings.tsx
│       │   └── 📄 not-found.tsx
│       │
│       ├── 📁 components/
│       │   ├── 📄 layout.tsx
│       │   ├── 📄 printable-invoice.tsx
│       │   └── 📁 ui/  (Shadcn components)
│       │
│       ├── 📁 hooks/
│       │   ├── 📄 use-toast.ts
│       │   └── 📄 use-mobile.tsx
│       │
│       ├── 📁 lib/
│       │   ├── 📄 queryClient.ts
│       │   ├── 📄 localStorage.ts
│       │   └── 📄 utils.ts
│       │
│       ├── 📄 App.tsx
│       ├── 📄 main.tsx
│       └── 📄 index.css
│
├── 📁 server/
│   ├── 📄 index.ts
│   ├── 📄 routes.ts
│   ├── 📄 storage.ts
│   └── 📄 vite.ts
│
├── 📁 shared/
│   └── 📄 schema.ts
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 vite.config.ts
├── 📄 components.json
├── 📄 start.bat
└── 📄 README.md
