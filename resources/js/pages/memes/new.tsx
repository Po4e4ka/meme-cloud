import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem, HeaderAction } from '@/types';
import { ArrowLeft, Check, Crop, FileImage, Monitor, Ruler, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InternalApi } from "@/api";
import Cropper, { Area } from "react-easy-crop";

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
    const videoRef = useRef<HTMLVideoElement>(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [videoPreviewFile, setVideoPreviewFile] = useState<File | null>(null);

    const PREVIEW_WIDTH = 198;
    const PREVIEW_HEIGHT = 258;
    const PREVIEW_ASPECT = PREVIEW_WIDTH / PREVIEW_HEIGHT;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        handleSelectedFile(e.target.files?.[0] ?? null);
    }

    function handleSelectedFile(selected: File | null) {
        if (!selected) return;

        setFile(selected);
        setPreviewImageUrl(null);
        setVideoPreviewUrl(null);
        setVideoPreviewFile(null);
        setVideoDuration(0);
        setVideoTime(0);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
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
        if (file.type.startsWith("image/") && !croppedAreaPixels) {
            alert('Выберите область превью');
            return;
        }

        const formData = new FormData();
        formData.append('name', title);
        formData.append('file', file);

        tags.forEach((t, idx) => {
            formData.append(`tags[${idx}]`, t);
        });
        const memeController = (new InternalApi).v1().meme()

        buildPreviewFile()
            .then((previewFile) => {
                if (previewFile) {
                    formData.append('preview', previewFile);
                }
                memeController.new(formData);
            })
            .catch(() => {
                alert('Не удалось подготовить превью');
            });
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

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const createImage = useCallback((url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", reject);
            image.src = url;
        });
    }, []);

    const getCroppedPreview = useCallback(async (source: string, cropArea: Area) => {
        const image = await createImage(source);
        const canvas = document.createElement("canvas");
        canvas.width = PREVIEW_WIDTH;
        canvas.height = PREVIEW_HEIGHT;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas context missing");
        }

        ctx.drawImage(
            image,
            cropArea.x,
            cropArea.y,
            cropArea.width,
            cropArea.height,
            0,
            0,
            PREVIEW_WIDTH,
            PREVIEW_HEIGHT,
        );

        return canvas;
    }, [PREVIEW_HEIGHT, PREVIEW_WIDTH, createImage]);

    useEffect(() => {
        if (!preview || !file || !croppedAreaPixels || !file.type.startsWith("image/")) {
            return;
        }

        let isCancelled = false;
        getCroppedPreview(preview, croppedAreaPixels)
            .then((canvas) => {
                if (isCancelled) return;
                const url = canvas.toDataURL("image/jpeg", 0.9);
                setPreviewImageUrl(url);
            })
            .catch(() => {
                if (isCancelled) return;
                setPreviewImageUrl(null);
            });

        return () => {
            isCancelled = true;
        };
    }, [preview, file, croppedAreaPixels, getCroppedPreview]);

    const captureVideoFrame = useCallback(async () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = PREVIEW_WIDTH;
        canvas.height = PREVIEW_HEIGHT;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return null;
        }

        const videoAspect = video.videoWidth / video.videoHeight;
        const targetAspect = PREVIEW_ASPECT;
        let sx = 0;
        let sy = 0;
        let sWidth = video.videoWidth;
        let sHeight = video.videoHeight;

        if (videoAspect > targetAspect) {
            sWidth = video.videoHeight * targetAspect;
            sx = (video.videoWidth - sWidth) / 2;
        } else if (videoAspect < targetAspect) {
            sHeight = video.videoWidth / targetAspect;
            sy = (video.videoHeight - sHeight) / 2;
        }

        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);

        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
        });

        if (!blob) return null;
        const file = new File([blob], "preview.jpg", { type: "image/jpeg" });
        const url = canvas.toDataURL("image/jpeg", 0.9);
        setVideoPreviewFile(file);
        setVideoPreviewUrl(url);
        return file;
    }, [PREVIEW_ASPECT, PREVIEW_HEIGHT, PREVIEW_WIDTH]);

    useEffect(() => {
        if (!preview || !file || !file.type.startsWith("video/")) {
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        const handleLoaded = () => {
            setVideoDuration(video.duration);
            setVideoTime(0);
            video.currentTime = 0;
        };

        const handleSeeked = () => {
            captureVideoFrame();
        };

        video.addEventListener("loadedmetadata", handleLoaded);
        video.addEventListener("seeked", handleSeeked);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoaded);
            video.removeEventListener("seeked", handleSeeked);
        };
    }, [preview, file, captureVideoFrame]);

    const handleVideoTimeChange = (value: number) => {
        if (!videoRef.current) return;
        setVideoTime(value);
        videoRef.current.currentTime = value;
    };

    const buildPreviewFile = async () => {
        if (!file) return null;

        if (file.type.startsWith("image/")) {
            if (!preview || !croppedAreaPixels) return null;
            const canvas = await getCroppedPreview(preview, croppedAreaPixels);
            const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
            });
            if (!blob) return null;
            return new File([blob], "preview.jpg", { type: "image/jpeg" });
        }

        if (file.type.startsWith("video/")) {
            if (videoPreviewFile) return videoPreviewFile;
            const file = await captureVideoFrame();
            return file ?? null;
        }

        return null;
    };

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
                                    <div className="mt-2 space-y-3">
                                        <p className="font-medium text-slate-200">Предпросмотр и выбор превью 9:16</p>
                                        {file?.type.startsWith("video/") ? (
                                            <div className="space-y-3">
                                                <video
                                                    ref={videoRef}
                                                    src={preview}
                                                    className="rounded-xl max-h-64 object-contain border border-slate-800 w-full bg-slate-900/70"
                                                    controls
                                                />
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={Math.max(0, videoDuration)}
                                                        step={0.1}
                                                        value={videoTime}
                                                        onChange={(e) => handleVideoTimeChange(Number(e.target.value))}
                                                        className="w-full"
                                                    />
                                                    <span className="text-xs text-slate-400 w-12 text-right">
                                                        {videoTime.toFixed(1)}s
                                                    </span>
                                                </div>
                                                {videoPreviewUrl && (
                                                    <img
                                                        src={videoPreviewUrl}
                                                        alt="preview"
                                                        className="rounded-xl max-h-64 object-contain border border-slate-800 w-full bg-slate-900/70"
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="relative h-80 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
                                                    <Cropper
                                                        image={preview}
                                                        crop={crop}
                                                        zoom={zoom}
                                                        aspect={PREVIEW_ASPECT}
                                                        onCropChange={setCrop}
                                                        onZoomChange={setZoom}
                                                        onCropComplete={onCropComplete}
                                                    />
                                                </div>
                                                <input
                                                    type="range"
                                                    min={1}
                                                    max={3}
                                                    step={0.05}
                                                    value={zoom}
                                                    onChange={(e) => setZoom(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                {previewImageUrl && (
                                                    <img
                                                        src={previewImageUrl}
                                                        alt="preview"
                                                        className="rounded-xl max-h-64 object-contain border border-slate-800 w-full bg-slate-900/70"
                                                    />
                                                )}
                                            </div>
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
