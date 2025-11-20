# Authentication System Documentation

## Overview

This is a production-ready authentication system using **NextAuth.js v4+** with credential-based authentication, MongoDB integration, and comprehensive validation.

## Features

✅ **Sign Up** - User registration with strong password requirements
✅ **Sign In** - Email/password authentication  
✅ **Session Management** - JWT-based sessions with NextAuth
✅ **Password Hashing** - bcryptjs with salt rounds = 10
✅ **Route Protection** - Middleware protecting routes from unauthenticated users
✅ **Input Validation** - Client & server-side validation
✅ **Error Handling** - Comprehensive error messages
✅ **Password Requirements**:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character (!@#$%^&*)

## File Structure

```
apps/web/
├── src/
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── auth-utils.ts        # Validation utilities
│   │   └── mongodb.ts           # MongoDB connection helper
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup page
│   │   └── api/
│   │       └── auth/
│   │           ├── [...nextauth]/
│   │           │   └── route.ts # NextAuth API handler
│   │           └── signup/
│   │               └── route.ts # Signup API endpoint
│   └── providers.tsx            # SessionProvider wrapper
├── middleware.ts                # Route protection middleware
└── scripts/
    └── seed-users.ts           # Demo user seeding script
```

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
npm install next-auth bcryptjs mongodb
```

### 2. Environment Variables

Add to `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-chars-for-production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=ticketmanager
```

### 3. Seed Demo Users (Optional)

Run once to populate MongoDB with demo accounts:

```bash
cd apps/web
npx ts-node scripts/seed-users.ts
```

Demo credentials:
- Email: `user@test.com`
- Password: `password123`

## Authentication Flow

### Sign Up Flow

1. User fills signup form with name, email, password
2. Client validates input with regex and rules
3. Form submits to `/api/auth/signup`
4. Server validates again (defense in depth)
5. Check if email already exists
6. Hash password with bcryptjs
7. Store user in MongoDB
8. Auto-signin user with NextAuth
9. Redirect to `/events`

### Sign In Flow

1. User enters email and password
2. Client sends credentials to NextAuth CredentialsProvider
3. Provider validates against MongoDB
4. bcryptjs compares password hash
5. Create JWT session token
6. Store session in NextAuth
7. Redirect to `/events`

## Database Schema

### Users Collection

```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...",  // bcryptjs hashed
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

## Route Protection

Routes are protected by `middleware.ts`. Unauthenticated users are redirected to `/login`.

**Protected Routes:**
- `/events` - Browse available events
- `/event/[id]` - View event details and select seats
- `/my-tickets` - View reserved tickets

**Public Routes:**
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

## Using Session in Components

### In Client Components

```tsx
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Not signed in</div>;

  return <div>Welcome, {session?.user?.email}</div>;
}
```

### Getting User ID for API Calls

```tsx
const { data: session } = useSession();

const response = await fetch(`/api/tickets/my-tickets?userId=${session?.user?.id}`);
```

### In Server Components

```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function MyComponent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Access denied</div>;
  }

  return <div>Welcome, {session.user.email}</div>;
}
```

## Password Validation

Use the auth-utils functions:

```tsx
import { validatePassword, getPasswordStrength } from '@/lib/auth-utils';

const { valid, errors } = validatePassword('MyPassword123!');
const strength = getPasswordStrength('MyPassword123!');
// strength = { strength: 'strong', score: 5 }
```

## Sign Out

In any client component:

```tsx
import { signOut } from 'next-auth/react';

<button onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}>
  Sign Out
</button>
```

The navbar already includes this functionality.

## Security Best Practices Implemented

✅ Password hashing with bcryptjs (10 rounds)  
✅ Constant-time password comparison (bcryptjs)  
✅ SQL injection prevention (MongoDB/Mongoose)  
✅ CSRF protection (NextAuth)  
✅ Secure session tokens (JWT)  
✅ HTTP-only cookies (NextAuth default)  
✅ Client & server-side validation  
✅ Email verification placeholder (ready to implement)  
✅ Rate limiting placeholder (ready to implement)  
✅ Middleware route protection  

## Future Enhancements

- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Rate limiting on login/signup
- [ ] Two-factor authentication (2FA)
- [ ] OAuth providers (Google, GitHub)
- [ ] Session timeout
- [ ] Activity logging
- [ ] IP whitelisting

## Troubleshooting

### "User not found" during login
- Check MongoDB connection
- Verify email is lowercase in database
- Seed demo users with script

### "Passwords do not match"
- JavaScript validation is case-sensitive
- Ensure CAPS LOCK is off

### "Email already registered"
- User already exists in MongoDB
- Try different email or login instead

### Session not persisting
- Check NEXTAUTH_SECRET is set
- Verify NextAuth routes are accessible at `/api/auth/[...nextauth]`
- Clear browser cookies

## Testing

### Manual Testing

1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill form with:
   - Name: Your Name
   - Email: yourname@test.com
   - Password: MyPassword123!
4. Submit
5. You'll be auto-signed in and redirected to events
6. Click navbar "Sign Out" to test logout
7. Login with credentials

### Test Accounts

Default demo account:
- Email: `user@test.com`
- Password: `password123`

## API Reference

### POST /api/auth/signup

Creates a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Error (400, 409, 500):**
```json
{
  "message": "Error description"
}
```

### POST /api/auth/signin (NextAuth)

Uses NextAuth CredentialsProvider. Called automatically by `signIn()`.

### GET /api/auth/session (NextAuth)

Returns current session or null if not authenticated.

## Migration from In-Memory to MongoDB

The system was migrated from in-memory user storage to MongoDB. All credentials are now persisted and secure.

Previously working demo account still works:
- Email: `user@test.com`
- Password: `password123`

(Available after running seed script)
