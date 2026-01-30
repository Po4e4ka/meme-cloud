import { WifiOff } from 'lucide-react';

export default function Offline() {
    return  (
        <div className="mx-4 mb-4 rounded-2xl border border-amber-200/70 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
            <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <WifiOff className="h-5 w-5" />
                        </span>
                <div className="text-sm">
                    <div className="font-semibold">Нет соединения</div>
                    <div className="text-amber-800/80">Показываем сохранённые мемы и медиа.</div>
                </div>
            </div>
        </div>
    )
}