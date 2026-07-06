import PanelContainer from "../../common/PanelContainer";
import PanelHeader from "../../common/PanelHeader";
import AddSourceButton from "./AddSourceButton";
import SourceSearch from "./SourceSearch";
import EmptySources from "./EmptySources";

export default function SourcesPanel() {
  return (
    <PanelContainer>
      <PanelHeader
        title="Sources"
        showCollapse
      />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
        <AddSourceButton />

        <SourceSearch />

        <EmptySources />
      </div>
    </PanelContainer>
  );
}