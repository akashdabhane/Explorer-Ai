import {
  ArrowUp,
  Mic,
  Plus,
} from "lucide-react";

export default function ChatInput() {
  return (
    <div className="border-t border-zinc-800 p-5">
      <div className="rounded-3xl border border-zinc-700 bg-[#2a2c31] p-4">
        <textarea
          rows={2}
          placeholder="Ask anything about your sources"
          className="w-full resize-none bg-transparent text-white placeholder:text-zinc-500 focus:outline-none"
        />

        <div className="mt-4 flex items-center justify-between">
          <button className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-white">
            <Plus size={20} />
          </button>

          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-white">
              <Mic size={20} />
            </button>

            <button className="rounded-full bg-white p-2 text-black transition hover:bg-zinc-200">
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-500">
        NotebookLM can make mistakes. Verify important information.
      </p>
    </div>
  );
}