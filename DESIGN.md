# Trip Planner App - Design System

## 1. Typography
-   **Font**: Inter (headings and body)
-   **Scale**:
    -   H1: `text-4xl font-bold tracking-tight` (Page Titles)
    -   H2: `text-2xl font-semibold` (Section Headers)
    -   H3: `text-xl font-medium` (Card Titles)
    -   Body: `text-base` (Standard text)
    -   Small: `text-sm text-muted-foreground` (Metadata, hints)

## 2. Color Palette
-   **Primary**: `bg-indigo-600 text-white hover:bg-indigo-700` (Main actions)
-   **Secondary**: `bg-slate-100 text-slate-900 hover:bg-slate-200` (Secondary actions)
-   **Background**: `bg-slate-50` (App background)
-   **Surface**: `bg-white` (Cards, modals)
-   **Border**: `border-slate-200`
-   **Destructive**: `text-red-600 hover:bg-red-50`

## 3. Spacing & Layout
-   **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
-   **Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` (Trip cards)
-   **Stack**: `flex flex-col gap-4` (Form fields)

## 4. Components
-   **Button**: Rounded-md, px-4 py-2, transition-colors.
-   **Card**: Rounded-lg border bg-card text-card-foreground shadow-sm.
-   **Input**: Rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring.
-   **Modal**: Fixed overlay, centered content, intricate shadow, rounded-lg.

## 6. Design System Notes for Stitch Generation
(Copy this block into every prompt)

**DESIGN SYSTEM (REQUIRED):**
- Use **Inter** font for a clean, modern look.
- Use a **light theme** with `bg-slate-50` background.
- **Card Design**: White background, subtle shadow (`shadow-sm`), rounded corners (`rounded-lg`), subtle border (`border-slate-200`).
- **Primary Actions**: Indigo-600 background, white text, hover:bg-indigo-700.
- **Typography**: dark slate (`text-slate-900`) for headings, muted slate (`text-slate-500`) for secondary text.
- **Micro-interactions**: Add `hover:scale-[1.02]` transition to cards.
- **Icons**: Use Lucide React icons (e.g., `Map`, `Plus`, `Calendar`, `Image`).
- **Layout**: Responsive grid for lists. Center content in a max-width container.
