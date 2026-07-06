import NotebookTopbar from "@/components/notebooks/NotebookTopbar";
import NotebookLayout from "@/components/notebooks/NotebookLayout";

import SourcesPanel from "@/components/notebooks/sources/SourcesPanel";
import ChatPanel from "@/components/notebooks/chat/ChatPanel";

export default function NotebookPage() {
  return (
    <>
      <NotebookTopbar />

      <NotebookLayout
        sourcesPanel={<SourcesPanel />}
        chatPanel={<ChatPanel />}
        studioPanel={<div />}
      />
    </>
  );
}