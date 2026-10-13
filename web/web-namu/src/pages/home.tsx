
import { useEffect, useState } from "react";
import Header from "../components/Header"
import CatalogFilters from "../components/CatalogFilters";
import ContentGrid from "../components/Grid";
import CatalogState from "../components/CatalogState";
import Pagination from "../components/Pagination";

import {
    getCategories,
    getContents,
    type Category,
    type Content,
} from "../services/api";

const PAGE_SIZE = 10;

export default function HomeScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [contents, setContents] = useState<Content[]>([]);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const result = await getCategories();

                if (!cancelled) {
                    setCategories(result);
                }
            } catch {
                if (!cancelled) {
                    setCategories([]);
                }
            }
        }

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        let cancelled = false;

        async function loadContents() {
            setLoading(true);
            setError("");

            try {
                const result = await getContents({
                    search,
                    category: selectedCategory,
                    page,
                    limit: PAGE_SIZE,
                });

                if (cancelled) return;

                setContents(result.data);
                setTotal(result.total);
                setTotalPages(result.totalPages);
            } catch {
                if (cancelled) return;

                setContents([]);
                setTotal(0);
                setTotalPages(1);
                setError(
                    "Não conseguimos carregar os conteúdos. Verifique sua conexão e tente novamente."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadContents();

        return () => {
            cancelled = true;
        };
    }, [search, selectedCategory, page, retryCount]);

    function handleSearchChange(value: string) {
        setSearchInput(value);
    }

    function handleCategoryChange(value: string) {
        setSelectedCategory(value);
        setPage(1);
    }

    function handleClearFilters() {
        setSearchInput("");
        setSearch("");
        setSelectedCategory("");
        setPage(1);
    }

    function handleRetry() {
        setRetryCount((current) => current + 1);
    }

    return (
        <div className="min-h-screen w-full bg-slate-50">
            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
                <CatalogFilters
                    categories={categories}
                    search={searchInput}
                    selectedCategory={selectedCategory}
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onClear={handleClearFilters}
                />

                <section aria-label="Resultados do catálogo">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                Descubra conteúdos
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {loading
                                    ? "Buscando conteúdos..."
                                    : `${total} ${total === 1
                                        ? "conteúdo encontrado"
                                        : "conteúdos encontrados"
                                    }`}
                            </p>
                        </div>

                        {!loading && !error && totalPages > 1 && (
                            <span className="text-sm text-slate-500">
                                Página {page} de {totalPages}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <CatalogState type="loading" />
                    ) : error ? (
                        <CatalogState
                            type="error"
                            message={error}
                            onRetry={handleRetry}
                        />
                    ) : contents.length === 0 ? (
                        <CatalogState
                            type="empty"
                            onClear={handleClearFilters}
                        />
                    ) : (
                        <>
                            <ContentGrid
                                contents={contents}
                                categories={categories}
                            />

                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}
