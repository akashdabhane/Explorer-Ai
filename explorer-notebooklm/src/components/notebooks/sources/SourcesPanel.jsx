'use client';

import { useState } from "react";
import PanelContainer from "../../common/PanelContainer";
import PanelHeader from "../../common/PanelHeader";
import AddSourceButton from "./AddSourceButton";
import SourceSearch from "./SourceSearch";
import EmptySources from "./EmptySources";
import AddSourceModal from "@/components/notebooks/source-modal/AddSourceModel";


export default function SourcesPanel() {
  const [open, setOpen] = useState(true);
  const [collapseLeftPanel, setCollapseLeftPanel] = useState(false);
  
  return (
    <PanelContainer>
      <PanelHeader
        title="Sources"
        showCollapse
        onCollapse={() => setCollapseLeftPanel(!collapseLeftPanel)}
      />

      <div className={`${collapseLeftPanel ? 'hidden w-10': 'flex' } flex-1 flex-col gap-5 overflow-y-auto p-4 `}>
        <AddSourceButton onClick={() => setOpen(true)} />

        <SourceSearch />

        <EmptySources />
      </div>
      
      <AddSourceModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </PanelContainer>
  );
}