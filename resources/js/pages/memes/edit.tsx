import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Check } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { InternalApi } from "@/api";
import { BreadcrumbItem, HeaderAction } from '@/types';
import Cropper, { Area } from "react-easy-crop";

type MemeEditData = {
    id: number;
    title: string;
    image_url: string;
    media_url: string;
    preview_url: string | null;
    type: string;
    tags: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Редактировать мемчик',
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

export default function EditMeme() {
    const { meme } = usePage<{ meme: MemeEditData }>().props;
    const [title, setTitle] = useState(meme.title ?? "");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(meme.tags ?? []);
    const isVideo = meme.type === "video";

    const videoRef = useRef<HTMLVideoElement>(null);
    const cropInitializedRef = useRef(false);

    const PREVIEW_WIDTH = 198;
    const PREVIEW_HEIGHT = 258;
    const PREVIEW_ASPECT = PREVIEW_WIDTH / PREVIEW_HEIGHT;

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [hasImagePreviewChange, setHasImagePreviewChange] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(meme.preview_url);
    const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);

    const [videoDuration, setVideoDuration] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [hasVideoPreviewChange, setHasVideoPreviewChange] = useState(false);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(meme.preview_url);
    const [videoPreviewFile, setVideoPreviewFile] = useState<File | null>(null);
    const [shouldAutoCapture, setShouldAutoCapture] = useState(!meme.preview_url);

    useEffect(() => {
        cropInitializedRef.current = true;
    }, []);

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
        if (isVideo || !croppedAreaPixels) {
            return;
        }

        if (!hasImagePreviewChange && meme.preview_url) {
            return;
        }

        let isCancelled = false;
        getCroppedPreview(meme.media_url, croppedAreaPixels)
            .then(async (canvas) => {
                if (isCancelled) return;
                const url = canvas.toDataURL("image/jpeg", 0.9);
                const blob = await new Promise<Blob | null>((resolve) => {
                    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
                });
                if (!blob) return;
                setPreviewImageUrl(url);
                setPreviewImageFile(new File([blob], "preview.jpg", { type: "image/jpeg" }));
            })
            .catch(() => {
                if (isCancelled) return;
                setPreviewImageUrl(null);
                setPreviewImageFile(null);
            });

        return () => {
            isCancelled = true;
        };
    }, [croppedAreaPixels, getCroppedPreview, hasImagePreviewChange, isVideo, meme.media_url, meme.preview_url]);

    const captureVideoFrame = useCallback(async () => {
        if (!videoRef.current) return null;
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
        if (!isVideo || !meme.media_url) {
            return;
        }

        const video = videoRef.current;
        if (!video) return;

        const handleLoaded = () => {
            setVideoDuration(video.duration);
            if (!meme.preview_url) {
                video.currentTime = 0;
            }
        };

        const handleSeeked = () => {
            if (!shouldAutoCapture && !hasVideoPreviewChange) {
                return;
            }
            captureVideoFrame().finally(() => {
                if (shouldAutoCapture) {
                    setShouldAutoCapture(false);
                }
            });
        };

        video.addEventListener("loadedmetadata", handleLoaded);
        video.addEventListener("seeked", handleSeeked);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoaded);
            video.removeEventListener("seeked", handleSeeked);
        };
    }, [captureVideoFrame, hasVideoPreviewChange, isVideo, meme.media_url, meme.preview_url, shouldAutoCapture]);

    const handleVideoTimeChange = (value: number) => {
        if (!videoRef.current) return;
        setHasVideoPreviewChange(true);
        setVideoTime(value);
        videoRef.current.currentTime = value;
    };

    const buildPreviewFile = async () => {
        if (isVideo) {
            if (videoPreviewFile) return videoPreviewFile;
            if (!meme.preview_url) {
                return await captureVideoFrame();
            }
            return null;
        }

        if (!hasImagePreviewChange && meme.preview_url) {
            return null;
        }

        if (!croppedAreaPixels) return null;
        const canvas = await getCroppedPreview(meme.media_url, croppedAreaPixels);
        const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
        });
        if (!blob) return null;
        return new File([blob], "preview.jpg", { type: "image/jpeg" });
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', title);
        tags.forEach((t, idx) => {
            formData.append(`tags[${idx}]`, t);
        });

        const memeController = (new InternalApi).v1().meme();

        buildPreviewFile()
            .then((previewFile) => {
                if (previewFile) {
                    formData.append('preview', previewFile);
                }
                memeController.update(meme.id, formData);
            })
            .catch(() => {
                alert('Не удалось подготовить превью');
            });
    }

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            actions={actions}
        >
            <Head title="Редактировать мем" />

            <div className="w-full p-6">
                <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl">
                    <h1 className="text-2xl font-bold text-slate-100 mb-6">Редактировать мем</h1>

                    <form onSubmit={handleSubmit} className="text-slate-100">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-2 text-slate-200">Файл</label>
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                                        {isVideo ? (
                                            <video
                                                ref={videoRef}
                                                src={meme.media_url}
                                                className="rounded-xl max-h-64 object-contain w-full bg-slate-900/70"
                                                controls
                                            />
                                        ) : (
                                            <img
                                                src={meme.media_url}
                                                alt={meme.title}
                                                className="rounded-xl max-h-64 object-contain w-full bg-slate-900/70"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 space-y-3">
                                    <p className="font-medium text-slate-200">Превью 9:16</p>
                                    {isVideo ? (
                                        <div className="space-y-3">
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
                                                    image={meme.media_url}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={PREVIEW_ASPECT}
                                                    onCropChange={(nextCrop) => {
                                                        setCrop(nextCrop);
                                                        if (cropInitializedRef.current) {
                                                            setHasImagePreviewChange(true);
                                                        }
                                                    }}
                                                    onZoomChange={(value) => {
                                                        setZoom(value);
                                                        if (cropInitializedRef.current) {
                                                            setHasImagePreviewChange(true);
                                                        }
                                                    }}
                                                    onCropComplete={onCropComplete}
                                                />
                                            </div>
                                            <input
                                                type="range"
                                                min={1}
                                                max={3}
                                                step={0.05}
                                                value={zoom}
                                                onChange={(e) => {
                                                    setZoom(Number(e.target.value));
                                                    setHasImagePreviewChange(true);
                                                }}
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
                                        Сохранить
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
