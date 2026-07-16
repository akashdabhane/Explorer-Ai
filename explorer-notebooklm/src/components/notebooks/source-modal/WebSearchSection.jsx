import { Search } from "lucide-react";
import SearchFilters from "./SearchFilters";

export default function WebSearchSection() {
  return (
    <section className="px-6">
      <div className="rounded-3xl border border-blue-600 bg-[#141414] p-4 shadow-[0_0_0_1px_rgba(59,130,246,0.15)]">
        <input
          type="text"
          placeholder="Search the web for new sources"
          className="w-full border-none bg-transparent text-lg text-white placeholder:text-zinc-500 focus:outline-none"
        />

        <div className="mt-5 flex items-end justify-between gap-4">
          <SearchFilters />

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-700">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}