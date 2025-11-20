# 📖 Code Walkthrough - Understanding Each File

This guide explains what each authentication file does, line by line.

---

## 1. 🔐 `src/lib/auth.ts` - NextAuth Configuration

**Purpose**: Central authentication configuration

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';
```
Import required dependencies for authentication.

### Type Declarations
```typescript
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
  }
}
```
**Why?** TypeScript doesn't know NextAuth's Session/User objects by default. We extend them to add our `id` field.

### CredentialsProvider Setup
```typescript
CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
```
Defines what fields we need for login (email and password).

### The `authorize` Function
```typescript
async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) {
    throw new Error('Email and password required');
  }
```
First validation: both fields required.

```typescript
  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ 
    email: credentials.email 
  });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
```
Query MongoDB for user. Note: Generic error message for security (don't reveal if email exists).

```typescript
  const isPasswordValid = await bcrypt.compare(
    credentials.password, 
    user.password
  );
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
```
Compare user's input with stored hash using bcryptjs. **Constant-time** comparison prevents timing attacks.

```typescript
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  };
```
Return user object if credentials valid.

### JWT Callback
```typescript
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.email = user.email;
  }
  return token;
}
```
When user first signs in, store their data in JWT token. On subsequent calls, JWT already has this data (no DB lookup needed).

### Session Callback
```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;
  }
  return session;
}
```
When component calls `useSession()`, populate it with data from JWT token.

---

## 2. 🔑 `src/lib/mongodb.ts` - Database Connection

**Purpose**: Singleton MongoDB connection with caching

```typescript
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
```
**Why cache?** In serverless/edge environments, creating a new connection per request is expensive. Cache it for the lifetime of the process.

```typescript
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
```
If already connected, return cached connection immediately.

```typescript
  const client = new MongoClient(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/ticketmanager'
  );
  
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'ticketmanager');
```
Create new connection if not cached. Use env vars or defaults.

```typescript
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
```
Cache for future use and return.

---

## 3. ✅ `src/lib/auth-utils.ts` - Validation Functions

**Purpose**: Reusable validation utilities

```typescript
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```
Simple regex: `anything@anything.anything`

```typescript
export const validatePassword = (password: string): { 
  valid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
```
Check each requirement, collect all failed ones.

**Why return array?** User can see ALL failed requirements, not just first one.

---

## 4. 📝 `src/app/api/auth/signup/route.ts` - Signup Endpoint

**Purpose**: Handle user registration

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password } = body;
```
Extract JSON body from request.

```typescript
  // Validation
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: 'Name, email, and password are required' },
      { status: 400 }
    );
  }
```
Defense in depth: validate on server even though client already did.

```typescript
  const { db } = await connectToDatabase();
  
  const existingUser = await db.collection('users').findOne({
    email: email.toLowerCase(),
  });
  
  if (existingUser) {
    return NextResponse.json(
      { message: 'Email already registered. Please sign in instead.' },
      { status: 409 }
    );
  }
```
Check if email already exists. `409` = Conflict status code.

**Why lowercase?** Consistent email matching (users might type `John@Test.com` or `john@test.com`).

```typescript
  const hashedPassword = await bcrypt.hash(password, 10);
```
Hash password with cost factor 10 (2^10 = 1024 iterations). Takes ~100ms, secure against brute force.

```typescript
  const result = await db.collection('users').insertOne({
    name: name.trim(),
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
```
Insert new user document. Store hashed password, not plaintext.

```typescript
  return NextResponse.json(
    {
      message: 'User created successfully',
      userId: result.insertedId,
    },
    { status: 201 }
  );
```
Return 201 Created with user ID.

---

## 5. 🎨 `src/app/signup/page.tsx` - Signup UI

**Purpose**: User-facing signup form

```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
```
Client component (needs React hooks and NextAuth client).

### State Management
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const [errors, setErrors] = useState<FormErrors>({});
const [loading, setLoading] = useState(false);
```
Form state, error state, and loading state.

### Validation Function
```typescript
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    newErrors.name = 'Name must be at least 2 characters';
  }
```
Client-side validation returns boolean and populates errors object.

### Form Submission
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});
  
  if (!validateForm()) {
    return;  // Don't submit if validation fails
  }
```
Prevent form default submission, validate first.

```typescript
  setLoading(true);
  
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }),
  });
```
Send to signup API endpoint.

```typescript
  const data = await response.json();
  
  if (!response.ok) {
    setErrors({
      general: data.message || 'Signup failed. Please try again.',
    });
    return;
  }
```
Handle API errors gracefully.

```typescript
  // Auto sign in after successful signup
  const signInResult = await signIn('credentials', {
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    redirect: false,
  });
  
  if (signInResult?.ok) {
    router.push('/events');
  }
```
After successful signup, automatically sign in the user and redirect to events page.

---

## 6. 🔓 `src/app/login/page.tsx` - Login UI

**Purpose**: User login form

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false,
  });
```
Call NextAuth's `signIn()` function which:
1. Calls `/api/auth/signin`
2. Runs CredentialsProvider's `authorize()` function
3. Creates JWT token if valid
4. Returns result object

```typescript
  if (result?.error) {
    setError(result.error);
  } else if (result?.ok) {
    router.push('/events');
  }
