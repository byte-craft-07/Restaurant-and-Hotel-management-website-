# DineLink OS

AI-powered ultra-fast QR room-service experience for modern hotels.

DineLink OS is a React + Express hackathon project that shows how hotels can run QR-based in-room ordering, AI-assisted cart building, service-staff verification, live kitchen operations, and guest tracking from one polished system.

## Judge Quick Start

**What it is:** A hotel SaaS demo where guests scan a room QR code, order with AI, and the kitchen receives live room-aware tickets.

**Fast demo route:**

```text
Homepage -> Simulate Room QR -> AI Menu -> Cart -> Code 123456 -> Success Timeline -> Kitchen Dashboard
```

**Why it stands out:**

- Practical AI that builds a cart from real menu items
- Premium mobile-first QR ordering flow
- Room-aware verification and kitchen handoff
- Demo-safe fallback if backend data is empty
- Startup-style product polish, not a raw prototype

**AI highlight:** Try `2 spicy burgers and 1 cold coffee` on the menu page.

**Screenshots to add before submission:**

- `screenshots/homepage.png`
- `screenshots/ai-menu.png`
- `screenshots/success-timeline.png`
- `screenshots/kitchen-dashboard.png`

## Product Vision

Hotels should not need enterprise software to create a premium in-room ordering experience. DineLink OS turns a simple room QR into a branded guest journey, an AI ordering concierge, and a live operations layer for service staff and kitchen teams.

The goal is to feel like a real hotel SaaS startup: fast for guests, calm for staff, and impressive for owners.

## Problem

Most hotel QR menus feel like static web pages. They do not understand guest intent, they rarely connect cleanly to kitchen operations, and they make hotels look less premium than they are.

Hotels need:

- Faster ordering without staff confusion
- Room-aware order verification
- Live kitchen visibility
- Better customer experience on mobile
- A digital menu that feels branded and trustworthy

## Solution

DineLink OS combines QR ordering, AI-assisted cart building, room verification, live kitchen dashboards, guest loyalty data, and analytics inside one premium React app.

## Project Pitch

Guests scan a room QR, open a premium digital menu, type what they want in natural language, and the system converts that request into real menu/cart actions. Staff get clear verification and kitchen dashboards so the hotel workflow stays fast, secure, and easy to demo.

## Feature Highlights

- Premium landing page with QR + AI ordering story
- Customer menu with glassmorphism UI and animated food cards
- AI Natural Language Ordering assistant
- Menu-aware matching with local fallback parser
- Cart drawer with verification flow
- Demo QR mode for hackathon presentation
- Live Kitchen Display System
- Service-staff/admin order management
- Room QR management
- Customer profile, order history, loyalty discounts
- Analytics dashboard
- Mobile-first responsive layout
- Hotel branding system with status, tags, avatar, banner, and room context
- Animated order success timeline
- Demo story mode with meaningful sample menu and kitchen activity

## Hotel Branding Layer

The guest experience uses a reusable hotel configuration:

- Hotel name and avatar
- Accent color
- Banner image
- Cuisine tags
- Open / Busy / Closed status
- Branded preparation-time messaging

This makes the product feel venue-aware rather than generic.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB, Socket.IO
- Auth: JWT-based role access
- UI: Lucide icons, premium light theme, 3D food scene

## Architecture Overview

```text
client/
  src/
    components/
      order/                 Order success and timeline UI
      restaurant/            Hotel branding components
      motion/                Premium hover and interaction helpers
    pages/
      customer/              QR menu and guest order flow
      admin/                 Admin dashboards and management pages
      kitchen/               Kitchen Display System
    services/
      aiOrderAssistant.js    Natural language order parsing
      demoExperience.js      Hackathon story/demo data
      restaurantBranding.js  Hotel branding configuration
      api.js                 Axios API client

server/
  src/
    app.js                  Express app configuration
    server.js               Local/Node server entry
    config/                 Database and environment configuration
    controllers/            Request handlers
    middlewares/            Auth and upload middleware
    models/                 Mongoose models
    routes/                 API route definitions
    seeders/                Admin/data seed scripts
    utils/                  Shared backend helpers
```

