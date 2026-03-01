"use client";

import React from "react";
import { useDog } from "@/components/providers/DogProvider";
import { Activity, Bone, Map, Clock, Navigation } from "lucide-react";
import { useWalkLogs } from "@/hooks/useWalkLogs";
import { RandomAvatar } from "@/components/layout/RandomAvatar";

export default function Home() {
  const { activeDog, dogData } = useDog();
  const data = dogData[activeDog];
  const { todayLogs, recent7AvgDistance, recent7LogsCount } = useWalkLogs();

  const totalWalkDistance = todayLogs.reduce((acc, log) => acc + log.distance, 0);
  const hasWalkedToday = todayLogs.length > 0;

  return (
    <div className="flex flex-col space-y-6 pb-6 animate-fade-in">
      <section className="mt-2 text-center flex flex-col items-center">
        <RandomAvatar />
        <h2 className="text-2xl font-bold text-slate-800">こんにちは、{data.name}！</h2>
        <p className="text-sm text-slate-500 font-medium">今日も一緒に楽しく過ごそうね</p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {/* Quick actions/Stats */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl w-full flex justify-center mb-1">
            <Activity strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-600">健康状態</span>
          <span className="text-[10px] text-slate-400">良好</span>
        </div>

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

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className="bg-rose-50 text-rose-500 p-3 rounded-2xl w-full flex justify-center mb-1">
            <Clock strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-600">通院</span>
          <span className="text-[10px] text-slate-400">予定なし</span>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 active:scale-95 transition-transform">
          <div className="bg-amber-50 text-amber-500 p-3 rounded-2xl w-full flex justify-center mb-1">
            <Bone strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-slate-600">おやつ</span>
          <span className="text-[10px] text-slate-400">残り3個</span>
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
