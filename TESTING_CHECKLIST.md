# ✅ Authentication System - Complete Checklist

## Pre-Launch Checklist

### Configuration
- [ ] `.env.local` created in `apps/web/`
- [ ] `NEXTAUTH_URL` set to `http://localhost:3000`
- [ ] `NEXTAUTH_SECRET` set (can be any string for dev)
- [ ] `MONGODB_URI` configured (if using MongoDB)
- [ ] `MONGODB_DB` set (default: `ticketmanager`)

### Installation
- [ ] Dependencies installed: `npm install` in `apps/web/`
- [ ] No build errors in VS Code
- [ ] `.next` folder deleted if had issues
- [ ] Node modules updated

### Files Verification
- [ ] `src/lib/auth.ts` exists
- [ ] `src/lib/mongodb.ts` exists
- [ ] `src/lib/auth-utils.ts` exists
- [ ] `src/app/api/auth/[...nextauth]/route.ts` exists
- [ ] `src/app/api/auth/signup/route.ts` exists
- [ ] `src/app/login/page.tsx` exists
- [ ] `src/app/signup/page.tsx` exists
- [ ] `src/app/providers.tsx` exists
- [ ] `middleware.ts` exists in root
- [ ] `scripts/seed-users.ts` exists

## Startup Checklist

### Terminal 1: Backend
```bash
cd apps/backend
npx ts-node src/main.ts
```
- [ ] Server starts without errors
- [ ] Listening on port 3000 (or your configured port)
- [ ] MongoDB connected (or fallback mode)
- [ ] Redis optional (uses fallback if unavailable)

### Terminal 2: Frontend
```bash
cd apps/web
npm run dev
```
- [ ] Next.js dev server starts
- [ ] No TypeScript errors
- [ ] Compiled successfully
- [ ] Running on http://localhost:3000

## Manual Testing Checklist

### Landing Page
- [ ] http://localhost:3000 loads
- [ ] Navbar visible at top
- [ ] Navbar shows "Sign In" button (not logged in)
- [ ] Page displays hero section

### Sign Up Flow
- [ ] Click navbar "Sign In" → redirects to /login
- [ ] Click "Sign up here" → redirects to /signup
- [ ] Form displays:
  - [ ] Name input field
  - [ ] Email input field
  - [ ] Password input field with toggle
  - [ ] Confirm password field
  - [ ] Submit button
  - [ ] Link back to login

### Sign Up Validation
- [ ] Leave name empty → error shows
- [ ] Enter short name → error shows
- [ ] Enter invalid email → error shows
- [ ] Enter short password → error shows
- [ ] Password strength indicator shows as you type
  - [ ] Gray bars for unmet requirements
  - [ ] Green bars for met requirements
- [ ] Passwords don't match → error shows
- [ ] All errors clear as you type

### Sign Up Submission
- [ ] Enter valid data:
  - Name: John Doe
  - Email: john123@test.com
  - Password: MyPassword123 (or with special char)
- [ ] Submit form
- [ ] Loading state shows ("Creating Account...")
- [ ] Form disables during submission
- [ ] User created in MongoDB
- [ ] Auto-signin happens
- [ ] Redirects to /events
- [ ] Navbar shows "Welcome, john123@test.com"
- [ ] Navbar shows "Sign Out" button

### Sign In Flow
- [ ] Logout: Click navbar "Sign Out"
- [ ] Redirects to /login
- [ ] Navigate to /login
- [ ] Form displays:
  - [ ] Email input
  - [ ] Password input
  - [ ] Submit button
  - [ ] Link to signup
  - [ ] Demo credentials badge

### Sign In with Demo Account
- [ ] Enter: user@test.com
- [ ] Enter: password123
- [ ] Click "Sign In"
- [ ] Loading state shows
- [ ] Redirects to /events
- [ ] Navbar shows session user

### Sign In Error Handling
- [ ] Try wrong email → error message
- [ ] Try wrong password → error message
- [ ] Try non-existent email → error message
- [ ] Errors don't leak information

### Route Protection
- [ ] Logout (if logged in)
- [ ] Try to access /events → redirects to /login
- [ ] Try to access /my-tickets → redirects to /login
- [ ] Try to access /event/1 → redirects to /login
- [ ] /login still accessible → no redirect
- [ ] /signup still accessible → no redirect
- [ ] / (home) accessible → no redirect

### Protected Page Functionality
- [ ] Login again
- [ ] Navigate to /events
- [ ] Page loads successfully
- [ ] useSession() works (can see user)
- [ ] Event list displays
- [ ] Can click event to view details

### Session Persistence
- [ ] Login with demo account
- [ ] Hard refresh browser (Ctrl+R / Cmd+R)
- [ ] Session persists (still logged in)
- [ ] Navbar still shows username
- [ ] Logout still works

### Navbar States
- [ ] When logged out:
  - [ ] Shows "Sign In" button
  - [ ] Clicking navigates to /login
  - [ ] Links to /events hidden
  - [ ] Links to /my-tickets hidden

- [ ] When logged in:
  - [ ] Shows "Welcome, email@domain.com"
  - [ ] Shows "Sign Out" button
  - [ ] Links to /events visible
  - [ ] Links to /my-tickets visible
  - [ ] Links are clickable

### User ID in API Calls
- [ ] Login
- [ ] Navigate to /events
- [ ] Open browser DevTools (F12)
- [ ] Network tab
- [ ] Look for API calls
- [ ] Check that userId is correct in requests
- [ ] (Not hardcoded "user-placeholder")

