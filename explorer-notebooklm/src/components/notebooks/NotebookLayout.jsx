export default function NotebookLayout({
  sourcesPanel,
  chatPanel,
  studioPanel,
}) {
  return (
    <main className="h-[calc(100vh-80px)] overflow-hidden bg-[#1f2023] px-4 pb-4">
      <div className="grid h-full gap-4 lg:grid-cols-[340px_minmax(0,1fr)_360px]">
        {/* Sources */}
        <section className="min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-[#24262b]">
          {sourcesPanel}
        </section>

        {/* Chat */}
        <section className="min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-[#24262b]">
          {chatPanel}
        </section>

        {/* Studio */}
        <section className="min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-[#24262b]">
          {studioPanel}
        </section>
      </div>
    </main>
  );
}