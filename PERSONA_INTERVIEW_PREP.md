# PERSONA — TECHNICAL INTERVIEW PREPARATION HANDBOOK
> **Reverse-Engineered directly from the codebase at `/Users/akshayaverma/Downloads/persona`**  
> *Targeted for Technical Interview Preparation (TCS Digital / Full-Stack Software Engineer)*

---

# 🔥 STUDY PRIORITY MATRIX

| Priority Level | Topics to Master | Est. Time Required |
| :--- | :--- | :--- |
| **🔥 MUST KNOW BEFORE INTERVIEW** | 1. 60s/30s/90s Project Pitch<br>2. Self-Referencing Comments (Prisma 4-level fetch)<br>3. Reactions & `$transaction` Trust Score<br>4. JWT Auth & Anonymity Enforcement<br>5. Database Schema & Prisma ORM | **2.5 Hours** |
| **🟡 SHOULD KNOW** | 1. Privacy Leak Detector (Regex implementation vs UI policy)<br>2. Express Middleware & Rate Limiting / Helmet<br>3. React State & AuthContext Interceptors<br>4. REST API Endpoint Design & Status Codes<br>5. System Architecture & Request Lifecycles | **1.5 Hours** |
| **🟢 IF TIME REMAINS** | 1. 1M Users Scalability Strategy (Redis, Connection Pooling)<br>2. Failure Scenarios & Edge Cases<br>3. AI-Assisted Development Defense<br>4. Technology Tradeoffs & Decision Matrix | **1 Hour** |

---

# 1. Project Overview

### 1. What is Persona?
**Persona** is an anonymous full-stack community discussion platform inspired by Reddit and Blind. It enables users to discuss sensitive workplace topics (salaries, interview rejections, startup burnouts, imposter syndrome) without exposing their real name or email address.

### 2. What problem does it solve?
In conventional social networks, user identities are attached to every post and comment. This creates fear of career repercussions, social judgment, or personal privacy leaks. Persona solves this by decoupling a user's real credential (email) from their public participation using procedurally generated, unique pseudonymous identities (e.g., `SilentFox 🦊`, `BoldEagle 🦅`).

### 3. Who is the intended user?
Students, software engineers, tech professionals, and startup founders seeking a safe, anonymous space for candid discussions.

### 4. Major Features & Implementation Status
* ✅ **Anonymous Identity Generation**: Automatically assigns a unique adjective+noun persona name, emoji, and color palette upon registration ([`personaGenerator.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/personaGenerator.js)).
* ✅ **JWT-Based Authentication**: Secure authentication via bcrypt password hashing (cost factor 12) and JWT tokens ([`authController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/authController.js)).
* ✅ **Community Discussions**: Categorized communities (`Career & Placements`, `Coding & Tech`, `Startups`, `Finance`, etc.) ([`communityController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/communityController.js)).
* ✅ **Pre-Save Privacy Leak Detector**: Regex scanner inspecting posts for emails, phone numbers, Instagram handles, and social links ([`privacyDetector.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/privacyDetector.js)).
* ✅ **Self-Referencing Comment Threads**: Nested discussion threads allowing top-level comments and multi-level replies ([`commentController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/commentController.js)).
* ✅ **Reactions & Trust Score System**: Custom reactions (`HELPFUL`, `INSIGHTFUL`, `SUPPORTIVE`) that atomically increment/decrement the post author's `trustScore` via Prisma `$transaction` ([`reactionController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/reactionController.js)).
* ⚠️ **Role-Based Access Control**: ❌ NOT IMPLEMENTED. Only single-tier authenticated user permissions exist.
* ⚠️ **Privacy Leak Post Blocking**: ⚠️ PARTIALLY IMPLEMENTED. The detector flags `hasPrivacyLeak: true` and saves `privacyLeaks: ["email"]`, but the backend intentionally permits creation to allow frontend banner warnings.

### 5. Technologies Used
* **Frontend**: React 18, Vite, React Router DOM v6, Axios, TailwindCSS, Lucide React icons.
* **Backend**: Node.js, Express.js, Prisma ORM v5, JSONWebToken (JWT), BcryptJS, Express-Rate-Limit, Helmet.
* **Database**: PostgreSQL (Hosted on Neon Cloud Serverless PostgreSQL).
* **Deployment**: Vercel Serverless Functions (`@vercel/node`).

### 6. High-Level Architecture Diagram

