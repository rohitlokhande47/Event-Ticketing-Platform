# 🚀 Quick Start - Authentication System

## What's New?

A complete, production-ready authentication system has been added to your ticketing platform.

## Features

✅ **Sign Up** - Create new account with validation  
✅ **Sign In** - Login with email/password  
✅ **MongoDB Storage** - User data persisted securely  
✅ **Password Hashing** - bcryptjs with 10 salt rounds  
✅ **Route Protection** - Automatic redirect to login for protected pages  
✅ **Session Management** - JWT-based sessions via NextAuth  
✅ **Password Requirements** - 8+ chars, uppercase, number, special char  

## Getting Started (3 Steps)

### Step 1: Setup Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=ticketmanager
```

For quick testing, use:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-change-in-production-12345
```

### Step 2: Seed Demo Account (Optional)

In `apps/web/` directory:

```bash
npx ts-node scripts/seed-users.ts
```

Output:
```
✅ Successfully seeded demo users
Demo credentials:
  Email: user@test.com
  Password: password123
```

### Step 3: Run the Application

```bash
# Terminal 1: Start backend
cd apps/backend
npx ts-node src/main.ts

# Terminal 2: Start frontend
cd apps/web
npm run dev
```

Visit **http://localhost:3000**

## Testing the Auth Flow

### Option A: Create New Account
1. Click "Sign Up" on navbar
2. Enter:
   - Name: Your Name
   - Email: newuser@example.com
   - Password: MyPassword123!
3. Click "Sign Up"
4. You'll be auto-logged in ✅
5. Browse events and buy tickets

### Option B: Use Demo Account
1. Click "Sign In" on navbar
2. Use:
   - Email: `user@test.com`
   - Password: `password123`
3. Click "Sign In"
4. You're logged in ✅

## What Changed

### New Files Created
- `src/app/signup/page.tsx` - Signup page with validation
- `src/app/api/auth/signup/route.ts` - Signup API endpoint
- `src/lib/auth.ts` - NextAuth configuration (updated to use MongoDB)
- `src/lib/auth-utils.ts` - Validation utility functions
- `src/lib/mongodb.ts` - MongoDB connection helper
- `middleware.ts` - Route protection
- `scripts/seed-users.ts` - Seed demo users

### Files Updated
- `src/app/login/page.tsx` - Added link to signup, improved UX
- `src/app/my-tickets/page.tsx` - Now uses `session.user.id`
- `src/app/events/page.tsx` - Now uses `session.user.id` (if updated)
- `src/app/layout.tsx` - Already has SessionProvider

## Key Implementation Details

### Password Requirements
```
✓ Minimum 8 characters
✓ At least 1 UPPERCASE letter (A-Z)
✓ At least 1 number (0-9)
✓ At least 1 special character (!@#$%^&*)
```

### Password Strength Indicator
Visual feedback shows as you type:
- 🟢 Green bar = Requirement met
- ⚪ Gray bar = Requirement not met

### Validation
- **Client-side** - Instant feedback while typing
- **Server-side** - Double-check on submission (defense in depth)
- **Database** - Email uniqueness check

### Session Management
Session is stored in:
- JWT token (secure)
- HTTP-only cookie (default NextAuth)
- Available in all components via `useSession()`

## Using Authentication in Your Code

### Check if User is Logged In
```tsx
import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session } = useSession();
  
  if (!session) return <div>Please login</div>;
  return <div>Welcome, {session.user.email}</div>;
}
```

### Get User ID for API Calls
```tsx
const { data: session } = useSession();

await fetch(`/api/tickets?userId=${session?.user?.id}`);
```

### Sign Out
```tsx
import { signOut } from 'next-auth/react';

<button onClick={() => signOut()}>
  Sign Out
</button>
```

(Already implemented in navbar)

## Database Structure

### MongoDB Collections

**users** collection:
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",  // bcryptjs hashed
  "createdAt": ISODate("2025-11-20T..."),
  "updatedAt": ISODate("2025-11-20T...")
}
```

## Security Features

✅ Password hashing (bcryptjs, 10 rounds)  
✅ Constant-time comparison (prevents timing attacks)  
✅ CSRF protection (NextAuth)  
✅ Secure cookies (HTTP-only, SameSite)  
✅ Client + server validation  
✅ Middleware route protection  
✅ No passwords in logs or responses  

## Troubleshooting

### "Cannot find module './mongodb'"
- Verify `/src/lib/mongodb.ts` exists
- Run `npm install`
- Restart dev server

### Email already registered
- Use different email
- Or login with that email

### Password not strong enough
- Password must have: 8 chars, uppercase, number, special char
- Example: `MyPassword123!`

### Session not persisting
- Check NEXTAUTH_SECRET is set in `.env.local`
- Clear browser cookies
- Check browser allows cookies

### 404 on /api/auth/signin
- Verify `apps/web/src/app/api/auth/[...nextauth]/route.ts` exists
- Restart dev server

## Protected Routes

These routes require login (redirect to /login if not authenticated):
- `/events` - Browse events
- `/event/[id]` - Select seats
- `/my-tickets` - View your tickets

These routes are public:
- `/` - Homepage
- `/login` - Login page
- `/signup` - Signup page

## Next Steps

1. ✅ **Auth System Ready** - Signup and signin working
2. **Complete Payment** - Finish Stripe integration
3. **QR Codes** - Generate downloadable QR codes for tickets
4. **Admin Dashboard** - Create/manage events
5. **Email Notifications** - Confirm bookings via email
6. **Advanced** - 2FA, OAuth (Google/GitHub), password reset

## Documentation

For detailed documentation, see: `AUTHENTICATION.md`

## Support

If something isn't working:
1. Check error message in console
2. Verify MongoDB connection string
3. Run `npm install` to ensure all packages installed
4. Clear `.next` folder and rebuild
5. Check that both backend and frontend are running

---

**Ready to test?** Go to http://localhost:3000 and sign up! 🎉
