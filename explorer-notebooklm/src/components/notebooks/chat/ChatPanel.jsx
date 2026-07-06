import PanelContainer from "../../common/PanelContainer";
import ChatHeader from "./ChatHeader";
import NotebookHero from "./NotebookHero";
import ChatInput from "./ChatInput";

export default function ChatPanel() {
  return (
    <PanelContainer>
      <ChatHeader />

      <div className="flex flex-1 items-center justify-center overflow-y-auto">
        <NotebookHero />
      </div>

      <ChatInput />
    </PanelContainer>
  );
}