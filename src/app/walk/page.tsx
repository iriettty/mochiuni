"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useDog } from "@/components/providers/DogProvider";
import { useWalkManager } from "@/components/providers/WalkProvider";
import { Play, Square, MapPin } from "lucide-react";

// Dynamically import the map to avoid SSR issues with Leaflet
const WalkMap = dynamic(() => import("@/components/walk/WalkMap").then(mod => mod.WalkMap), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 rounded-3xl animate-pulse">
            <MapPin className="text-slate-300 w-12 h-12 animate-bounce" />
        </div>
    ),
});

export default function WalkTracker() {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];

    const { walkData, dispatch } = useWalkManager();
    const currentWalk = walkData[activeDog];

    // Local tick for duration display
    const [displayDuration, setDisplayDuration] = useState(currentWalk.duration);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (currentWalk.isTracking && currentWalk.startTime) {
            interval = setInterval(() => {
                setDisplayDuration(Math.floor((Date.now() - currentWalk.startTime!) / 1000));
            }, 1000);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplayDuration(currentWalk.duration);
        }
        return () => clearInterval(interval);
    }, [currentWalk.isTracking, currentWalk.startTime, currentWalk.duration]);

    const toggleTracking = () => {
        if (currentWalk.isTracking) {
            // Stop tracking
            dispatch({ type: "STOP_TRACKING", dogId: activeDog });
        } else {
            // Start tracking
            dispatch({ type: "START_TRACKING", dogId: activeDog, startTime: Date.now() });
        }
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="flex flex-col h-full space-y-4 pb-6 animate-fade-in relative flex-1">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">お散歩トラッカー</h2>
                    <p className="text-sm text-slate-500 font-medium">{data.name}の冒険</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${data.color}`}>
                    {data.emoji}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">
                        {currentWalk.distance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">キロメートル</span>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">
                        {formatTime(displayDuration)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">経過時間</span>
                </div>
            </div>

            <div className="flex-1 w-full bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-100 min-h-[350px] relative">
                <WalkMap positions={currentWalk.positions} isTracking={currentWalk.isTracking} dogColor={data.color} />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[1000]">
                    <button
                        onClick={toggleTracking}
                        className={`flex items-center space-x-2 px-6 py-4 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${currentWalk.isTracking
                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                            }`}
                    >
                        {currentWalk.isTracking ? (
                            <>
                                <Square fill="currentColor" strokeWidth={0} size={20} />
                                <span>終了</span>
                            </>
                        ) : (
                            <>
                                <Play fill="currentColor" size={20} />
                                <span>出発</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {currentWalk.positions.length > 0 && !currentWalk.isTracking && (
                <button
                    onClick={() => dispatch({ type: "RESET", dogId: activeDog })}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 self-center py-2"
                >
                    リセット
                </button>
            )}
        </div>
    );
}
