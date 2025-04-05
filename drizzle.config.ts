import { defineConfig } from 'drizzle-kit';
import { neonConfig } from '@neondatabase/serverless';

// Configure connection pooling
neonConfig.fetchConnectionCache = true;

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        // For Neon, we need to parse the connection string
        host: new URL(process.env.DATABASE_URL!).hostname,
        user: new URL(process.env.DATABASE_URL!).username,
        password: new URL(process.env.DATABASE_URL!).password,
        database: new URL(process.env.DATABASE_URL!).pathname.slice(1),
        ssl: true
    },

});
