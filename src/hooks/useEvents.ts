"use client";

import { useState, useEffect } from "react";
import { useDog } from "@/components/providers/DogProvider";

export type EventType = "vet" | "meds" | "grooming" | "other";

export interface CalendarEvent {
    id: string;
    dogId: string;
    date: string; // YYYY-MM-DD
    type: EventType;
    title: string;
    notes?: string;
    recoveryDays?: number; // Added for tracking surgical recovery periods
    completed: boolean;
}

export function useEvents() {
    const { activeDog } = useDog();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load from local storage
        const stored = localStorage.getItem("wanlog_events");
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setEvents(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse events", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wanlog_events", JSON.stringify(events));
        }
    }, [events, isLoaded]);

    const activeDogEvents = events.filter((e) => e.dogId === activeDog);

    const addEvent = (event: Omit<CalendarEvent, "id" | "dogId">) => {
        const newEvent: CalendarEvent = {
            ...event,
            id: Math.random().toString(36).substr(2, 9),
            dogId: activeDog,
        };
        setEvents((prev) => [...prev, newEvent]);
    };

    const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    };

    const deleteEvent = (id: string) => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
    };

    return {
        events: activeDogEvents,
        allDogEvents: events,
        addEvent,
        updateEvent,
        deleteEvent,
        isLoaded,
    };
}
