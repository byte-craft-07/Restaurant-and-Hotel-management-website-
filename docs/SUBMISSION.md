# DineLink OS Submission

## Project Name

DineLink OS

## One-Line Pitch

AI-powered ultra-fast QR ordering experience for modern restaurants.

## Links

- Live demo: `PASTE_DEPLOYED_URL_HERE`
- GitHub repo: `PASTE_GITHUB_REPO_HERE`

## 30-Second Product Summary

DineLink OS turns a restaurant table QR into a complete ordering workflow. Guests scan, browse a premium branded menu, type natural requests like "2 spicy burgers and 1 cold coffee", and the AI assistant converts that into real cart actions. Staff and kitchen teams get live dashboards with table context, order status, and service flow.

## Problem Solved

Most QR menus are static, generic, and disconnected from restaurant operations. Small restaurants need a simple way to offer fast digital ordering, reduce staff confusion, and look premium without buying enterprise software.

## Target Users

- Small restaurants
- Cafes
- Quick-service restaurants
- Waiters and service staff
- Kitchen teams
- Customers ordering from table QR codes

## Key Features

- QR-to-menu guest ordering
- AI natural language order assistant
- Real menu-aware matching and suggestions
- Premium branded restaurant menu
- Cart verification flow
- Animated order success timeline
- Live kitchen dashboard
- Waiter/admin operations
- Customer profile and order history
- Demo safety mode for reliable judging

## AI Usage

The AI ordering assistant lets guests type natural requests instead of searching manually. It detects quantities, understands food intent like spicy, vegetarian, drinks, and budget, and only matches against real menu items. If no external AI endpoint is configured, the app uses a local fallback parser so the demo still works.

## Tech Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT role-based auth

## Demo Steps

1. Open the homepage.
2. Click `Simulate QR Scan`.
3. Show the table-aware restaurant menu.
4. Type `2 spicy burgers and 1 cold coffee`.
5. Show AI cart building.
6. Place the order.
7. Enter demo code `123456`.
8. Show success timeline.
9. Open `/kitchen`.
10. Move order through kitchen statuses.

## Why This Matters

Restaurants are already comfortable with QR menus, but customers expect better experiences. DineLink OS adds AI, premium design, and operations visibility to make QR ordering useful for both guests and staff.

## Future Roadmap

- Secure backend OpenAI integration
- Payments
- Multi-restaurant SaaS onboarding
- PWA/offline mode
- AI upsells and combo recommendations
- Kitchen prep-time prediction
- Owner analytics dashboard
- Restaurant theme studio

## Submission Note

The project includes demo fallback behavior. If the backend database is empty or unavailable, the app still shows sample menu items, AI ordering, order success, and kitchen demo activity.

