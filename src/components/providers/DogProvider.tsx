"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Dog } from "lucide-react";

export type DogType = "mochi" | "uni";

interface DogContextType {
  activeDog: DogType;
  setActiveDog: (dog: DogType) => void;
  dogData: {
    [key in DogType]: {
      name: string;
      breed: string;
      emoji: React.ReactNode;
      color: string;
    };
  };
}

const defaultDogData = {
  mochi: {
    name: "もち",
    breed: "Japanese Spitz",
    emoji: <Dog size={24} color="#ffffff" fill="#ffffff" />,
    color: "bg-slate-100 text-slate-900 border-slate-200",
  },
  uni: {
    name: "うに",
    breed: "Pug",
    emoji: <Dog size={24} color="#1e293b" fill="#1e293b" />,
    color: "bg-amber-100 text-amber-900 border-amber-200",
  }
};

const DogContext = createContext<DogContextType | undefined>(undefined);

export function DogProvider({ children }: { children: React.ReactNode }) {
  const [activeDog, setActiveDogState] = useState<DogType>("mochi");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedDog = localStorage.getItem("wanlog_active_dog") as DogType;
    if (savedDog === "mochi" || savedDog === "uni") {
      setActiveDogState(savedDog);
    }
  }, []);

  const setActiveDog = (dog: DogType) => {
    setActiveDogState(dog);
    localStorage.setItem("wanlog_active_dog", dog);
  };

  // Prevent hydration mismatch by returning null or a skeleton until mounted
  if (!isMounted) {
    return <div className="min-h-screen bg-neutral-50" />;
  }

  return (
    <DogContext.Provider value={{ activeDog, setActiveDog, dogData: defaultDogData }}>
      {children}
    </DogContext.Provider>
  );
}

export function useDog() {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error("useDog must be used within a DogProvider");
  }
  return context;
}
