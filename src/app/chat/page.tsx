"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { useDog } from "@/components/providers/DogProvider";
import { Send, Bot, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
    const { activeDog, dogData } = useDog();
    const data = dogData[activeDog];
    const router = useRouter();

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        body: {
            data: { dogId: activeDog }
        },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: `こんにちは！${data.name}ちゃんの健康や育成に関する専門AIアシスタントです。何か気になることはありますか？ 何でもご相談ください！`,
            }
        ]
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-50 relative animate-fade-in -mx-4 -my-6 sm:-mx-0 sm:-my-0">
            {/* Chat Header */}
            <div className="bg-white px-4 py-3 shadow-sm border-b border-slate-100 flex items-center space-x-3 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">専門家に相談 (AI)</h2>
                        <p className="text-[10px] text-slate-500 font-medium">{data.name}専用サポート</p>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {m.role !== "user" && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mr-2 shrink-0">
                                <Bot size={16} />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === "user"
                                ? "bg-slate-800 text-white rounded-tr-sm"
                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm whitespace-pre-wrap"
                                }`}
                        >
                            {m.content}
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mr-2 shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Chat Input */}
            <div className="bg-white p-4 border-t border-slate-100 pb-8 sm:pb-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center space-x-2"
                >
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder={`${data.name}について質問する...`}
                        className="flex-1 bg-slate-50 text-slate-700 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-slate-200 border border-slate-100"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-11 h-11 bg-slate-800 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity shrink-0 shadow-md active:scale-95"
                    >
                        <Send size={18} className="mr-0.5 mt-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
