
import { useState } from "react";
import {
  Upload,
  Link2,
  Triangle,
  Clipboard,
} from "lucide-react";

import UploadActionButton from "./UploadActionButton";
import WebsiteModal from "@/components/notebooks/website-modal/WebsiteModal";
import CopiedTextModal from "@/components/notebooks/modal/CopiedTextModal";


export default function UploadActions() {
  const [openWebsiteModal, setOpenWebsiteModal] = useState(false);
  const [openCopiedTextModal, setOpenCopiedTextModal] = useState(false);
  const [websiteUrls, setWebsiteUrls] = useState("");
  const [text, setText] = useState("");


  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <input 
        className="hidden"
        type="file" 
        name="fileInput" 
        id="fileInput" 
      />
      <label htmlFor="fileInput">
        <UploadActionButton
          icon={Upload}
          label="Upload files"
        />
      </label>

      <UploadActionButton
        onClick={() => setOpenWebsiteModal(true)}
        icon={Link2}
        label="Websites"
      />

      <UploadActionButton
        icon={Triangle}
        label="Drive"
      />

      <UploadActionButton
        onClick={() => setOpenCopiedTextModal(true)}
        icon={Clipboard}
        label="Copied text"
      />


      <WebsiteModal
        open={openWebsiteModal}
        value={websiteUrls}
        onChange={setWebsiteUrls}
        onClose={() => setOpenWebsiteModal(false)}
        onBack={() => console.log("Back")}
        onInsert={() => console.log(websiteUrls)}
      />

      <CopiedTextModal
        open={openCopiedTextModal}
        value={text}
        onChange={setText}
        onBack={() => console.log("Back")}
        onClose={() => setOpenCopiedTextModal(false)}
        onInsert={() => {
          console.log(text);
          setOpenCopiedTextModal(false);
        }}
      />
    </div>
  );
}