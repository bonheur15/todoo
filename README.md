# Todoo — A Cozy Space for Your Tasks 📝

## ✨ Key Features

**Todoo** isn't just another to-do list. It's a mindful productivity tool built with a focus on simplicity and a calming user experience.

- **Cozy & Inviting UI**: A warm, soft-toned interface with gentle animations that make task management feel less like a chore.
- **Google Authentication**: Secure and easy sign-in with your Google account, powered by [Auth.js](https://authjs.dev/).
- **Organize with Lists**: Group your tasks into separate lists for work, home, or your next big idea to keep your mind tidy.
- **Fully Responsive**: A seamless experience whether you're on your desktop, tablet, or phone.
- **Optimized for SEO**: Built with Next.js 14 and best practices for discoverability.
- **Persisted Data**: Your lists and todos are securely stored in a MySQL database, managed with Drizzle ORM.

---

## 🛠 Tech Stack

This project is built with a modern, type-safe, and performant stack:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Authentication**: [Auth.js (NextAuth.js v5)](https://authjs.dev/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: MySQL (PlanetScale or other providers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Fonts**: Lora & Nunito Sans from [Google Fonts](https://fonts.google.com/)

---

## 🚀 Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

### 1. Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18.17 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Bun](https://bun.sh/) (optional, for faster installs and dev server)
- A MySQL database (e.g., [just find it](just find it/))

### 2. Clone the Repository

```bash
git clone https://github.com/bonheur15/todoo.git
cd todoo
```

### 3. Install Dependencies

```bash
bun install
# or
npm install
# or
yarn install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following:

```env
# Database URL from your provider
DATABASE_URL="mysql://user:password@host/database?sslaccept=strict"

# Auth.js Configuration
AUTH_SECRET="your-super-secret-auth-secret"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

You can generate `AUTH_SECRET` using:

```bash
openssl rand -base64 32
# or
npx auth secret
# or
bunx auth secret
```

Get your Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

### 5. Push the Database Schema

```bash
npx drizzle-kit push
# or
bun run db:push
```

This will create the necessary tables (`users`, `todo_lists`, `todos`, etc.) in your database.

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📁 Project Structure

```
.
├── app/
│   ├── (auth)/                    # Login page/Register Page
│   ├── (dashboard)/dashboard/     # Main dashboard
│   ├── api/auth/[...nextauth]/    # NextAuth.js API route
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Homepage
├── components/                    # Shared React components
├── db/                            # Drizzle ORM config and schema
│   └── schema.ts
├── lib/                           # Helper libraries
├── public/                        # Static assets
└── ...
```

---

## 📄 License

No license yet
