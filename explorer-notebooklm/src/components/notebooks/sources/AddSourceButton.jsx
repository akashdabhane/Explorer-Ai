import { Plus } from "lucide-react";

export default function AddSourceButton({ onClick }) {
  return (
    <button className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-zinc-700 bg-[#24262b] text-white transition hover:bg-zinc-800" onClick={onClick}>
      <Plus size={18} />
      <span className="font-medium">Add sources</span>
    </button>
  );
}