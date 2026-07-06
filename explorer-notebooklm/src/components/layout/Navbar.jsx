"use client";

import { Settings, Grid2x2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">

        {/* Left */}

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/10" />

          <h1 className="hidden lg:block text-3xl font-semibold tracking-tight">
            NotebookLM
          </h1>
        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <button className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:bg-white/5">
            <Settings size={18} />
            Settings
          </button>

          <button className="rounded-full p-2 hover:bg-white/10">
            <Grid2x2 size={22} />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-semibold">
            A
          </div>

        </div>

      </div>
    </header>
  );
}