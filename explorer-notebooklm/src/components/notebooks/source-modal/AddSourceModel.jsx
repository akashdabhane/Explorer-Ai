"use client";

import ModalHeader from "./ModalHeader";
import WebSearchSection from "./WebSearchSection";
import FileDropzone from "./FileDropzone";

export default function AddSourceModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-20 inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl rounded-3xl border border-zinc-800 bg-[#121212] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader onClose={onClose} />

          <WebSearchSection />

          <FileDropzone />
        </div>
      </div>
    </>
  );
}