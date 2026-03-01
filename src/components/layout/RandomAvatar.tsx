"use client";

import React, { useState, useEffect } from "react";
import { useDog } from "@/components/providers/DogProvider";

export function RandomAvatar() {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch random image
        const fetchImage = async () => {
            try {
                const res = await fetch(`/api/images?dog=${activeDog}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json.image) {
                        setImageUrl(json.image);
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

    if (imageUrl) {
        return (
            <div className={`w-24 h-24 rounded-full mb-4 shadow-sm border-4 border-white overflow-hidden transition-all duration-500`}>
                <img src={imageUrl} alt={data.name} className="w-full h-full object-cover" />
            </div>
        );
    }

    // Fallback to emoji
    return (
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 shadow-sm border-4 border-white ${data.color} transition-colors duration-500`}>
            {data.emoji}
        </div>
    );
}
