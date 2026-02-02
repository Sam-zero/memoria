# Final Project Report — Memoria

Course: Advanced Databases (NoSQL)

Team: 2 students

---

## 1. Project overview
Memoria is a web application for creating personal “moments” (short notes) and organizing them into “memories” (collections). The app supports authentication, CRUD operations, advanced updates/deletes, aggregation analytics, and indexing.

## 2. System architecture
**Frontend:** React (Vite) + Axios  
**Backend:** Node.js + Express (REST)  
**Database:** MongoDB (Mongoose)

**Data flow:**
1) User logs in → receives JWT
2) Frontend stores JWT and sends it in `Authorization: Bearer <token>`
3) Backend authorizes the request and performs MongoDB operations
4) Frontend renders the results (tables/cards/analytics)

## 3. Database design (collections & relations)

### 3.1 Users (referenced)
Collection: `users`
- `_id` — ObjectId
- `name` — String
- `email` — String (unique)
- `passwordHash` — String

### 3.2 Moments (referenced)
Collection: `moments`
- `_id` — ObjectId
- `userId` — ObjectId (ref → `users`)
- `text` — String
- `mood` — String
- `tags` — [String]
- `views` — Number
- timestamps (`createdAt`, `updatedAt`)

### 3.3 Memories (embedded + referenced)
Collection: `memories`
- `_id` — ObjectId
- `userId` — ObjectId (ref → `users`)
- `title` — String
- `description` — String
- `moments` — embedded array:
  - `momentId` — ObjectId (ref → `moments`)
  - `addedAt` — Date

**Why embedded + referenced?**
- We embed the list of moment references inside a memory to keep the memory document self-contained (fast fetch of “what is inside”).
- We reference the real moment documents to avoid data duplication and keep moments editable.

## 4. MongoDB features used

### 4.1 CRUD across multiple collections
- `users`: register/login + profile (`/me`)
- `moments`: create/list/update/delete + views
- `memories`: create/list/details/update/delete

### 4.2 Advanced updates/deletes
- `$set`: update moment fields and memory details
- `$inc`: increment moment views
- `$push`: add moment to memory
- `$pull`: remove moment from memory and cleanup after moment deletion

### 4.3 Aggregation pipelines (business meaning)
Endpoints under `/api/analytics/*` implement multi-stage pipelines, for example:
- Mood distribution
- Top tags usage
- Daily activity (moments per day)
- Memory insights (number of moments per memory, etc.)

These analytics are displayed on the frontend Analytics page.

## 5. Indexing & optimization

### 5.1 Compound indexes (Moments)
- `{ userId: 1, createdAt: -1 }` — common “my feed” query
- `{ userId: 1, mood: 1, createdAt: -1 }` — filter by mood and sort
- `{ userId: 1, tags: 1 }` — tag-based filtering

### 5.2 Compound indexes (Memories)
- `{ userId: 1, createdAt: -1 }` — list page
- `{ userId: 1, title: 1 }` — quick title search

**Justification:** The app always queries data “per user” (authorization boundary). These indexes align with the query shapes (filter by `userId`, optional filters by `mood`/`tags`, and sort by `createdAt`).

## 6. REST API documentation
See `/README.md` for the full endpoint list and examples.

Bonus:
- Swagger UI: `/api/docs`
- OpenAPI JSON: `/api/openapi.json`

## 7. Security
- JWT authentication
- Authorization: all user data is scoped by `userId` and protected endpoints require a valid token

## 8. Frontend requirements
The frontend provides 6+ functional pages with real HTTP requests to the backend:
- Auth pages
- CRUD pages for moments and memories
- Analytics page using aggregation endpoints

## 9. Contribution of each student
Student A: Backend (models, routes, controllers, aggregation, indexes, security)  
Student B: Frontend (pages, components, API integration, UX/UI, styling)

> Replace with real names.