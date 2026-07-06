"use client";

import { Grid2X2, List } from "lucide-react";
import { useState } from "react";

export default function ViewSwitcher() {
  const [view, setView] = useState("grid");

  return (
    <div className="flex overflow-hidden rounded-full border border-white/10">

      <button
        onClick={() => setView("grid")}
        className={`p-2 lg:p-3 ${
          view === "grid"
            ? "bg-[#3C4043]"
            : "hover:bg-white/5"
        }`}
      >
        <Grid2X2 size={20} />
      </button>

      <button
        onClick={() => setView("list")}
        className={`p-2 lg:p-3 ${
          view === "list"
            ? "bg-[#3C4043]"
            : "hover:bg-white/5"
        }`}
      >
        <List size={20} />
      </button>

    </div>
  );
}