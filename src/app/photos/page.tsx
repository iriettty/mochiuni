"use client";

import React, { useEffect, useState } from "react";
import { useDog } from "@/components/providers/DogProvider";

export default function PhotosPage() {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                // To list multiple blobs we need an API route, but for now we'll write a simple API to return all blob URLs
                const response = await fetch(`/api/images/all?dog=${activeDog}`);
                if (response.ok) {
                    const data = await response.json();
                    setImages(data.images || []);
                } else {
                    console.error("Failed to fetch images list");
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [activeDog]);

    return (
        <div className="flex flex-col h-full space-y-4 pb-6 animate-fade-in relative">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">ギャラリー</h2>
                    <p className="text-sm text-slate-500 font-medium">{data.name}の思い出</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${data.color}`}>
                    {data.emoji}
                </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 min-h-[50vh]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-2">
                        <span className="text-4xl opacity-50">📷</span>
                        <p className="font-medium text-sm">まだ写真がありません</p>
                        <p className="text-xs">設定画面から追加してね</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {images.map((url, idx) => (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    alt={`${data.name} photo ${idx}`}
                                    className="w-full h-full object-cover select-none"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
