"use client";

import { ArrowLeft, X } from "lucide-react";

export default function WebsiteModal({
  open,
  onClose,
  value,
  onChange,
  onInsert,
  onBack,
}) {
  if (!open) return null;

  const instructions = [
    "To add multiple URLs, separate with a space or new line.",
    "Only the visible text on the website will be imported at this time.",
    "Paid articles are not supported.",
    "Only the text transcript in YouTube will be imported at this time.",
    "Only public YouTube videos are supported.",
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-16 inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="website-modal-title"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#121212] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5 text-zinc-300" />
              </button>

              <h2
                id="website-modal-title"
                className="text-2xl font-medium text-white"
              >
                Website and YouTube URLs
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-zinc-800"
            >
              <X className="h-5 w-5 text-zinc-300" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6 px-8 py-8">
            <div>
              <p className="mb-5 text-md text-zinc-300">
                Paste in website and YouTube URLs below to upload as a source
                in NotebookLM.
              </p>

              <textarea
                rows={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste any links"
                className="w-full resize-none rounded-3xl border border-blue-500 bg-[#111111] p-6 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <ul className="list-disc space-y-2 pl-5 text-sm leading-4 text-zinc-400 text-start">
              {instructions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex justify-end">
              <button
                disabled={!value.trim()}
                onClick={onInsert}
                className="rounded-full bg-zinc-700 px-6 py-2 text-md font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}