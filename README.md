# toilet-map

Find a nearby restroom. A mobile-first web app that shows public and semi-public restrooms on a map with details like access type, code requirements, and accessibility.

## Stack

- **Next.js 16** (App Router) + React 19
- **TypeScript** + **Tailwind CSS v4**
- **Prisma 7** with SQLite
- **next-auth v5** (Auth.js) with credentials provider
- **Leaflet** via react-leaflet for maps
- **Nominatim** for geocoding

## Getting started

```bash
# Clone and install
git clone <repo-url> && cd toilet-map
npm install

# Environment
cp .env.example .env
# Edit .env if needed

# Database
npx prisma migrate dev --name init
npx prisma generate

# Seed data (10 restrooms in downtown LA + admin user)
npm run seed

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite connection string |
| `AUTH_SECRET` | Secret for signing JWTs (change in production) |
| `AUTH_URL` | Base URL of the app |
| `ADMIN_EMAIL` | Email for the seeded admin user |
| `ADMIN_PASSWORD` | Password for the seeded admin user |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed the database |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:reset` | Reset database and re-seed |

## Admin

Navigate to `/admin/login` and sign in with the credentials from your `.env` file (default: `admin@toilet-map.local` / `admin123`). From the dashboard you can create, edit, and delete restroom entries.

## Deploy

1. Set `DATABASE_URL` to a persistent SQLite path or switch to Postgres
2. Set `AUTH_SECRET` to a random string (`openssl rand -base64 32`)
3. Set `AUTH_URL` to your production URL
4. Run `npx prisma migrate deploy` and `npm run seed`
5. `npm run build && npm run start`
