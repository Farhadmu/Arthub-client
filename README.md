<div align="center">

# 🎨 ArtHub — Online Art Marketplace

**A full-stack digital platform connecting art lovers with talented artists**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe)](https://stripe.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com/)

[Live Site](https://arthub-client-olive.vercel.app) · [Backend Repo](https://github.com/Farhadmu/Arthub-server) · [Report Issue](https://github.com/Farhadmu/Arthub-client/issues)

</div>

---

## 📖 About The Project

ArtHub is a digital platform that connects art lovers, collectors, and buyers with talented artists. The platform allows users to browse, discover, and purchase original artworks. Artists can upload and manage their creations, while an admin oversees the entire system.

Traditional art buying is often limited to galleries or physical exhibitions. ArtHub democratizes access to art, enables emerging artists to reach global audiences, and provides a secure, streamlined purchase experience — built on the MERN-style stack (MongoDB, Express, Next.js/React, Node.js) with role-based access, Stripe payment integration, and interactive features like comments and analytics.


---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [API Overview](#-api-overview-backend)
- [Links](#-links)

---

## ✨ Key Features

### 🔐 Authentication & Roles
- Email/password and Google OAuth login & registration
- JWT-based sessions (7-day expiry)
- Three roles: **User**, **Artist**, **Admin** — each with a dedicated dashboard

### 🏛️ Luxury & Next-Gen Experience Features (v2.1 - v2.2)
- **🖼️ View on Your Wall (3D / AR Preview)**: Interactive room simulation with realistic wall textures (Modern Minimalist Living Room, Industrial Concrete Loft, Classic White Cube Gallery), custom luxury frames (Raw Oak, Gold Leaf Rococo, Walnut Float, Obsidian Minimalist), live paint color picker, and 1:1 human silhouette scale reference.
- **✨ Interactive Wall Showcase (Home Page)**: Live in-page frame and wall paint simulation allowing visitors to customize lighting and frames on the home page.
- **🌟 Masterwork of the Week (Curator's Spotlight)**: Chief curatorial spotlight highlighting the top weekly piece with instant Audio Guide playback and 3D Holographic Seal.
- **⚡ Live Art Auction Arena (Home Spotlight)**: Active real-time countdown timer, current bid ticker, and quick bidding trigger integrated directly into the home flow.
- **🎯 Art Matchmaker Teaser & Interactive Discovery**: Stacked-card aesthetic reaction mode accessible via 1 click from home.
- **🎨 Quick Interior Palette Bar**: 6 curated luxury wall swatches (Tuscan Ochre, Royal Azure, Emerald Forest, etc.) for 1-click aesthetic matching.
- **🏆 Verified Collector Testimonials**: Real-time quotes from international patrons, gallerists, and architectural directors.
- **📜 Digital Certificate of Authenticity (COA)**: Cryptographically secured certificate with unique SHA-256 verification hash, interactive 3D holographic foil seal reacting to mouse physics, QR code linking to public verification route (`/verify/[hash]`), and print-ready high-resolution export.
- **🎧 AI Museum Audio Guide**: Curated curatorial narratives synthesized using Web Speech API, synced real-time canvas waveform visualizer, playback rate controls, and expandable transcript drawer.
- **🎨 Interior Palette Matcher**: Explore artworks matching interior design hex codes using an interactive HSL color wheel and delta-E color distance sorting.

### 🖼️ Artwork Discovery
- Hero banner carousel, Featured Artworks, Top Artists, Category grid
- Live auction ticker banner announcing current competitive lots
- Browse page with **search**, **category/price filters**, **sorting**, and **pagination**
- Detailed artwork page with high-res image, description, price, and artist profile link

### 💳 Payments (Stripe)
- One-time artwork purchases via Stripe Checkout
- Subscription tiers — **Free** (3 purchases), **Pro** (9 purchases, $9.99/mo), **Premium** (unlimited, $19.99/mo)
- Automatic "Sold" badge once an artwork is purchased

### 💬 Engagement
- Purchase-gated comment system (edit/delete own comments)
- Wishlist — save, remove, or buy artworks directly
- Dummy email notifications (simulated, logged on the backend) after purchase/subscription

### 📊 Dashboards
- **User:** Purchase history, bought artworks gallery, subscription overview, profile management
- **Artist:** Manage artworks (CRUD), add/edit forms with imgBB image upload, sales history, profile management
- **Admin:** Manage users & roles, manage all artworks, view all transactions, analytics cards, sales charts (bar + pie)

### 🎨 UX Details
- Fully responsive (mobile, tablet, desktop)
- Dark mode toggle (persisted)
- Skeleton loaders & global loading spinner
- Custom 404 page and error boundary fallback
- Toast notifications for all API actions

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| HTTP Client | [Axios](https://axios-http.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |
| Icons | [react-icons](https://react-icons.github.io/react-icons/) |
| Loaders | [react-loader-spinner](https://www.npmjs.com/package/react-loader-spinner) |
| Carousel | [Swiper](https://swiperjs.com/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Image Hosting | [imgBB API](https://api.imgbb.com/) |
| Payments | [Stripe Checkout](https://stripe.com/payments/checkout) |
| Auth | JWT + Google OAuth |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
arthub-client/
├── app/
│   ├── about/                # About page
│   ├── artists/[id]/         # Public artist profile page
│   ├── artworks/             # Browse + artwork details ([id])
│   ├── auctions/             # Live Art Auction hub page
│   ├── contact/              # Contact form page
│   ├── dashboard/
│   │   ├── admin/            # Admin dashboard
│   │   ├── artist/           # Artist dashboard + edit/[id]
│   │   └── user/             # User dashboard (with COA downloads)
│   ├── login/ register/      # Auth pages
│   ├── privacy/ terms/       # Legal pages
│   ├── verify/[hash]/        # Public Certificate verification page
│   └── wishlist/             # Wishlist page
├── components/                # RoomPreviewModal, HolographicSeal, AudioGuide, etc.
├── context/                   # AuthContext (JWT/session state)
└── lib/                       # Axios instance
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Farhadmu/Arthub-client.git
cd Arthub-client

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Overview (Backend)

This frontend consumes a separate Express + MongoDB API. See the [backend repo](https://github.com/Farhadmu/Arthub-server) for full route documentation.

| Route Prefix | Purpose |
|---|---|
| `/api/auth` | Register, login, Google login, profile, password |
| `/api/artworks` | Browse, search, filter, CRUD, artist-specific listing |
| `/api/transactions` | Stripe checkout, webhook, purchase/sales history, analytics |
| `/api/comments` | Purchase-gated comment CRUD |
| `/api/users` | Admin user management |
| `/api/wishlist` | Add/remove/list wishlist items |

---

## 🔗 Links

- **Live Site:** [arthub-client-olive.vercel.app](https://arthub-client-olive.vercel.app)
- **Frontend Repo:** [github.com/Farhadmu/Arthub-client](https://github.com/Farhadmu/Arthub-client)
- **Backend Repo:** [github.com/Farhadmu/Arthub-server](https://github.com/Farhadmu/Arthub-server)

---

<div align="center">

Built with ❤️ for art lovers and creators everywhere.

</div>
