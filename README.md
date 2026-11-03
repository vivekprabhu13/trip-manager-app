# ✈️ Trip Manager App

> A modern, mobile-first hierarchical trip planning and travel itinerary application built with Next.js, React 19, Tailwind CSS, and Firebase.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)

---

## 🌟 Overview

The **Trip Manager App** empowers travelers to organize their journeys with ease. Move beyond rigid, flat itineraries with a flexible recursive hierarchy (Days &rarr; Locations &rarr; Activities &rarr; Sub-items), visual timelines, document attachments, and real-time synchronization backed by Firebase.

## 🎬 Application Demo

### Video Walkthrough

You can view or stream the full demo video directly using below link :

<p align="center">
  <a href="https://drive.google.com/file/d/1H9uFMAreQpz4tvNbXZ9WpfeDHAJDdlNB/view?usp=drive_link" target="_blank">
    <img src="https://img.shields.io/badge/▶%20Watch%20Demo%20Video-Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white" alt="Watch Demo Video" />
  </a>
</p>

---

## ✨ Features

- **Nested Hierarchical Itineraries**: Group itinerary items recursively (e.g. Day &rarr; Morning/Afternoon &rarr; Activity &rarr; Booking notes).
- **Interactive Visual Timeline**: Expand and collapse itinerary branches with state saved locally in session storage.
- **Rich Activity Indicators**:
  - **Status Chips**: Track whether an item is *Confirmed*, *Pending*, or on the *Wishlist*.
  - **Priority Badges**: Distinguish between *Must See* priorities and *Optional* stops.
  - **Travel Durations**: Highlight estimated transit times (e.g., walking, driving) between activities.
  - **Weather & Activity Icons**: Visual cues for outdoor vs. indoor conditions.
- **Ticket & Link Attachments**: Link PDF tickets, booking vouchers, and external reservation URLs directly to specific itinerary entries.
- **Secure Authentication**: Built-in authentication (Email/Password & Google Sign-In) powered by Firebase Auth.
- **Real-Time Data Persistence**: Seamless data storage and retrieval using Google Cloud Firestore.
- **Glassmorphic Mobile-First UI**: Styled with modern translucent glassmorphism, responsive cards, and crisp micro-interactions using Lucide icons.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Frontend**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Language**: TypeScript

---

## 📁 Repository Structure

```text
trip-manager-app/
├── app/                      # Next.js web application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (Home, Login, Trips)
│   │   ├── components/       # Reusable UI components (TripCard, Modals, ProfileMenu)
│   │   ├── context/          # Authentication & Application state contexts
│   │   ├── hooks/            # Custom hooks (useTrips, useItinerary)
│   │   ├── lib/              # Firebase initialization & utilities
│   │   └── types/            # TypeScript type definitions
│   ├── public/               # Static assets
│   ├── package.json          # App dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
├── docs/                     # Sample travel documents and sample PDF tickets
├── DESIGN.md                 # Design system specifications
├── SITE.md                   # Application architecture and product roadmap
├── .gitignore                # Root git ignore rules
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or later recommended; tested on v22+)
- `npm` (v9+) or `yarn` / `pnpm`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vivekprabhu13/trip-manager-app.git
   cd trip-manager-app
   ```

2. Navigate to the application directory and install dependencies:
   ```bash
   cd app
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## ⚙️ Configuration & Firebase Setup

Firebase configuration is managed in [`app/src/lib/firebase.ts`](app/src/lib/firebase.ts). To use your own Firebase project:

1. Create a project at the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google & Email/Password providers).
3. Enable **Cloud Firestore** and deploy the rules defined in `app/firestore.rules`.
4. Update `firebaseConfig` in `app/src/lib/firebase.ts` with your credentials:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

---

## 📜 Available Scripts

Run these scripts from within the `app/` directory:

- `npm run dev` - Starts the Next.js development server with Turbopack at `http://localhost:3000`.
- `npm run build` - Creates an optimized production build in the `dist` directory.
- `npm run start` - Runs the compiled production server.
- `npm run lint` - Runs ESLint to check for code issues.

---

## 📄 License

This project is licensed under the MIT License.

