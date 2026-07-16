import { ChevronDown, Globe, Sparkles } from "lucide-react";

export default function SearchFilters() {
  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-zinc-500">
        <Globe className="h-4 w-4" />
        Web
        <ChevronDown className="h-4 w-4" />
      </button>

      <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-zinc-500">
        <Sparkles className="h-4 w-4" />
        Fast research
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}