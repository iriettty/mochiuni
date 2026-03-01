"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// import icon fix for Next.js
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface WalkMapProps {
    positions: [number, number][];
    isTracking: boolean;
    dogColor: string; // Tailwind class string
}

// A component to automatically pan the map to the latest position
function RecenterAutomatically({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom(), {
                animate: true
            });
        }
    }, [position, map]);
    return null;
}

export function WalkMap({ positions, isTracking, dogColor }: WalkMapProps) {
    // Default center (Tokyo initially if no positions)
    const defaultCenter: [number, number] = [35.6895, 139.6917];

    const currentPos = positions.length > 0 ? positions[positions.length - 1] : null;
    const initialCenter = currentPos || defaultCenter;

    // Derive a basic hex color from the tailwind class roughly
    let mapLineColor = "#3b82f6"; // default blue
    if (dogColor.includes("amber")) mapLineColor = "#f59e0b"; // amber-500
    if (dogColor.includes("slate")) mapLineColor = "#64748b"; // slate-500

    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={initialCenter}
                zoom={16}
                scrollWheelZoom={false}
                zoomControl={false}
                className="w-full h-[350px] sm:h-[450px] absolute inset-0 rounded-3xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {positions.length > 1 && (
                    <Polyline
                        positions={positions}
                        color={mapLineColor}
                        weight={5}
                        opacity={0.8}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}

                {currentPos && (
                    <>
                        <Marker position={currentPos} />
                        {isTracking && <RecenterAutomatically position={currentPos} />}
                    </>
                )}
            </MapContainer>

            {/* Overlay gradient mask for rounded corners looking better */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-inset ring-slate-100 z-10" />
        </div>
    );
}
