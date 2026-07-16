import StudioCard from "./StudioCard";
import { studioTools } from "@/lib/studioData";

export default function StudioGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {studioTools.map((tool) => (
        <StudioCard
          key={tool.id}
          title={tool.title}
          icon={tool.icon}
        />
      ))}
    </div>
  );
}