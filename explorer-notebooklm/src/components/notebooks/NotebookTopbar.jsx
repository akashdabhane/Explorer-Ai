import Link from "next/link";
import {
  Plus,
  ChartNoAxesCombined,
  Share2,
  Settings,
  Grid2x2,
} from "lucide-react";

export default function NotebookTopbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#1f2023]">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white"
          >
            {/* Temporary logo */}
            <div className="h-6 w-6 rounded-full border-4 border-black border-t-transparent" />
          </Link>

          <h1 className="text-2xl font-medium text-white">
            Untitled notebook
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-zinc-100">
            <Plus size={18} />
            <span>Create notebook</span>
          </button>

          <button className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-white transition hover:bg-zinc-800">
            <ChartNoAxesCombined size={18} />
            <span>Analytics</span>
          </button>

          <button className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-white transition hover:bg-zinc-800">
            <Share2 size={18} />
            <span>Share</span>
          </button>

          <button className="flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-3 text-white transition hover:bg-zinc-800">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-300">
            PRO
          </span>

          <button className="rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800">
            <Grid2x2 size={22} />
          </button>

          <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-purple-500 bg-orange-500 font-semibold text-white">
            A
          </button>
        </div>
      </div>
    </header>
  );
}