import { EllipsisVertical, PanelLeftClose } from "lucide-react";

export default function PanelHeader({
  title,
  showMenu = false,
  showCollapse = false,
  onCollapse
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-5">
      <h2 className="text-lg font-medium text-white">
        {title}
      </h2>

      <div className="flex items-center gap-2">
        {showMenu && (
          <button className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white">
            <EllipsisVertical size={18} />
          </button>
        )}

        {showCollapse && (
          <button className="rounded-md p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white" onClick={onCollapse}>
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>
    </header>
  );
}