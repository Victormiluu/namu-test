
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">


          <span className="text-lg font-bold tracking-tight">
            Teste Namu<span className="text-indigo-600"></span>
          </span>
        </Link>
      </div>
    </header>
  );
}
