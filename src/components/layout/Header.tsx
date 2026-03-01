"use client";

import React from "react";
import { DogSelector } from "./DogSelector";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-slate-100 pb-3 pt-safe shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col items-center pt-2 px-4 md:pt-4">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-800 mb-3 font-sans">
                    Wan<span className="text-slate-400 font-light">Log</span>
                </h1>
                <DogSelector />
            </div>
        </header>
    );
}
