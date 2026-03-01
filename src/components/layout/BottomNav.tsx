"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Calendar, Settings } from "lucide-react";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: MapPin, label: "Walk", href: "/walk" },
        { icon: Calendar, label: "Calendar", href: "/calendar" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                }`}
                        >
                            <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${isActive ? "scale-110" : "scale-100"
                                }`}>
                                {isActive && (
                                    <span className="absolute inset-0 rounded-full bg-slate-100 -z-10 animate-fade-in" />
                                )}
                                <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium tracking-wide ${isActive ? "opacity-100" : "opacity-70"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
