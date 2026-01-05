# Step-by-step Guide to Duplicate and Run the Project

This guide will walk you through the process of duplicating the project, setting it up, and running all the necessary services (including the development server and Laravel Reverb).

---

## 1. Clone the Repository

```bash
git clone https://github.com/kimpoy31/hr_tabulator_v2.git
cd hr_tabulator_v2
```

---

## 2. Install Dependencies

### Backend (Laravel)

```bash
composer install
```

### Frontend (npm/yarn, depending on the project)

```bash
npm install
# OR
yarn install
```

---

## 3. Setup Environment Variables

Copy the example `.env` file and update it with your configuration:

```bash
cp .env.example .env
```

Then edit `.env` as needed (database, keys, etc).

---

## 4. Generate Application Key

```bash
php artisan key:generate
```

---

## 5. Run Database Migrations and Seed

Run the migrations to create database tables **and** seed the database with initial data:

```bash
php artisan migrate --seed
```

If you want to run migrations and seeding separately, you can do:

```bash
php artisan migrate
php artisan db:seed
```

---

## 6. Start the Development Servers

### a. Serve the Laravel Backend

```bash
php artisan serve
```

This will usually run on [http://localhost:8000](http://localhost:8000).

### b. Start the Frontend (Vite/React/Vue/etc.)

Check `package.json` for the script, usually:

```bash
npm run dev
# OR
yarn dev
```

This will usually run on [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173).

### c. Start Laravel Reverb (for websockets)

```bash
php artisan reverb:start
```

This will run the Laravel Reverb websocket server needed for real-time features.

---

## 7. Access the Project

- Laravel backend: `http://localhost:8000`
- Frontend: refer to the output URL after running `npm run dev` or `yarn dev`.
- Websocket/Reverb usually runs on `ws://localhost:6001` (check `.env` for details).

---

**Tip:** You may want to use [Laravel Sail](https://laravel.com/docs/sail) or Docker for a fully containerized setup if you prefer.

**If you encounter any errors:**

- Double check your `.env` database credentials.
- Verify that all dependencies are installed without errors.
- Ensure the correct PHP and Node.js versions are installed.

---

Happy coding!
