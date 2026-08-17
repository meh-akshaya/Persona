# Persona — Backend Setup Guide

## What's built right now
- ✅ Project structure
- ✅ Prisma schema (User, Community, Post, Comment, Reaction)
- ✅ POST /api/auth/register — creates user + generates unique persona
- ✅ POST /api/auth/login — returns JWT
- ✅ GET /api/auth/me — returns persona (protected route)
- ✅ JWT auth middleware
- ✅ Persona generator (SilentFox, CalmEagle etc. — unique, DB-checked)
- ✅ Privacy leak detector (email, phone, instagram, personal links)

---

## Step 1 — Install dependencies
```bash
cd server
npm install
```

## Step 2 — Set up your database
You have two options:

**Option A: Neon (recommended — free PostgreSQL in cloud)**
1. Go to neon.tech → create account → create project called "persona"
2. Copy the connection string
3. Paste it in your .env as DATABASE_URL

**Option B: Local PostgreSQL**
```bash
# Mac
brew install postgresql
createdb persona_db

# Ubuntu/WSL
sudo apt install postgresql
sudo -u postgres createdb persona_db
```

## Step 3 — Set up .env
```bash
cp .env.example .env
# Now edit .env with your actual values
# For JWT_SECRET run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4 — Run Prisma migrations
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Step 5 — Start the server
```bash
npm run dev
```

You should see: `Server running on http://localhost:5000`

---

## Test your APIs in Postman

### Register
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Expected response:
{
  "token": "eyJ...",
  "persona": {
    "name": "SilentFox",
    "emoji": "🦊",
    "color": "#E07A5F",
    "trustScore": 0
  }
}
```

### Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Get My Persona (protected)
```
GET http://localhost:5000/api/auth/me
Headers:
  Authorization: Bearer <your_token_here>
```

---

## File structure explained
```
server/
├── index.js                  ← Entry point, express setup
├── routes/
│   └── auth.js               ← Route definitions
├── controllers/
│   └── authController.js     ← Business logic (register, login, me)
├── middleware/
│   └── auth.js               ← JWT verification
├── utils/
│   ├── personaGenerator.js   ← Unique name generation
│   └── privacyDetector.js    ← Leak detection (used when building posts)
└── prisma/
    └── schema.prisma         ← Database schema
```

---

## What to build next (after auth works)
1. Communities routes — GET /api/communities (seed 5 default ones)
2. Posts routes — POST /api/posts (this is where privacyDetector gets used)
3. Comments routes
4. Reactions routes + trust score update logic
```
