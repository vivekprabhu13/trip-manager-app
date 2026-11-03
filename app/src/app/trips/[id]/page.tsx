"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useItinerary } from "@/hooks/useItinerary";
import { useAuth } from "@/context/AuthContext";
import { useTrips } from "@/hooks/useTrips";
import { ChevronLeft, Plus, MapPin, Clock, ExternalLink, Trash2, Sun, Cloud, CloudRain, Navigation, Star, Edit2, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { Trip, ItineraryItem } from "@/types";
import { AddItemModal } from "@/components/AddItemModal";
import { CreateTripModal } from "@/components/CreateTripModal";
import { ProfileMenu } from "@/components/ProfileMenu";
import { formatTripDates } from "@/lib/utils";

export default function TripDetails() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { user } = useAuth();
    const { items, loading: itineraryLoading, addItem, updateItem, deleteItem, error } = useItinerary(id);
    const { deleteTrip, trips, updateTrip } = useTrips();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isTripEditOpen, setIsTripEditOpen] = useState(false);
    const [activeParentId, setActiveParentId] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
    const [isSavingTrip, setIsSavingTrip] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Load expansion state on mount
    useEffect(() => {
        const saved = sessionStorage.getItem(`expanded_items_${id}`);
        if (saved) {
            try {
                setExpandedIds(new Set(JSON.parse(saved)));
            } catch (e) {
                console.error("Failed to parse expansion state", e);
            }
        }
    }, [id]);

    // Save expansion state whenever it changes
    const toggleExpand = (itemId: string) => {
        const next = new Set(expandedIds);
        if (next.has(itemId)) {
            next.delete(itemId);
        } else {
            next.add(itemId);
        }
        setExpandedIds(next);
        sessionStorage.setItem(`expanded_items_${id}`, JSON.stringify(Array.from(next)));
    };

    const currentTrip = trips.find(t => t.id === id);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this entire trip?")) {
            try {
                await deleteTrip(id);
                router.push("/");
            } catch (error) {
                console.error("Failed to delete trip", error);
                alert("Failed to delete trip");
            }
        }
    };

    const handleUpdateTrip = async (data: { name: string; dates: string; imageFile: File | null; imageUrl?: string }) => {
        setIsSavingTrip(true);
        try {
            await updateTrip(id, data.name, data.dates, data.imageFile, data.imageUrl);
            setIsTripEditOpen(false);
        } catch (error) {
            console.error("Failed to update trip", error);
            alert("Failed to update trip details");
        } finally {
            setIsSavingTrip(false);
        }
    };

    const handleSaveItem = async (data: Omit<ItineraryItem, 'id'>) => {
        try {
            if (editingItem) {
                await updateItem(editingItem.id, data);
                setEditingItem(null);
            } else {
                await addItem(data);
            }
        } catch (error) {
            console.error("Failed to save item", error);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (confirm("Delete this itinerary item?")) {
            try {
                await deleteItem(itemId);
            } catch (error) {
                console.error("Failed to delete item", error);
            }
        }
    };

    const handleEditItem = (item: ItineraryItem) => {
        setEditingItem(item);
        setIsAddOpen(true);
    };

    const openAddModal = (parentId: string | null = null) => {
        setEditingItem(null);
        setActiveParentId(parentId);
        setIsAddOpen(true);
    };

    // Recursive component to render items and their children
    const ItineraryItemRow = ({ item, level = 0 }: { item: ItineraryItem, level?: number }) => {
        const children = items.filter(i => i.parentId === item.id);
        const isExpanded = expandedIds.has(item.id);
        const hasContent = children.length > 0 || (item.attachments && item.attachments.length > 0) || !!item.description;

        return (
            <div className={`relative ${level > 0 ? 'ml-6 mt-6' : ''}`}>
                {/* Timeline Dot (only for root items) */}
                {level === 0 && (
                    <div className={`absolute -left-[30px] top-8 w-2.5 h-2.5 rounded-full border-2 border-midnight z-10 shadow-2xl shadow-primary/50 ${item.type === 'activity' ? 'bg-primary' :
                        item.type === 'flight' ? 'bg-sky-400' :
                            item.type === 'lodging' ? 'bg-indigo-400' :
                                'bg-slate-600'
                        }`} />
                )}

                <div className={`group glass rounded-[28px] p-6 transition-all duration-500 hover:shadow-primary/10 hover:border-primary/20 ${level > 0 ? 'bg-white/5' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {hasContent && (
                                    <button
                                        onClick={() => toggleExpand(item.id)}
                                        className="p-1 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-primary"
                                    >
                                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                )}
                                {item.type && item.type !== 'none' && (
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-widest border border-white/5 ${item.type === 'activity' ? 'bg-primary/10 text-primary' :
                                        item.type === 'flight' ? 'bg-sky-400/10 text-sky-400' :
                                            'bg-indigo-400/10 text-indigo-400'
                                        }`}>
                                        {item.type}
                                    </span>
                                )}

                                {item.status && item.status !== 'none' && (
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-widest border border-white/5 ${item.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400' :
                                        item.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                )}

                                {item.priority === 'must-see' && (
                                    <span className="bg-primary text-white p-1 rounded-full shadow-lg shadow-primary/20" title="Must See">
                                        <Star className="w-2.5 h-2.5 fill-white" />
                                    </span>
                                )}

                                {item.attachments && item.attachments.length > 0 && (
                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full text-[9px] font-black flex items-center gap-1 uppercase tracking-widest">
                                        <ExternalLink className="w-2.5 h-2.5" /> {item.attachments.length}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <h3 className={`font-black text-white tracking-tight leading-tight group-hover:text-primary transition-colors ${level === 0 ? 'text-xl' : 'text-lg'}`}>
                                    {item.title}
                                </h3>
                                {item.weather === 'sunny' && <Sun className="w-4 h-4 text-amber-400 animate-pulse" />}
                                {item.weather === 'cloudy' && <Cloud className="w-4 h-4 text-slate-400" />}
                                {item.weather === 'rainy' && <CloudRain className="w-4 h-4 text-sky-400" />}
                            </div>

                            {item.location && (
                                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    <span>{item.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditItem(item)}
                                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10 transition-all"
                                title="Edit Item"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Delete Item"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => openAddModal(item.id)}
                                className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10 transition-all"
                                title="Add sub-item"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {item.description && isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in duration-500">
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    {/* Attachments */}
                    {item.attachments && item.attachments.length > 0 && isExpanded && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-500">
                            {item.attachments.map((at, idx) => (
                                <a
                                    key={idx}
                                    href={at.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 hover:text-primary transition-all border border-white/5"
                                >
                                    <ExternalLink className="w-3 h-3" /> {at.name || 'Doc'}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Duration Badge / Connector */}
                {item.duration && isExpanded && (
                    <div className="my-3 ml-12 flex items-center gap-2">
                        <div className="bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Navigation className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {item.duration}
                            </span>
                        </div>
                    </div>
                )}

                {/* Sub-items */}
                {isExpanded && children.length > 0 && (
                    <div className="border-l-2 border-white/5 mt-4 ml-2 pl-2 animate-in fade-in slide-in-from-top-4 duration-500">
                        {children.map(child => (
                            <ItineraryItemRow key={child.id} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Filter root items (days) or ungrouped items
    const rootItems = items.filter(item => !item.parentId);

    if (itineraryLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-2xl shadow-primary/20"></div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Timeline...</p>
            </div>
        </div>
    );


    const { range: formattedDateRange, year: tripYear } = formatTripDates(currentTrip?.dates);

    return (
        <div className="min-h-screen max-w-md mx-auto relative pointer-events-auto">
            {/* Immersive Hero Header */}
            <div className="relative h-[400px] w-full overflow-hidden">
                {currentTrip?.coverImageUrl ? (
                    <img
                        src={currentTrip.coverImageUrl}
                        alt={currentTrip.name}
                        className="w-full h-full object-cover scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-midnight to-midnight flex items-center justify-center">
                        <span className="text-8xl drop-shadow-2xl opacity-50">✈️</span>
                    </div>
                )}

                {/* Dramatic Gradient Overlays */}
                <div className="absolute inset-0 bg-midnight/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-transparent to-transparent" />

                {/* Top Controls Overlay */}
                <div className="absolute top-12 left-8 right-8 flex items-center justify-between z-30">
                    <button
                        onClick={() => router.push("/")}
                        className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white transition-all active:scale-90 hover:bg-white/10 hover:-translate-x-1"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <ProfileMenu />
                        <button
                            onClick={() => setIsTripEditOpen(true)}
                            className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white transition-all active:scale-90 hover:bg-primary/20 hover:text-primary hover:-translate-y-1"
                            title="Edit Trip Details"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-red-400 transition-all active:scale-90 hover:bg-red-500/20 hover:text-red-500 hover:-translate-y-1"
                            title="Delete Trip"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Bottom-left Info Overlay */}
                <div className="absolute bottom-16 left-10 right-10 z-20 animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md mb-4">
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Navigation className="w-3 h-3" /> Live Blueprint
                      </p>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none text-gradient filter drop-shadow-2xl">
                        {currentTrip?.name || "Loading..."}
                    </h1>
                    <div className="mt-4 flex items-center gap-4">
                        <p className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                            <Calendar className="w-4 h-4 text-primary" />
                            {formattedDateRange}
                        </p>
                        {tripYear && (
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] border-l border-white/10 pl-4">
                                {tripYear}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative glass-light rounded-t-[56px] -mt-12 z-10 px-8 pt-16 pb-32 min-h-[600px] shadow-2xl">
                <div className="flex items-center justify-between mb-12 px-2">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 mb-2">
                            EXPEDITION LOG
                        </h2>
                        <h3 className="text-3xl font-black text-white tracking-tight">Timeline</h3>
                    </div>
                    <button
                        onClick={() => openAddModal(null)}
                        className="w-14 h-14 rounded-[20px] bg-primary text-white shadow-[0_20px_40px_-10px_rgba(30,121,255,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group overflow-hidden relative"
                        title="Add to Itinerary"
                    >
                        <Plus className="w-7 h-7 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                </div>

                {/* Itinerary Timeline */}
                <div className="pb-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Vertical Line */}
                    <div className="absolute left-[8px] top-8 bottom-24 w-[2px] bg-gradient-to-b from-primary via-white/5 to-transparent" />

                    <div className="space-y-8 relative">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] text-red-400 text-sm animate-in shake-1 duration-500">
                                <p className="font-black uppercase tracking-widest mb-1">Timeline Error</p>
                                <p className="opacity-80">{error}</p>
                            </div>
                        )}

                        {rootItems.length > 0 ? (
                            rootItems.map((item) => (
                                <ItineraryItemRow key={item.id} item={item} />
                            ))
                        ) : (
                            <div className="text-center py-24 pl-12 relative">
                                <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="w-8 h-8 text-primary shadow-2xl shadow-primary/40" />
                                </div>
                                <h4 className="text-white font-black text-xl mb-2 tracking-tight">Timeline Void</h4>
                                <p className="text-slate-500 font-medium text-sm max-w-[200px] mx-auto">
                                    Your itinerary is currently a blank canvas.
                                </p>
                                <button
                                    onClick={() => openAddModal(null)}
                                    className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:tracking-[0.2em] transition-all"
                                >
                                    + Add Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddItemModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSave={handleSaveItem}
                tripId={id}
                parentId={activeParentId}
                itemToEdit={editingItem}
            />

            <CreateTripModal
                isOpen={isTripEditOpen}
                isLoading={isSavingTrip}
                onClose={() => setIsTripEditOpen(false)}
                onCreate={handleUpdateTrip}
                itemToEdit={currentTrip}
            />
        </div>
    );

}
