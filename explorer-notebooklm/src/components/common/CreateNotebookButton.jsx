import { Plus } from "lucide-react";

export default function CreateNotebookButton({ onClick }) {
  return (
    <button className="flex items-center text-xs lg:text-base gap-1 lg:gap-2 rounded-full bg-white px-4 py-2 lg:px-6 lg:py-3 font-medium text-black transition hover:bg-gray-200" onClick={onClick}>
      <Plus size={18} />

      <span>
        Create 
      </span>
      <span className="hidden lg:inline">
        new
      </span>
    </button>
  );
}