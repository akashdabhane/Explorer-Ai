import Image from "next/image";
import { Globe } from "lucide-react";

export default function NotebookCard({ notebook }) {
  return (
    <article
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      bg-[#2A2B2E]
      cursor-pointer
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-2xl
      "
    >
      <div className="relative h-64 w-full">

        <Image
          src={notebook.cover}
          alt={notebook.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-0 w-full p-5">

          <div className="mb-4 flex items-center gap-3">

            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-white
              font-semibold
              text-black
              "
            >
              {notebook.logo}
            </div>

            <span className="text-sm font-medium">
              {notebook.organization}
            </span>

          </div>

          <h3 className="line-clamp-2 text-3xl font-medium leading-tight">
            {notebook.title}
          </h3>

          <div className="mt-5 flex items-center justify-between text-sm text-gray-300">

            <span>
              {notebook.date} • {notebook.sources} sources
            </span>

            <button
              className="
              rounded-full
              bg-black/40
              p-2
              backdrop-blur-sm
              transition
              hover:bg-white
              hover:text-black
              "
            >
              <Globe size={18} />
            </button>

          </div>

        </div>

      </div>
    </article>
  );
}