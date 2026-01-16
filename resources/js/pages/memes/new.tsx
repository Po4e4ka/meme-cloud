import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, HeaderAction } from '@/types';
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = e.target.files?.[0];
        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!file) {
            alert('Выберите изображение');
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('file', file);

        tags.forEach((t, idx) => {
            formData.append(`tags[${idx}]`, t);
        });
        const memeController = (new InternalApi).v1().meme()

        const result = memeController.new(formData);
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

            <div className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Создать новый мем</h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Название */}
                    <div>
                        <label className="block font-medium mb-1">Название</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded px-3 py-2 w-full"
                            required
                        />
                    </div>

                    {/* Выбор файла */}
                    <div>
                        <label className="block font-medium mb-1">Выберите изображение</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                            required
                        />
                    </div>

                    {/* Превью */}
                    {preview && (
                        <div className="mt-4">
                            <p className="font-medium mb-2">Предпросмотр:</p>
                            <img
                                src={preview}
                                alt="preview"
                                className="rounded-lg max-h-64 object-contain border"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block font-medium mb-1">Теги</label>

                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            placeholder="Введите тег и нажмите Enter"
                            className="border rounded px-3 py-2 w-full"
                        />

                        {/* Показ тегов */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-green-200 rounded-full flex items-center gap-1 text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => removeTag(tag)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                    >
                        <Check size={18} />
                        Создать
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
