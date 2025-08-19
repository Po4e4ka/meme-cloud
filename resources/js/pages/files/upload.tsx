import { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUrl(res.data.url);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input
                    type="file"
                    accept="video/mp4,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
                    disabled={!file || uploading}
                >
                    {uploading ? 'Загрузка...' : 'Загрузить'}
                </button>
            </form>

            {url && (
                <div className="mt-4">
                    <p>Файл загружен:</p>
                    {url.endsWith('.mp4') ? (
                        <video src={url} controls className="w-[200px] h-[260px] object-cover" />
                    ) : (
                        <img src={url} alt="Uploaded" className="w-[200px] h-[260px] object-cover" />
                    )}
                </div>
            )}
        </div>
    );
}
