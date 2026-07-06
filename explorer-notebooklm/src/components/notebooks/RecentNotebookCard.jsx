import Image from "next/image";
import { MoreVertical, FileText } from "lucide-react";

export default function RecentNotebookCard({ notebook }) {
  return (
    <article
      className="
        overflow-hidden
        rounded-2xl
        bg-[#2B2C2F]
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        cursor-pointer
      "
    >
      <div className="relative aspect-[16/9]">

        <Image
          src={notebook.cover}
          alt={notebook.title}
          fill
          className="object-cover"
        />

      </div>

      <div className="p-5">

        <div className="flex items-start justify-between">

          <h3 className="line-clamp-2 text-lg font-semibold">
            {notebook.title}
          </h3>

          <button className="rounded-full p-2 hover:bg-white/10">
            <MoreVertical size={18} />
          </button>

        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-gray-400">

          <div className="flex items-center gap-2">
            <FileText size={16} />
            {notebook.sources} sources
          </div>

          <span>{notebook.updatedAt}</span>

        </div>

      </div>

    </article>
  );
}