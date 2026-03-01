"use client";

import React from "react";
import { useDog } from "@/components/providers/DogProvider";
import { Check } from "lucide-react";

export function DogSelector() {
    const { activeDog, setActiveDog, dogData } = useDog();

    return (
        <div className="flex bg-slate-100 p-1 rounded-full w-full max-w-sm mx-auto self-center drop-shadow-sm">
            {(["mochi", "uni"] as const).map((dog) => {
                const isActive = activeDog === dog;
                const data = dogData[dog];

                return (
                    <button
                        key={dog}
                        onClick={() => setActiveDog(dog)}
                        className={`
              relative flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300
              ${isActive ? `bg-white drop-shadow-sm ${data.color}` : "text-slate-500 hover:text-slate-700"}
            `}
                    >
                        <span className="text-base">{data.emoji}</span>
                        <span>{data.name}</span>
                        {isActive && (
                            <span className="absolute right-3 flex h-4 w-4 shrink-0 mt-0.5 animate-in zoom-in-50 fade-in duration-300">
                                <Check className="h-4 w-4 opacity-70" />
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
