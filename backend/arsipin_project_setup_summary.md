# Arsipin Fullstack Project Setup Summary

## Project Overview

Project name: **Arsipin**

Tech stack:

- Frontend: Next.js + Tailwind CSS + TypeScript
- Backend: Express.js + TypeScript
- Database: Neon PostgreSQL
- ORM: Prisma
- Runtime/Package Manager: Bun

Project architecture:

```txt
arsipin-fullstack/
├── frontend/
└── backend/
```

---

# Backend Setup

## 1. Initialize Backend

Command used:

```bash
bun init -y
```

Generated files:

- `.gitignore`
- `index.ts`
- `tsconfig.json`
- `README.md`

Notes:

- `tsconfig.json` already exists automatically from Bun.
- No need to run `bunx tsc --init` again.

---

## 2. Install Backend Dependencies

### Main Dependencies

```bash
bun add express cors dotenv bcrypt jsonwebtoken @prisma/client
```

### Development Dependencies

```bash
bun add -d typescript tsx prisma @types/express @types/cors @types/bcrypt @types/jsonwebtoken
```

---

## 3. Initialize Prisma

Command:

```bash
bunx prisma init
```

Generated:

```txt
prisma/
  schema.prisma
prisma.config.ts
.env
```

---

# Neon Database Setup

## Create Neon Project

Platform:

- Neon PostgreSQL

Recommended project name:

```txt
arsipin-db
```

After project creation, Neon provides:

- Database URL
- Username
- Password
- Host
- Connection string

---

# Environment Variables

File:

```txt
backend/.env
```

Contents:

```env
DATABASE_URL="postgresql://username:password@host/neondb?sslmode=require"
JWT_SECRET="your_random_secret"
PORT=5000
```

Optional JWT secret generator:

```bash
openssl rand -base64 32
```

---

# Prisma Configuration

## prisma/schema.prisma

Because Prisma v7 no longer supports datasource URL inside schema files, the datasource only contains provider.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String     @id @default(cuid())
  name      String
  email     String     @unique
  password  String
  documents Document[]
  createdAt DateTime   @default(now())
}

model Document {
  id          String   @id @default(cuid())
  title       String
  description String?
  expiredDate DateTime
  createdAt   DateTime @default(now())

  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## prisma.config.ts

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

---

# Run Migration

Command:

```bash
bunx prisma migrate dev --name init
```

Result:

- Tables created successfully in Neon PostgreSQL.
- Prisma Client generated.

---

# Backend API Initial Setup

## index.ts

```ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Arsipin API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

# package.json Scripts

Recommended scripts:

```json
{
  "scripts": {
    "dev": "bun --watch index.ts",
    "start": "bun index.ts",
    "prisma:generate": "bunx prisma generate",
    "prisma:migrate": "bunx prisma migrate dev",
    "prisma:studio": "bunx prisma studio"
  }
}
```

---

# Frontend Setup

## Create Next.js Project

Command:

```bash
bun create next-app
```

Configuration used:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Import alias: @/*
```

Installed:

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- ESLint

---

# Project MVP Features

## Authentication

- Register
- Login
- JWT Authentication
- Protected Routes

## Document Management

- Create document
- Read document
- Update document
- Delete document
- Search documents
- Filter documents

## Expiry Tracking

- Active
- Expiring Soon
- Expired

## Dashboard

- Total documents
- Active documents
- Expiring soon
- Expired documents

---

# Recommended Next Steps

## Backend

1. Setup Prisma Client singleton
2. Create auth routes
3. Implement register/login
4. JWT middleware
5. Document CRUD API
6. Expiry status calculation

## Frontend

1. Setup Tailwind layout
2. Login/Register pages
3. Dashboard UI
4. Document table
5. API integration
6. Protected routes with token storage

---

# Important Notes

## Common Mistakes Encountered

### Typo Package Names

Wrong:

```bash
jsobwebtoken
```

Correct:

```bash
jsonwebtoken
```

Wrong:

```bash
@types/core
```

Correct:

```bash
@types/cors
```

---

## Prisma v7 Change

Old Prisma versions:

```prisma
url = env("DATABASE_URL")
```

Prisma v7:

- Connection URL moved into `prisma.config.ts`
- `schema.prisma` only contains provider

---

# Current Progress Status

Completed:

- Backend initialized
- Frontend initialized
- Bun configured
- Neon database connected
- Prisma configured
- Migration successful
- Initial API setup completed

Next milestone:

- Authentication system implementation
- Full CRUD document system
- Frontend dashboard integration