```
[ Client: React 18 SPA (Vite) ]
              │  HTTP / REST (JSON) + JWT Authorization Header
              ▼
[ Serverless API Gateway / CORS / Helmet / Rate Limiter (Express.js) ]
              │
              ▼
[ Auth Middleware (`authMiddleware`) ] ── (Verifies JWT & attaches req.userId)
              │
              ▼
[ Controllers Layer ]
 ├── `authController.js`      ── Generates unique personas & signs JWTs
 ├── `postController.js`      ── Runs `privacyDetector.js` before DB write
 ├── `commentController.js`   ── Queries 4-level nested comment trees
 └── `reactionController.js`  ── Executes `$transaction` (Reaction + TrustScore)
              │
              ▼
[ Data Access Layer: Prisma ORM v5 Client ]
              │  SQL (PostgreSQL Wire Protocol via SSL)
              ▼
[ Database: Neon Cloud Serverless PostgreSQL ]
 ├── `User` (email, password, personaName, trustScore)
 ├── `Community` (slug, name, icon)
 ├── `Post` (content, hasPrivacyLeak, privacyLeaks)
 ├── `Comment` (parentId self-referencing relationship)
 └── `Reaction` (@@unique([userId, postId]) constraint)
```

---

# 2. 60-Second Project Explanation

### 60-Second Pitch (Natural Student Level)
> "Persona is an anonymous community platform I built for students and professionals to discuss workplace challenges, salary figures, and career struggles without fear of exposure. The core challenge was protecting user privacy while maintaining data integrity. On the backend, I used Node.js, Express, and Prisma ORM connected to a Neon PostgreSQL database. Whenever a user registers, the system procedurally generates a unique pseudonymous identity—like *SilentFox* or *CalmEagle*—and completely decouples their email from all public posts and comments at the database query level. I also implemented a pre-save privacy leak detector using regex to flag accidental phone or email shares, and an atomic reaction system using Prisma transactions that updates user trust scores concurrently."

### 30-Second Version (Quick Punchy Summary)
> "Persona is a full-stack anonymous forum built with React, Node.js, Express, and PostgreSQL. It allows users to post and comment under auto-generated pseudonymous identities like *SilentFox*. It features multi-level nested comment threads, a regex-based privacy leak detector that scans posts before saving, and atomic database transactions that compute user trust scores when peers react to their contributions."

### 90-Second Version (Deep Technical Pitch for Senior Interviewers)
> "Persona is an anonymous community platform built with React, Express, Prisma, and PostgreSQL. The goal was to build a space for candid discussion while enforcing zero identity leakage.
>
> Architecturally, privacy enforcement happens at the query level: our Prisma queries explicitly select ONLY persona fields (`personaName`, `personaEmoji`, `personaColor`, `trustScore`) and never join or return user email or password hashes to the client.
>
> Two key technical highlights I worked on:
> First, self-referencing nested comments. Using Prisma's relation capabilities on a nullable `parentId` foreign key, I structured 4-level recursive queries to fetch nested discussion trees efficiently in a single query.
>
> Second, atomic state consistency. When a user reacts to a post with 'HELPFUL' or 'INSIGHTFUL', we must prevent duplicate votes while updating the author's aggregate trust score. I used Prisma's `$transaction` API alongside composite unique constraints (`userId_postId`) to guarantee that reaction insertion and score incrementation succeed or fail together atomically, preventing race conditions or orphan score increments."

---

# 3. Request Lifecycle (Step-by-Step Code Trace)

