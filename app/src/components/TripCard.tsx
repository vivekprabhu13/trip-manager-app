import Link from "next/link";
import { Calendar, Trash2 } from "lucide-react";
import Image from "next/image";

import { formatFullTripDate } from "@/lib/utils";

interface TripCardProps {
    id: string;
    name: string;
    imageUrl?: string;
    dates: string;
    status: "Planning" | "Confirmed" | "Completed";
    onDelete?: (id: string) => void;
}

export function TripCard({
    id,
    name,
    imageUrl,
    dates,
    status = "Planning",
    onDelete,
}: TripCardProps) {
    // const bgImage = imageUrl || "/placeholder.jpg"; // Fallback image - no longer needed

    return (
        <div className="relative group mb-8">
            <Link href={`/trips/${id}`} className="block">
                <div className="rounded-[32px] glass overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:shadow-primary/20 hover:border-primary/30">
                    {/* Image Container */}
                    <div className="relative h-56 w-full overflow-hidden">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="h-full w-full bg-gradient-to-br from-primary/10 to-midnight flex items-center justify-center">
                                <span className="text-5xl drop-shadow-2xl">✈️</span>
                            </div>
                        )}
                        {/* Dramatic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
                        
                        {/* Status Badge - Floating on Image */}
                        <div className="absolute top-4 left-4">
                            <span
                                className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 ${status === "Confirmed"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                    : status === "Completed"
                                    ? "bg-slate-500/20 text-slate-300 border-slate-500/20"
                                    : "bg-primary/20 text-primary border-primary/20"
                                    }`}
                            >
                                {status}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2 text-gradient group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                {formatFullTripDate(dates)}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex -space-x-2">
                                {/* Decorative placeholders for "collaborators" or just visual flair */}
                                <div className="w-6 h-6 rounded-full border-2 border-midnight bg-slate-800" />
                                <div className="w-6 h-6 rounded-full border-2 border-midnight bg-slate-700" />
                            </div>
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-4 transition-all">
                                View Trip <div className="w-4 h-[2px] bg-primary" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Overlay Delete Button */}
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this trip?")) {
                            onDelete(id);
                        }
                    }}
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-red-500/20"
                    title="Delete Trip"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );

}
