"use client";

import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { DogType } from "./DogProvider";

export interface WalkState {
    isTracking: boolean;
    positions: [number, number][];
    distance: number; // km
    duration: number; // seconds
    startTime: number | null;
}

interface WalkProviderState {
    mochi: WalkState;
    uni: WalkState;
}

type WalkAction =
    | { type: "START_TRACKING"; dogId: DogType; startTime: number }
    | { type: "STOP_TRACKING"; dogId: DogType }
    | { type: "RESET"; dogId: DogType }
    | { type: "ADD_POSITION"; position: [number, number]; timeNow: number };

const defaultWalkState: WalkState = {
    isTracking: false,
    positions: [],
    distance: 0,
    duration: 0,
    startTime: null,
};

const initialState: WalkProviderState = {
    mochi: { ...defaultWalkState },
    uni: { ...defaultWalkState },
};

function calculateDistance(pos1: [number, number], pos2: [number, number]) {
    const R = 6371; // km
    const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180;
    const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pos1[0] * Math.PI) / 180) *
        Math.cos((pos2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function walkReducer(state: WalkProviderState, action: WalkAction): WalkProviderState {
    switch (action.type) {
        case "START_TRACKING":
            return {
                ...state,
                [action.dogId]: {
                    ...state[action.dogId],
                    isTracking: true,
                    startTime: state[action.dogId].startTime || action.startTime,
                },
            };
        case "STOP_TRACKING":
            return {
                ...state,
                [action.dogId]: {
                    ...state[action.dogId],
                    isTracking: false,
                },
            };
        case "RESET":
            return {
                ...state,
                [action.dogId]: { ...defaultWalkState },
            };
        case "ADD_POSITION": {
            let anyChanged = false;

            const nextMochi = { ...state.mochi };
            if (nextMochi.isTracking) {
                anyChanged = true;
                if (nextMochi.positions.length > 0) {
                    const lastPos = nextMochi.positions[nextMochi.positions.length - 1];
                    nextMochi.distance += calculateDistance(lastPos, action.position);
                }
                nextMochi.positions = [...nextMochi.positions, action.position];
                nextMochi.duration = Math.floor(
                    (action.timeNow - (nextMochi.startTime || action.timeNow)) / 1000
                );
            }

            const nextUni = { ...state.uni };
            if (nextUni.isTracking) {
                anyChanged = true;
                if (nextUni.positions.length > 0) {
                    const lastPos = nextUni.positions[nextUni.positions.length - 1];
                    nextUni.distance += calculateDistance(lastPos, action.position);
                }
                nextUni.positions = [...nextUni.positions, action.position];
                nextUni.duration = Math.floor(
                    (action.timeNow - (nextUni.startTime || action.timeNow)) / 1000
                );
            }

            if (!anyChanged) return state;

            return {
                ...state,
                mochi: nextMochi,
                uni: nextUni
            };
        }
        default:
            return state;
    }
}

interface WalkContextValue {
    walkData: WalkProviderState;
    dispatch: React.Dispatch<WalkAction>;
    anyTracking: boolean;
}

const WalkContext = createContext<WalkContextValue | undefined>(undefined);

export function WalkProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(walkReducer, initialState);
    const watchIdRef = useRef<number | null>(null);

    const anyTracking = state.mochi.isTracking || state.uni.isTracking;

    useEffect(() => {
        if (anyTracking && watchIdRef.current === null) {
            if (!navigator.geolocation) {
                alert("お使いのブラウザは位置情報をサポートしていません。");
                return;
            }

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newPos: [number, number] = [position.coords.latitude, position.coords.longitude];
                    dispatch({ type: "ADD_POSITION", position: newPos, timeNow: Date.now() });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // タイムアウトや権限拒否時
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else if (!anyTracking && watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }

        return () => {
            // Cleanup happens only on unmount (or tracking completely stopped)
            // Usually, WalkProvider lives at root so it rarely unmounts.
        };
    }, [anyTracking]);

    // Tick duration manually every second so UI updates even if no new GPS coordinate arrives
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (anyTracking) {
            interval = setInterval(() => {
                // Just trigger a fake coordinate at previous position to tick timers? No, we don't want to add same coords.
                // We can just rely on normal React state, but getting current duration is tricky if we only update on ADD_POSITION.
                // Alternatively, we just let components tick their own timers.
                // Or we dispatch a tick action. But let's let components handle timer display natively using startTime.
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [anyTracking]);

    return (
        <WalkContext.Provider value={{ walkData: state, dispatch, anyTracking }}>
            {children}
        </WalkContext.Provider>
    );
}

export function useWalkManager() {
    const context = useContext(WalkContext);
    if (context === undefined) {
        throw new Error("useWalkManager must be used within a WalkProvider");
    }
    return context;
}
