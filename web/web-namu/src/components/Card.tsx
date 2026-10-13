import { Link } from "react-router-dom";
import { ImageOff, ArrowRight } from "lucide-react";
import type { Content } from "../services/api";

interface CardProps {
    content: Content;
    categoryName: string;
}

function getImage(content: Content) {
    return content.thumbnailUrl || "";
}
function formatContentType(type?: string) {
    if (!type) return "";

    const types: Record<string, string> = {
        audio: "Áudio",
        video: "Vídeo",
        artigo: "Artigo",
        article: "Artigo",
        texto: "Texto",
        text: "Texto",
        imagem: "Imagem",
        image: "Imagem",
    };

    const normalizedType = type.trim().toLowerCase();

    return (
        types[normalizedType] ??
        normalizedType.charAt(0).toLocaleUpperCase("pt-BR") +
        normalizedType.slice(1)
    );
}


function formatDuration(durationSeconds?: number | string) {
    if (
        durationSeconds === undefined ||
        durationSeconds === null ||
        durationSeconds === ""
    ) {
        return null;
    }

    const totalSeconds = Number(durationSeconds);

    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
        return null;
    }

    const seconds = Math.floor(totalSeconds);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
        return remainingSeconds > 0
            ? `${minutes} min ${remainingSeconds}s`
            : `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}min`
        : `${hours}h`;
}

export default function Card({
    content,
    categoryName,
}: CardProps) {
    const image = getImage(content);
    const duration = formatDuration(content.durationSeconds);

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Link
                to={`/contents/${content.id}`}
                className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-indigo-500"
            >
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-100 to-slate-100">
                    {image ? (
                        <img
                            src={image}
                            alt={content.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                            <ImageOff
                                size={48}
                                strokeWidth={1.5}
                                className="text-indigo-300"
                                aria-hidden="true"
                            />

                            <span className="text-center text-sm font-medium text-slate-500">
                                Não foi possível carregar a imagem
                            </span>
                        </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                        {categoryName}
                    </span>
                </div>

                <div className="p-5">
                    <h3 className="line-clamp-2 min-h-12 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-indigo-700">
                        {content.title}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {content.type && (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                {formatContentType(content.type)}
                            </span>
                        )}

                        {duration && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 7v5l3 2" />
                                </svg>

                                {duration}
                            </span>
                        )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-semibold text-indigo-600">
                            Ver conteúdo
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
}