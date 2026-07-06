import { FileText } from "lucide-react";

export default function EmptySources() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <FileText
        size={42}
        className="mb-6 text-zinc-500"
        strokeWidth={1.5}
      />

      <h3 className="mb-3 text-lg font-semibold text-zinc-300">
        Saved sources will appear here
      </h3>

      <p className="max-w-xs text-sm leading-7 text-zinc-500">
        Click Add source above to add PDFs, websites, text, videos or audio
        files. Or import a file directly from Google Drive.
      </p>
    </div>
  );
}