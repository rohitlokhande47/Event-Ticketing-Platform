# 🎫 TicketManager - Event Ticketing Platform

A **production-ready**, full-stack event ticketing application built with **Next.js 15**, **NestJS**, **MongoDB Atlas**, and **Stripe** with **NextAuth.js** for secure authentication and JWT-based QR code tickets.

**Status**: ✅ Fully Deployed to Production

---

## 🚀 Live Deployment Links

| Component | Deployment | Status |
|-----------|------------|--------|
| **Frontend** | 🔗 [https://web-pi-seven-74.vercel.app](https://web-pi-seven-74.vercel.app) | ✅ Live |
| **Backend API** | 🔗 [https://ticketmanager-production-897d.up.railway.app](https://ticketmanager-production-897d.up.railway.app) | ✅ Live |
| **Health Check** | 🔗 [https://ticketmanager-production-897d.up.railway.app/health](https://ticketmanager-production-897d.up.railway.app/health) | ✅ Live |
| **Database** | MongoDB Atlas (Cloud) | ✅ Connected |

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- ✅ User Sign Up/Sign In with email validation
- ✅ Password strength requirements (8+ chars, uppercase, numbers)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ JWT-based session management via NextAuth.js
- ✅ Secure route protection and automatic redirects

### 🎟️ **Ticket Management**
- ✅ Real-time seat availability tracking
- ✅ Secure seat locking (10-minute reservation window)
- ✅ Prevent overbooking with distributed locks
- ✅ Instant QR code ticket generation after purchase
- ✅ JWT-signed QR codes for validation

### 💳 **Payment Processing**
- ✅ Stripe integration with Payment Intents API
- ✅ Secure card processing in test mode
- ✅ Instant order confirmation
- ✅ Support for multiple currencies
- ✅ Webhook-based payment verification

### 📱 **User Experience**
- ✅ Responsive design (mobile-first)
- ✅ Live seat selection interface
- ✅ One-click ticket download (QR code)
- ✅ My Tickets dashboard
- ✅ Dark mode support

---

## 🏗️ Tech Stack

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **NestJS 11** | TypeScript-first Node.js framework with modular architecture |
| **Express.js** | Web server (via NestJS) |
| **MongoDB** | NoSQL database for events, users, tickets, orders |
| **Mongoose** | MongoDB ODM for schema validation |
| **Stripe API** | Payment processing & secure transactions |
| **JWT (jsonwebtoken)** | Token signing for QR codes |

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React framework with App Router & SSR |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **NextAuth.js 4** | Authentication & session management |
| **Stripe.js** | Client-side payment handling |

### **Infrastructure**
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting & deployment |
| **Railway** | Backend hosting & deployment |
| **MongoDB Atlas** | Cloud MongoDB database |
| **GitHub** | Version control & CI/CD |

---

## 📁 Project Structure

```
ticketmanger/                          # Monorepo root
├── apps/
│   ├── backend/                        # NestJS backend server
│   │   ├── src/
│   │   │   ├── main.ts                 # Entry point (listens on 0.0.0.0:PORT)
│   │   │   ├── app.module.ts           # Root module
│   │   │   ├── app.controller.ts       # Health check endpoint
│   │   │   ├── schemas/                # MongoDB Mongoose schemas
│   │   │   │   ├── user.schema.ts
│   │   │   │   ├── event.schema.ts
│   │   │   │   ├── ticket.schema.ts
│   │   │   │   └── order.schema.ts
│   │   │   ├── events/                 # Events module (list, details)
│   │   │   ├── tickets/                # Tickets module (reserve, list)
│   │   │   ├── payments/               # Payments module (Stripe integration)
│   │   │   └── qr/                     # QR code module (generate, verify)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                            # Next.js frontend application
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx             # Home page
│       │   │   ├── layout.tsx           # Root layout
│       │   │   ├── signup/              # Sign up page
│       │   │   ├── login/               # Sign in page
│       │   │   ├── events/              # Events listing page
│       │   │   ├── event/[id]/          # Event details & seat selection
│       │   │   ├── checkout/[orderId]/  # Payment page
│       │   │   ├── my-tickets/          # User's tickets page
│       │   │   └── api/
│       │   │       └── auth/
│       │   │           ├── signup/route.ts
│       │   │           └── [...nextauth]/route.ts
│       │   ├── lib/
│       │   │   ├── auth.ts              # NextAuth configuration
│       │   │   ├── mongodb.ts           # MongoDB connection
│       │   │   └── auth-utils.ts        # Auth helper functions
│       │   └── components/              # Reusable components
│       ├── package.json
│       ├── next.config.ts
│       └── tailwind.config.ts
│
├── package.json                         # Root monorepo config
├── vercel.json                          # Vercel build config
├── README.md                            # This file
└── .gitignore
```

---

## 🔄 Complete User Journey & Workflow

### **1️⃣ User Registration**
```
User Browser
   ↓
Visits: https://web-pi-seven-74.vercel.app/signup
   ↓
Fills signup form (name, email, password)
   ↓
Form validation: password strength check
   ↓
POST /api/auth/signup → Next.js Route Handler
   ↓
Validate input & check if email exists
   ↓
Hash password with bcryptjs
   ↓
INSERT into MongoDB "users" collection
   ↓
Auto sign-in: signIn('credentials', {...})
   ↓
Redirect to /events page (authenticated)
```

**Files Involved:**
- Frontend: `apps/web/src/app/signup/page.tsx` (UI)
- Backend: `apps/web/src/app/api/auth/signup/route.ts` (API Handler)
- Database: MongoDB `users` collection
- Auth: `apps/web/src/lib/auth.ts` (NextAuth config)

---

### **2️⃣ Browse Events**
```
User at /events
   ↓
Page loads Next.js component
   ↓
GET /events → Backend API
   ↓
NestJS EventsController
   ↓
Query MongoDB "events" collection
   ↓
Return JSON with event details:
{
  _id: "507f1f77bcf86cd799439011",
  name: "Concert 2025",
  date: "2025-12-25",
  totalSeats: 500,
  availableSeats: 237,
  price: 10000  // cents
}
   ↓
React renders event cards
```

**Files Involved:**
- Frontend: `apps/web/src/app/events/page.tsx`
- Backend: `apps/backend/src/events/events.controller.ts`
- Backend: `apps/backend/src/events/events.service.ts`
- Schema: `apps/backend/src/schemas/event.schema.ts`

---

### **3️⃣ Select Seats & Reserve**
```
User clicks event → /event/[id]
   ↓
Seat map loads from database
   ↓
User selects 3 seats (A1, A2, A3)
   ↓
Click "Reserve Tickets"
   ↓
POST /tickets/reserve {seatIds: [...]}
   ↓
Backend acquires REDLOCK on each ticket
   ↓
Seats locked for 10 minutes
   ↓
Status changed to "reserved"
   ↓
Create Order in MongoDB
   ↓
Return order ID to frontend
   ↓
Redirect to /checkout/[orderId]
```

**Files Involved:**
- Frontend: `apps/web/src/app/event/[id]/page.tsx`
- Backend: `apps/backend/src/tickets/tickets.service.ts`
- Backend: `apps/backend/src/tickets/tickets.controller.ts`
- Schema: `apps/backend/src/schemas/ticket.schema.ts`, `order.schema.ts`

---

### **4️⃣ Payment Processing**
```
User at /checkout/[orderId]
   ↓
Stripe CardElement renders
   ↓
User enters card: 4242 4242 4242 4242 (test card)
   ↓
Click "Pay Now"
   ↓
POST /payments/create-intent {orderId, amount}
   ↓
Backend creates Stripe PaymentIntent
   ↓
Returns client_secret to frontend
   ↓
Frontend calls stripe.confirmCardPayment(clientSecret)
   ↓
[User enters 2FA if required]
   ↓
POST /payments/confirm {orderId, paymentIntentId}
   ↓
Backend verifies payment with Stripe
   ↓
Update Order status: "pending" → "paid"
   ↓
Change Tickets status: "reserved" → "sold"
   ↓
Return success response
   ↓
Frontend redirects to /my-tickets
```

**Files Involved:**
- Frontend: `apps/web/src/app/checkout/[orderId]/page.tsx`
- Frontend: `apps/web/src/components/CheckoutForm.tsx`
- Backend: `apps/backend/src/payments/payments.service.ts`
- Backend: `apps/backend/src/payments/payments.controller.ts`
- Stripe: Payment Intents API

**Test Card**: `4242 4242 4242 4242` (any future date, any CVC)

---

### **5️⃣ QR Code Download**
```
User at /my-tickets
   ↓
Sees purchased tickets
   ↓
Click "Download QR"
   ↓
POST /qr/generate {ticketId}
   ↓
Backend creates JWT payload:
{
  ticketId: "...",
  eventId: "...",
  seatNumber: "A1",
  iat: 1732193400,
  exp: 1763729400  // 1 year from now
}
   ↓
Sign with JWT_SECRET
   ↓
Generate QR code image
   ↓
Return QR code PNG
   ↓
Browser downloads as ticket.png
```

**Files Involved:**
- Frontend: `apps/web/src/app/my-tickets/page.tsx`
- Backend: `apps/backend/src/qr/qr.service.ts`
- Backend: `apps/backend/src/qr/qr.controller.ts`

---

### **6️⃣ Ticket Validation (Event Entry)**
```
Event staff scans QR code at gate
   ↓
QR contains JWT token
   ↓
GET /qr/verify/:token
   ↓
Backend verifies JWT signature
   ↓
Decode token → get ticketId, eventId, seatNumber
   ↓
Query MongoDB for ticket
   ↓
Check status: must be "sold"
   ↓
Mark as "used"
   ↓
Return response:
{
  valid: true,
  ticketNumber: "A1",
  eventName: "Concert 2025",
  holder: "John Doe"
}
   ↓
Staff grants entry
```

**Files Involved:**
- Backend: `apps/backend/src/qr/qr.service.ts`

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                       │
│  (Next.js Frontend: https://web-pi-seven-74.vercel.app) │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Signup     │  │  Events      │  │  Checkout    │  │
│  │   Page       │  │  Page        │  │  Page        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
└─────────┼─────────────────┼──────────────────┼──────────┘
          │                 │                  │
          │ HTTP API Calls  │                  │
          ↓                 ↓                  ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (NestJS)                       │
│ (https://ticketmanager-production-897d.up.railway.app) │
│                                                          │
│  POST /api/auth/signup    (Create user account)         │
│  GET  /events             (List events)                 │
│  GET  /events/:id         (Event details)               │
│  POST /tickets/reserve    (Lock seats)                  │
│  POST /payments/create-intent (Stripe)                  │
│  POST /payments/confirm   (Verify payment)              │
│  POST /qr/generate        (Create QR ticket)            │
│  GET  /qr/verify/:token   (Validate ticket)             │
│                                                          │
└─────────────────┬──────────────────────┬────────────────┘
                  │                      │
                  ↓                      ↓
        ┌────────────────┐     ┌───────────────────┐
        │ MongoDB Atlas  │     │  Stripe API       │
        │  (Database)    │     │ (Payments)        │
        │                │     │                   │
        │ - Users        │     │ PaymentIntents    │
        │ - Events       │     │ Confirmations     │
        │ - Tickets      │     │ Webhooks          │
        │ - Orders       │     │                   │
        └────────────────┘     └───────────────────┘
```

---

## 🚀 Deployment Architecture

### **Frontend Deployment (Vercel)**
```
GitHub Repository
        ↓
Auto-deploy on push
        ↓
Vercel builds Next.js
        ↓
npm run build
        ↓
.next/ generated
        ↓
Deployed to CDN
        ↓
https://web-pi-seven-74.vercel.app
```

**Environment Variables (Vercel Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://ticketmanager-production-897d.up.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
NEXTAUTH_SECRET=*** (random 32-character string)
NEXTAUTH_URL=https://web-pi-seven-74.vercel.app
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### **Backend Deployment (Railway)**
```
GitHub Repository
        ↓
Railway detects push
        ↓
npm install
        ↓
npm run build
        ↓
npm run start
        ↓
NestJS app starts
        ↓
Listens on: 0.0.0.0:PORT (Railway sets PORT)
        ↓
https://ticketmanager-production-897d.up.railway.app
```

**Environment Variables (Railway Dashboard):**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
STRIPE_SECRET_KEY=sk_test_***
JWT_SECRET=*** (same as NEXTAUTH_SECRET)
FRONTEND_URL=https://web-pi-seven-74.vercel.app
PORT=8080 (auto-set by Railway)
```

---

## 🔧 Local Development Setup

### **Prerequisites**
- Node.js 18+ and npm 9+
- MongoDB Atlas account (free tier available)
- Stripe account (test mode)
- Git installed

### **1. Clone Repository**
```bash
git clone https://github.com/rohitlokhande47/Event-Ticketing-Platform.git
cd ticketmanger
```

### **2. Install Dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/backend
npm install

# Install frontend dependencies
cd ../web
npm install
```

### **3. Create Environment Files**

**`apps/backend/.env`:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ticketing
JWT_SECRET=your-random-secret-key-32-chars-long
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
FRONTEND_URL=http://localhost:3000
REDIS_URL=  # Leave empty for development (uses fallback)
```

**`apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ticketing
```

### **4. Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd apps/backend
npm run start:dev

# Output:
# [Nest] 1234  - 11/21/2025, 10:00:00 AM LOG [NestApplication] Nest application successfully started
# ✅ Backend API running at http://0.0.0.0:3001
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev

# Output:
# ▲ Next.js 15.5.6
# - Local:        http://localhost:3000
# - Environments: .env.local
```

### **5. Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## 📡 API Endpoints Reference

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/signin` | Sign in with credentials |

### **Events**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events with details |
| GET | `/events/:id` | Get specific event details |
| GET | `/events/:id/tickets` | Get available seats for event |

### **Tickets**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tickets/reserve` | Reserve seats (locks for 10 min) |
| GET | `/tickets/my-tickets` | Get user's purchased tickets |

### **Payments**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/create-intent` | Create Stripe PaymentIntent |
| POST | `/payments/confirm` | Confirm and process payment |
| GET | `/payments/order/:orderId` | Get order details |

### **QR Codes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/qr/generate` | Generate QR code ticket |
| GET | `/qr/verify/:token` | Verify ticket JWT token |

### **Health**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check MongoDB & Redis status |

---

## 🧪 Testing the Application

### **Test User Account**
```
Email: test@example.com
Password: Test@1234
```

### **Test Stripe Card**
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (MM/YY)
CVC: Any 3 digits
```

### **Sample cURL Commands**

**List Events:**
```bash
curl https://ticketmanager-production-897d.up.railway.app/events
```

**Health Check:**
```bash
curl https://ticketmanager-production-897d.up.railway.app/health
```

**Create User:**
```bash
curl -X POST https://web-pi-seven-74.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

---

## 🔒 Security Features

| Feature | Implementation |
|---------|-----------------|
| **Password Hashing** | Bcryptjs with 10 salt rounds |
| **JWT Tokens** | NextAuth.js session tokens (secure, httpOnly cookies) |
| **QR Code Signing** | JWT-based signed tokens (2-year expiration) |
| **CORS Protection** | Whitelist frontend domain only |
| **Environment Secrets** | No secrets in code, all in .env |
| **Stripe Integration** | PCI-compliant Payment Intents API |
| **Database Validation** | Mongoose schema validation |
| **Input Sanitization** | Email validation, password strength checks |

---

## 📈 Performance Optimizations

- ✅ **Distributed Locking** - Redis prevents race conditions
- ✅ **Database Indexing** - Fast queries on frequently accessed fields
- ✅ **CDN Delivery** - Vercel global CDN for frontend
- ✅ **Image Optimization** - Next.js automatic image optimization
- ✅ **Code Splitting** - Lazy loading of components
- ✅ **Caching** - MongoDB and backend caching

---

## 🐛 Troubleshooting

### **Issue: "Cannot POST /api/auth/signup"**
**Solution:** Disable Vercel Deployment Protection
- Go to: https://vercel.com/dashboard
- Select "web" project → Settings → Protection
- Toggle OFF "Standard Protection"

### **Issue: "MongoDB connection failed"**
**Solution:** Check MONGODB_URI in environment variables
```bash
# Verify connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/database
```

### **Issue: "Stripe API key not found"**
**Solution:** Ensure Stripe keys are in environment variables
```bash
# Backend needs: STRIPE_SECRET_KEY
# Frontend needs: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## 📚 Additional Documentation

- **NestJS Docs**: https://docs.nestjs.com
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth.js Docs**: https://next-auth.js.org
- **MongoDB Guide**: https://docs.mongodb.com
- **Stripe Docs**: https://stripe.com/docs/payments

---

## 🔮 Future Enhancements

- [ ] WebSocket real-time seat updates
- [ ] Admin dashboard for event management
- [ ] Email notifications (signup, order confirmation)
- [ ] SMS verification for users
- [ ] Multi-currency support
- [ ] Analytics dashboard
- [ ] Refund processing system
- [ ] Waitlist functionality
- [ ] Ticket resale marketplace
- [ ] Mobile app (React Native)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**Rohit Lokhande**
- GitHub: https://github.com/rohitlokhande47
- Project: Event-Ticketing-Platform

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

**Last Updated**: November 21, 2025  
**Status**: ✅ Production Ready
