# 🎫 TicketManager - Authentication System Visual Guide

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / User                            │
└─────────────┬───────────────────────────────────────┬───────┘
              │                                         │
              ▼                                         ▼
    ┌─────────────────┐                      ┌─────────────────┐
    │   Sign Up Page  │                      │   Login Page    │
    │   (Gradient)    │                      │   (Gradient)    │
    │   - Name input  │                      │  - Email input  │
    │   - Email input │                      │ - Password input│
    │ - Pwd strength  │                      │  - Demo creds   │
    │  - Validation   │                      │  - Validation   │
    └────────┬────────┘                      └────────┬────────┘
             │                                        │
             │ POST /api/auth/signup                 │ signIn()
             │                                        │
             ▼                                        ▼
    ┌────────────────────────────────────────────────────────┐
    │              NextAuth API Routes                       │
    │  /api/auth/signin  /api/auth/signup /api/auth/session│
    └────────┬──────────────────────────────┬───────────────┘
             │                              │
             │ Validate credentials        │ Validate form
             │ Hash password               │ Check uniqueness
             │                              │
             ▼                              ▼
    ┌────────────────────────────────────────────────────────┐
    │           MongoDB Database                             │
    │                                                        │
    │   users collection:                                   │
    │   ├─ _id: ObjectId                                   │
    │   ├─ name: string                                    │
    │   ├─ email: string (unique)                          │
    │   ├─ password: bcrypt hash                           │
    │   ├─ createdAt: date                                 │
    │   └─ updatedAt: date                                 │
    └─────────────────────────────────────────────────────┘
             │
             │ Create JWT token
             │
             ▼
    ┌────────────────────────────────────────────────────────┐
    │         NextAuth Session Management                    │
    │                                                        │
    │   JWT Token (in HTTP-only cookie)                    │
    │   ├─ user.id                                         │
    │   ├─ user.email                                      │
    │   ├─ user.name                                       │
    │   └─ expires_at                                      │
    └────────┬─────────────────────────────────┬───────────┘
             │                                 │
             │ Session persisted              │ useSession()
             │                                 │
             ▼                                 ▼
    ┌──────────────────┐            ┌────────────────────┐
    │ Browser Cookies  │            │  Client Components │
    │                  │            │                    │
    │ HTTP-only        │            │ useSession() hook  │
    │ Secure           │            │ Get user.id        │
    │ SameSite         │            │ Check auth state   │
    └──────────────────┘            └────────────────────┘
```

## 🔄 Sign Up Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│ 1. User visits /signup                                     │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │  Signup Form │
            │              │
            │ Name: ______ │
            │ Email: _____ │
            │ Pwd: _______ │
            │ Confirm: ___ │
            └──────┬───────┘
                   │
                   │ User fills form
                   │ Real-time validation ✓
                   │
                   ▼
            ┌──────────────┐
            │   Submit     │
            │   Button     │
            └──────┬───────┘
                   │
                   ▼
        Client-side validation:
        ✓ Name length >= 2
        ✓ Valid email format
        ✓ Password >= 8 chars
        ✓ Has uppercase letter
        ✓ Has number
        ✓ Passwords match
                   │
          (if validation fails)
                   ├──► Show field errors
                   └──► Stop submission
                   
          (if validation passes)
                   │
                   ▼
        POST /api/auth/signup
        {
          name: "John Doe",
          email: "john@example.com",
          password: "SecurePass123"
        }
                   │
                   ▼
        Server validation:
        ✓ All fields required
        ✓ Valid email format
        ✓ Password strong enough
        ✓ Email not already used
                   │
          (if server validation fails)
                   ├──► Return 400/409
                   └──► Show error message
                   
          (if all validation passes)
                   │
                   ▼
        Hash password with bcryptjs
        salt = 10 rounds
        hashed = await bcrypt.hash(password)
                   │
                   ▼
        Insert into MongoDB:
        {
          _id: ObjectId(),
          name: "John Doe",
          email: "john@example.com",
          password: "$2a$10$...",
          createdAt: Date(),
          updatedAt: Date()
        }
                   │
                   ▼
        Return 201 Created
        {
          message: "User created successfully",
          userId: "507f1f77bcf86cd799439011"
        }
                   │
                   ▼
        Auto sign-in with NextAuth
        signIn('credentials', {
          email: "john@example.com",
          password: "SecurePass123"
        })
                   │
                   ▼
        Create JWT session
        Store in HTTP-only cookie
                   │
                   ▼
        Redirect to /events
        ✅ User logged in
```

