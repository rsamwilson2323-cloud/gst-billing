# 🧾 GST Billing Software

A modern **GST-compliant Billing & Invoice Management System** built with **Node.js, React, TypeScript, and Tailwind CSS**. Easily manage customers, products, invoices, and taxes with automatic **CGST, SGST, and IGST** calculations. Designed to work completely offline on your local network with a professional, responsive interface.

---

## ✨ Features

### 👥 Customer Management

* Add, edit and delete customers
* GSTIN tracking
* Customer search
* Address & contact management

### 📦 Product Management

* Product catalog
* HSN/SAC code management
* Retail & Wholesale pricing
* GST percentage configuration
* Stock details management

### 🧾 Invoice Generator

* Professional GST invoice creation
* Automatic bill number generation
* Custom bill number prefix
* Live GST calculation
* Printable A4 invoice
* Invoice history

### 💰 GST Calculation

* Automatic CGST calculation
* Automatic SGST calculation
* Automatic IGST calculation
* Intrastate billing detection
* Interstate billing detection
* Grand total calculation

### 📊 Dashboard

* Sales overview
* Revenue statistics
* Recent invoices
* Customer count
* Product count
* Business analytics

### 🌐 Offline Ready

* Local data storage
* No internet required
* Local network access
* Mobile friendly
* Tablet support

---

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **React 18**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI**
* **TanStack Query**
* **Zod**
* **Vite**

---

## 📂 Project Structure

```text
gst-billing/
│
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
│       │   └── 📁 ui/
│       │       └── 📄 Shadcn UI Components
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
├── 📄 README.md
└── 📄 LICENSE
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/rsamwilson2323-cloud/gst-billing.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd gst-billing
```

### 3️⃣ Install Dependencies

```bash
npm install
```

---

## ▶️ Running the Application

### Option 1 – Windows Launcher

Double-click:

```text
start.bat
```

### Option 2 – Command Line

```bash
npm run dev
```

or

```bash
npm start
```

---

## 🌐 Access the Application

### Localhost

```text
http://localhost:5000
```

### Local Network

```text
http://YOUR-IP:5000
```

Example:

```text
http://192.168.1.100:5000
```

Access the software from any phone, tablet, or computer connected to the same Wi-Fi network.

---

## 🖥️ Modules

| Module               | Description                |
| -------------------- | -------------------------- |
| 👥 Customers         | Customer Management        |
| 📦 Products          | Product Management         |
| 🧾 Invoice Generator | GST Invoice Creation       |
| 📑 Invoice History   | View Previous Bills        |
| 📊 Dashboard         | Sales & Business Analytics |
| ⚙️ Settings          | Application Configuration  |

---

## 🌟 Highlights

* 🧾 GST-compliant billing
* 👥 Customer management
* 📦 Product management
* 💰 Automatic GST calculations
* 🖨️ Printable A4 invoices
* 📊 Business dashboard
* 📱 Mobile responsive interface
* 🌐 Local network access
* 💾 Offline data storage
* ⚡ Fast and lightweight

---

## 💡 Applications

* Retail Shops
* Wholesale Businesses
* Supermarkets
* Grocery Stores
* Medical Stores
* Hardware Stores
* Textile Shops
* Electronics Stores
* Small & Medium Enterprises

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Sam Wilson**

🐙 GitHub: https://github.com/rsamwilson2323-cloud

💼 LinkedIn: https://www.linkedin.com/in/sam-wilson-14b554385

---

⭐ **If you found this project useful, don't forget to Star ⭐ the repository!**
