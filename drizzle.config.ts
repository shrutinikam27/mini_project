import { defineConfig } from 'drizzle-kit';
import { neonConfig } from '@neondatabase/serverless';

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

if (!isLocal) {
    // Configure connection pooling for Neon remote
    neonConfig.fetchConnectionCache = true;
}

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: isLocal
        ? (() => {
            const url = new URL(process.env.DATABASE_URL!);
            return {
                host: url.hostname,
                port: Number(url.port) || 5432,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1),
                ssl: false,
            };
        })()
        : {
            // For Neon, we need to parse the connection string
            host: new URL(process.env.DATABASE_URL!).hostname,
            user: new URL(process.env.DATABASE_URL!).username,
            password: new URL(process.env.DATABASE_URL!).password,
            database: new URL(process.env.DATABASE_URL!).pathname.slice(1),
            ssl: true,
        },
});
