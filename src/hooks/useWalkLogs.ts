"use client";

import { useState, useEffect } from "react";
import { useDog } from "@/components/providers/DogProvider";

export interface WalkLog {
    id: string;
    dogId: string;
    date: string; // YYYY-MM-DD
    startTime: number; // timestamp
    duration: number; // seconds
    distance: number; // km
}

export function useWalkLogs() {
    const { activeDog } = useDog();
    const [logs, setLogs] = useState<WalkLog[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from local storage
        const stored = localStorage.getItem("wanlog_walk_logs");
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setLogs(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse walk logs", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wanlog_walk_logs", JSON.stringify(logs));
        }
    }, [logs, isLoaded]);

    const activeDogLogs = logs.filter((log) => log.dogId === activeDog);

    // Get today's logs specifically
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
    const todayLogs = activeDogLogs.filter((log) => log.date === todayStr);

    const addWalkLog = (walk: Omit<WalkLog, "id" | "dogId" | "date">) => {
        const newLog: WalkLog = {
            ...walk,
            id: Math.random().toString(36).substr(2, 9),
            dogId: activeDog,
            date: new Date(walk.startTime).toLocaleDateString("en-CA"),
        };
        setLogs((prev) => [...prev, newLog]);
    };

    const deleteWalkLog = (id: string) => {
        setLogs((prev) => prev.filter((log) => log.id !== id));
    };

    return {
        logs: activeDogLogs,
        allDogLogs: logs,
        todayLogs,
        addWalkLog,
        deleteWalkLog,
        isLoaded,
    };
}
