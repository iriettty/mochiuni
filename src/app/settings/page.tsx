"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { DogType, useDog } from "@/components/providers/DogProvider";

export default function SettingsPage() {
    const { activeDog, dogData } = useDog();
    const [selectedDog, setSelectedDog] = useState<DogType>(activeDog);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        // Force ASCII filename to prevent parsing errors in Next.js / Undici with Japanese filenames
        const originalName = file.name || "";
        const ext = originalName.includes('.') ? originalName.substring(originalName.lastIndexOf('.')) : '.jpg';
        formData.append("file", file, "image" + ext);
        formData.append("dog", selectedDog);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setMessage({ text: "画像のアップロードに成功しました！", type: "success" });
                setFile(null);
                // Reset file input
                const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
            } else {
                const data = await res.json();
                setMessage({ text: data.error || "アップロードに失敗しました", type: "error" });
            }
        } catch (error: any) {
            setMessage({ text: `エラーが発生しました: ${error?.message || error}`, type: "error" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 pb-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">設定</h2>

            <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-slate-800">
                    <ImageIcon className="text-blue-500" size={24} />
                    <h3 className="font-bold">画像をアップロードする</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                    アップロードした画像はダッシュボードのアイコンとしてランダムに表示されます。
                </p>

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-bold text-slate-600">対象のワンちゃん</label>
                        <div className="flex space-x-2">
                            {(["mochi", "uni"] as DogType[]).map((dog) => (
                                <button
                                    key={dog}
                                    type="button"
                                    onClick={() => setSelectedDog(dog)}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${selectedDog === dog
                                        ? dogData[dog].color + " border-2 ring-2 ring-offset-2 ring-slate-200"
                                        : "bg-slate-50 text-slate-400 border-2 border-transparent hover:bg-slate-100"
                                        }`}
                                >
                                    {dogData[dog].name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-bold text-slate-600">画像ファイル</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
                        />
                    </div>

                    {message && (
                        <p className={`text-xs font-bold ${message.type === "success" ? "text-emerald-500" : "text-rose-500"}`}>
                            {message.text}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`w-full py-4 rounded-full font-bold flex items-center justify-center space-x-2 transition-all ${!file || uploading
                            ? "bg-slate-100 text-slate-400"
                            : "bg-slate-800 text-white shadow-lg shadow-slate-800/20 active:scale-95 hover:bg-slate-700"
                            }`}
                    >
                        <Upload size={18} />
                        <span>{uploading ? "アップロード中..." : "アップロード"}</span>
                    </button>
                </form>
            </section>
        </div>
    );
}