## 🔑 Sign In Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│ 1. User visits /login                                      │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │  Login Form  │
            │              │
            │ Email: _____ │
            │ Pwd: _______ │
            └──────┬───────┘
                   │
                   │ User enters credentials
                   │
                   ▼
            ┌──────────────┐
            │   Submit     │
            └──────┬───────┘
                   │
                   ▼
        signIn('credentials', {
          email: "john@example.com",
          password: "SecurePass123",
          redirect: false
        })
                   │
                   ▼
        NextAuth CredentialsProvider
        async authorize(credentials)
                   │
                   ▼
        Query MongoDB:
        user = db.users.findOne({
          email: "john@example.com"
        })
                   │
        ├─► User not found?
        │   └──► throw "Invalid email or password"
        │
        └─► User found?
                   │
                   ▼
        Compare passwords:
        isValid = await bcrypt.compare(
          inputPassword,
          user.password
        )
                   │
        ├─► Password wrong?
        │   └──► throw "Invalid email or password"
        │
        └─► Password correct?
                   │
                   ▼
        Return user object:
        {
          id: "507f1f77bcf86cd799439011",
          email: "john@example.com",
          name: "John Doe"
        }
                   │
                   ▼
        NextAuth JWT callback:
        token.id = user.id
        token.email = user.email
                   │
                   ▼
        Create JWT token
        Encode: sign(payload, secret)
                   │
                   ▼
        Store in HTTP-only cookie
        Cookie name: next-auth.session-token
        Domain: localhost
        Path: /
        HttpOnly: true
        Secure: true (HTTPS in prod)
        SameSite: Lax
                   │
                   ▼
        Return success response
                   │
                   ▼
        signIn() resolves
        result.ok = true
                   │
                   ▼
        Redirect to /events
        ✅ User logged in
```

## 🛡️ Route Protection Flow

```
┌──────────────────────────────────────┐
│ User navigates to /events            │
└──────────────┬───────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │  middleware.ts      │
    │                     │
    │ Match route pattern │
    └──────────┬──────────┘
               │
               ▼
    getToken({req, secret})
    Read cookie: next-auth.session-token
               │
        ├─► Token exists?
        │   └──► Validate & decode JWT
        │        Check expiration
        │        ✅ Continue (NextResponse.next())
        │
        └─► No token?
            └──► Is public route?
                 (/, /login, /signup)
                 │
                 ├─► Yes: ✅ Continue
                 │
                 └─► No: ❌ Redirect to /login
                    window.location = '/login'
```

## 💾 Data Flow on Page Load

```
┌─ Page Load ─────────────────────┐
│ /events                          │
└──────────────┬──────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │  Check session in        │
    │  browser context         │
    │                          │
    │  useSession() hook       │
    │  status: 'loading'       │
    └──────────┬───────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │  Fetch session from      │
    │  /api/auth/session       │
    │                          │
    │  Read cookie            │
    │  Verify JWT             │
    └──────────┬───────────────┘
               │
        ├─► Valid token?
        │   │
        │   └──► Decode JWT
        │        Return session object
        │        {
        │          user: {
        │            id: "...",
        │            email: "...",
        │            name: "..."
        │          }
        │        }
        │        status: 'authenticated'
        │
        └─► No token?
            │
            └──► status: 'unauthenticated'
                 Return null
                   │
                   ▼
    ┌──────────────────────────┐
    │ Component receives       │
    │ session data            │
    │                         │
    │ useSession() returns:   │
    │ {                       │
    │   data: { user {...} }, │
    │   status: 'authenticated'
    │ }                       │
    └──────────┬──────────────┘
               │
               ▼
    Render component with user data
    const userId = session.user.id
    ✅ Ready to make API calls
