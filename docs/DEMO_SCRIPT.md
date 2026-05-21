# DineLink OS 2-Minute Demo Script

## Before Recording

Run:

```bash
cd frontend
npm run dev
```

Optional backend:

```bash
cd backend
npm run dev
```

Use this URL:

```text
http://localhost:5173/
```

## 0:00 - 0:15 Opening

Show homepage.

Say:

> DineLink OS is an AI-powered QR ordering system for modern restaurants. It turns a simple table QR into a premium ordering, verification, and kitchen workflow.

Point to:

- AI ordering message
- QR workflow
- Kitchen/service value

## 0:15 - 0:30 QR Flow

Click:

```text
Simulate QR Scan
```

Say:

> This simulates a customer scanning the QR code on their table.

The demo QR is:

```text
/qr/demo-table-t1
```

## 0:30 - 0:55 Branded Menu

Show menu page.

Point to:

- Restaurant branding
- Busy/Open status
- Table context
- Menu cards

Say:

> The experience is table-aware and branded for the restaurant, so it feels like a real venue rather than a generic menu.

## 0:55 - 1:15 AI Ordering

Type in AI assistant:

```text
2 spicy burgers and 1 cold coffee
```

Click:

```text
Build My Order
```

Say:

> The assistant understands natural language, detects quantities, and only matches real menu items.

Backup prompts:

```text
1 Spicy Paneer Burger and 1 Cold Coffee
Veg food under Rs. 300
Something spicy
```

## 1:15 - 1:35 Cart And Verification

Open cart if it is not already open.

Click:

```text
Place Order
```

Enter demo code:

```text
123456
```

Say:

> Verification keeps table orders safe and gives staff confidence before the order enters the kitchen.

## 1:35 - 1:50 Success Timeline

Show:

- Thank-you confirmation
- Estimated preparation time
- Order summary
- Animated timeline

Say:

> After ordering, the customer gets a premium status experience instead of a plain receipt.

## 1:50 - 2:00 Kitchen Dashboard

Open:

```text
http://localhost:5173/kitchen
```

Click:

```text
Accept
Start Preparing
Mark Ready/Served
```

Say:

> The kitchen receives clear table-aware tickets and can move orders through the workflow live.

## Backup Plan

If backend/API is unavailable:

- Use `http://localhost:5173/qr/demo-table-t1`
- The app loads sample menu data
- AI uses local fallback parsing
- Use code `123456`
- Kitchen shows demo orders

## Recording Checklist

- Homepage hero
- Simulated QR scan
- Branded menu
- AI assistant prompt
- Cart verification
- Success timeline
- Kitchen status update

