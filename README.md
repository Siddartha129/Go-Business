# Go Business — Referral Dashboard

A secure, responsive referral management dashboard built for Go Business. Track referrals, earnings, and partner activity with authentication, search, sort, and pagination.

## Features

- **User Authentication** — Secure login with JWT token stored in cookies
- **Protected Routes** — Dashboard and referral details require authentication
- **Referral Dashboard** — Overview metrics, service summary, referral link/code sharing
- **Searchable & Sortable Table** — Filter by name or service, sort by date (newest/oldest first)
- **Client-side Pagination** — 10 rows per page with Previous/Next navigation
- **Referral Detail Page** — Individual referral view with formatted data
- **404 Page** — Public not-found route accessible without authentication

## Tech Stack

- React 19 + Vite
- React Router DOM
- js-cookie
- CSS (no external UI framework)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Test Credentials

| Field    | Value              |
|----------|--------------------|
| Email    | admin@example.com  |
| Password | admin123           |

## API Endpoints

| Purpose        | Method | URL                                                                                  |
|----------------|--------|--------------------------------------------------------------------------------------|
| Login          | POST   | `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin`            |
| Referrals      | GET    | `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals`              |
| Search         | GET    | `.../api/referrals?search=<query>`                                                   |
| Sort           | GET    | `.../api/referrals?sort=asc\|desc`                                                   |
| Single Referral| GET    | `.../api/referrals?id=<id>`                                                          |

## Routes

| Route                  | Access    | Description              |
|------------------------|-----------|--------------------------|
| `/login`               | Public    | Login page               |
| `/`                    | Protected | Referral dashboard       |
| `/referral/:id`        | Protected | Referral detail view     |
| `/dashboard/referrals` | Redirect  | Redirects to `/`           |
| `*`                    | Public    | 404 Not Found page       |

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

## Project Structure

```
src/
├── components/
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   └── ReferralDetail.jsx
├── services/
│   └── api.js
├── utils/
│   └── formatters.js
├── App.jsx
├── main.jsx
└── index.css
```
