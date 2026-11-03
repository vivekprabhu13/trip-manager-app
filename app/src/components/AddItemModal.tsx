"use client";

import { X, Link as LinkIcon, Type, FileText, Trash2, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ItineraryItem } from "@/types";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<ItineraryItem, 'id'>) => void;
    tripId: string;
    parentId?: string | null;
    itemToEdit?: ItineraryItem | null;
}

export function AddItemModal({ isOpen, onClose, onSave, tripId, parentId = null, itemToEdit = null }: AddItemModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState<ItineraryItem['type']>('activity');
    const [status, setStatus] = useState<ItineraryItem['status']>('none');
    const [priority, setPriority] = useState<ItineraryItem['priority']>('none');
    const [weather, setWeather] = useState<ItineraryItem['weather']>('none');
    const [duration, setDuration] = useState("");
    const [attachments, setAttachments] = useState<{ name: string, url: string, type: 'file' }[]>([]);

    useEffect(() => {
        if (itemToEdit) {
            setTitle(itemToEdit.title || "");
            setDescription(itemToEdit.description || "");
            setLocation(itemToEdit.location || "");
            setType(itemToEdit.type || 'activity');
            setStatus(itemToEdit.status || 'none');
            setPriority(itemToEdit.priority || 'none');
            setWeather(itemToEdit.weather || 'none');
            setDuration(itemToEdit.duration || "");

            setAttachments(itemToEdit.attachments?.map(a => ({ ...a, type: 'file' as const })) || []);
        } else {
            // Reset for new item
            setTitle("");
            setDescription("");
            setLocation("");
            setType('activity');
            setStatus('none');
            setPriority('none');
            setWeather('none');
            setDuration("");
            setAttachments([]);
        }
    }, [itemToEdit, isOpen]);

    if (!isOpen) return null;

    const addAttachment = () => {
        setAttachments([...attachments, { name: "", url: "", type: 'file' }]);
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const updateAttachment = (index: number, field: 'name' | 'url', value: string) => {
        const newAttachments = [...attachments];
        newAttachments[index] = { ...newAttachments[index], [field]: value };
        setAttachments(newAttachments);
    };

    const handleSubmit = () => {
        // Filter out empty attachments
        const validAttachments = attachments.filter(a => a.url.trim() !== "");

        onSave({
            tripId,
            parentId: itemToEdit?.parentId || parentId,
            title,
            description,
            location,
            type,
            status,
            priority,
            weather,
            duration,
            attachments: validAttachments
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-xl">
            <div className="glass w-full max-w-[480px] rounded-[48px] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-500 shadow-2xl border-white/10">
                <div className="px-10 pt-12 pb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-none text-gradient mb-2">
                            {itemToEdit ? 'Refine Logic' : 'New Protocol'}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                            Itinerary Configuration
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-10 py-6 overflow-y-auto space-y-8 no-scrollbar">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Objective Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                            placeholder="e.g. Flight to Neo Tokyo"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Classification</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value as any)}
                                className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="none" className="bg-midnight">Unspecified</option>
                                <option value="activity" className="bg-midnight">Activity</option>
                                <option value="flight" className="bg-midnight">Flight</option>
                                <option value="lodging" className="bg-midnight">Lodging</option>
                                <option value="note" className="bg-midnight">Note</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Geolocation</label>
                            <input
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                                placeholder="Coordinates"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Status Phase</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as any)}
                                className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="none" className="bg-midnight">None</option>
                                <option value="confirmed" className="bg-midnight">Confirmed</option>
                                <option value="pending" className="bg-midnight">Pending</option>
                                <option value="wishlist" className="bg-midnight">Wishlist</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Priority Level</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value as any)}
                                className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="none" className="bg-midnight">Standard</option>
                                <option value="must-see" className="bg-midnight">Critical</option>
                                <option value="optional" className="bg-midnight">Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Atmosphere</label>
                            <select
                                value={weather}
                                onChange={e => setWeather(e.target.value as any)}
                                className="w-full h-14 px-5 rounded-2xl bg-white/5 border border-white/5 text-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="none" className="bg-midnight">None</option>
                                <option value="sunny" className="bg-midnight">Sunny ☀️</option>
                                <option value="cloudy" className="bg-midnight">Cloudy ☁️</option>
                                <option value="rainy" className="bg-midnight">Rainy 🌧️</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Time / Delta</label>
                            <input
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                                placeholder="e.g. 15m walk"
                            />
                        </div>
                    </div>

                    <div className="space-y-5 pt-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Resource Overlays</label>
                            <button
                                onClick={addAttachment}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all"
                            >
                                <PlusCircle className="w-4 h-4" /> Add Link
                            </button>
                        </div>

                        {attachments.length === 0 && (
                            <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[32px]">
                              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">No dependencies attached</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {attachments.map((at, idx) => (
                                <div key={idx} className="p-4 rounded-[28px] bg-white/5 border border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="relative flex-1">
                                            <input
                                                value={at.url}
                                                onChange={e => updateAttachment(idx, 'url', e.target.value)}
                                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-midnight/40 border-none outline-none text-xs text-white focus:ring-1 focus:ring-primary placeholder:text-slate-700"
                                                placeholder="https://..."
                                            />
                                            <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(idx)}
                                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        value={at.name}
                                        onChange={e => updateAttachment(idx, 'name', e.target.value)}
                                        className="w-full h-10 px-4 rounded-xl bg-midnight/40 border-none outline-none text-[10px] font-black text-white uppercase tracking-wider placeholder:text-slate-700"
                                        placeholder="Aliased Resource"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pb-8">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Field Intelligence</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full h-32 p-6 rounded-[32px] bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300 resize-none"
                            placeholder="Detailed analysis..."
                        />
                    </div>
                </div>

                <div className="px-10 py-8 glass-light flex gap-4">
                    <button 
                      onClick={onClose} 
                      className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all underline-offset-8 decoration-primary hover:underline"
                    >
                      Abort
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!title}
                        className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 disabled:opacity-30 transition-all hover:-translate-y-1 active:scale-95 group overflow-hidden relative"
                    >
                        <span className="relative z-10">Confirm Protocol</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>
    );

}
