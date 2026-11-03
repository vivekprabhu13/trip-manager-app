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
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ItineraryItem } from "@/types";

export function useItinerary(tripId: string) {
    const [items, setItems] = useState<ItineraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tripId) return;

        const itemsRef = collection(db, "itineraryItems");
        const q = query(
            itemsRef,
            where("tripId", "==", tripId),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ItineraryItem[];
            setItems(itemsData);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error fetching itinerary:", err);
            if (err.code === 'failed-precondition') {
                setError("Firestore index required. Please check console link.");
            } else {
                setError(err.message);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tripId]);

    const addItem = async (itemData: Omit<ItineraryItem, 'id'>) => {
        await addDoc(collection(db, "itineraryItems"), {
            ...itemData,
            createdAt: serverTimestamp()
        });
    };

    const updateItem = async (itemId: string, updates: Partial<ItineraryItem>) => {
        const itemRef = doc(db, "itineraryItems", itemId);
        await updateDoc(itemRef, updates);
    };

    const deleteItem = async (itemId: string) => {
        const itemRef = doc(db, "itineraryItems", itemId);
        await deleteDoc(itemRef);
    };

    return { items, loading, error, addItem, updateItem, deleteItem };
}
