"use client";

import React, { useState, useEffect } from "react";
import { useDog } from "@/components/providers/DogProvider";

interface RandomAvatarProps {
    useSmall?: boolean;
}

export function RandomAvatar({ useSmall = false }: RandomAvatarProps) {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch random image
        const fetchImage = async () => {
            try {
                const timestamp = Date.now();
                const res = await fetch(`/api/images?dog=${activeDog}&t=${timestamp}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.image) {
                        setImageUrl(`${json.image}?t=${timestamp}`);
                        return;
                    }
                }
            } catch (err) {
                console.error("Failed to fetch image", err);
            }
            setImageUrl(null);
        };

        fetchImage();
    }, [activeDog]);

    const sizeClasses = useSmall
        ? "w-full h-full text-xl border-2"
        : "w-24 h-24 text-5xl mb-4 border-4";

    if (imageUrl) {
        return (
            <div className={`${sizeClasses} rounded-full flex items-center justify-center shadow-sm border-white overflow-hidden transition-all duration-500`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
        );
    }

    // Fallback to emoji
    return (
        <div className={`${sizeClasses} rounded-full flex items-center justify-center shadow-sm border-white ${data.color} transition-colors duration-500`}>
            {data.emoji}
        </div>
    );
}
