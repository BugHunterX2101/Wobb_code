---
title: Wobb Influencer Search
emoji: 🔍
colorFrom: pink
colorTo: purple
sdk: docker
pinned: false
---

# Wobb Influencer Search

A modern, full-stack influencer search platform built with React, TypeScript, Vite, Zustand, and Tailwind CSS. Features a stunning 3D animated background with glass-morphism UI, persistent profile saving, and cross-platform search across Instagram, YouTube, and TikTok.

## Features

- **3D Animated Background** — Floating platform orbs, hearts, sparkles, and stars using Three.js + React Three Fiber
- **Glass-morphism UI** — Frosted glass panels, gradient text, and smooth animations
- **Cross-platform Search** — Filter influencers across Instagram, YouTube, and TikTok
- **Profile Details** — View extended stats, engagement rates, and bio
- **Save Profiles** — Add/remove profiles to a persistent list (Zustand + localStorage)
- **Responsive Design** — Mobile-first, works on all screen sizes

## Live Demo

👉 https://huggingface.co/spaces/vedit2101/wobb-influencer-search

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **State:** Zustand (persisted to localStorage)
- **Styling:** Tailwind CSS v4, CSS Variables
- **3D:** @react-three/fiber, @react-three/drei, Three.js
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **Notifications:** Custom toast system

## Getting Started

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

Open http://localhost:5173

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI primitives (Button, Avatar, Badge, etc.)
│   ├── Background3D.tsx    # 3D animated background
│   ├── Layout.tsx          # Main layout with header & saved profiles
│   ├── PlatformFilter.tsx  # Platform tabs + search
│   ├── ProfileCard.tsx     # Influencer card with "Add to List"
│   ├── ProfileList.tsx     # List of profile cards
│   ├── SavedProfilesPanel.tsx # Dropdown panel for saved profiles
│   └── SearchBar.tsx
├── pages/
│   ├── SearchPage.tsx      # Main search & browse view
│   └── ProfileDetailPage.tsx # Detailed profile view
├── store/
│   └── useAppStore.ts      # Zustand store with persistence
├── utils/
│   ├── dataHelpers.ts      # Platform data loading & filtering
│   ├── formatters.ts       # Number formatting (followers, engagement)
│   └── profileLoader.ts    # Dynamic profile JSON loading
├── lib/utils.ts            # cn() classname utility
└── hooks/use-toast.ts      # Toast notification system
```

## Deployment

Built for Hugging Face Spaces (Docker SDK). The Dockerfile builds the Vite app and serves via Nginx on port 7860.