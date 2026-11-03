---
page: trip-details
---
Enhance the Trip Details Itinerary page with richer visual indicators.

**New Visual Indicator Requirements:**
1.  **Travel Time/Duration**: Show estimated time between activities (e.g., "15m walk", "1h drive") in a subtle badge or text along the timeline.
2.  **Status Badges**: Add small status chips like "Confirmed", "Pending", or "Wishlist" to items.
3.  **Weather/Environment Icons**: Include small icons representing conditions (e.g., a sun for outdoor activities, a coffee cup for food).
4.  **Priority Markers**: Visual distinction for "Must See" vs "Optional" items.

**IMPORTANT CONSTRAINTS:**
- **NO DIRECT PHOTOS**: Do not include any UI for uploading or storing photos directly in Firestore/Storage to avoid costs. Use link-based attachments only.
- **Inter Font**: Maintain the premium look using Inter.
- **Timeline Continuity**: Ensure the vertical timeline reflects these new indicators clearly.

**DESIGN SYSTEM (REQUIRED):**
- Use **Inter** font for a clean, modern look.
- Use a **light theme** with `bg-slate-50` background.
- **Card Design**: White background, subtle shadow (`shadow-sm`), rounded corners (`rounded-lg`), subtle border (`border-slate-200`).
- **Primary Actions**: Indigo-600 background, white text, hover:bg-indigo-700.
- **Typography**: dark slate (`text-slate-900`) for headings, muted slate (`text-slate-500`) for secondary text.
- **Micro-interactions**: Add `hover:scale-[1.02]` transition to cards.
- **Icons**: Use Lucide React icons (e.g., `Map`, `Plus`, `Calendar`, `Clock`, `CloudSun`, `Navigation`).
- **Layout**: Centered content in a max-width container.