### Duplicate Email Prevention
- [ ] Try to signup with existing email
- [ ] Error message displays
- [ ] Redirects to login (optionally)
- [ ] Can login with that account instead

## Integration Testing

### Tickets Workflow
- [ ] Login
- [ ] Browse events (/events)
- [ ] Select event
- [ ] Choose seats
- [ ] Submit reservation
- [ ] Check /my-tickets
- [ ] See reserved tickets with your user ID

### Session Across Pages
- [ ] Login
- [ ] Navigate /events → /event/[id] → /my-tickets
- [ ] Session persists (no logout/re-auth)
- [ ] User ID same throughout

## Error Handling Testing

### Input Errors
- [ ] Empty submission attempts show errors
- [ ] Invalid email format shows error
- [ ] Weak password shows error
- [ ] Mismatched passwords show error

### Server Errors
- [ ] Network error handling (show message)
- [ ] Duplicate email handling (409 error)
- [ ] Invalid credentials (generic message)
- [ ] Server down gracefully fails

### Edge Cases
- [ ] Extra spaces in input (trimmed)
- [ ] Uppercase email (converted to lowercase)
- [ ] Copy/paste password (works)
- [ ] Special characters in name (accepted)

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Test scenarios:
- [ ] Form inputs accessible
- [ ] Validation messages visible
- [ ] Colors/UI displays correctly
- [ ] Buttons are clickable
- [ ] Navigation works

## Security Testing

### Session Security
- [ ] Cookies are HTTP-only (check DevTools)
- [ ] Cookie has Secure flag (in HTTPS)
- [ ] Cookie has SameSite flag
- [ ] Cookie path is /
- [ ] Token expires (check exp claim in JWT)

### Password Security
- [ ] Password never logged in console
- [ ] Password not sent in URLs
- [ ] Password hashed in database (check MongoDB)
- [ ] Not same hash twice (bcrypt has salt)

### CSRF Protection
- [ ] External site can't submit forms
- [ ] Cookie not accessible from external JS

## Performance Testing

### Load Times
- [ ] Signup page loads < 2 seconds
- [ ] Login page loads < 2 seconds
- [ ] Session restored < 1 second
- [ ] No console errors

### Database Performance
- [ ] User lookup is fast (indexed email)
- [ ] Signup completes in < 3 seconds
- [ ] Login completes in < 2 seconds

## Documentation Review

- [ ] QUICKSTART.md exists and is clear
- [ ] AUTHENTICATION.md covers all details
- [ ] IMPLEMENTATION.md explains architecture
- [ ] CODE_WALKTHROUGH.md has examples
- [ ] VISUAL_GUIDE.md shows diagrams
- [ ] This checklist is complete

## Sign Off

### Development Team
- [ ] Reviewed code for quality
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Tested locally

### Security Review
- [ ] Passwords properly hashed (bcryptjs 10 rounds)
- [ ] No credentials in code
- [ ] Validation on client and server
- [ ] CSRF protection enabled
- [ ] Session tokens secure

### Product Review
- [ ] UX is intuitive
- [ ] Error messages helpful
- [ ] Loading states visible
- [ ] Responsive design works
- [ ] Accessibility acceptable

### Documentation Review
- [ ] Setup instructions clear
- [ ] Code is documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide complete
- [ ] Examples provided

## Pre-Production Checklist

### Environment Setup
- [ ] Production NEXTAUTH_SECRET generated (32+ chars)
  ```bash
  openssl rand -base64 32
  ```
- [ ] Production MongoDB URI configured
- [ ] NEXTAUTH_URL set to production domain
- [ ] Email verification implemented (optional)
- [ ] Rate limiting implemented (optional)

### Monitoring
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Logging configured
- [ ] Performance monitoring setup
- [ ] Database backups configured

### Security Hardening
- [ ] HTTPS enforced (Secure flag on cookies)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Email verification required
- [ ] Password reset implemented
- [ ] Suspicious activity logging

### Deployment
- [ ] Build succeeds: `npm run build`
- [ ] No production warnings
- [ ] Environment variables verified
- [ ] Database migrations run
- [ ] Seed data loaded (optional)
- [ ] Health checks working

## Testing Commands Reference

```bash
# Clear cache if issues
rm -rf .next
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed demo users
npx ts-node scripts/seed-users.ts

# Check types
npx tsc --noEmit
```

## Quick Links

- Landing: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Events: http://localhost:3000/events (requires auth)
- My Tickets: http://localhost:3000/my-tickets (requires auth)

## Status Legend

✅ = Complete & tested
🟡 = In progress
⏳ = Pending
❌ = Issue

## Final Sign-Off

**System Status**: Ready for testing

**Tested by**: [Your name]

**Date**: [Date tested]

**Sign-off**: ✅ All tests passed, ready for user testing

---

## Next Steps After Sign-Off

1. **User Testing**
   - [ ] Real users test signup flow
   - [ ] Feedback collected
   - [ ] Issues documented

2. **Bug Fixes**
   - [ ] Critical issues fixed immediately
   - [ ] Minor issues added to backlog

3. **Performance Optimization**
   - [ ] Profile slow endpoints
   - [ ] Optimize database queries
   - [ ] Cache frequently accessed data

4. **Feature Additions**
   - [ ] Email verification
   - [ ] Password reset
   - [ ] OAuth providers
   - [ ] 2FA setup

5. **Deployment**
   - [ ] Merge to main branch
   - [ ] Deploy to staging
   - [ ] Final testing in staging
   - [ ] Deploy to production

---

**Congratulations!** Your authentication system is ready! 🎉
