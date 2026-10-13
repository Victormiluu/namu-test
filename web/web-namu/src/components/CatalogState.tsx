
interface CatalogStateProps {
  type: "loading" | "error" | "empty";
  message?: string;
  onRetry?: () => void;
  onClear?: () => void;
}

export default function CatalogState({
  type,
  message,
  onRetry,
  onClear,
}: CatalogStateProps) {
  if (type === "loading") {
    return (
      <div
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Carregando conteúdos"
        aria-busy="true"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          >
            <div className="aspect-[16/9] animate-pulse bg-slate-200" />

            <div className="space-y-3 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "error") {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-600">
          !
        </div>

        <h3 className="mt-4 font-bold">
          Não foi possível carregar
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {message ?? "Ocorreu um erro ao buscar os conteúdos."}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
        ⌕
      </div>

      <h3 className="mt-4 text-lg font-bold">
        Nenhum conteúdo encontrado
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Não encontramos resultados para esses filtros.
        Experimente outro título ou categoria.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Limpar filtros
      </button>
    </section>
  );
}
