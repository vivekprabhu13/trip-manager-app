"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function ProfileMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 p-1 rounded-2xl glass transition-all active:scale-95 hover:bg-white/10"
            >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/5">
                    <User className="w-5 h-5" />
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-60 glass rounded-[32px] shadow-2xl py-4 animate-in fade-in zoom-in slide-in-from-top-4 duration-500 origin-top-right z-50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-1">Explorer ID</p>
                        <p className="text-sm font-black text-white truncate tracking-tight">{user.email}</p>
                    </div>
                    
                    <div className="px-2">
                      <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-black text-red-400 hover:bg-red-500/10 transition-all text-left uppercase tracking-widest group"
                      >
                          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          Launch Logout
                      </button>
                    </div>
                </div>
            )}
        </div>
    );

}
