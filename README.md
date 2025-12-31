# Woodsphere 🪵

<!-- ![Woodsphere Banner](https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop) -->

> **A Premium Full-Stack E-Commerce Platform with Dynamic Content Management.**

[![Live Demo](https://woodsphere.vercel.app/)](https://woodsphere.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![MUI](https://img.shields.io/badge/MUI-v6-007FFF?style=flat-square&logo=mui)](https://mui.com/)

---

## 📖 Overview

**Woodsphere** is a modern e-commerce application developed as an MCA MiniProject (2024-2026). It goes beyond standard templates by introducing a **"HQ" (Headquarters) Dashboard**—a custom-built CMS that allows administrators to modify the website's navigation, hero banners, and category layouts in real-time without touching the code.

The project demonstrates advanced full-stack capabilities including server-side rendering, role-based security, and complex database relationships.

---

## 🚀 Key Features

### 🛍️ User Experience (Storefront)
* **Dynamic Homepage:** The hero section, promotional banners, and category grids are fully editable via the admin panel.
* **Smart Category Grid:** The homepage automatically syncs with the Header Menu, allowing admins to map cover images to navigation links.
* **Advanced Filtering:** Products can be sorted by price, popularity, and categories (Living Room, Bedroom, Office, etc.).
* **Performance:** Built with Next.js Server Components for SEO and fast load times.

### ⚙️ Admin "HQ" Dashboard
* **No-Code Control:** Administrators can upload images and change text for the site's branding directly from the UI.
* **Menu Management:** Add or remove navigation links dynamically.
* **Secure Access:** Protected by strict Role-Based Access Control (RBAC)—only `SUPER_ADMIN` users can access `/hq`.

### 🔐 Security & Backend
* **Authentication:** Secure Sign-up/Login using **NextAuth.js v5** (Credentials & Google OAuth).
* **Password Recovery:** Complete flow using **Resend API** to email secure reset tokens.
* **Data Integrity:** Uses **PostgreSQL** with **Prisma ORM** for type-safe database interactions.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon / Supabase) |
| **ORM** | Prisma |
| **UI Library** | Material UI (MUI) v6 & Tailwind CSS |
| **Authentication** | NextAuth.js (Auth.js) v5 |
| **Email Service** | Resend API |
| **Deployment** | Vercel |

---

## 📂 Project Structure

A high-level overview of the codebase organization:

```plaintext
src/
├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── (auth)/          # Authentication Routes (Login, Register, Forgot Password)
│   ├── (shop)/          # Public Storefront Routes (Home, Search, Product Details)
│   ├── hq/              # Admin Dashboard Routes (Protected)
│   └── api/             # API Routes (Auth, Webhooks)
├── components/          # Reusable UI Components
│   ├── hq/              # Admin-specific editors (HomeEditor.tsx)
│   ├── home/            # Homepage sections (Hero.tsx, CategoryGrid.tsx)
│   └── ui/              # Generic UI atoms (Buttons, Inputs, Modals)
├── lib/                 # Utilities & Configuration
│   ├── actions/         # Server Actions (Backend Logic for Settings & Auth)
│   └── prisma.ts        # Database Client Singleton
└── prisma/              # Database Schema & Migrations