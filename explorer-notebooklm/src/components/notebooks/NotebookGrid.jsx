import NotebookCard from "./NotebookCard";

export default function NotebookGrid({
  notebooks,
  className = "",
}) {
  return (
    <div
      className={`
        grid
        gap-6

        grid-cols-1

        sm:grid-cols-2

        lg:grid-cols-3

        xl:grid-cols-4

        ${className}
      `}
    >
      {notebooks.map((notebook) => (
        <NotebookCard
          key={notebook.id}
          notebook={notebook}
        />
      ))}
    </div>
  );
}