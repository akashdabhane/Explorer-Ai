import { BookOpen, Sparkles } from "lucide-react";

export default function NotebookHero() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
        <BookOpen
          size={34}
          className="text-zinc-300"
          strokeWidth={1.7}
        />
      </div>

      <h1 className="text-3xl font-semibold text-white">
        Untitled notebook
      </h1>

      <p className="mt-3 text-sm text-zinc-500">
        Created Yesterday • 0 sources
      </p>

      <button className="mt-8 flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800">
        <Sparkles size={16} />
        Customize
      </button>
    </div>
  );
}