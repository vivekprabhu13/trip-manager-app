"use client";

import { TripCard } from "@/components/TripCard";
import { CreateTripModal } from "@/components/CreateTripModal";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTrips } from "@/hooks/useTrips";

export default function Home() {
  const { user, loading } = useAuth();
  const { trips, loading: tripsLoading, createTrip, deleteTrip, error: tripsError } = useTrips();

  const handleTripDelete = async (id: string) => {
    try {
      await deleteTrip(id);
    } catch (error: any) {
      console.error("Failed to delete trip", error);
      alert("Failed to delete trip");
    }
  };
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCreateTrip = async (tripData: { name: string; dates: string; imageFile: File | null; imageUrl?: string }) => {
    setIsCreating(true);
    try {
      await createTrip(tripData.name, tripData.dates, tripData.imageFile, tripData.imageUrl);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create trip", error);
      alert(`Failed to create trip: ${error.message || "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto pointer-events-auto">
            {/* Header Section */}
            <header className="sticky top-0 z-20 glass-light px-8 pt-12 pb-8 rounded-b-[48px] shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 transition-transform hover:rotate-0">
                            <span className="text-white text-2xl font-black italic">TP</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white leading-tight">
                                Explorer
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">
                                Adventure Log
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ProfileMenu />

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-midnight shadow-2xl transition-all active:scale-90 hover:bg-primary hover:text-white hover:-translate-y-1"
                            title="Plan New Trip"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Quick Filter/Tabs */}
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-1">
                    {["Upcoming", "Past Trips"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Main Feed */}
            <main className="flex-1 px-8 pt-10 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                        {activeTab} JOURNEYS
                    </h2>
                    <div className="h-[1px] flex-1 bg-white/5 ml-4" />
                </div>

                {tripsError ? (
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[32px] text-red-400 text-sm mb-8 animate-in shake-1 duration-500">
                        <p className="font-black uppercase tracking-widest mb-1">Retrieval Error</p>
                        <p className="font-medium opacity-80">{tripsError}</p>
                    </div>
                ) : null}

                {tripsLoading ? (
                    <div className="space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="animate-pulse glass rounded-[32px] h-64 w-full"></div>
                        ))}
                    </div>
                ) : trips.length > 0 ? (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {trips
                            .filter((trip) => {
                                if (!trip.dates || !trip.dates.includes(" to ")) return activeTab === "Upcoming";
                                try {
                                    const [, endStr] = trip.dates.split(" to ");
                                    const endDate = new Date(endStr);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    
                                    if (activeTab === "Upcoming") {
                                        return endDate >= today;
                                    } else {
                                        return endDate < today;
                                    }
                                } catch (e) {
                                    return activeTab === "Upcoming";
                                }
                            })
                            .map((trip) => (
                                <TripCard
                                    key={trip.id}
                                    id={trip.id}
                                    name={trip.name}
                                    dates={trip.dates}
                                    status={trip.status}
                                    imageUrl={trip.coverImageUrl}
                                    onDelete={handleTripDelete}
                                />
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-20 animate-in fade-in duration-700">
                        <div className="w-20 h-20 glass rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🏜️</span>
                        </div>
                        <h4 className="text-white font-black text-xl mb-2">No expeditions found</h4>
                        <p className="text-slate-500 text-sm font-medium px-10">
                            The world is waiting for your first blueprint.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:tracking-[0.2em] transition-all"
                        >
                            + Start Planning
                        </button>
                    </div>
                )}
            </main>

            {/* Create Trip Modal */}
            <CreateTripModal
                isOpen={isModalOpen}
                isLoading={isCreating}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateTrip}
            />
        </div>
    );

}
