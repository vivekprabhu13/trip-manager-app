"use client";

import { X, Calendar, Image as ImageIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Trip } from "@/types";

interface CreateTripModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onCreate: (tripData: { name: string; dates: string; imageFile: File | null; imageUrl?: string }) => void;
    itemToEdit?: Trip | null;
}

export function CreateTripModal({ isOpen, isLoading = false, onClose, onCreate, itemToEdit = null }: CreateTripModalProps) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);

    // Populate or reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setName(itemToEdit.name || "");
                setImageUrl(itemToEdit.coverImageUrl || "");
                setImageFile(null);

                // Parse dates (e.g., "2023-10-01 to 2023-10-10")
                if (itemToEdit.dates && itemToEdit.dates.includes(" to ")) {
                    const [start, end] = itemToEdit.dates.split(" to ");
                    setStartDate(start);
                    setEndDate(end);
                } else {
                    setStartDate(itemToEdit.dates || "");
                    setEndDate("");
                }
            } else {
                setName("");
                setStartDate("");
                setEndDate("");
                setImageFile(null);
                setImageUrl("");
            }
        }
    }, [isOpen, itemToEdit]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImageUrl(""); // Clear URL if file is selected
        }
    };

    const handleSubmit = () => {
        const dateRange = startDate && endDate ? `${startDate} to ${endDate}` : startDate || endDate || "";
        onCreate({ name, dates: dateRange, imageFile, imageUrl });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/60 backdrop-blur-xl">
            <div className="glass w-full max-w-[480px] rounded-[48px] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-500 shadow-2xl border-white/10">
                {/* Modal Header */}
                <div className="px-10 pt-12 pb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter leading-none text-gradient mb-2">
                            {itemToEdit ? 'Edit Vector' : 'New Journey'}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                            Expedition Parameters
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="px-10 py-6 overflow-y-auto space-y-8 no-scrollbar">
                    {/* Trip Name Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Mission Designation
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                            placeholder="e.g. Neo Tokyo Drift"
                        />
                    </div>

                    {/* Trip Dates Input */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                                Launch Date
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    ref={startInputRef}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full h-14 pl-6 pr-12 rounded-2xl bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div
                                    onClick={() => startInputRef.current?.showPicker()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Calendar className="w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                                Return Date
                            </label>
                            <div className="relative group">
                                <input
                                    type="date"
                                    ref={endInputRef}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full h-14 pl-6 pr-12 rounded-2xl bg-white/5 border border-white/5 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div
                                    onClick={() => endInputRef.current?.showPicker()}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Calendar className="w-5 h-5 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image URL Area */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                            Visual ID (Optional)
                        </label>
                        <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => {
                                setImageUrl(e.target.value);
                                setImageFile(null);
                            }}
                            className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                            placeholder="Remote Image URL"
                        />
                        <div className="flex items-center gap-4 py-2">
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">OR</span>
                            <div className="h-[1px] flex-1 bg-white/5"></div>
                        </div>
                        <div
                            className="relative"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border-2 border-dashed border-white/5 bg-white/5 px-8 py-8 hover:bg-white/10 transition-all cursor-pointer group hover:border-primary/30">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-relaxed">
                                        {imageFile ? imageFile.name : "Local Uplink"}
                                    </p>
                                    {!imageFile && <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1">Maximum 5MB Recommended</p>}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-10 py-8 glass-light flex gap-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-all underline-offset-8 decoration-primary hover:underline disabled:opacity-30"
                    >
                        Abort
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !name || !startDate}
                        className="flex-[1.5] h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 disabled:opacity-30 transition-all hover:-translate-y-1 active:scale-95 group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />}
                            {isLoading ? (itemToEdit ? "Transmitting..." : "Initializing...") : (itemToEdit ? "Re-sync" : "Launch Mission")}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </button>
                </div>
            </div>
        </div>
    );
}
