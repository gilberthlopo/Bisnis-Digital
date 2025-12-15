
  # BeresinAja Service App

  This is a code bundle for BeresinAja Service App. The original project is available at https://www.figma.com/design/ykfJnpqbYvSgFQ5eDhcGKM/BeresinAja-Service-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Supabase Backend Setup

  1. Create a Supabase project at https://app.supabase.com and copy the `API URL` and `anon/public` key.
  2. Add the two environment variables to Vercel or locally in `.env.local` (do not commit `.env.local`):

  ```
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

  3. Run migrations and seed data locally using the Supabase CLI or psql:

  ```
  -- using supabase CLI (recommended)
  supabase link --project-ref <your-ref>
  supabase db reset --yes
  psql $DATABASE_URL -f supabase/migrations/init.sql
  psql $DATABASE_URL -f supabase/migrations/seed.sql

  -- or manually import SQL files in the SQL editor on Supabase dashboard
  ```

  4. Deploy your app to Vercel and set the same env vars in the project settings. The shop dashboard listens to realtime inserts on the `orders` table.

  Note on Row Level Security (RLS):

  - If you enable RLS on the `orders` table, make sure to add policies that allow inserts and selects for the clients you expect (for example, allow `INSERT` for authenticated users or use Edge Functions with the service role key to perform inserts). For quick testing you can keep RLS disabled or add permissive policies via the Supabase SQL editor.

## Edge Functions (secure server-side actions)

This project includes two Supabase Edge Functions in `supabase/functions/`:

- `create_order` — securely inserts an order using the service role key.
- `update_order_status` — securely updates an order's status.

To deploy them with the Supabase CLI:

```
supabase link --project-ref <your-ref>
supabase functions deploy create_order --project-ref <your-ref>
supabase functions deploy update_order_status --project-ref <your-ref>
```

After deployment, the frontend calls these functions via `supabase.functions.invoke(...)` so the service role key is never exposed to clients.

  