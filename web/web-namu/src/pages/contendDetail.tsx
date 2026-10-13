import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  ImageOff,
  LoaderCircle,
  PlayCircle,
  Tag,
  UserRound,
  WifiOff,
} from "lucide-react";

import Header from "../components/Header";
import {
  getContentById,
  addFavorite,
  removeFavorite,
  type Content,
} from "../services/api";

const CATEGORY_NAMES: Record<string, string> = {
  meditacao: "Meditação",
  yoga: "Yoga",
  nutricao: "Nutrição",
  movimento: "Movimento",
  "saude-mental": "Saúde mental",
  sono: "Sono",
};

function getCategoryName(category?: string) {
  if (!category) return "Bem-estar";

  return (
    CATEGORY_NAMES[category] ??
    category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

function formatDuration(seconds?: number) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) {
    return null;
  }

  const totalMinutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (totalMinutes < 1) {
    return `${remainingSeconds}s`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }

  if (remainingSeconds > 0) {
    return `${totalMinutes} min ${remainingSeconds}s`;
  }

  return `${totalMinutes} min`;
}

function formatPublishedDate(date?: string) {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}

function getContentType(type?: string) {
  if (!type) return "Conteúdo";

  const types: Record<string, string> = {
    audio: "Áudio",
    video: "Vídeo",
    article: "Artigo",
    text: "Leitura",
    image: "Imagem",
  };

  return (
    types[type.toLowerCase()] ??
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ContentDetailScreen() {
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadContent() {
      setLoading(true);
      setPageError("");
      setContent(null);
      setImageError(false);
      setFavoriteError("");

      const contentId = Number(id);

      if (!id || !Number.isInteger(contentId) || contentId <= 0) {
        setPageError("O conteúdo solicitado não é válido.");
        setLoading(false);
        return;
      }

      try {
        const result = await getContentById(contentId);

        if (!active) return;

        if (!result || !result.id) {
          setPageError("Não encontramos esse conteúdo.");
          return;
        }

        setContent(result);
      } catch {
        if (active) {
          setPageError(
            "Não foi possível carregar este conteúdo. Verifique sua conexão e tente novamente.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadContent();

    return () => {
      active = false;
    };
  }, [id]);

  async function handleToggleFavorite() {
    if (!content || favoriteLoading) return;

    setFavoriteLoading(true);
    setFavoriteError("");

    try {
      if (content.isFavorite) {
        await removeFavorite(content.id);

        setContent((current) =>
          current ? { ...current, isFavorite: false } : current,
        );
      } else {
        await addFavorite(content.id);

        setContent((current) =>
          current ? { ...current, isFavorite: true } : current,
        );
      }
    } catch {
      setFavoriteError(
        "Não foi possível atualizar seus favoritos. Tente novamente.",
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  const publishedDate = content
    ? formatPublishedDate(content.publishedAt)
    : null;

  const duration = content
    ? formatDuration(content.durationSeconds)
    : null;

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar ao catálogo
        </Link>

        {loading && (
          <section
            className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 text-center"
            aria-live="polite"
          >
            <LoaderCircle
              size={36}
              className="animate-spin text-indigo-600"
              aria-hidden="true"
            />
            <h1 className="mt-5 text-lg font-semibold text-slate-800">
              Carregando conteúdo
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Estamos preparando todos os detalhes para você.
            </p>
          </section>
        )}

        {!loading && pageError && (
          <section className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <WifiOff size={30} aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Não foi possível abrir o conteúdo
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {pageError}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Tentar novamente
            </button>

            <Link
              to="/"
              className="mt-4 text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              Voltar ao catálogo
            </Link>
          </section>
        )}

        {!loading && !pageError && content && (
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <section className="relative">
              <div className="relative h-64 overflow-hidden bg-slate-100 sm:h-80 lg:h-[420px]">
                {content.thumbnailUrl && !imageError ? (
                  <img
                    src={content.thumbnailUrl}
                    alt={`Imagem de ${content.title}`}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-indigo-50 to-slate-100 text-slate-400">
                    <ImageOff size={44} strokeWidth={1.5} />
                    <span className="text-sm font-medium">
                      Imagem indisponível
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-4 p-5 sm:p-8">
                  <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                      <Tag size={14} aria-hidden="true" />
                      {getCategoryName(content.category)}
                    </span>

                    <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                      {content.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/90">
                      <span className="inline-flex items-center gap-2">
                        <PlayCircle size={17} aria-hidden="true" />
                        {getContentType(content.type)}
                      </span>

                      {duration && (
                        <span className="inline-flex items-center gap-2">
                          <Clock3 size={17} aria-hidden="true" />
                          {duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    aria-pressed={content.isFavorite}
                    className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 ${
                      content.isFavorite
                        ? "bg-white text-indigo-700 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {favoriteLoading ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                    ) : content.isFavorite ? (
                      <Check size={18} aria-hidden="true" />
                    ) : (
                      <Heart size={18} aria-hidden="true" />
                    )}

                    {favoriteLoading
                      ? "Salvando..."
                      : content.isFavorite
                        ? "Salvo nos favoritos"
                        : "Adicionar aos favoritos"}
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:p-10">
              <section>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    Sobre este conteúdo
                  </h2>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                  {content.description || "Nenhuma descrição disponível."}
                </p>

                {favoriteError && (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {favoriteError}
                  </div>
                )}
              </section>

              <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <h2 className="text-base font-bold text-slate-900">
                  Informações
                </h2>

                <div className="mt-6 space-y-6">
                  <DetailItem
                    icon={<UserRound size={19} aria-hidden="true" />}
                    label="Instrutor(a)"
                    value={content.instructor || "Não informado"}
                  />

                  <DetailItem
                    icon={<Tag size={19} aria-hidden="true" />}
                    label="Categoria"
                    value={getCategoryName(content.category)}
                  />

                  <DetailItem
                    icon={<PlayCircle size={19} aria-hidden="true" />}
                    label="Formato"
                    value={getContentType(content.type)}
                  />

                  {duration && (
                    <DetailItem
                      icon={<Clock3 size={19} aria-hidden="true" />}
                      label="Duração"
                      value={duration}
                    />
                  )}

                  {publishedDate && (
                    <DetailItem
                      icon={<CalendarDays size={19} aria-hidden="true" />}
                      label="Publicado em"
                      value={publishedDate}
                    />
                  )}
                </div>
              </aside>
            </div>
          </article>
        )}
      </main>
    </div>
  );
}