```

## 🎨 UI Component Hierarchy

```
App (Next.js)
│
├─ providers.tsx (SessionProvider)
│  │
│  └─ layout.tsx
│     │
│     ├─ AuthProvider (SessionProvider)
│     │
│     ├─ navbar.tsx (useSession)
│     │  ├─ conditional: logged in
│     │  │  ├─ "Welcome, user@email.com"
│     │  │  ├─ Sign Out button
│     │  │  ├─ Link: /events
│     │  │  └─ Link: /my-tickets
│     │  │
│     │  └─ conditional: logged out
│     │     └─ Sign In button
│     │
│     ├─ page.tsx (children)
│     │  │
│     │  ├─ / (public, landing)
│     │  │
│     │  ├─ /login (public, LoginPage)
│     │  │  ├─ Form
│     │  │  │  ├─ Email input
│     │  │  │  ├─ Password input
│     │  │  │  └─ Submit button
│     │  │  └─ Link to /signup
│     │  │
│     │  ├─ /signup (public, SignupPage)
│     │  │  ├─ Form
│     │  │  │  ├─ Name input
│     │  │  │  ├─ Email input
│     │  │  │  ├─ Password input
│     │  │  │  │  └─ Strength indicator
│     │  │  │  ├─ Confirm password
│     │  │  │  └─ Submit button
│     │  │  └─ Link to /login
│     │  │
│     │  ├─ /events (protected)
│     │  │  └─ uses session.user.id
│     │  │
│     │  ├─ /event/[id] (protected)
│     │  │  └─ uses session.user.id
│     │  │
│     │  └─ /my-tickets (protected)
│     │     └─ uses session.user.id
│     │
│     └─ API routes
│        ├─ /api/auth/[...nextauth] ✅
│        └─ /api/auth/signup ✅
│
└─ middleware.ts (route protection)
   └─ Redirects /protected → /login if not authenticated
```

## 🔐 Password Hashing Visualization

```
User enters password:
"MyPassword123"
    │
    ▼
bcryptjs.hash(password, saltRounds=10)
    │
    ├─► Generate random salt
    │   Salt: $2a$10$abcdefghijklmnopqrst
    │
    ├─► Run hash function 10 times (2^10 = 1024 iterations)
    │
    ├─► Each iteration:
    │   hash = bcrypt(password + salt)
    │
    └─► Result:
        $2a$10$abcdefghijklmnopqrstuvwxyz...
        (60 character string)
        
Stored in MongoDB:
password: "$2a$10$abcdefghijklmnopqrstuvwxyz..."

During login:
User enters: "MyPassword123"
    │
    ▼
bcryptjs.compare(input, hash)
    │
    ├─► Extract salt from stored hash
    │   $2a$10$abcdefghijklmnopqrst
    │
    ├─► Hash user input with same salt
    │   inputHash = bcrypt(input + salt)
    │
    ├─► Constant-time comparison
    │   Compare: inputHash == storedHash
    │
    └─► Result: true/false
        ✅ Passwords match
        ❌ Passwords don't match
```

## 📱 Session Cookie Structure

```
HTTP Response Header:
Set-Cookie: next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; 
    Path=/; 
    Domain=localhost; 
    Max-Age=2592000; 
    HttpOnly; 
    Secure; 
    SameSite=Lax

Cookie Payload (JWT):
{
  "sub": "507f1f77bcf86cd799439011",
  "email": "user@test.com",
  "name": "Test User",
  "iat": 1700476800,
  "exp": 1703068800,
  "jti": "abcdef123456"
}

Security Attributes:
├─ HttpOnly: ✅ JavaScript cannot access (prevents XSS)
├─ Secure: ✅ Only HTTPS (production)
├─ SameSite=Lax: ✅ Prevents CSRF
├─ Path=/: ✅ Available to all routes
└─ Max-Age: ✅ Expires after 30 days

Browser automatically sends cookie with each request:
GET /api/tickets
Cookie: next-auth.session-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 State Management Flow

```
Redux-like state in NextAuth:

1. Initial State: unauthenticated
   session = null
   status = 'loading'

2. Check Session: getToken()
   ├─ Valid token found
   │  └─ Decode JWT
   │     Parse user data
   │     status = 'authenticated'
   │     session = { user: {...} }
   │
   └─ No token found
      └─ status = 'unauthenticated'
         session = null

3. During API Call: signIn()
   ├─ Submit credentials
   ├─ Backend validates
   ├─ Create JWT
   ├─ Set cookie
   └─ Update context
      status = 'authenticated'
      session = { user: {...} }

4. During Logout: signOut()
   ├─ Clear cookie
   ├─ Invalidate JWT
   └─ Update context
      status = 'unauthenticated'
      session = null
```

---

This visual guide should help understand the complete authentication flow! 🎉
