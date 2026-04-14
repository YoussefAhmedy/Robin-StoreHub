<div align="center">

# ◈ Robin-StoreHub — Full-Stack Fashion E-Commerce

### A production-ready monorepo powering Robin — a contemporary fashion label's storefront, staff portal, and AI-assisted admin dashboard. Built with React 19 and .NET 9.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Robin--StoreHub-0E0D0B?style=for-the-badge&logo=github)](https://github.com/YoussefAhmedy/Robin-StoreHub)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![.NET](https://img.shields.io/badge/.NET-9-512BD4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/)
[![Claude AI](https://img.shields.io/badge/AI-Claude_Sonnet-BF4317?style=for-the-badge)](https://www.anthropic.com/)

</div>

---

## 📖 Overview

**Robin-StoreHub** is the complete source repository for Robin — a contemporary fashion label's digital platform. Everything lives in a single monorepo: the public editorial storefront, the internal staff operations portal, and a fully AI-assisted admin dashboard, all powered by a clean layered .NET 9 API backend.

The platform is designed around four distinct audiences:

- **Shoppers** — discover, filter, and purchase through an editorial-quality storefront
- **Staff / Employees** — manage incoming orders, assign tracking numbers, and mark shipments from a dedicated portal
- **Finance** — access monthly revenue summaries and export reports
- **Super Admins** — full product management, live store analytics, and a Claude-powered AI assistant that adds catalog entries from plain English

---

## ✨ Features

### 🛍️ Storefront
- **Editorial Design System** — Cormorant Garamond display type, DM Sans body, and a rust/olive/cream palette inspired by the robin bird
- **Product Catalogue** — filterable by gender, category, season, age group, price range, and availability with real-time pagination
- **Product Detail Pages** — full image gallery, size selector, related products, customer reviews, and waitlist for sold-out items
- **Slide-in Cart Drawer** — persistent cart state synced with the API, with live subtotal
- **Checkout Flow** — shipping method selection, address capture, order confirmation
- **New In / Trending** — dedicated section surfacing `IsTrending` products

### 🔐 Auth & Roles
- JWT Bearer authentication with `localStorage` token management
- Four roles with distinct frontend views and API policies: `Customer`, `Employee/Staff`, `Finance`, `SuperAdmin`
- Role-aware Navbar links and protected route redirects

### 🤖 AI-Powered Admin
- Claude-powered assistant embedded in the Super Admin dashboard
- Create products from natural language: *"Add a rust crewneck at 1,400 EGP, sizes S–XL"* — the AI generates the full product payload and posts it to the catalog without touching code
- Full store context (revenue, order count, catalog size) injected into every system prompt
- Newsletter copy and campaign email drafting on demand

### 📦 Staff Portal
- Dedicated order queue with status filter chips
- Update order status, assign tracking numbers, and mark shipments
- Shipping method breakdown and active transit list
- Staff-targeted email notifications on assignment and reminders

### 📧 Role-Based Email System

| Trigger | Customer | Staff | Finance | SuperAdmin |
|---------|----------|-------|---------|------------|
| Order placed | ✅ Confirmation | ✅ Assignment | — | ✅ Alert |
| Order shipped | ✅ Tracking info | — | — | — |
| Order delivered | ✅ Confirmation | — | — | — |
| Monthly report | — | — | ✅ Revenue | ✅ Summary |

### 📊 Admin Dashboard
- Revenue line chart (30-day rolling window)
- Orders-by-status breakdown
- Top products and category performance
- Live KPI cards: total revenue, orders, customers, active stock

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Routing** | [React Router 6](https://reactrouter.com/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Fonts** | Cormorant Garamond, DM Sans (Google Fonts) |
| **Backend Framework** | [ASP.NET Core 9](https://dotnet.microsoft.com/en-us/apps/aspnet) |
| **ORM** | [Entity Framework Core 9](https://learn.microsoft.com/en-us/ef/core/) |
| **Database** | SQL Server (configurable) |
| **Authentication** | JWT Bearer Tokens, BCrypt |
| **Email** | SMTP — Gmail / SendGrid / Brevo compatible |
| **AI** | [Anthropic Claude API](https://www.anthropic.com/) (`claude-sonnet-4`) |
| **Language (Frontend)** | JavaScript (JSX) |
| **Language (Backend)** | C# 13 |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- SQL Server (or configure another EF Core provider)

### Frontend

```bash
cd robin-web
npm install
npm run dev
# → http://localhost:5173
```

Create `robin-web/.env` and set the API base URL:

```env
VITE_API_URL=http://localhost:5000/api
```

> For GitHub Codespaces, replace `localhost:5000` with your backend's forwarded port URL.

### Backend (.NET 9)

1. Update `AuraLoom.API/appsettings.json` with your connection string and SMTP credentials
2. Run migrations and start:

```bash
cd AuraLoom.API
dotnet ef database update    # applies all migrations + seeds default data
dotnet run                   # → http://localhost:5000
```

> The database seeds automatically on first run with demo products and default user accounts.

---

## 📁 Project Structure

```
Robin-StoreHub/
├── robin-web/                     # React 19 + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx       # Hero, featured products, newsletter
│       │   ├── ShopPage.jsx       # Product grid, filters, sort, pagination
│       │   ├── ProductPage.jsx    # Detail, sizes, reviews, waitlist
│       │   ├── CartPage.jsx       # Cart + checkout with shipping options
│       │   ├── AuthPage.jsx       # Login & Register
│       │   ├── AdminDashboard.jsx # Super Admin: charts, products, AI
│       │   └── StaffDashboard.jsx # Staff: orders, shipments, tracking
│       ├── components/
│       │   ├── Navbar.jsx         # Sticky, role-aware navigation
│       │   ├── Footer.jsx         # Footer with newsletter form
│       │   ├── ProductCard.jsx    # Grid card with hover CTA
│       │   ├── CartDrawer.jsx     # Slide-in cart panel
│       │   └── RobinLogo.jsx      # Custom SVG logotype
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state + JWT lifecycle
│       │   └── CartContext.jsx    # Cart state synced with API
│       └── api/client.js          # Full API client (all endpoints)
│
├── AuraLoom.API/                  # ASP.NET Core 9 Web API
│   ├── Controllers/
│   │   ├── AuthController.cs      # Register, Login, Me
│   │   ├── ProductsController.cs  # Public catalogue endpoints
│   │   ├── CartController.cs      # Cart CRUD [Authorized]
│   │   ├── OrdersController.cs    # Customer orders [Authorized]
│   │   ├── AdminController.cs     # Full admin CRUD [SuperAdmin]
│   │   ├── StaffController.cs     # Order management [Staff+]
│   │   └── NewsletterController.cs
│   └── Services/
│       ├── IEmailService.cs
│       └── EmailService.cs        # Role-based SMTP templates
│
├── AuraLoom.Application/          # Application layer (use cases, DTOs)
│
├── AuraLoom.Domain/               # Core domain entities
│   └── Entities/
│       ├── Product.cs
│       ├── Order.cs
│       ├── User.cs
│       ├── CartItem.cs
│       ├── Category.cs
│       └── NewsletterSubscriber.cs
│
├── AuraLoom.Infrastructure/       # EF Core, migrations, seeding
├── Robin-storeHub.sln
└── README.md
```

---

## 🌐 API Reference

```
Public
  GET  /api/products              List products (full filter support)
  GET  /api/products/trending     Trending products
  GET  /api/products/{id}         Product by ID
  GET  /api/products/slug/{slug}  Product by slug
  POST /api/auth/register
  POST /api/auth/login            Returns JWT
  POST /api/newsletter/subscribe

Customer (JWT required)
  GET  /api/auth/me
  GET  | POST    /api/cart
  PUT  | DEL     /api/cart/{id}
  POST /api/orders                Checkout
  GET  /api/orders                My order history

Staff / Employee (JWT required)
  GET  /api/staff/orders
  PUT  /api/staff/orders/{id}/status
  PUT  /api/staff/orders/{id}/ship

Super Admin (JWT required)
  GET  /api/admin/stats
  GET  /api/admin/finance
  GET  /api/admin/orders
  PUT  /api/admin/orders/{id}/status
  GET  | POST    /api/admin/products
  PUT  | DEL     /api/admin/products/{id}
  GET  /api/admin/users
```

---

## 🎨 Brand & Colour Palette

> *Named after the robin bird — rust-breast, olive-wing, cream sky. The palette deliberately avoids cliché fashion tropes.*

| Token | Hex | Usage |
|-------|-----|-------|
| `--rust` | `#BF4317` | Primary CTA, brand accent |
| `--olive` | `#4A5240` | Staff portal, secondary elements |
| `--cream` | `#F6F2EC` | Main background |
| `--parchment` | `#FAF8F4` | Card surfaces |
| `--ink` | `#0E0D0B` | Headings, dark elements |

**Display:** Cormorant Garamond &nbsp;·&nbsp; **Body:** DM Sans

---

## ⚙️ Email Configuration

In `AuraLoom.API/appsettings.json`:

```json
"EmailSettings": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": "587",
  "SmtpUser": "your@gmail.com",
  "SmtpPass": "your-app-password",
  "FromAddress": "noreply@robin.store",
  "AdminAlertEmail": "admin@robin.store"
}
```

> For Gmail, generate an **App Password** via Google Account → Security → 2-Step Verification → App Passwords.

---

## 📬 Contact

**Youssef Ahmedy** — .NET Full-Stack Web Developer

[![GitHub](https://img.shields.io/badge/GitHub-YoussefAhmedy-0E0D0B?style=flat-square&logo=github)](https://github.com/YoussefAhmedy)
[![Portfolio](https://img.shields.io/badge/Portfolio-youssefahmedy.vercel.app-4a6cf7?style=flat-square)](https://youssefahmedy.vercel.app/)

---

<div align="center">
  <sub>Robin Studio — Cairo · SS 2026 · Built with intent by Youssef Ahmedy</sub>
</div>
