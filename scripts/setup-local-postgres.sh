#!/bin/bash

# Script to automate local PostgreSQL setup for the project

# 1. Install PostgreSQL (for Ubuntu/Debian)
if ! command -v psql &> /dev/null
then
    echo "PostgreSQL not found. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
else
    echo "PostgreSQL is already installed."
fi

# 2. Start PostgreSQL service
sudo service postgresql start

# 3. Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE lingo_dev;
CREATE USER lingo_user WITH PASSWORD 'lingo_password';
GRANT ALL PRIVILEGES ON DATABASE lingo_dev TO lingo_user;
EOF

echo "Database and user created."

# 4. Export DATABASE_URL environment variable for local development
export DATABASE_URL="postgresql://lingo_user:lingo_password@localhost:5432/lingo_dev"
echo "Set DATABASE_URL to $DATABASE_URL"

# 5. Run migrations and seed scripts (adjust commands as per your project)
echo "Running migrations..."
npx drizzle-kit migrate:latest

echo "Running seed scripts..."
npx drizzle-kit seed:run

echo "Local PostgreSQL setup complete. Please restart your development server."
