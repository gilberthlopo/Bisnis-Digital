# Backend Server

This is the dedicated backend for the BeresinAja app, built with Express and Prisma.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Ensure your `.env` file in this directory contains your Supabase credentials:
    ```env
    DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
    ```

3.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

4.  **Sync Database**:
    If you want to pull the schema from Supabase (once connection works):
    ```bash
    npx prisma db pull
    ```
    If you want to push the local schema (in `prisma/schema.prisma`) to Supabase:
    ```bash
    npx prisma db push
    ```

5.  **Run Server**:
    ```bash
    npm run dev
    ```

## Project Structure
-   `src/index.ts`: Entry point of the Express server.
-   `prisma/schema.prisma`: Database schema definition.
