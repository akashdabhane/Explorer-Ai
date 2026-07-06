import { Search } from "lucide-react";

export default function SearchButton() {
  return (
    <button className="rounded-full border border-white/10 p-2 lg:p-3 transition hover:bg-white/5">
      <Search size={22} />
    </button>
  );
}