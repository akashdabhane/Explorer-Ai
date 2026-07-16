import { X } from "lucide-react";

export default function ModalHeader({ onClose }) {
  return (
    <div className="relative px-8 pt-10 pb-6">
      <button
        onClick={onClose}
        className="absolute right-8 top-8 rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="text-center">
        <h2 className="text-3xl font-medium leading-tight text-white">
          Create Audio and Video Overviews
          <br />
          from{" "}
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            your notes
          </span>
        </h2>
      </div>
    </div>
  );
}