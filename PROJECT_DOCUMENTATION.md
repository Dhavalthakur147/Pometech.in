# Pomegranate Technology Project Documentation

## Project Overview

Pomegranate Technology is a modern digital agency website with a public business website, admin dashboard UI, and a secure backend API.

The project includes:

- Public website pages
- Admin login and dashboard pages
- Node.js + Express backend
- Supabase PostgreSQL database
- Supabase Storage file uploads
- JWT authentication
- REST API architecture
- Deployment-ready configuration for Render, Railway, Supabase, and Vercel

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Responsive design
- Glassmorphism UI
- Red, black, gold, and white brand theme

### Backend

- Node.js
- Express.js
- Supabase PostgreSQL
- Supabase Storage
- JWT authentication
- bcrypt password hashing
- Nodemailer
- Zod validation
- Helmet security
- CORS protection
- Rate limiting

## Project Structure

```text
pometech/
  index.html
  about.html
  services.html
  portfolio.html
  more-services.html
  contact.html
  admin-login.html
  admin-dashboard.html
  robots.txt
  sitemap.xml

  assets/
    css/
      style.css
      admin.css
    js/
      script.js
      admin.js

  image/
    logo.jpeg
    portfolio images...

  backend/
    package.json
    .env.example
    README.md
    API.md
    render.yaml
    railway.json
    database/
      schema.sql
    src/
      app.js
      server.js
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

## Website Pages

### Home Page

File: `index.html`

Purpose:

- Introduces Pomegranate Technology
- Shows main services
- Displays statistics
- Adds offer and CTA sections

Main sections:

- Hero section
- Statistics
- Services preview
- Why choose us
- Offer section
- CTA
- Footer

### About Page

File: `about.html`

Purpose:

- Explains company identity
- Shows mission, vision, values, team, and company journey

Main sections:

- Company introduction
- Services summary
- Mission and vision
- Core values
- Timeline
- Team section

### Services Page

File: `services.html`

Purpose:

- Shows detailed core services
- Includes pricing cards and service CTAs

Services:

- Logo Design
- Website Development
- App Development
- Data Analysis & Excel Automation
- Custom Shop Management System
- Social Media & Banner Design

### Portfolio Page

File: `portfolio.html`

Purpose:

- Clean profile and portfolio page
- Shows company work and business identity

Sections:

- Hero
- Company introduction
- Featured work
- Why choose us
- Client feedback
- Final CTA

### More Services Page

File: `more-services.html`

Purpose:

- Lists additional creative and business services

Includes:

- Instagram Post Design
- LinkedIn Post Design
- Festival Poster Design
- YouTube Thumbnail Design
- Visiting Card Design
- Brochure Design
- QR Code Poster
- Invoice Design
- Data Entry
- Attendance Sheet
- Salary Sheet Automation
- Business Dashboard
- WhatsApp Marketing Creatives

### Contact Page

File: `contact.html`

Purpose:

- Lets users contact Pomegranate Technology
- Shows phone, Instagram, website, and WhatsApp links

## Admin Panel

### Admin Login

File: `admin-login.html`

Features:

- Email field
- Password field
- Login button
- Forgot Password button
- Futuristic digital background

### Admin Dashboard

File: `admin-dashboard.html`

Features:

- Sticky sidebar
- Top navbar
- Search
- Notifications
- Admin profile
- Dark/light mode toggle
- Dashboard statistics
- Charts
- User management
- Services management
- Portfolio management
- Orders
- Clients
- Payments
- Messages
- Analytics
- Settings

Note:

The current admin frontend uses demo local authentication. The production backend authentication is available in the `backend` folder and should be connected before live deployment.

## Backend Overview

Backend folder:

```text
backend/
```

The backend provides secure APIs for the public website and admin dashboard.

Main backend features:

- Admin login
- JWT authentication
- Password hashing
- Forgot password
- Reset password
- Role-based protected routes
- Services APIs
- Portfolio APIs
- Client APIs
- Order APIs
- Message APIs
- Payment APIs
- Dashboard analytics APIs
- File uploads with Supabase Storage
- Email notifications with Nodemailer

## Backend Database Tables

Database file:

```text
backend/database/schema.sql
```

Tables:

- `admin_users`
- `services`
- `portfolio`
- `clients`
- `orders`
- `messages`
- `payments`

## Backend Setup

### 1. Install Node.js

Install Node.js version 20 or newer.

Check version:

```powershell
node -v
npm -v
```

### 2. Open Backend Folder

```powershell
cd C:\Users\Dhval\OneDrive\Desktop\pometech\backend
```

### 3. Install Dependencies

```powershell
npm install
```

### 4. Create Environment File

```powershell
copy .env.example .env
```

Fill these values in `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-long-random-secret
```

Optional email values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@pomotech.in
```

