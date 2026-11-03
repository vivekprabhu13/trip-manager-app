"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
            <div className="w-full max-w-md glass p-10 rounded-[40px] relative z-10 animate-in zoom-in-95 fade-in duration-700">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary/40 rotate-12 transition-transform hover:rotate-0 duration-500">
                        <span className="text-white text-3xl font-black italic">TP</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-tight text-gradient">
                        {isLogin ? "Welcome Back" : "Start Adventure"}
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide uppercase">
                        {isLogin ? "Ready for your next journey?" : "Create your explorer account"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="explorer@earth.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">Secure Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 active:scale-95 transition-all duration-300 group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLogin ? "Launch App" : "Create Account"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    {isLogin ? "New explorer? " : "Already an explorer? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
                    >
                        {isLogin ? "Sign Up Now" : "Log In"}
                    </button>
                </div>
            </div>
        </div>
    );

}
