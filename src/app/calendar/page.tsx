"use client";

import React, { useState } from "react";
import { useDog } from "@/components/providers/DogProvider";
import { useEvents, CalendarEvent, EventType } from "@/hooks/useEvents";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock, Stethoscope, Scissors } from "lucide-react";
import { RandomAvatar } from "@/components/layout/RandomAvatar";

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

export default function CalendarPage() {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];
    const { events, addEvent, updateEvent, deleteEvent } = useEvents();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventType, setNewEventType] = useState<EventType>("vet");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (dayStr: string) => {
        setSelectedDate(dayStr);
    };

    const handleAddEvent = () => {
        if (!selectedDate || !newEventTitle) return;
        addEvent({
            date: selectedDate,
            title: newEventTitle,
            type: newEventType,
            completed: false,
        });
        setNewEventTitle("");
        setIsModalOpen(false);
    };

    const toggleEventComplete = (event: CalendarEvent) => {
        updateEvent(event.id, { completed: !event.completed });
    };

    const typeIcons: Record<EventType, React.ReactNode> = {
        vet: <Stethoscope size={14} className="text-rose-500" />,
        meds: <Clock size={14} className="text-blue-500" />,
        grooming: <Scissors size={14} className="text-emerald-500" />,
        other: <CalIcon size={14} className="text-slate-500" />
    };

    // Build calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const dayEvents = events.filter((e) => e.date === dayStr);
        const isSelected = selectedDate === dayStr;
        const isToday = dayStr === new Date().toISOString().split("T")[0];

        days.push(
            <button
                key={d}
                onClick={() => handleDayClick(dayStr)}
                className={`h-12 rounded-xl flex flex-col items-center justify-start pt-1 text-sm transition-all relative ${isSelected
                    ? `${data.color} ring-2 ring-offset-2 ring-slate-200 font-bold shadow-sm`
                    : isToday
                        ? "bg-slate-100 font-bold text-slate-900"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
            >
                <span>{d}</span>
                {dayEvents.length > 0 && (
                    <div className="flex space-x-0.5 mt-0.5">
                        {dayEvents.slice(0, 3).map(e => (
                            <span key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.type === 'vet' ? 'bg-rose-400' : e.type === 'meds' ? 'bg-blue-400' : 'bg-emerald-400'
                                }`} />
                        ))}
                    </div>
                )}
            </button>
        );
    }

    const selectedEvents = events.filter((e) => e.date === selectedDate);

    return (
        <div className="flex flex-col h-full space-y-4 pb-6 animate-fade-in relative">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">ヘルスケア</h2>
                    <p className="text-sm text-slate-500 font-medium">{data.name}のスケジュール</p>
                </div>
                <div className="w-12 h-12 shadow-sm rounded-full overflow-hidden">
                    <RandomAvatar useSmall={true} />
                </div>
            </div>

            {/* Calendar Header */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-4 px-2">
                    <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <ChevronLeft />
                    </button>
                    <span className="text-lg font-bold text-slate-700">
                        {currentDate.toLocaleString("ja-JP", { month: "long", year: "numeric" })}
                    </span>
                    <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <ChevronRight />
                    </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 w-full mb-2 text-center text-xs font-bold text-slate-400">
                    <div>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div>土</div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 w-full gap-1">
                    {days}
                </div>
            </div>

            {/* Events List for Selected Day */}
            {selectedDate && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-5 border border-white shadow-sm flex flex-col space-y-3">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-slate-800 text-lg">
                            {new Date(selectedDate).toLocaleString("ja-JP", { month: "short", day: "numeric" })}
                        </h3>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-800 text-white p-2 rounded-full shadow-md hover:bg-slate-700 transition-transform active:scale-95"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
                    </div>

                    {selectedEvents.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium py-4 text-center">この日の予定はありません。</p>
                    ) : (
                        <ul className="space-y-2">
                            {selectedEvents.map(event => (
                                <li key={event.id} className="bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => toggleEventComplete(event)} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${event.completed ? "bg-emerald-400 border-emerald-400" : "border-slate-300"}`}>
                                            {event.completed && <div className="w-2 h-2 bg-white rounded-full scale-100 animate-in zoom-in" />}
                                        </button>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${event.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {event.title}
                                            </span>
                                            <div className="flex items-center space-x-1 mt-0.5">
                                                {typeIcons[event.type]}
                                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{event.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteEvent(event.id)} className="text-slate-300 hover:text-rose-500 text-xs font-bold p-2">
                                        削除
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Add Event Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-end sm:justify-center p-4 pb-24 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                        <h3 className="font-bold text-xl text-slate-800 mb-4">カレンダーに追加</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">イベント名</p>
                        <input
                            type="text"
                            placeholder="例：狂犬病予防接種"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            className="w-full bg-slate-50 rounded-2xl p-4 mb-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-100"
                        />

                        {newEventTitle.includes("手術") && (
                            <>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 mt-2">安静期間（日数）</p>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="例：3"
                                    id="recoveryDaysInput"
                                    className="w-full bg-slate-50 rounded-2xl p-4 mb-4 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-100"
                                />
                            </>
                        )}

                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">カテゴリ</p>
                        <div className="grid grid-cols-4 gap-2 mb-6">
                            {(['vet', 'meds', 'grooming', 'other'] as EventType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setNewEventType(type)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl space-y-1 transition-colors border ${newEventType === type ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    {typeIcons[type]}
                                    <span className="text-[10px] font-bold capitalize">
                                        {type === 'vet' ? '通院' : type === 'meds' ? '投薬' : type === 'grooming' ? 'お手入れ' : 'その他'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="flex space-x-3 w-full">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-4 font-bold rounded-2xl text-slate-600 bg-slate-100 active:bg-slate-200 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => {
                                    const recInput = document.getElementById('recoveryDaysInput') as HTMLInputElement;
                                    const recDays = recInput ? parseInt(recInput.value || "0", 10) : undefined;

                                    if (!selectedDate || !newEventTitle) return;
                                    addEvent({
                                        date: selectedDate,
                                        title: newEventTitle,
                                        type: newEventType,
                                        completed: false,
                                        ...(recDays ? { recoveryDays: recDays } : {})
                                    });
                                    setNewEventTitle("");
                                    setIsModalOpen(false);
                                }}
                                className="flex-[2] py-4 rounded-2xl font-bold bg-slate-800 text-white active:bg-slate-900 transition-colors shadow-lg"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