```
Handle response: show error or redirect.

---

## 7. 📱 `src/app/signup/page.tsx` - Password Strength Indicator

```typescript
<div className="mt-3 space-y-2">
  <div className="flex items-center gap-2">
    <div className={`w-1 h-3 rounded ${
      formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
    }`}></div>
    <span className="text-xs text-gray-600">Min 8 characters</span>
  </div>
```
Real-time feedback:
- Check each requirement as user types
- Green bar = met
- Gray bar = not met

**UX benefit**: User sees immediately what's needed instead of waiting for form submission error.

---

## 8. 🛡️ `middleware.ts` - Route Protection

**Purpose**: Protect routes from unauthenticated access

```typescript
export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
```
Extract JWT token from request cookie.

```typescript
  const publicRoutes = ['/login', '/signup', '/'];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
```
Define which routes don't require auth.

```typescript
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
```
If no token AND trying to access protected route, redirect to login.

```typescript
  return NextResponse.next();
```
Otherwise allow request to continue.

```typescript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```
Apply middleware to all routes except static assets and Next.js internals.

---

## 9. 🎁 `src/app/providers.tsx` - Session Provider

**Purpose**: Wrap app with NextAuth session context

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```
**Why needed?** Provides `useSession()` hook to all child components.

---

## 10. 🌳 `src/app/layout.tsx` - Root Layout

```typescript
import AuthProvider from './providers';
import Navbar from './components/navbar';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```
Wraps entire app with session context and includes navbar.

**Execution order**:
1. AuthProvider initializes session
2. Navbar renders with access to session
3. Page content renders with access to session

---

## 11. ⬆️ `src/app/components/navbar.tsx` - Navigation

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  
  if (session) {
    return (
      <>
        <span>Welcome, {session.user?.email}</span>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  }
  
  return <Link href="/login">Sign In</Link>;
}
```
Show different UI based on `session` state.

---

## 12. 🌾 `scripts/seed-users.ts` - Demo Data

```typescript
const hashedPassword = await bcrypt.hash('password123', 10);

await db.collection('users').insertMany([
  {
    name: 'Test User',
    email: 'user@test.com',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);
```
Pre-hash password and insert demo user so it's ready to login.

Run once: `npx ts-node scripts/seed-users.ts`

---

## 🔄 Complete Flow Example

### When user signs up:

1. **User fills signup form**
   - Enters: name, email, password
   - Form validates in real-time
   
2. **User clicks "Sign Up"**
   - `handleSubmit()` runs in signup page
   - Client validation checks
   - POST request sent to `/api/auth/signup`

3. **Backend receives request**
   - `/api/auth/signup` route handles POST
   - Server-side validation
   - Hash password with bcryptjs
   - Insert into MongoDB

4. **Successful response**
   - Signup page calls `signIn('credentials', {...})`

5. **NextAuth processes login**
   - Calls CredentialsProvider's `authorize()`
   - Runs database query for user
   - Compares password hash
   - Creates JWT token

6. **Token stored**
   - JWT encoded with user data
   - Stored in HTTP-only cookie
   - Sent with every subsequent request

7. **Redirect & render**
   - Page redirects to `/events`
   - `useSession()` now returns user data
   - Navbar shows "Welcome, user@email.com"
   - Event page uses `session.user.id` for API calls

---

## 🎓 Key Concepts

### Hashing vs Encryption
- **Hashing**: One-way (password → hash). Can verify but not reverse.
- **Encryption**: Two-way (can decrypt). Used for data you need to read.
- **We use**: Hashing for passwords (bcryptjs)

### JWT Token
- **Contains**: user.id, user.email, expiration, signature
- **Where stored**: HTTP-only cookie (browser can't access)
- **When used**: Browser auto-sends with each request
- **Verified by**: Server checks signature with NEXTAUTH_SECRET

### CSRF Protection
- **What**: Attacker tricks you into making unintended requests
- **How NextAuth prevents**: Cookie with SameSite=Lax (only sent same-site)
- **Result**: External websites can't make requests to your site

### Salt (in bcryptjs)
- **What**: Random string added to password before hashing
- **Why**: Same password hashes to different values (prevents rainbow tables)
- **How much**: 10 rounds = 2^10 = 1024 iterations = ~100ms per hash

---

## 🚀 Performance Notes

- **JWT tokens**: Stateless, no DB lookup per request
- **MongoDB caching**: Connection pooled, reused
- **Password hashing**: Cost=10 is balanced (not too fast, not too slow)
- **Middleware**: Early redirect, prevents unnecessary rendering

---

## 🔐 Security Highlights

- **Password storage**: Bcryptjs hash with 10 rounds
- **Comparison**: Constant-time (prevents timing attacks)
- **Cookies**: HTTP-only, Secure, SameSite
- **Validation**: Client AND server (defense in depth)
- **Email**: Lowercase stored (consistent matching)
- **Error messages**: Generic (don't leak if email exists)

---

This walkthrough explains the "why" behind each line. Now you understand not just what the code does, but *why* it's built that way! 🎉