### Flow 1: Registering a New User
1. **Frontend**: [`Register.jsx`](file:///Users/akshayaverma/Downloads/persona/client/src/pages/Register.jsx) captures `email` and `password`. Sends `POST /api/auth/register`.
2. **Route**: [`routes/auth.js`](file:///Users/akshayaverma/Downloads/persona/server/routes/auth.js) matches `POST /register` → invokes `register` in [`authController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/authController.js).
3. **Controller Validation**: Checks if `email` or `password` is missing, or if `password.length < 8`.
4. **Existing Check**: `prisma.user.findUnique({ where: { email } })`. If exists, returns `409 Email already registered`.
5. **Persona Generation**: Calls `generateUniquePersona(prisma)` in [`personaGenerator.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/personaGenerator.js). Randomly picks an adjective + noun combination, queries DB in a `while(true)` loop until an unassigned name is found.
6. **Password Hashing**: `await bcrypt.hash(password, 12)`.
7. **Database Write**: `prisma.user.create(...)` stores hashed password and generated persona attributes.
8. **JWT Signing**: `jwt.sign({ userId: user.id, personaName: user.personaName }, process.env.JWT_SECRET, { expiresIn: '7d' })`.
9. **Response**: Returns HTTP 201 with JWT token and persona object (`name`, `emoji`, `color`, `trustScore`). **Email and password are omitted**.

### Flow 2: Creating a Post with Privacy Detection
1. **Frontend**: [`CreatePostModal.jsx`](file:///Users/akshayaverma/Downloads/persona/client/src/components/posts/CreatePostModal.jsx) submits `{ content, communityId }` to `POST /api/posts`.
2. **Middleware**: [`middleware/auth.js`](file:///Users/akshayaverma/Downloads/persona/server/middleware/auth.js) extracts `Authorization: Bearer <token>`, verifies JWT secret, attaches `req.userId` and calls `next()`.
3. **Route**: [`routes/post.js`](file:///Users/akshayaverma/Downloads/persona/server/routes/post.js) passes to `createPost` in [`postController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/postController.js).
4. **Validation**: Checks `content` non-empty and verifies community existence via `prisma.community.findUnique`.
5. **Privacy Scan**: Calls `detectPrivacyLeaks(content)` in [`privacyDetector.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/privacyDetector.js). Runs regex tests for email (`/@/`), phone (`/+91/`, `/\d{10}/`), instagram (`/@user/`), and links.
6. **Prisma Write**: `prisma.post.create` writes `content`, `authorId`, `communityId`, `hasPrivacyLeak: boolean`, and `privacyLeaks: string[]`. Uses explicit `postSelect` object.
7. **Response**: Returns HTTP 201 with newly created post object.

### Flow 3: Adding a Reaction & Updating Trust Score
1. **Frontend**: [`PostCard.jsx`](file:///Users/akshayaverma/Downloads/persona/client/src/components/posts/PostCard.jsx) sends `POST /api/reactions` with `{ postId, type: 'HELPFUL' }`.
2. **Middleware**: `authMiddleware` validates JWT token.
3. **Controller**: [`reactionController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/reactionController.js) checks valid enum types (`['HELPFUL', 'INSIGHTFUL', 'SUPPORTIVE']`).
4. **Self-React Check**: Fetches post `authorId`. If `post.authorId === userId`, returns `400 You cannot react to your own post`.
5. **Duplicate Check**: Queries `prisma.reaction.findUnique({ where: { userId_postId: { userId, postId } } })`.
   - *If reaction exists*: Updates type via `prisma.reaction.update` (no trust score change).
   - *If new reaction*: Executes **`prisma.$transaction([...])`**:
     - Operation 1: `prisma.reaction.create(...)`
     - Operation 2: `prisma.user.update({ where: { id: post.authorId }, data: { trustScore: { increment: 1 } } })`
6. **Response**: Returns HTTP 201 `{ reaction, message: 'Reaction added' }`.

---

# 4. Technology-by-Technology Interview Preparation

## Technology: PostgreSQL & Neon Cloud
* **A. What is it?**: An enterprise-grade, open-source object-relational database management system (ORDBMS) emphasizing SQL compliance and ACID transactional integrity.
* **B. Why in Persona?**: Persona requires strict relational structure between Users, Communities, Posts, Comments, and Reactions, enforcing hard constraints like composite unique keys (`userId` + `postId`).
* **C. What exactly are WE using it for?**: Storing relational entities, enforcing foreign key integrity, cascade constraints, and guaranteeing atomic transactions for trust scores. Hosted on **Neon Cloud** (serverless Postgres with SSL required).
* **D. Code Reference**: Configured via `DATABASE_URL` in [`prisma/schema.prisma`](file:///Users/akshayaverma/Downloads/persona/server/prisma/schema.prisma).
* **E. Alternatives**:
  * *vs MongoDB*: MongoDB is document-based. Disadvantage: Lacks native relational integrity and join efficiency for complex relational data like self-referencing comment trees and foreign key cascading. PostgreSQL provides rigid schemas and atomic multi-document transactions.
  * *vs SQLite*: SQLite is file-based. Disadvantage: Cannot handle concurrent writes from serverless cloud deployments like Vercel.

## Technology: Prisma ORM v5
* **A. What is it?**: A modern type-safe Object-Relational Mapper (ORM) for Node.js that abstracts raw SQL queries into clean JavaScript method calls.
* **B. Why in Persona?**: Eliminates SQL injection vulnerabilities, provides auto-generated query builders, handles migrations, and simplifies nested relational selects.
* **C. What WE use it for**: Querying DB models, nesting 4-level deep self-referencing comment replies, running atomic `$transaction` queries, and applying `select` field exclusions.
* **D. Code Reference**: `const prisma = new PrismaClient()` in [`authController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/authController.js).
* **E. Alternatives**:
  * *vs Raw SQL*: Raw SQL offers maximum query optimization control but is error-prone, vulnerable to SQL injection if un-parameterized, and requires manual parsing of nested joins. Prisma gives type safety and clean syntax.

## Technology: Express.js & Node.js
* **A. What is it?**: Node.js is an asynchronous event-driven JavaScript runtime; Express.js is a minimalist web framework for building REST APIs.
* **B. Why in Persona?**: High non-blocking I/O performance for concurrent API requests, unified JavaScript stack between frontend and backend.
* **C. What WE use it for**: Route handling, middleware execution (auth, rate limiting, helmet), REST endpoints, and Vercel serverless function exporting (`module.exports = app`).
* **D. Code Reference**: [`index.js`](file:///Users/akshayaverma/Downloads/persona/index.js).

## Technology: JSON Web Tokens (JWT) & BcryptJS
* **A. What is it?**: JWT is a compact, URL-safe standard (RFC 7519) for digitally signed claims. BcryptJS is an adaptive password hashing algorithm based on the Blowfish cipher.
* **B. Why in Persona?**: Stateless authentication suitable for serverless deployments; bcrypt securely hashes passwords with salt cost factor 12 before persistence.
* **C. What WE use it for**: `jwt.sign` with `{ userId, personaName }` on login/register ([`authController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/authController.js)); `jwt.verify` in [`authMiddleware`](file:///Users/akshayaverma/Downloads/persona/server/middleware/auth.js).
* **D. Alternatives**:
  * *vs Server Sessions*: Stateful sessions require Redis or central DB lookup on every request. JWTs are statelessly verified using `process.env.JWT_SECRET`.

## Technology: Express-Rate-Limit & Helmet
* **A. What is it?**: `express-rate-limit` limits repeated requests to public APIs. `helmet` sets security-minded HTTP headers.
* **B. Why in Persona?**: Protects against brute-force login attempts, DOS spam, and common web security vectors (XSS, clickjacking).
* **C. What WE use it for**: Configured in [`index.js`](file:///Users/akshayaverma/Downloads/persona/index.js) (Window: 15 mins, Max: 100 requests per IP).

---

# 5. Database Deep Dive & Prisma Schema Analysis

### Schema Structure ([`prisma/schema.prisma`](file:///Users/akshayaverma/Downloads/persona/server/prisma/schema.prisma))

```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  password     String
  personaName  String    @unique
  personaEmoji String
  personaColor String
  trustScore   Int       @default(0)
  createdAt    DateTime  @default(now())

  posts        Post[]
  comments     Comment[]
  reactions    Reaction[]
}

model Community {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String
  icon        String
  createdAt   DateTime @default(now())

  posts       Post[]
}

model Post {
  id              String    @id @default(uuid())
  content         String
  hasPrivacyLeak  Boolean   @default(false)
  privacyLeaks    String[]  // e.g. ["email", "phone"]
  createdAt       DateTime  @default(now())

  author          User      @relation(fields: [authorId], references: [id])
  authorId        String

  community       Community @relation(fields: [communityId], references: [id])
  communityId     String

  comments        Comment[]
  reactions       Reaction[]
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())

  author    User     @relation(fields: [authorId], references: [id])
  authorId  String

  post      Post     @relation(fields: [postId], references: [id])
  postId    String

  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  parentId  String?

  replies   Comment[] @relation("CommentReplies")
}

model Reaction {
  id        String       @id @default(uuid())
  type      ReactionType
  createdAt DateTime     @default(now())

  user      User         @relation(fields: [userId], references: [id])
  userId    String

  post      Post         @relation(fields: [postId], references: [id])
  postId    String

  @@unique([userId, postId]) // Composite unique index: One reaction per user per post
}

enum ReactionType {
  HELPFUL
  INSIGHTFUL
  SUPPORTIVE
}
```

### Complete Relationship Graph:
* **User → Post** (1-to-Many): One user can create multiple posts (`authorId`).
* **User → Comment** (1-to-Many): One user can write multiple comments (`authorId`).
* **User → Reaction** (1-to-Many): One user can give multiple reactions (`userId`).
* **Community → Post** (1-to-Many): One community contains multiple posts (`communityId`).
* **Post → Comment** (1-to-Many): One post has multiple comments (`postId`).
* **Post → Reaction** (1-to-Many): One post has multiple reactions (`postId`).
* **Comment → Comment** (Self-Referencing 1-to-Many): A comment optionally belongs to a `parent` comment via nullable `parentId`, and has many `replies`.

---

# 6. Self-Referencing Comments Deep Dive

### 1. What is a Self-Referencing Relationship?
A self-referencing (or adjacency list) relationship occurs when a table contains a foreign key that references its own primary key. In Persona, `Comment.parentId` references `Comment.id`.

### 2. How Our Code Implements It ([`commentController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/commentController.js))
* **Top-Level Comments**: Created with `parentId: null`.
* **Replies**: Created with `parentId: "<parent-comment-uuid>"`.
* **Fetching Logic**: `getPostComments` queries comments where `postId = id` AND `parentId = null`. It then uses Prisma's nested `select` to eagerly load `replies` up to **4 levels deep**:

```javascript
// Excerpt from commentController.js (lines 78-118)
const comments = await prisma.comment.findMany({
  where: { postId, parentId: null }, // Top-level comments only
  orderBy: { createdAt: 'asc' },
  select: {
    id: true, content: true, createdAt: true, parentId: true, author: authorSelect,
    replies: {
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, content: true, createdAt: true, parentId: true, author: authorSelect,
        replies: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true, content: true, createdAt: true, parentId: true, author: authorSelect,
            replies: {
              select: { id: true, content: true, createdAt: true, parentId: true, author: authorSelect }
            }
          }
        }
      }
    }
  }
})
```

### 3. Interview Q&A on Self-Referencing Comments

#### Q: How do you prevent infinite recursion or performance degradation with nested comments?
* **Short Answer**: We query top-level comments (`parentId: null`) and limit nested relation fetching to 4 fixed levels in Prisma.
* **Interview Answer**: "In Persona, we use an Adjacency List pattern where each comment holds an optional `parentId`. To avoid unbounded DB recursion, our Prisma query fetches top-level comments and explicitly nests child `replies` to a depth of 4 levels. For production scaling beyond 4 levels, we would switch to Materialized Paths or Closure Tables."
* **Deep Follow-up**: "What if a parent comment is deleted?" → Currently, if a parent comment is deleted without cascading, child comments reference an un-queryable parent. In production, we would soft-delete parent comments (setting `content = "[Comment deleted]"`).

---

# 7. Prisma Deep Dive & Transaction Handling

### Prisma `$transaction` Implementation ([`reactionController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/reactionController.js))

When adding a new reaction, two database operations must succeed atomically:
1. Inserting the `Reaction` record.
2. Incrementing the author's `trustScore` by 1.

```javascript
// Excerpt from reactionController.js (lines 47-56)
const [reaction] = await prisma.$transaction([
  prisma.reaction.create({
    data: { userId, postId, type },
    select: { id: true, type: true, postId: true }
  }),
  prisma.user.update({
    where: { id: post.authorId },
    data: { trustScore: { increment: 1 } }
  })
])
```

### ACID Compliance Breakdown:
* **Atomicity**: Either both the reaction creation and trust score increment complete, or neither completes (rolled back on error).
* **Consistency**: DB constraints (e.g., valid `postId`, valid `userId`, `@@unique([userId, postId])`) are strictly enforced.
* **Isolation**: Concurrent reactions to the same author execute isolated transactions, preventing lost updates on `trustScore`.
* **Durability**: Committed transactions are permanently written to PostgreSQL storage.

---

# 8. Authentication & Privacy Guarantees

### Code Implementation vs Production Standard

| Security Aspect | What Persona Code Actually Does | Production-Grade Standard |
| :--- | :--- | :--- |
| **Identity Protection** | ✅ Queries explicitly exclude `email` & `password` via Prisma `select` shapes (`authorSelect`). | ✅ Same + Database view-level column exclusion. |
| **Password Storage** | ✅ Bcrypt hashing with cost factor 12 (`bcrypt.hash(password, 12)`). | ✅ Bcrypt/Argon2id + Pepper stored in Key Management System (KMS). |
| **Token Handling** | ✅ JWT signed with `process.env.JWT_SECRET`, 7-day expiration. Sent in `Authorization: Bearer <token>`. | 💡 Short-lived JWT (15 mins) + HttpOnly Refresh Cookies with rotation. |
| **Persona Uniqueness** | ✅ `generateUniquePersona` checks DB in loop until unique adjective+noun is found (`@@unique` constraint). | ✅ Pre-seeded pool or collision-resistant hashing. |

---

# 9. Security Implementations

* **CORS (Cross-Origin Resource Sharing)**: Configured in [`index.js`](file:///Users/akshayaverma/Downloads/persona/index.js) with regex allowing `localhost` ports and `*.vercel.app` domains.
* **Helmet.js**: Sets security HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
* **Express-Rate-Limit**: Restricts requests to 100 per 15-minute window per IP to prevent automated brute-force attacks.
* **SQL Injection Prevention**: Abstracted through Prisma's parameterized queries.

---

# 10. Privacy Leak Detector Analysis ([`privacyDetector.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/privacyDetector.js))

### RegEx Inspection Breakdown:
```javascript
const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+91[\s-]?)?[6-9]\d{9}|(\+1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
  instagram: /@[a-zA-Z0-9._]{1,30}|\binstagram\.com\/[a-zA-Z0-9._]+/gi,
  personalLink: /\b(linkedin\.com|facebook\.com|twitter\.com|t\.me|wa\.me|snapchat\.com)\/[^\s]+/gi,
}
```

### Critical Architecture Note for Interviewers:
- **Where Detection Happens**: On server side inside `createPost` in [`postController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/postController.js) *before* saving to Prisma.
- **Backend Policy**: The backend flags `hasPrivacyLeak: true` and records leak types in `privacyLeaks: String[]`, but **does NOT reject the request**. It returns HTTP 201 so the UI can present warning banners.
- **Limitations**:
  - *False Positives*: E.g., mentioning `@component` or a public support email.
  - *False Negatives*: Obfuscated numbers like `"9 8 7 6 5 4 3 2 1 0"` or spelled-out emails (`"user at gmail dot com"`).

---

# 11. Reactions & Trust Score Logic

### Unique Constraint Guard:
In [`prisma/schema.prisma`](file:///Users/akshayaverma/Downloads/persona/server/prisma/schema.prisma):
`@@unique([userId, postId])`

### Execution Logic ([`reactionController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/reactionController.js)):
1. **Self-React Check**: `if (post.authorId === userId) return res.status(400)...` (Prevents artificial trust score boosting).
2. **Duplicate Reaction**: If a reaction exists for `(userId, postId)`:
   - Updates `type` via `prisma.reaction.update`.
   - **Does NOT increment `trustScore`** (prevents infinite score inflation).
3. **New Reaction**: Executes `$transaction` (creates `Reaction` + `trustScore: { increment: 1 }`).
4. **Reaction Removal**: Executes `$transaction` (deletes `Reaction` + `trustScore: { decrement: 1 }`).

---

# 12. API Endpoint Reference Table

| Method | Endpoint | Auth Required? | Purpose | HTTP Success | Expected Errors |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | No | Creates user, assigns persona, signs JWT | `201 Created` | `400` Validation, `409` Duplicate Email |
| **POST** | `/api/auth/login` | No | Verifies credentials, returns JWT | `200 OK` | `400` Missing inputs, `401` Invalid Creds |
| **GET** | `/api/auth/me` | **Yes** | Fetches current user persona & counts | `200 OK` | `401` Unauthorized |
| **GET** | `/api/communities` | No | Lists all communities sorted by name | `200 OK` | `500` Server Error |
| **GET** | `/api/communities/:slug` | No | Gets community details by slug | `200 OK` | `404` Not Found |
| **GET** | `/api/posts` | No | Gets posts feed (optional `?communityId=` or `?slug=`) | `200 OK` | `500` Server Error |
| **POST** | `/api/posts` | **Yes** | Scans privacy leaks & creates post | `201 Created` | `400` Missing content, `404` Community missing |
| **GET** | `/api/posts/:id` | No | Gets single post details | `200 OK` | `404` Post Not Found |
| **GET** | `/api/comments/post/:postId` | No | Gets 4-level nested comment tree | `200 OK` | `404` Post Not Found |
| **POST** | `/api/comments` | **Yes** | Adds top-level comment or nested reply | `201 Created` | `400` Bad Request, `404` Parent Not Found |
| **POST** | `/api/reactions` | **Yes** | Adds/updates post reaction & trust score | `201 / 200` | `400` Self-react, `404` Post missing |
| **DELETE**| `/api/reactions/:postId`| **Yes** | Removes reaction & decrements score | `200 OK` | `404` Reaction missing |

---

# 13. Node.js & Express Architecture

* **Single-Threaded Event Loop**: Node.js handles concurrent incoming HTTP requests asynchronously on a single main thread using libuv event loop callbacks.
* **Middleware Chain**: Express processes requests through sequential function middleware (`helmet` → `rateLimit` → `cors` → `express.json` → `authMiddleware` → `controller`).
* **`next()` Execution**: Calling `next()` moves control to the subsequent handler in the pipeline. Omitting `next()` or failing to return a response hangs the request.

---

# 14. React Frontend Architecture

* **State Management**: React `useState` for local component state; `AuthContext` ([`AuthContext.jsx`](file:///Users/akshayaverma/Downloads/persona/client/src/context/AuthContext.jsx)) for global user persona & token state synced with `localStorage`.
* **Axios Interceptor ([`axios.js`](file:///Users/akshayaverma/Downloads/persona/client/src/api/axios.js))**: Automatically attaches `Authorization: Bearer <token>` header to every outgoing HTTP request.
* **Route Guards ([`App.jsx`](file:///Users/akshayaverma/Downloads/persona/client/src/App.jsx))**:
  - `ProtectedRoute`: Redirects unauthenticated users attempting to access protected routes to `/login`.
  - `RedirectIfAuthenticated`: Redirects logged-in users visiting `/login` or `/register` to home `/`.

---

# 15. Error Handling & Edge Cases

* **Validation Errors**: HTTP 400 with explicit JSON message (e.g., `{ error: 'Password must be at least 8 characters' }`).
* **Authentication Failures**: HTTP 401 (`{ error: 'Invalid or expired token' }`).
* **Duplicate Email Registration**: Caught by Prisma unique constraint → HTTP 409 (`{ error: 'Email already registered' }`).
* **Resource Absence**: HTTP 404 (`{ error: 'Post not found' }`).
* **Server Exceptions**: Wrapped in `try/catch` blocks returning HTTP 500 (`{ error: 'Something went wrong' }`).

---

# 16. Scalability Strategy (1 Million Users)

If asked *"How would you scale Persona to 1 Million Users?"*:

### Current Implementation vs Production Scaling Matrix:

| Component | Persona Current Implementation | 1M Users Production Strategy |
| :--- | :--- | :--- |
| **Database Queries** | Direct Neon PostgreSQL connection | PostgreSQL Read Replicas + PgBouncer connection pooling. |
| **Feed Caching** | Direct DB queries on `getAllPosts` | Redis cache for trending community posts (TTL 60s). |
| **Comments Fetching** | 4-level nested Prisma query | Materialized path indexing or paginated flat array with client-side tree assembly. |
| **Search / Privacy Scan** | On-demand JS Regex scanning | Asynchronous background worker queue (BullMQ / RabbitMQ). |
| **Static Assets** | Vite Client SPA | Distributed Cloudflare CDN / AWS CloudFront edge caching. |

---

# 17. Technology Decision Matrix

| Technology | Selected | Closest Alternative | Why We Used It | When Alternative Wins |
| :--- | :--- | :--- | :--- | :--- |
| **Database** | PostgreSQL | MongoDB | Strict relational constraints (`@@unique([userId, postId])`), transactional integrity for trust score. | Document data with dynamic, unstructured schema and no complex joins. |
| **ORM** | Prisma v5 | Raw SQL / Sequelize | Type safety, clean declarative relations, auto-generated migrations. | Extreme query performance tuning requiring custom CTEs and raw SQL optimizations. |
| **Backend** | Node / Express | Python / FastAPI | Unified JavaScript codebase, high concurrent non-blocking I/O performance. | Heavy CPU-bound machine learning / data processing workloads. |
| **Auth Strategy**| JWT | Session Cookies | Stateless, scalable across serverless cloud environments (Vercel). | Enterprise apps requiring immediate global session revocation. |
| **Frontend** | React 18 | Vanilla JS / Vue | Declarative component model, virtual DOM reconciliation, rich ecosystem. | Micro-lightweight static web pages with near-zero bundle size requirements. |

---

# 18. Resume Bullet-by-Bullet Defense

### Claim 1: "Built atomic `$transaction` blocks for concurrent writes"
* **Code Evidence**: [`reactionController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/reactionController.js) (lines 47-56 & 81-89).
* **What it means**: Combines reaction creation/deletion and user trust score update into a single atomic database unit using `prisma.$transaction`.
* **Interviewer Trap**: *"What happens if `prisma.user.update` fails?"*
* **Correct Answer**: *"Because both queries run inside `prisma.$transaction`, if `user.update` fails, the `reaction.create` query is automatically rolled back by PostgreSQL, ensuring trust score stays strictly consistent with reaction counts."*

### Claim 2: "Implemented pre-save privacy-leak detector using Regex"
* **Code Evidence**: [`privacyDetector.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/privacyDetector.js).
* **What it means**: Scans raw text strings for pattern matches against emails, phone numbers, and social URLs prior to database persistence.
* **Interviewer Trap**: *"Does your detector block users from posting?"*
* **Correct Answer**: *"No. In our implementation, `detectPrivacyLeaks` sets `hasPrivacyLeak: true` and records the leak array in the database record, allowing the frontend to render warning indicators without blocking content creation."*

### Claim 3: "Prisma select-field exclusion for anonymity enforcement"
* **Code Evidence**: [`postController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/postController.js) (`postSelect`) and [`commentController.js`](file:///Users/akshayaverma/Downloads/persona/server/controllers/commentController.js) (`authorSelect`).
* **What it means**: Queries explicitly define `select: { personaName: true, personaEmoji: true, personaColor: true, trustScore: true }`, ensuring `email` and `password` fields never enter application memory or network payloads.

---

# 19. Project Challenges & Real Code Solutions

### 1. Hardest Technical Feature: Nested Self-Referencing Comments
* **Challenge**: Fetching hierarchical comment threads without causing N+1 database queries.
* **Solution**: Designed a self-referencing `parentId` schema in Prisma and structured nested `select` queries to fetch up to 4 levels of replies in a single query execution.

### 2. Biggest Bug & Fix: CORS Port Mismatch on Development / Serverless
* **Challenge**: Frontend running on Vite port 5174 was blocked by backend CORS configured strictly for port 5173.
* **Solution**: Implemented dynamic regex-based origin validation in Express CORS middleware ([`index.js`](file:///Users/akshayaverma/Downloads/persona/index.js)) allowing local ports (`localhost:\d+`) and Vercel domains (`*.vercel.app`).

---

# 20. "What Would You Improve?" (Technical Debt & Roadmap)

1. **Implement Soft Deletion for Comments**: Currently, deleting a parent comment breaks child replies. I would add a `deletedAt` timestamp and display `"[Comment deleted]"` for deleted parents with active replies.
2. **Paginate Discussion Feeds**: Convert `getAllPosts` from returning full post lists to Cursor-Based Pagination using Prisma `take` and `cursor`.
3. **Asynchronous Privacy Scanning Queue**: Offload heavy regex analysis to a background worker queue (BullMQ + Redis) for large posts.

---

# 21. Real-World Failure Scenarios & Solutions

1. **PostgreSQL Database Goes Down**:
   - *Current Implementation*: Express returns HTTP 500 (`{ error: 'Something went wrong' }`).
   - *Production Solution*: Implement retry logic with exponential backoff and circuit breaker pattern.
2. **Two Users React at the Exact Same Millisecond**:
   - *Current Implementation*: Handled cleanly by PostgreSQL isolation level inside `prisma.$transaction` and `@@unique([userId, postId])` constraint.
3. **Invalid or Expired JWT Token**:
   - *Current Implementation*: [`authMiddleware`](file:///Users/akshayaverma/Downloads/persona/server/middleware/auth.js) catches error during `jwt.verify` and returns HTTP 401 (`{ error: 'Invalid or expired token' }`).

---

# 22. Interview Question Bank (By Difficulty)

## Level 1 — Basic Definitions
1. **What is REST?**: Representational State Transfer, an architectural style for stateless networked APIs using standard HTTP methods.
2. **What is middleware in Express?**: Functions with access to `req`, `res`, and `next` that execute during the request-response lifecycle.
3. **What is JWT?**: A signed JSON string containing claims used for stateless authentication.

## Level 2 — Project Understanding
4. **How does Persona preserve user anonymity?**: By decoupling real credentials from pseudonyms at registration and using explicit Prisma `select` shapes that exclude `email` and `password`.
5. **How are unique persona names generated?**: Procedurally combining adjectives and nouns in [`personaGenerator.js`](file:///Users/akshayaverma/Downloads/persona/server/utils/personaGenerator.js) while checking database uniqueness.

## Level 3 — Deep Technical
6. **Why use `prisma.$transaction` for reactions?**: To guarantee atomicity when creating a reaction and updating user trust score.
7. **How does the self-referencing comment model work?**: Via a nullable `parentId` foreign key referencing `Comment.id`.

## Level 4 — Scenario & Design
8. **How would you prevent spam comments?**: Integrate Redis rate-limiting (e.g., max 5 comments per minute per IP).

---

# 23. Standard Answer Format Example

### Q: Why did you choose Prisma over raw SQL?
* **Short Answer**: Prisma provides compile-time type safety, automated migrations, and clean nested query syntax, preventing SQL injection vulnerabilities.
* **Interview Answer**: "We chose Prisma ORM for Persona because it significantly speeds up development while enforcing type safety. It automatically handles parameterization to prevent SQL injection and makes complex relational queries—like fetching 4-level nested comments—readable and maintainable compared to writing raw SQL JOIN queries."
* **Follow-up**: "When would you prefer raw SQL?" → "For complex analytical queries involving window functions, CTEs, or micro-optimized reporting queries."

---

# 24. How to Control the Interview Naturally

### Strategic Conversational Bridges:
* **When asked about Project Overview** → Mention *"atomic database transactions"* → Leads interviewer to ask about Prisma `$transaction`.
* **When asked about Authentication** → Mention *"query-level privacy enforcement"* → Leads interviewer to ask about Prisma `select` exclusions.

### Topic Risk Categorization:
* **🟢 SAFE TOPICS**: Project Architecture, JWT Auth, Express Middleware, CRUD APIs.
* **🟡 CAUTION TOPICS**: Complex Regex Edge Cases, Vercel Serverless Lifecycle.
* **🔴 HIGH-RISK TOPICS**: Claiming Redis caching is implemented when it is only conceptual.

---

# 25. AI-Assisted Development Honest Defense

If asked: *"Did you use AI tools while building Persona?"*

> **Professional Answer**:
> "Yes, I leveraged modern AI coding assistants as pair-programming tools during development—primarily for scaffolding boilerplate code, refining complex regular expressions for privacy detection, and optimizing Prisma query structures. However, I personally designed the system architecture, established database schema relations, implemented the authentication pipeline, and thoroughly debugged edge cases like CORS preflight handling and atomic database transactions."

---

# 26. NIGHT-BEFORE CHEAT SHEET

### Quick Memory Anchor
```
Persona Tech Stack: React 18 + Node/Express + Prisma v5 + PostgreSQL (Neon) + JWT
Key Feature 1: Anonymous Identity Generation (Adjective + Noun -> SilentFox 🦊)
Key Feature 2: Pre-save Privacy Leak Detector (Regex scan for email/phone)
Key Feature 3: Self-referencing Nested Comments (Comment.parentId -> Comment.id)
Key Feature 4: Atomic Reaction & Trust Score (prisma.$transaction + @@unique constraint)
```

---

# 27. TOP 25 QUESTIONS YOU MUST BE ABLE TO ANSWER TOMORROW

1. What is Persona and what problem does it solve?
2. Walk me through the high-level architecture of your application.
3. How does user registration work from frontend to database?
4. How do you enforce anonymity and prevent email leaks?
5. What is a self-referencing relationship in a database?
6. How did you implement nested comments in Prisma?
7. What is `prisma.$transaction` and why did you use it?
8. Explain ACID properties in the context of your reaction system.
9. How does duplicate reaction prevention work in your database schema?
10. What is JWT and how is it used in your middleware?
11. How are passwords stored securely in Persona?
12. How does your regex privacy leak detector work?
13. Does your privacy detector block post creation or just flag it?
14. What security measures are implemented in your Express backend?
15. Why did you use CORS middleware and how is it configured?
16. Why did you choose PostgreSQL over MongoDB?
17. Why did you choose Prisma over raw SQL or Sequelize?
18. What is the difference between `useState` and `useEffect` in React?
19. How does Axios handle authenticated requests in your frontend?
20. What error handling strategy is implemented across your API?
21. How would you scale Persona to support 1 Million active users?
22. What happens if two users react to the same post simultaneously?
23. What would you improve in Persona if you had another month?
24. How did you deploy your application to Vercel and Neon?
25. How did you use AI tools during the development of this project?

---

*Handcrafted for interview excellence based on code analysis of `/Users/akshayaverma/Downloads/persona`.*
