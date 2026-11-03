"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    Timestamp,
    doc,
    deleteDoc,
    getDocs,
    writeBatch,
    updateDoc,
    QuerySnapshot,
    DocumentData,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Trip } from "@/types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function useTrips() {
    const { user } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setTrips([]);
            setLoading(false);
            return;
        }

        const tripsRef = collection(db, "trips");
        const q = query(
            tripsRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tripsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Trip[];
            setTrips(tripsData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching trips:", err);
            // Handle index creation error gracefully
            if (err.code === 'failed-precondition') {
                setError("Firestore index required. Please check console link.");
            } else {
                setError(err.message);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const createTrip = async (name: string, dates: string, imageFile: File | null, imageUrl?: string) => {
        if (!user) throw new Error("User not authenticated");

        let coverImageUrl = imageUrl || null;

        if (imageFile && !coverImageUrl) {
            try {
                const storageRef = ref(storage, `covers/${user.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                coverImageUrl = await getDownloadURL(snapshot.ref);
            } catch (err: any) {
                console.warn("Storage not enabled or failed, skipping image upload:", err.message);
            }
        }

        await addDoc(collection(db, "trips"), {
            userId: user.uid,
            name,
            dates,
            coverImageUrl,
            status: 'Planning',
            createdAt: serverTimestamp()
        });
    };

    const deleteTrip = async (tripId: string) => {
        if (!user) throw new Error("User not authenticated");

        const batch = writeBatch(db);

        // 1. Find all itinerary items for this trip
        const itemsRef = collection(db, "itineraryItems");
        const q = query(itemsRef, where("tripId", "==", tripId));
        const itemsSnapshot = await getDocs(q);

        // 2. Add each item to the batch for deletion
        itemsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // 3. Add the trip itself to the batch
        const tripRef = doc(db, "trips", tripId);
        batch.delete(tripRef);

        // 4. Commit the batch
        await batch.commit();
    };

    const updateTrip = async (tripId: string, name: string, dates: string, imageFile: File | null, imageUrl?: string) => {
        if (!user) throw new Error("User not authenticated");

        let coverImageUrl = imageUrl || null;

        if (imageFile) {
            try {
                const storageRef = ref(storage, `covers/${user.uid}/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                coverImageUrl = await getDownloadURL(snapshot.ref);
            } catch (err: any) {
                console.warn("Storage upload failed, using provided URL if any:", err.message);
            }
        }

        const tripRef = doc(db, "trips", tripId);
        await updateDoc(tripRef, {
            name,
            dates,
            coverImageUrl,
            updatedAt: serverTimestamp()
        });
    };

    return { trips, loading, error, createTrip, updateTrip, deleteTrip };
}
