import SectionHeader from "./SectionHeader";
import RecentNotebookGrid from "./RecentNotebookGrid";

export default function RecentNotebookSection({
  notebooks,
}) {
  return (
    <section className="mt-16">

      <SectionHeader
        title="Recent notebooks"
        showSeeAll
      />

      <RecentNotebookGrid
        notebooks={notebooks}
      />

    </section>
  );
}