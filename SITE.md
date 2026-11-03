# Trip Planner App - Site Documentation

## 1. Vision
A modern, intuitive Trip Planner application that allows users to organize their travel plans hierarchically. Users can create trips, add detailed itineraries (Days -> Locations -> Activities), and attach relevant files (tickets, images) at any level. The app features a visually stunning interface with cover images and smooth interactions.

## 2. Core Features
-   **Trip Management**: Create, edit, and delete trips with cover images.
-   **Hierarchical Itinerary**: Recursive structure for flexible planning (e.g., Trip -> Day -> Activity).
-   **Attachments**: upload and view tickets/images for any itinerary item.
-   **Data Persistence**: Firebase Firestore for data and Firebase Storage for assets.

## 3. Tech Stack
-   **Frontend**: Next.js, Tailwind CSS, Radix UI (shadcn)
-   **Backend**: Firebase (Firestore, Storage, Auth)
-   **State**: Zustand

## 4. Sitemap
- [ ] / (Home Dashboard)
- [ ] /trips/[id] (Trip Itinerary View)
- [ ] /settings (Optional)

## 5. Roadmap
- [ ] Design and implement the Home Dashboard with Trip Grid.
- [ ] Implement "Create Trip" modal with image upload.
- [ ] Build the recursive Itinerary Tree component.
- [ ] Implement detail view for itinerary items with attachment support.
- [ ] Integrate Firebase Authentication.

## 6. Creative Freedom
-   Explore using a masonry layout for the trip grid.
-   Consider a map view integration in the future.
