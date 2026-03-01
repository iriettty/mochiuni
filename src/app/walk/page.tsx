"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useDog } from "@/components/providers/DogProvider";
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

    const [isTracking, setIsTracking] = useState(false);
    const [positions, setPositions] = useState<[number, number][]>([]);
    const [distance, setDistance] = useState(0); // in km
    const [startTime, setStartTime] = useState<number | null>(null);
    const [duration, setDuration] = useState(0); // in seconds

    const watchIdRef = useRef<number | null>(null);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTracking && startTime) {
            interval = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking, startTime]);

    const calculateDistance = (pos1: [number, number], pos2: [number, number]) => {
        // Haversine formula
        const R = 6371; // km
        const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
        const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toggleTracking = () => {
        if (isTracking) {
            // Stop tracking
            setIsTracking(false);
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        } else {
            // Start tracking
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser");
                return;
            }

            setStartTime(Date.now());
            setIsTracking(true);

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                    setPositions(prev => {
                        if (prev.length > 0) {
                            const dist = calculateDistance(prev[prev.length - 1], newPos);
                            setDistance(d => d + dist);
                        }
                        return [...prev, newPos];
                    });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    alert("Error getting location: " + error.message);
                    setIsTracking(false);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
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
                        {distance.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">キロメートル</span>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">
                        {formatTime(duration)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">経過時間</span>
                </div>
            </div>

            <div className="flex-1 w-full bg-slate-100 rounded-3xl overflow-hidden shadow-sm border border-slate-100 min-h-[300px] relative">
                <WalkMap positions={positions} isTracking={isTracking} dogColor={data.color} />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[1000]">
                    <button
                        onClick={toggleTracking}
                        className={`flex items-center space-x-2 px-6 py-4 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95 ${isTracking
                            ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
                            }`}
                    >
                        {isTracking ? (
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

            {positions.length > 0 && !isTracking && (
                <button
                    onClick={() => { setPositions([]); setDistance(0); setDuration(0); }}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 self-center py-2"
                >
                    リセット
                </button>
            )}
        </div>
    );
}
