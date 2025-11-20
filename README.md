# TicketManager - Event Ticketing System

A full-stack event ticketing application built with **Next.js 15**, **NestJS**, **MongoDB**, and **Redis** with **NextAuth.js** for authentication.

## 🎉 What's New - Authentication System!

✅ **User Sign Up** - Create account with password strength validation  
✅ **User Sign In** - Secure login with session management  
✅ **Session Management** - JWT-based persistent sessions  
✅ **Route Protection** - Automatic redirection for unauthorized access  
✅ **Password Hashing** - Bcryptjs with 10 salt rounds  

**Quick Start**: See [START_HERE.md](./START_HERE.md) (2 minutes)

## Features

✅ **Secure Seat Locking** - Seats are locked for 10 minutes during checkout to prevent overbooking  
✅ **Instant QR Tickets** - Generate and download QR codes immediately after purchase  
✅ **Real-time Availability** - Live updates as seats are purchased  
✅ **Waitlist System** - Get notified when seats become available  
✅ **Resale Marketplace** - Users can sell their tickets to others  
✅ **Stripe Payments** - Secure payment processing  
✅ **Distributed Locking** - Redis-based locks prevent race conditions
✅ **User Authentication** - NextAuth.js with secure session management

## Tech Stack

### Backend
- **NestJS 11** - TypeScript-first Node.js framework
- **MongoDB** - Document database for events, tickets, orders
- **Mongoose** - MongoDB object modeling
- **Redis** - Distributed caching and locks via Redlock
- **Stripe** - Payment processing
- **JWT** - Secure ticket QR code signing

### Frontend
- **Next.js 15** - React with App Router
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe components

### Infrastructure
- **MongoDB Atlas** - Cloud MongoDB hosting
- **Upstash Redis** - Serverless Redis
- **Stripe API** - Payment gateway

## Project Structure

```
ticketmanger/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── schemas/       # MongoDB schemas (Ticket, Event, Order, etc)
│   │   │   ├── tickets/       # Ticket reservation logic
│   │   │   ├── payments/      # Stripe integration
│   │   │   ├── qr/           # QR code generation
│   │   │   └── main.ts       # Entry point
│   │   └── package.json
│   └── web/
│       ├── src/app/
│       │   ├── page.tsx       # Home page
│       │   ├── events/        # Event listing
│       │   ├── event/[id]/    # Event detail & seat selection
│       │   └── my-tickets/    # User's tickets
│       └── package.json
└── packages/
    └── shared/                # Shared types
```

## Getting Started

### 1. Setup Environment Variables

Create `.env` files:

**`apps/backend/.env`**:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ticketing?retryWrites=true&w=majority
REDIS_URL=rediss://default:password@host:6379
REDIS_TLS=true
JWT_SECRET=your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**`apps/web/.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd ../web
npm install
```

### 3. Start Development Servers

**Backend** (Terminal 1):
```bash
cd apps/backend
npx ts-node src/main.ts
# Runs on http://localhost:3000
```

**Frontend** (Terminal 2):
```bash
cd apps/web
npm run dev
# Runs on http://localhost:3001
```

## API Endpoints

### Tickets
- `POST /tickets/reserve` - Reserve a seat
- `GET /tickets/my-tickets` - Get user's tickets

### Payments
- `POST /payments/create-intent` - Create Stripe payment intent
- `POST /payments/confirm` - Confirm payment

### QR Codes
- `POST /qr/generate` - Generate QR code for a ticket
- `GET /qr/verify/:token` - Verify and validate a ticket

### Events
- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `GET /events/:id/tickets` - Get available tickets for event

### Health
- `GET /health` - Check MongoDB and Redis connection status

## How It Works

### 1. **Seat Reservation Flow**
1. User selects seats on the event page
2. Client calls `POST /tickets/reserve` with ticket IDs
3. Backend acquires a **Redlock** distributed lock on each ticket (10-minute timeout)
4. Seats are marked as "reserved" in MongoDB
5. Auto-release happens after 10 minutes if not confirmed

### 2. **Payment Flow**
1. User submits payment info
2. Client calls `POST /payments/create-intent` 
3. Backend creates Stripe PaymentIntent
4. User completes payment on frontend
5. Webhook confirms payment → marks tickets as "sold"

### 3. **QR Ticket Generation**
1. After payment confirmation, user can download QR code
2. `POST /qr/generate` creates JWT-signed token
3. Token is embedded in QR code image
4. Event staff scans QR at entry to validate ticket

## Database Schemas

### Ticket
```typescript
{
  event: ObjectId,          // Reference to Event
  seatNumber: "A12",        // Seat identifier
  status: "available|reserved|sold|used",
  holder: ObjectId,         // User who holds the ticket
  reservationExpiresAt: Date,
  ticketToken: string,      // JWT for QR code
}
```

### Order
```typescript
{
  user: ObjectId,
  tickets: [ObjectId],      // Array of ticket IDs
  totalAmount: 5000,        // In cents
  status: "pending|paid|failed",
  stripePaymentIntentId: string,
}
```

## Deployment

### Frontend (Vercel)
```bash
cd apps/web
npm run build
# Push to GitHub, connect to Vercel
```

### Backend (Railway/Render)
```bash
cd apps/backend
npm run build
npm run start:prod
```

## Future Enhancements

- [ ] WebSocket live seat updates
- [ ] Admin dashboard for event management
- [ ] Email notifications
- [ ] SMS verification
- [ ] Multi-currency support
- [ ] Analytics dashboard
- [ ] Refund processing
- [ ] Bulk ticket upload

## License

MIT