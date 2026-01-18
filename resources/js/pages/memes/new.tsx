import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, HeaderAction } from '@/types';
import { ArrowLeft, Check, Crop, FileImage, Monitor, Ruler, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { InternalApi } from "@/api";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Создать новый мемчик',
        href: '',
    }
];

const actions: HeaderAction[] = [
    {
        Icon: ArrowLeft,
        target_url: "/",
        isActive: false
    }
];

export default function NewMeme() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleSelectedFile(e.target.files?.[0] ?? null);
    }

    function handleSelectedFile(selected: File | null) {
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0] ?? null;
        handleSelectedFile(droppedFile);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!file) {
            alert('Выберите файл');
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('file', file);

        tags.forEach((t, idx) => {
            formData.append(`tags[${idx}]`, t);
        });
        const memeController = (new InternalApi).v1().meme()

        memeController.new(formData);
    }

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    function validateTag(text: string) {
        return /^[A-Za-zА-Яа-я0-9 ]+$/.test(text) && !/ {3,}/.test(text);
    }

    function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = tagInput.trim();
            if (!value) return;
            if (!validateTag(value)) {
                alert("Тег может содержать только буквы, цифры и максимум два пробела подряд.");
                return;
            }
            if (!tags.includes(value)) setTags([...tags, value]);
            setTagInput("");
        }
    }

    function removeTag(tag: string) {
        setTags(tags.filter(t => t !== tag));
    }

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            actions={actions}
        >
            <Head title="Создать мем" />

            <div className="w-full p-6">
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
                    <h1 className="text-2xl font-bold text-slate-100 mb-6">Создать новый мем</h1>

                    <form onSubmit={handleSubmit} className="text-slate-100">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-2 text-slate-200">Файл</label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        className={`border-2 border-dashed rounded-xl px-4 py-8 text-center cursor-pointer transition ${
                                            isDragging ? "border-cyan-400 bg-cyan-500/10" : "border-slate-700 bg-slate-900/70"
                                        }`}
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="rounded-full bg-slate-900 p-3 shadow-sm border border-slate-700">
                                                <Upload size={20} className="text-cyan-300" />
                                            </div>
                                            <div className="font-medium">Перетащите файл сюда</div>
                                            <div className="text-sm text-slate-400">или нажмите, чтобы выбрать</div>
                                            {file && (
                                                <div className="text-sm text-slate-300">{file.name}</div>
                                            )}
                                        </div>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                        className="hidden"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <Ruler size={18} className="text-slate-300" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-100">Размер</div>
                                            <div className="text-xs text-slate-400">до 50 МБ</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <FileImage size={18} className="text-slate-300" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-100">Формат</div>
                                            <div className="text-xs text-slate-400">JPG, PNG, GIF, MP4</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <Monitor size={18} className="text-slate-300" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-100">Разрешение</div>
                                            <div className="text-xs text-slate-400">до 4K</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <Crop size={18} className="text-slate-300" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-100">Соотношение</div>
                                            <div className="text-xs text-slate-400">1:1, 4:5, 9:16</div>
                                        </div>
                                    </div>
                                </div>

                                {preview && (
                                    <div className="mt-2">
                                        <p className="font-medium mb-2 text-slate-200">Предпросмотр:</p>
                                        {file?.type.startsWith("video/") ? (
                                            <video
                                                src={preview}
                                                className="rounded-xl max-h-64 object-contain border border-slate-800 w-full bg-slate-900/70"
                                                controls
                                            />
                                        ) : (
                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="rounded-xl max-h-64 object-contain border border-slate-800 w-full bg-slate-900/70"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-1 text-slate-200">Название</label>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="border border-slate-800 rounded-lg px-3 py-2 w-full bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1 text-slate-200">Теги</label>

                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Введите тег и нажмите Enter"
                                        className="border border-slate-800 rounded-lg px-3 py-2 w-full bg-slate-900/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
                                    />

                                    {/* Показ тегов */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-emerald-500/15 text-emerald-200 border border-emerald-500/40 rounded-full flex items-center gap-1 text-sm"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    className="text-rose-300 hover:text-rose-200"
                                                    onClick={() => removeTag(tag)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 bg-cyan-500 text-slate-900 rounded-lg px-6 py-2.5 font-semibold hover:bg-cyan-400 transition"
                                    >
                                        <Check size={18} />
                                        Добавить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
