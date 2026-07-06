export default function SectionHeader({
  title,
  showSeeAll = false,
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>

      {showSeeAll && (
        <button
          className="
            rounded-full
            border
            border-white/10
            px-5
            py-2
            text-sm
            transition
            hover:bg-white/5
          "
        >
          See all →
        </button>
      )}
    </div>
  );
}