"use client";

const tabs = [
  "All",
  "My notebooks",
  "Featured notebooks",
];

export default function DashboardTabs({ active, setActive }) {

  return (
    <div className="flex items-center gap-3">

      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`rounded-full px-5 py-2.5 text-sm transition
          
          ${
            active === tab
              ? "bg-[#3C4043] text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }
          `}
        >
          {tab}
        </button>
      ))}

    </div>
  );
}