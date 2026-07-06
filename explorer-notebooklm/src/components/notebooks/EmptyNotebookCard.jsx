import { Plus } from "lucide-react";

export default function EmptyNotebookCard() {
  return (
    <button
      className="
      flex
      h-64
      w-full
      flex-col
      items-center
      justify-center
      rounded-2xl
      border-2
      border-dashed
      border-white/10
      bg-[#2A2B2E]
      transition
      hover:border-white/30
      hover:bg-[#333438]
      "
    >
      <div
        className="
        mb-4
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-[#3C4043]
        "
      >
        <Plus size={32} />
      </div>

      <span className="text-lg font-medium">
        Create Notebook
      </span>
    </button>
  );
}