# Real Estate Frontend

Next.js frontend for a real estate app. Handles authentication and property listings, talking to a Laravel API.

## Stack

- **Next.js 16** (Pages Router)
- **React 19**
- **Tailwind CSS 4**
- **Laravel API** (auth + properties)

## Prerequisites

- Node.js 18+
- Laravel backend running (e.g. `http://localhost:8000`) with auth and properties API

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Environment**

   Copy the example env and set your Laravel API URL:

   ```bash
   cp .env.local.example .env.local
   ```

   In `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

   Use the URL of your Laravel app (no trailing slash).

3. **Run**

   ```bash
   npm run dev
   ```

   App runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Build for production     |
| `npm run start`| Start production server |

## Features

- **Auth**: Login and register; token stored in `localStorage`; cookie used for middleware.
- **Middleware**: Protects `/properties` (and below). Unauthenticated users are redirected to `/login`. Logged-in users visiting `/login` or `/register` are redirected to `/properties`.
- **Properties**: List (table), create, edit, delete. Create/update send `user_id` from the current user when available.
- **Routing**: `/` redirects to `/properties`.

## Project structure

```
src/
├── components/
│   └── PropertyForm.js    # Shared form for create/edit property
├── lib/
│   └── api.js            # API client, auth helpers, property CRUD
├── middleware.js        # Auth protection and guest redirects
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── login.js
│   ├── register.js
│   └── properties/
│       ├── index.js      # List + delete
│       ├── new.js       # Create
│       └── [id]/
│           └── edit.js  # Edit
└── styles/
    └── globals.css
```

## Laravel API expectations

- **Base URL**: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000`).

- **Auth**
  - `POST /api/login` — body: `{ email, password }`. Response: `{ token, user?: { id, ... } }`.
  - `POST /api/register` — body: `{ name, email, password, password_confirmation }`. Response: `{ token, user?: { id, ... } }`.
  - Authenticated requests: `Authorization: Bearer <token>`.

- **Properties**
  - `GET /api/properties` — list (array or `{ data: [] }`).
  - `GET /api/properties/:id` — single (object or `{ data: {} }`).
  - `POST /api/properties` — body: `property_type`, `features` (array), `price`, `taxes`, `income`, `expenditure`, `user_id` (sent by frontend when available).
  - `PUT /api/properties/:id` — same body shape as create.
  - `DELETE /api/properties/:id`.

Property fields: `property_type` (residential | commercial | land), `features` (JSON array of strings), `price`, `taxes`, `income`, `expenditure`, `user_id`.

## License

Private.
