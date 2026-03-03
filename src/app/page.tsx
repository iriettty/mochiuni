"use client";

import React from "react";
import { useDog } from "@/components/providers/DogProvider";
import { Activity, Bone, Map, Clock, Navigation, Bot } from "lucide-react";
import { useWalkLogs } from "@/hooks/useWalkLogs";
import { useEvents } from "@/hooks/useEvents";
import { RandomAvatar } from "@/components/layout/RandomAvatar";

export default function Home() {
  const { activeDog, dogData } = useDog();
  const data = dogData[activeDog];
  const { todayLogs, recent7AvgDistance, recent7LogsCount, logs } = useWalkLogs();
  const { events } = useEvents();

  // 1. Calculate Walk Distance
  const totalWalkDistance = todayLogs.reduce((acc, log) => acc + log.distance, 0);
  const hasWalkedToday = todayLogs.length > 0;

  // 2. Health Status Logic
  let healthStatus = "良好";
  let healthColor = "text-blue-500";
  let healthBg = "bg-blue-50";

  // Check for recent walks first
  const now = new Date();
  if (logs && logs.length > 0) {
    // Find the most recent walk
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastWalkDate = new Date(sortedLogs[0].date);
    const hoursSinceLastWalk = (now.getTime() - lastWalkDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastWalk >= 48) {
      healthStatus = "ストレス";
      healthColor = "text-rose-500";
      healthBg = "bg-rose-50";
    } else if (hoursSinceLastWalk >= 24) {
      healthStatus = "ちょっとストレス";
      healthColor = "text-amber-500";
      healthBg = "bg-amber-50";
    } else {
      healthStatus = "良好";
      healthColor = "text-blue-500";
      healthBg = "bg-blue-50";
    }
  }

  // Check Surgery Recovery Priority
  for (const event of events) {
    if (event.title.includes("手術") && event.recoveryDays && event.recoveryDays > 0) {
      const eventDate = new Date(event.date);
      const recoveryEndDate = new Date(eventDate);
      recoveryEndDate.setDate(recoveryEndDate.getDate() + event.recoveryDays);

      // If currently inside the recovery window
      if (now >= eventDate && now <= recoveryEndDate) {
        healthStatus = "安静中";
        healthColor = "text-purple-500";
        healthBg = "bg-purple-50";
        break; // Highest priority, stop checking
      }
    }
  }


  return (
    <div className="flex flex-col space-y-6 pb-6 animate-fade-in">
      <section className="mt-2 text-center flex flex-col items-center">
        <RandomAvatar />
        <h2 className="text-2xl font-bold text-slate-800">こんにちは、{data.name}！</h2>
        <p className="text-sm text-slate-500 font-medium">今日も一緒に楽しく過ごそうね</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {/* 健康状態 (Health Status) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className={`${healthBg} ${healthColor} p-3 rounded-2xl w-full flex justify-center mb-1 transition-colors`}>
            <Activity strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-600">健康状態</span>
          <span className="text-[10px] text-slate-400 font-bold">{healthStatus}</span>
        </div>

        {/* お散歩 (Walk) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className={`${hasWalkedToday ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'} p-3 rounded-2xl w-full flex justify-center mb-1 transition-colors`}>
            {hasWalkedToday ? <Navigation strokeWidth={2.5} /> : <Map strokeWidth={2.5} />}
          </div>
          <span className="text-xs font-bold text-slate-600">お散歩</span>
          <span className="text-[10px] text-slate-400">
            {hasWalkedToday ? `本日 ${totalWalkDistance.toFixed(2)}km` : '準備OK'}
            {recent7LogsCount > 0 && <span className="block text-[8px] text-slate-300 mt-1">直近平均 {recent7AvgDistance.toFixed(2)}km</span>}
          </span>
        </div>

        {/* 通院 (Vet/Hospital) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className="bg-rose-50 text-rose-500 p-3 rounded-2xl w-full flex justify-center mb-1">
            <Clock strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-600">通院</span>
          <span className="text-[10px] text-slate-400">予定なし</span>
        </div>

        {/* 写真を見る (View Photos) replacing Snacks */}
        <div
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform cursor-pointer"
          onClick={() => window.location.href = '/photos'}
        >
          <div className="bg-indigo-50 text-indigo-500 p-3 rounded-2xl w-full flex justify-center mb-1">
            <Bone strokeWidth={2.5} style={{ display: 'none' }} /> {/* Hide bone, use custom SVG or another icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </div>
          <span className="text-xs font-bold text-slate-600">写真を見る</span>
          <span className="text-[10px] text-slate-400">ギャラリー</span>
        </div>
      </div>

      {/* AI Chat Button */}
      <div
        onClick={() => window.location.href = '/chat'}
        className="bg-indigo-600 rounded-[2rem] p-5 shadow-lg shadow-indigo-200 flex items-center justify-between cursor-pointer active:scale-95 transition-transform mt-4 relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">専門家に相談 (AI)</h3>
            <p className="text-indigo-100 text-xs font-medium">{data.name}専用のサポート窓口</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white relative z-10 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
        </div>
      </div>

      <section className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-5 border border-white shadow-sm mt-4 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-bold text-slate-800 mb-1">今日のサマリー</h3>
          <p className="text-sm text-slate-500 font-medium">あとでお散歩に行こうね！</p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-5 select-none pointer-events-none">
          {data.emoji}
        </div>
      </section>
    </div>
  );
}
