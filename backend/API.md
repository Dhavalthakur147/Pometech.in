# API Reference

Base URL:

```text
http://localhost:5000/api
```

Production example:

```text
https://pomotech-backend.onrender.com/api
```

## Auth

### Login

```http
POST /auth/login
```

```json
{
  "email": "admin@pomotech.in",
  "password": "StrongPassword123"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <token>
```

### Forgot Password

```http
POST /auth/forgot-password
```

```json
{ "email": "admin@pomotech.in" }
```

### Reset Password

```http
POST /auth/reset-password
```

```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword123"
}
```

## Services

```http
GET /services
POST /services
PUT /services/:id
DELETE /services/:id
```

```json
{
  "title": "Website Development",
  "description": "Responsive modern websites for businesses.",
  "icon": "WD",
  "image": "https://...",
  "price": 18000
}
```

## Portfolio

```http
GET /portfolio
POST /portfolio
PUT /portfolio/:id
DELETE /portfolio/:id
```

```json
{
  "title": "Social Media Campaign",
  "category": "Social Media Posts",
  "image": "https://...",
  "description": "Instagram promotional designs."
}
```

## Clients

```http
GET /clients
POST /clients
PUT /clients/:id
DELETE /clients/:id
```

```json
{
  "name": "Aarav Sharma",
  "business_name": "Jaipur Retail Co.",
  "phone": "+91 98752 94387",
  "email": "client@example.com",
  "service": "Website Development",
  "status": "active"
}
```

## Orders

```http
GET /orders
POST /orders
PUT /orders/:id
PATCH /orders/:id/status
DELETE /orders/:id
```

```json
{
  "client_id": "uuid",
  "service": "Logo Design",
  "amount": 2999,
  "payment_status": "pending",
  "order_status": "new",
  "delivery_date": "2026-05-25"
}
```

## Messages

### Save Contact Form

```http
POST /messages
```

```json
{
  "name": "Lead Name",
  "email": "lead@example.com",
  "phone": "+91 90000 00000",
  "message": "I need a website."
}
```

### Admin Messages

```http
GET /messages
POST /messages/:id/reply
DELETE /messages/:id
```

## Payments

```http
GET /payments
POST /payments
PUT /payments/:id
PATCH /payments/:id/status
```

```json
{
  "client_id": "uuid",
  "amount": 12000,
  "payment_method": "UPI",
  "transaction_id": "UPI123456",
  "payment_status": "paid"
}
```

## Dashboard Analytics

```http
GET /dashboard/overview
GET /dashboard/revenue-report
GET /dashboard/client-growth
GET /dashboard/service-performance
GET /dashboard/order-statistics
```
