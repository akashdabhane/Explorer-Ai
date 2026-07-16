export default function UploadActionButton({
  icon: Icon,
  label,
  iconClassName = "",
  onClick
}) {
  return (
    <button className="flex items-center gap-3 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-800" onClick={onClick}>
      <Icon className={`h-5 w-5 ${iconClassName}`} />
      <span>{label}</span>
    </button>
  );
}