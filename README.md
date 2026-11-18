# Daily Focus

Built with Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui.

## Getting started

```bash
npm install
cp .env.local.sample .env.local
```

Fill in `.env.local` with your Supabase connection details:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
DAILY_FOCUS_LOGIN_EMAIL=your_supabase_auth_account_email
```

Use the URL and publishable key for the same Supabase environment. For local development, start Supabase from the separate `labs` repository and use its local connection values. For hosted Supabase, use your project's URL and publishable key.

`DAILY_FOCUS_LOGIN_EMAIL` identifies an existing Supabase Auth account in that environment. The login form asks for that account's password; the email stays on the server. Local and hosted Auth accounts are separate.

Keep real credentials in `.env.local`, which is ignored by Git. Never use a secret or service-role key in these public environment variables. Database migrations and seed data belong in `labs`.

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in. Restart the development server after changing `.env.local`.

## UI setup

This project uses shadcn preset `b4cxP0iElc`. The UI configuration is stored in `components.json`.

## Scripts

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the development server               |
| `npm run build`        | Create a production build                  |
| `npm start`            | Start the production server after building |
| `npm run lint`         | Run ESLint                                 |
| `npm run format`       | Format the project with Prettier           |
| `npm run format:check` | Check formatting                           |
