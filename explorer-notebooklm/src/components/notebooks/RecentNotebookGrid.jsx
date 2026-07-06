import RecentNotebookCard from "./RecentNotebookCard";

export default function RecentNotebookGrid({ notebooks }) {
  return (
    <div
      className="
        grid
        gap-6

        grid-cols-1

        sm:grid-cols-2

        lg:grid-cols-3

        xl:grid-cols-4
      "
    >
      {notebooks.map((notebook) => (
        <RecentNotebookCard
          key={notebook.id}
          notebook={notebook}
        />
      ))}
    </div>
  );
}