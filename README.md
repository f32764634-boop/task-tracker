# Task → Branch → PR Tracker

A simple, fast tool to track your tasks, branches, and pull requests in one place.

## Tech Stack

- **Next.js 14+** (App Router)
- **Tailwind CSS** + shadcn UI
- **Supabase** (PostgreSQL database)
- **TypeScript**

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API**
3. Copy your **Project URL** and **service_role key** (not the anon key!)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** Never commit `.env.local` to git. The service role key has full database access.

### 4. Create Database Table

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-migration.sql`
4. Click **Run** to execute the migration

This will create the `tasks` table with all necessary columns and indexes.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The `tasks` table has the following structure:

- `id` - UUID (primary key)
- `title` - Text (required)
- `createdBranch` - Text (required)
- `taskBranch` - Text (required)
- `prLink` - Text (optional)
- `serverType` - Text (required, either 'backend' or 'frontend')
- `serverName` - Text (required, e.g., 'dev', 'qa', 'prod')
- `createdAt` - Timestamp (auto-generated)

## Features

- ✅ Add new tasks with branch and PR information
- ✅ View all tasks in a clean table
- ✅ View and edit task details
- ✅ Copy branch names quickly
- ✅ Open PR links directly
- ✅ Filter by server type and name
- 🔜 Notes/history tracking
- 🔜 PR commits extraction
- 🔜 Cherry-pick helper

## Project Structure

```
app/
  ├── actions/          # Server actions (database operations)
  ├── components/       # React components
  ├── task/[id]/        # Task detail page
  └── page.tsx          # Main task list page

lib/
  └── supabase.ts       # Supabase client (server-side only)

types/
  └── task.ts           # TypeScript types

supabase-migration.sql  # Database schema
```

## Security Notes

- The service role key is **only** used in server actions/API routes
- Never expose the service role key to the client
- All database operations go through Next.js server actions
- No authentication required (personal tool)

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically use the environment variables you configure in Vercel.
