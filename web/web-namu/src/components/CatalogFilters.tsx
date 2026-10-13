
import type { Category } from "../services/api";

interface CatalogFiltersProps {
  categories: Category[];
  search: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
}

export default function CatalogFilters({
  categories,
  search,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Catálogo de conteúdos</h2>

        <p className="mt-1 text-sm text-slate-500">
          Encontre o conteúdo ideal para você.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px_auto]">
        <label className="relative block">
          <span className="sr-only">Buscar por título</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por título..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </label>

        <label>
          <span className="sr-only">Filtrar por categoria</span>

          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="">Todas as categorias</option>

            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onClear}
          className="h-12 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
}