### 5. Create Supabase Tables

Open Supabase SQL Editor.

Run:

```text
backend/database/schema.sql
```

This creates all required tables and storage bucket setup.

### 6. Seed First Admin

PowerShell:

```powershell
$env:SEED_ADMIN_EMAIL="admin@pomotech.in"
$env:SEED_ADMIN_PASSWORD="StrongPassword123"
npm run seed:admin
```

### 7. Start Backend

```powershell
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

Check:

```text
http://localhost:5000
http://localhost:5000/health
http://localhost:5000/api/docs
```

## API Summary

Full API documentation:

```text
backend/API.md
```

### Authentication

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/session
```

### Services

```http
GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id
```

### Portfolio

```http
GET    /api/portfolio
POST   /api/portfolio
PUT    /api/portfolio/:id
DELETE /api/portfolio/:id
```

### Clients

```http
GET    /api/clients
POST   /api/clients
PUT    /api/clients/:id
DELETE /api/clients/:id
```

### Orders

```http
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

### Messages

```http
POST   /api/messages
GET    /api/messages
POST   /api/messages/:id/reply
DELETE /api/messages/:id
```

### Payments

```http
GET   /api/payments
POST  /api/payments
PUT   /api/payments/:id
PATCH /api/payments/:id/status
```

### Uploads

```http
POST /api/uploads
```

Upload supports:

- Portfolio images
- Service images
- Client files
- Profile images

### Dashboard Analytics

```http
GET /api/dashboard/overview
GET /api/dashboard/revenue-report
GET /api/dashboard/client-growth
GET /api/dashboard/service-performance
GET /api/dashboard/order-statistics
```

## Authentication Flow

1. Admin sends email and password to `/api/auth/login`.
2. Backend checks admin in Supabase.
3. Backend compares password with bcrypt.
4. Backend returns JWT token.
5. Admin frontend stores token.
6. Protected API calls use:

```http
Authorization: Bearer <token>
```

## Roles

Supported roles:

- `super_admin`
- `admin`
- `editor`

Role permissions are handled in route middleware.

## File Upload Flow

1. Admin uploads file through API.
2. Backend validates file type and size.
3. Backend uploads to Supabase Storage.
4. Supabase returns public preview URL.
5. URL can be saved in service, portfolio, or profile records.

Allowed files:

- JPG
- PNG
- WEBP
- GIF
- PDF

Maximum size:

```text
5MB
```

## Security Features

Implemented:

- JWT authentication
- bcrypt password hashing
- Role-based access control
- Helmet security headers
- CORS protection
- Rate limiting
- Zod API validation
- Supabase parameterized client queries
- Secure environment variables
- No service role key in frontend

## Deployment Guide

### Backend on Render

Use:

```text
backend/render.yaml
```

Render settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Add environment variables from `.env`.

### Backend on Railway

Use:

```text
backend/railway.json
```

Add environment variables in Railway dashboard.

### Database on Supabase

1. Create Supabase project
2. Run `backend/database/schema.sql`
3. Copy project URL and service role key
4. Add them to backend environment variables

### Frontend on Vercel

Deploy the main project folder as static frontend.

Important:

- Do not expose `SUPABASE_SERVICE_ROLE_KEY`
- Connect frontend API calls to deployed backend URL

## Common Errors

### `getaddrinfo ENOTFOUND your-project.supabase.co`

Cause:

`SUPABASE_URL` is still placeholder.

Fix:

Use real Supabase Project URL in `.env`.

### `Could not find table public.admin_users`

Cause:

Database schema has not been created.

Fix:

Run `backend/database/schema.sql` in Supabase SQL Editor.

### Login fails

Check:

- Admin was seeded
- Password is correct
- Supabase keys are correct
- Backend server restarted after `.env` changes

## Maintenance Notes

- Keep backend `.env` private
- Never add Supabase service role key to frontend
- Use HTTPS in production
- Update `CORS_ORIGINS` with real frontend/admin URLs
- Rotate JWT secret if leaked
- Backup Supabase database regularly

## Important Files

- Backend setup: `backend/README.md`
- API reference: `backend/API.md`
- Database schema: `backend/database/schema.sql`
- Environment sample: `backend/.env.example`
- Backend entry: `backend/src/server.js`
- Express app: `backend/src/app.js`
- Public website style: `assets/css/style.css`
- Admin style: `assets/css/admin.css`

## Project Status

Completed:

- Public website
- Admin panel UI
- Backend API
- Database schema
- Auth system
- Upload system
- Email service structure
- API documentation
- Deployment configuration

Remaining for production:

- Connect admin frontend forms to backend APIs
- Add real SMTP credentials
- Deploy backend
- Deploy frontend
- Test all APIs with production Supabase
- Add real business data
