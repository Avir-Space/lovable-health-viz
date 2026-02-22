

## Add Email + Password Sign-In to Login Page

### What changes

The login page currently only supports magic link (OTP) sign-in. We'll add email + password authentication alongside it, and pre-fill a demo account for easy access.

### Demo credentials

- **Email:** `demo@avir.space`
- **Password:** `avir-demo-2025`

A demo user will be created in Supabase Auth with these credentials. The login page will display these credentials in a hint box so anyone demoing the app can sign in instantly.

### Implementation details

**1. Create demo user in Supabase**
- Run a Supabase Admin API call (via edge function or SQL) to create a user with email `demo@avir.space` and password `avir-demo-2025`.

**2. Update Login page (`src/pages/Login.tsx`)**
- Add a password field below the email field.
- Add a "Sign In" button that calls `supabase.auth.signInWithPassword({ email, password })`.
- Keep the existing magic link option as a secondary method (e.g., a "Sign in with magic link instead" toggle or link).
- Add a visible demo credentials box at the bottom:
  - "Demo account: demo@avir.space / avir-demo-2025"
  - A "Use demo account" button that auto-fills the email and password fields.

**3. Auth flow on success**
- On successful password sign-in, redirect to the stored `auth_redirect` path or default to `/`.
- No changes needed to `AuthContext` or `ProtectedRoute` -- they already handle session state.

**4. No other pages affected**
- Settings, Admin, AuthCallback remain unchanged.

### Technical notes

- The demo user is created via a migration that calls `auth.users` insert -- but since we cannot modify the `auth` schema directly, we'll use the Supabase Management API or ask the user to create the account manually via the Supabase dashboard. Alternatively, we can add a sign-up flow that auto-creates the account on first attempt.
- Simplest approach: add `signUp` as a fallback -- if `signInWithPassword` fails with "Invalid login credentials", we try `supabase.auth.signUp({ email, password })` once for the demo account, then sign in again. This way the demo user is auto-created on first use.

