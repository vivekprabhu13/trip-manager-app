import { Timestamp } from "firebase/firestore";

export interface Trip {
    id: string;
    userId: string;
    name: string;
    dates: string; // Keep as string for now for simplicity, or use Start/End timestamps
    coverImageUrl?: string;
    status: 'Planning' | 'Confirmed' | 'Completed';
    createdAt: Timestamp;
}

export interface ItineraryItem {
    id: string;
    tripId: string;
    parentId: string | null;
    title: string;
    description?: string;
    startTime?: Timestamp;
    endTime?: Timestamp;
    location?: string;
    type: 'activity' | 'flight' | 'lodging' | 'note' | 'none';
    status?: 'confirmed' | 'pending' | 'wishlist' | 'none';
    priority?: 'must-see' | 'optional' | 'none';
    duration?: string; // e.g. "15m walk"
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'none';
    attachments?: {
        name: string;
        url: string;
        type: 'image' | 'file';
    }[];
}
