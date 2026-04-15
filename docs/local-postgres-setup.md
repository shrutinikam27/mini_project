# Local PostgreSQL Setup Guide for Development

This guide will help you set up a local PostgreSQL database for development to replace the Neon remote database connection and avoid network issues.

## Step 1: Install PostgreSQL

- Download and install PostgreSQL from the official website: https://www.postgresql.org/download/
- Follow the installation instructions for your operating system.
- During installation, set a password for the default `postgres` user.

## Step 2: Create a Development Database and User

1. Open a terminal or command prompt.
2. Access the PostgreSQL shell:
   ```
   psql -U postgres
   ```
3. Create a new database:
   ```sql
   CREATE DATABASE lingo_dev;
   ```
4. Create a new user with a password:
   ```sql
   CREATE USER lingo_user WITH PASSWORD 'your_password_here';
   ```
5. Grant all privileges on the database to the user:
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE lingo_dev TO lingo_user;
   ```
6. Exit the psql shell:
   ```sql
   \q
   ```

## Step 3: Update Your Environment Variable

- Update your `.env` or environment configuration to set the `DATABASE_URL` to point to your local database:
  ```
  DATABASE_URL=postgresql://lingo_user:your_password_here@localhost:5432/lingo_dev
  ```

## Step 4: Run Migrations and Seed Data

- Run your project's migration scripts to create the necessary tables.
- Run seed scripts to populate initial data.

For example, if you use a migration tool like `drizzle-kit` or `knex`, run:
```
npx drizzle-kit migrate:latest
npx drizzle-kit seed:run
```

## Step 5: Restart Your Development Server

- Restart your Next.js or backend server to pick up the new database connection.

## Additional Notes

- Ensure PostgreSQL server is running locally.
- Adjust firewall or security settings if needed.
- For Windows, you can use pgAdmin for GUI management.

---

This setup will help you avoid network issues with the remote Neon database and speed up local development.

If you need help with any step, please let me know.
