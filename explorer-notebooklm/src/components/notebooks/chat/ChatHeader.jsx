import { EllipsisVertical } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-5">
      <h2 className="text-lg font-medium text-white">Chat</h2>

      <button className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
        <EllipsisVertical size={18} />
      </button>
    </header>
  );
}