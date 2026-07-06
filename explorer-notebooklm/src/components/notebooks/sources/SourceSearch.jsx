import { Globe, Search, ChevronDown, Sparkles } from "lucide-react";

export default function SourceSearch() {
  return (
    <div className="rounded-2xl border border-zinc-700 bg-[#24262b] p-4">
      <p className="mb-4 text-sm text-zinc-300">
        Search the web for new sources
      </p>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800">
          <Globe size={16} />
          Web
          <ChevronDown size={16} />
        </button>

        <button className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm text-white hover:bg-zinc-800">
          <Sparkles size={16} />
          Fast research
          <ChevronDown size={16} />
        </button>

        <button className="ml-auto rounded-full bg-zinc-800 p-2 hover:bg-zinc-700">
          <Search size={18} className="text-zinc-300" />
        </button>
      </div>
    </div>
  );
}