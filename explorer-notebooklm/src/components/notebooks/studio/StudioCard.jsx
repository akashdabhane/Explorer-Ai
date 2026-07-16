export default function StudioCard({ title, icon: Icon }) {
  return (
    <button className="flex flex-col items-start rounded-2xl border border-zinc-700 bg-[#2b2d31] p-5 text-left transition hover:border-zinc-500 hover:bg-zinc-800">
      <div className="mb-4 rounded-xl bg-zinc-800 p-3">
        <Icon
          size={22}
          className="text-zinc-300"
        />
      </div>

      <h3 className="text-sm font-medium text-white">
        {title}
      </h3>
    </button>
  );
}