## AI Feature Explanation

The AI Natural Language Ordering assistant is menu-aware. It only works with items available in the current menu and never invents fake dishes.

Current local fallback capabilities:

- Quantity detection
- Dish-name matching
- Veg / non-veg intent
- Spicy intent
- Drink intent
- Budget intent such as `under Rs. 300`
- Closest-match suggestions

The architecture is AI-ready. A future secure backend AI endpoint can be connected through:

```env
VITE_AI_ORDER_ENDPOINT=https://your-ai-endpoint.example.com/order-assistant
```

## Setup

### Environment Variables

Frontend env file:

```text
client/.env
```

Use [client/.env.example](client/.env.example):

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_AI_ORDER_ENDPOINT=
VITE_ENABLE_DEMO_MODE=true
```

Backend env file:

```text
server/.env
```

Use [server/.env.example](server/.env.example):

```env
PORT=5000
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/dinelink-os?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Never commit real secrets.

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

Create backend environment file:

```text
server/.env
```

Typical values:

```env
PORT=5000
ATLASDB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Install and run the full app from the project root:

```bash
cd restaurant-ordering-system
npm install
npm run dev
```

This starts both services:

```text
Backend:  http://localhost:5000
Frontend: http://localhost:5173
```

Build and run as one production app:

```bash
npm run build
npm start
```

In production mode, the backend serves the built frontend from `client/dist`.

Health check:

```text
http://localhost:5000/api/health
```

Advanced separate backend command:

```bash
cd server
npm run dev
```

Advanced separate frontend command:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173/
```

## Hackathon Demo Flow

1. Open the homepage.
2. Click `Simulate QR Scan`.
3. Login or create a customer account.
4. The menu opens with demo room context.
5. Use the AI assistant:

```text
2 spicy burgers and 1 cold coffee
Veg food under Rs. 300
Suggest something spicy
```

6. Add items to cart.
7. Click `Place Order`.
8. Use demo verification code:

```text
123456
```

9. Watch the animated confirmation timeline.
10. Open `/kitchen` as kitchen/admin user to show live kitchen activity.

## Demo Mode Notes

If the backend has no menu items or orders, the frontend gracefully loads polished sample menu items and sample kitchen tickets. Real backend data always takes priority.

Demo safety mode is controlled by:

```env
VITE_ENABLE_DEMO_MODE=true
```

Set it to `false` when you want strict auth behavior during production-like testing.

Demo QR token:

```text
demo-room-101
```

Demo verification code:

```text
123456
```

## Screenshots

Add screenshots here before final submission:

- Homepage hero
- Customer menu + AI assistant
- Cart verification flow
- Kitchen dashboard
- Admin analytics

## Hackathon Submission Note

This project is designed to be judged as a complete experience:

- The homepage explains the value quickly.
- The guest flow demonstrates AI in a practical hotel room-service context.
- The kitchen dashboard proves operational usefulness.
- Demo safety mode prevents blank screens during live presentation.
- The README, pitch, and demo script make the project easy to present.

## Useful Routes

```text
/                 Landing page
/qr/demo-room-101 Simulated QR flow
/menu             Customer menu
/kitchen          Kitchen display
/admin            Admin dashboard
/service/orders   Service staff dashboard
/waiter/orders    Legacy service staff route
```

## Production Improvements

- Move AI parsing to a secure backend OpenAI route
- Add payment gateway integration
- Add tenant/venue isolation
- Add image optimization
- Add automated tests for order lifecycle
- Add PWA install/offline support
- Add multi-tenant venue management
- Add real payment provider integration
- Add AI upsells and personalized recommendations
- Add customer-facing live order status from backend sockets

## Future Roadmap

- Multi-hotel SaaS tenancy
- AI-powered recommendations and combo optimization
- Payment gateway abstraction
- PWA mode for guests and staff
- Kitchen prep-time prediction
- Manager-level business insights
- Theme studio for hotel owners

