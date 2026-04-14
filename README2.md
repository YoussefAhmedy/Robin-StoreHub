# Robin — Contemporary Fashion Store

> *Wear the Story.*

Robin is a full-stack e-commerce platform for a contemporary fashion label. Built with React 19 (Vite) on the frontend and .NET 9 on the backend, the project features a refined editorial design system, role-based access, AI-powered admin tools, and a dedicated staff order portal.

---

## Brand Identity

**Name:** Robin  
**Concept:** Named after the robin bird — rust-breast, olive-wing, cream sky. The palette deliberately avoids cliché fashion tropes.  
**Palette:**
| Token | Hex | Usage |
|---|---|---|
| `--rust` | `#BF4317` | Primary brand, CTAs |
| `--olive` | `#4A5240` | Secondary, staff UI |
| `--cream` | `#F6F2EC` | Main background |
| `--parchment` | `#FAF8F4` | Card surfaces |
| `--ink` | `#0E0D0B` | Headings, dark elements |

**Typography:** Cormorant Garamond (display) + DM Sans (body)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8, React Router 6, Recharts |
| Backend API | .NET 9, ASP.NET Core, Entity Framework Core |
| Database | SQL Server (configurable) |
| Auth | JWT Bearer Tokens |
| Email | SMTP (configurable — Gmail, SendGrid, etc.) |
| AI | Anthropic Claude API (claude-sonnet-4) |

---

## Project Structure

```
Robin/
├── robin-web/                # React frontend
│   └── src/
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero, featured products, newsletter
│       │   ├── ShopPage.jsx        # Product grid with filters & sort
│       │   ├── ProductPage.jsx     # Product detail, sizes, add to cart
│       │   ├── CartPage.jsx        # Cart + checkout with shipping options
│       │   ├── AuthPage.jsx        # Login & Register
│       │   ├── AdminDashboard.jsx  # Super Admin: charts, products, AI
│       │   └── StaffDashboard.jsx  # Staff: orders, shipping, tracking
│       ├── components/
│       │   ├── Navbar.jsx          # Sticky nav with role-aware links
│       │   ├── Footer.jsx          # Footer with newsletter
│       │   ├── ProductCard.jsx     # Product grid card with hover CTA
│       │   ├── CartDrawer.jsx      # Slide-in cart panel
│       │   └── RobinLogo.jsx       # Custom SVG logo
│       ├── context/
│       │   ├── AuthContext.jsx     # Auth state + JWT management
│       │   └── CartContext.jsx     # Cart state synced with API
│       └── api/client.js           # Typed API client
│
├── AuraLoom.API/             # ASP.NET Core API
│   ├── Controllers/
│   │   ├── AuthController.cs       # Register, Login, Me
│   │   ├── ProductsController.cs   # Public product endpoints
│   │   ├── CartController.cs       # Cart CRUD [Authorized]
│   │   ├── OrdersController.cs     # Customer orders [Authorized]
│   │   ├── AdminController.cs      # Full admin CRUD [SuperAdmin/Admin]
│   │   ├── StaffController.cs      # Order management [Staff/Admin]
│   │   └── NewsletterController.cs # Newsletter subscribe
│   └── Services/
│       ├── IEmailService.cs        # Email interface
│       └── EmailService.cs         # Role-based SMTP email service
│
├── AuraLoom.Domain/          # Domain entities
│   └── Entities/
│       ├── Product.cs (+ ImageUrl, SizesJson, OptionsJson, IsFeatured)
│       ├── Order.cs  (+ ShippingMethod, TrackingNumber, ShippedAt, StaffNotes)
│       ├── User.cs
│       ├── CartItem.cs
│       ├── Category.cs
│       └── NewsletterSubscriber.cs
│
└── AuraLoom.Infrastructure/  # EF Core, migrations, seeding
```

---

## User Roles & Access

| Role | Frontend Access | Email Type |
|---|---|---|
| `Customer` | Shop, cart, orders, profile | Order confirmation, status updates, shipping |
| `Employee` / `Staff` | Staff portal — update orders, mark shipped, add tracking | Internal shift notifications |
| `Finance` | (Reserved) Financial reports, export | Monthly revenue reports |
| `SuperAdmin` / `Admin` | Full admin dashboard, AI assistant, product CRUD, all orders | All alert types |

---

## AI-Powered Admin

The Super Admin dashboard includes a **Claude-powered AI assistant** (`/admin` → AI Assistant tab) that can:

- **Create products** directly from natural language: *"Add a new black hoodie at 1,600 EGP with sizes S-XL"* — the AI generates the product JSON and adds it to the catalog without touching source code.
- Summarize store performance from live stats.
- Write newsletter copy and campaign emails.
- Advise on inventory, pricing strategy, and restocking.

The AI has full context about current revenue, order counts, and catalog size injected into every system prompt.

---

## Getting Started

### Frontend

```bash
cd robin-web
npm install
npm run dev
# → http://localhost:5173
```

Set `VITE_API_URL` in `.env` if API is not on `localhost:5000`:
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.NET 9)

1. Update `appsettings.json` → `ConnectionStrings.DefaultConnection`
2. Update `appsettings.json` → `EmailSettings` with your SMTP credentials
3. Run:

```bash
cd AuraLoom.API
dotnet ef database update   # applies all migrations
dotnet run                  # → http://localhost:5000
```

The database is seeded automatically on first run.

---

## Email Configuration

Configure `appsettings.json`:

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

For Gmail, generate an **App Password** (Google Account → Security → 2-Step Verification → App Passwords).

---

## API Endpoints Summary

```
Public
  GET  /api/products           — All products
  GET  /api/products/trending  — Trending products
  GET  /api/products/{id}      — Product by ID
  GET  /api/products/slug/{s}  — Product by slug
  POST /api/auth/register      — Register
  POST /api/auth/login         — Login → JWT
  POST /api/newsletter/subscribe

Authenticated (Customer+)
  GET  /api/auth/me
  GET  /api/cart
  POST /api/cart
  PUT  /api/cart/{id}
  DEL  /api/cart/{id}
  POST /api/orders             — Checkout
  GET  /api/orders             — My orders

Staff (Employee+)
  GET  /api/staff/orders
  PUT  /api/staff/orders/{id}/status
  PUT  /api/staff/orders/{id}/ship

Admin (Admin+)
  GET  /api/admin/stats
  GET  /api/admin/finance
  GET  /api/admin/orders
  PUT  /api/admin/orders/{id}/status
  GET  /api/admin/products
  POST /api/admin/products
  PUT  /api/admin/products/{id}
  DEL  /api/admin/products/{id}
  GET  /api/admin/users
```

---

*Robin Studio — Cairo & London — SS 2026*
