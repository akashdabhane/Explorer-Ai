import { ChevronDown } from "lucide-react";

export default function SortDropdown() {
  return (
    <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 lg:px-5 lg:py-3 transition hover:bg-white/5">
      <span className="text-xs lg:text-sm">
        Most recent
      </span>

      <ChevronDown size={18} />
    </button>
  );
}