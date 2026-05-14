# Pomegranate Technology Backend

Secure Node.js + Express + Supabase PostgreSQL REST API for the Pomegranate Technology website and admin panel.

## Features

- JWT admin authentication
- bcrypt password hashing
- Forgot and reset password flow
- Role-based access: `super_admin`, `admin`, `editor`
- Supabase PostgreSQL database
- Supabase Storage image/file uploads
- REST APIs for services, portfolio, clients, orders, messages, payments, dashboard analytics
- Nodemailer email notifications
- Rate limiting, Helmet, CORS, validation, pagination, filtering, search, sorting
- Render/Railway deployment config

## Folder Structure

```text
backend/
  database/schema.sql
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    uploads/
    utils/
    validators/
```

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run `database/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Fill in:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
```

5. Install dependencies:

```bash
npm install
```

6. Seed first super admin:

```bash
SEED_ADMIN_EMAIL=admin@pomotech.in SEED_ADMIN_PASSWORD=StrongPassword123 npm run seed:admin
```

On PowerShell:

```powershell
$env:SEED_ADMIN_EMAIL="admin@pomotech.in"
$env:SEED_ADMIN_PASSWORD="StrongPassword123"
npm run seed:admin
```

7. Start locally:

```bash
npm run dev
```

API runs at `http://localhost:5000`.

## Deployment

### Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check: `/health`
- Add all `.env` values in Render Environment.

### Railway

- Deploy the `backend` folder.
- Railway reads `railway.json`.
- Add environment variables in Railway Variables.

### Supabase

- Database: run `database/schema.sql`
- Storage bucket: `pomotech-uploads`
- Use service role key only on backend. Never expose it in frontend.

### Vercel Frontend

- Deploy static website/admin frontend separately.
- Set frontend API base URL to your Render/Railway backend URL.

## Authentication

Use:

```http
Authorization: Bearer <JWT_TOKEN>
```

Public endpoints:

- `GET /api/services`
- `GET /api/portfolio`
- `POST /api/messages`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Protected endpoints require JWT.

## API Documentation

Run the server and open:

```text
GET /api/docs
```

## Uploads

Endpoint:

```http
POST /api/uploads
Content-Type: multipart/form-data
Authorization: Bearer <JWT>

file=<image>
type=portfolio|services|clients|profiles
```

Limits:

- Max file size: 5MB
- Allowed: JPG, PNG, WEBP, GIF, PDF

## Pagination, Search, Filter, Sort

All list endpoints support:

```text
?page=1&limit=20&search=website&sortBy=created_at&sortOrder=desc
```

Filters can be passed by field:

```text
/api/orders?order_status=pending&payment_status=paid
```

## Security Notes

- Use a long random `JWT_SECRET`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.
- Use HTTPS in production.
- Add frontend domains to `CORS_ORIGINS`.
- Connect password reset URLs to your deployed admin frontend.
