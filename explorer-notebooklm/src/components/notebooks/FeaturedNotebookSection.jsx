import NotebookGrid from "./NotebookGrid";
import SectionHeader from "./SectionHeader";

export default function FeaturedNotebookSection({
  notebooks,
}) {
  return (
    <section className="mt-14">

      <SectionHeader
        title="Featured notebooks"
        showSeeAll
      />

      <NotebookGrid notebooks={notebooks} />

    </section>
  );
}