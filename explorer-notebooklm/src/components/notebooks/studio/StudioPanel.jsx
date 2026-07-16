import PanelContainer from "../../common/PanelContainer";
import PanelHeader from "../../common/PanelHeader";
import StudioGrid from "./StudioGrid";
import StudioFooter from "./StudioFooter";

export default function StudioPanel() {
  return (
    <PanelContainer>
      <PanelHeader
        title="Studio"
        showCollapse
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
        <div>
          <h3 className="mb-2 text-lg font-medium text-white">
            Create
          </h3>

          <p className="text-sm leading-6 text-zinc-400">
            Generate study materials, summaries, and other helpful content from
            your notebook sources.
          </p>
        </div>

        <StudioGrid />

        <div className="mt-auto">
          <StudioFooter />
        </div>
      </div>
    </PanelContainer>
  );
}