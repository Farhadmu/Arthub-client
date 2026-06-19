# ArtHub Client - Online Art Marketplace

## Overview
Frontend for ArtHub - A digital platform connecting art lovers with talented artists. Built with Next.js 14, Tailwind CSS, and modern React patterns.

## Live Demo
[Your Vercel URL]

## Features

### Pages
- **Home** - Hero carousel, featured artworks, top artists, categories
- **Browse Artworks** - Search, filter, sort, pagination
- **Artwork Details** - Full artwork info, purchase, comments
- **Login/Register** - Email/password and Google OAuth
- **User Dashboard** - Purchase history, subscriptions, profile
- **Artist Dashboard** - Manage artworks, sales history
- **Admin Dashboard** - User management, analytics, transactions

### Key Features
- Role-based authentication (User, Artist, Admin)
- Dark mode toggle with persistent state
- Responsive design (mobile, tablet, desktop)
- Advanced search and filtering
- Pagination support
- Image upload via imgBB
- Stripe payment integration
- Real-time comments system
- Skeleton loaders
- Framer Motion animations
- Error boundaries
- Toast notifications

## Tech Stack
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Swiper** - Modern touch slider
- **React Hot Toast** - Toast notifications
- **Next Themes** - Dark mode support
- **React Icons** - Icon library
- **Axios** - HTTP client

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## Project Structure

```
app/
├── artworks/
│   ├── [id]/
│   │   └── page.js          # Artwork details
│   └── page.js              # Browse artworks
├── dashboard/
│   ├── admin/page.js        # Admin dashboard
│   ├── artist/page.js       # Artist dashboard
│   └── user/page.js         # User dashboard
├── login/page.js            # Login page
├── register/page.js         # Register page
├── layout.js                # Root layout
├── page.js                  # Home page
├── providers.js             # Context providers
└── globals.css              # Global styles

components/
├── Navbar.js                # Navigation bar
├── Footer.js                # Footer
├── ArtworkCard.js           # Artwork card component
└── Loading.js               # Loading states

context/
└── AuthContext.js           # Authentication context

lib/
└── axios.js                 # Axios instance
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your live backend URL
   - `NEXT_PUBLIC_IMGBB_API_KEY` = your imgBB API key
5. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Authentication Flow

1. User registers/logs in
2. JWT token stored in localStorage
3. Token sent with every API request
4. Role-based redirects after login
5. Protected routes check auth state

## Payment Flow

1. User clicks "Buy Now"
2. Backend creates Stripe checkout session
3. User redirected to Stripe
4. On success, webhook updates database
5. User redirected back to dashboard

## License
MIT
