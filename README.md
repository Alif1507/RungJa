# RungJa

![alt text](https://i.imgur.com/wgkBZJi.png)

Full-stack e-commerce platform with a Laravel 12 API backend, React + Vite frontend, and Midtrans payment gateway integration (Snap). The project ships with containerized dev/prod workflows, role-based auth (user/admin), carts, orders, order history, and an admin dashboard.

## Tech Stack

- **Backend**: Laravel 12, PHP 8.3, MySQL, Sanctum auth
- **Frontend**: React 19, Vite, Tailwind classes, Flowbite components
- **Payments**: Midtrans Snap (sandbox & production-ready)
- **Deployment**: Docker/Docker Compose for backend, frontend, and MySQL

## Features

- User registration/login with Sanctum tokens and role-based access (admin/user)
- Browse menus with search/filter, add to cart, checkout via Midtrans Snap
- Order history + detail view with Midtrans payment status mapping
- Admin dashboard for menu CRUD, order stats, and order monitoring
- Midtrans notifications endpoint to update order payment status

## Prerequisites

- Docker & Docker Compose (recommended)  
  or PHP >= 8.3, Composer, Node.js 20, npm if running without containers
- Midtrans sandbox account (for real payment testing)
- MySQL server (or Docker MySQL service)

## Environment Setup

### Backend `.env`

Copy `backend/.env.example` (if available) or configure manually:

```ini
APP_NAME=RungJa
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=rungja
DB_USERNAME=rungja
DB_PASSWORD=secret

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost

MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_STUB=true                  # true for offline mock, false for real Snap
MIDTRANS_FALLBACK_ON_FAILURE=true   # fallback to mock if real call fails
MIDTRANS_ENABLED_PAYMENTS=bca,gopay # optional comma-separated list
```

> When deploying, set `MIDTRANS_STUB=false` and provide valid keys. The frontend also needs the client key.

### Frontend `.env`

`frontend/.env`:

```ini
VITE_API_URL=http://localhost:8000/api    # or /api when reverse proxying
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxx
```

## Docker Workflows

### Backend + Database

The default `docker-compose.yml` runs MySQL + Laravel API:

```bash
docker compose up --build -d
```

Services:
- `db`: MySQL 8.0 with persistent volume `db_data`
- `backend`: PHP 8.3 + Laravel served via `php artisan serve`

By default the backend is exposed on `localhost:8000`. Override with `BACKEND_PORT` env var.

### Frontend Only

`docker-compose.frontend.yml` builds and serves the React app via Nginx:

```bash
docker compose -f docker-compose.frontend.yml up --build -d
```

Access at `http://localhost:8080` (customize via `FRONTEND_PORT`).  
Ensure `VITE_API_URL` points to your backend URL (e.g., `http://your-api-host:8000/api`).

### Combined Deployment

If you want frontend + backend + db simultaneously, run both compose files or create an umbrella compose file. For example:

```bash
docker compose up --build -d      # backend + db
docker compose -f docker-compose.frontend.yml up --build -d
```

Alternatively, adjust `docker-compose.yml` to include the frontend service (earlier revision) if you prefer a single stack.

## Running Without Docker

### Backend

```bash
cd backend
composer install
cp .env.example .env  # or configure manually
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Ensure MySQL credentials match `.env`. The API runs at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://127.0.0.1:5173
```

Set `VITE_API_URL` to `http://127.0.0.1:8000/api` during dev.

## Midtrans Integration

- **Snap Payments**: `/api/checkout` creates a Snap transaction, returns `snapToken`. Frontend uses `window.snap.pay(snapToken)`.
- **Stub Mode**: When `MIDTRANS_STUB=true`, the backend returns a simulated response and redirect URL for offline testing.
- **Notifications**: Midtrans should hit `/api/midtrans/notifications` (named route `midtrans.notifications`) to update order status.
- **Customer details**: Checkout sends billing/shipping info, metadata, expiry, and optional `enabled_payments`.

## Key Endpoints

- `POST /api/register` – create user
- `POST /api/login` – login, returns token
- `GET /api/menus` – public menu list with search/filter
- Authenticated routes (Sanctum):
  - `/api/cart`, `/api/cart/items`
  - `/api/checkout`
  - `/api/orders`, `/api/orders/{id}`
  - Admin routes (requires `role=admin`): `/api/menus` CRUD, `/api/admin/orders`, `/api/admin/metrics`
- `POST /api/midtrans/notifications` – webhook handling

## Admin Access

Seeder creates a default admin:

- Email: `admin@example.com`
- Password: `password`

Use it to access the dashboard at `/admin`.

## Frontend Routes

- `/` – marketing landing page
- `/store` – store/catalog with cart & checkout
- `/signin`, `/signup` – auth pages
- `/orders` – user order history (protected)
- `/admin` – admin dashboard (protected + role check)

## Notes & Tips

- Cart → Order flow auto-decrements menu stock.
- Midtrans snap script is loaded in `frontend/index.html`; ensure the client key is injected via Vite.
- When running behind a reverse proxy (Apache/Nginx), proxy `/api/*` to backend and serve `/` from frontend build.
- Laravel logs live under `backend/storage/logs/laravel.log`; inspect errors from Docker via `docker compose logs backend`.
- MySQL data persists via the `db_data` volume; remove it with `docker volume rm rungja_db_data` if needed.

## Testing

Run Laravel tests:

```bash
cd backend
php artisan test
```

Frontend lint/build:

```bash
cd frontend
npm run lint
npm run build
```

## License

MIT (or update accordingly).
