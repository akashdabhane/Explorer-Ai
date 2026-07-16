"use client";

import { ArrowLeft, X } from "lucide-react";

export default function CopiedTextModal({
  open,
  onClose,
  onBack,
  value,
  onChange,
  onInsert,
}) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="copied-text-modal-title"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#121212] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>

              <h2
                id="copied-text-modal-title"
                className="text-3xl font-medium text-white"
              >
                Paste copied text
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-300 transition hover:bg-zinc-800"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-8 px-8 py-8">
            <p className="text-lg text-zinc-300">
              Paste your copied text below to upload as a source in NotebookLM.
            </p>

            <textarea
              rows={8}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste text here"
              className="w-full resize-none rounded-3xl border border-blue-500 bg-[#111111] p-6 text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Footer */}
            <div className="flex justify-end">
              <button
                disabled={!value.trim()}
                onClick={onInsert}
                className="rounded-full bg-zinc-700 px-8 py-3 text-lg font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
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