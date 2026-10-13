import { Link } from "react-router-dom";
import { ArrowLeft, CircleX } from "lucide-react";

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-emerald-50">
          <CircleX
            size={76}
            strokeWidth={1.2}
            className="text-emerald-600"
          />

        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Erro 404
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ops! Página não encontrada
        </h1>

        <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-500">
          Parece que esse conteúdo saiu do caminho. Vamos voltar para um lugar
          onde você possa continuar sua jornada de bem-estar.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <ArrowLeft size={18} />
          Voltar ao catálogo
        </Link>

       
      </div>
    </main>
  );
}