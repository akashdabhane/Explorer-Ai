'use client';

import DashboardTabs from "../common/DashboardTabs";
import SearchButton from "../common/SearchButton";
import ViewSwitcher from "../common/ViewSwitcher";
import SortDropdown from "../common/SortDropdown";
import CreateNotebookButton from "../common/CreateNotebookButton";
import { useRouter } from "next/navigation";


export default function DashboardHeader({ active, setActive }) {
  const router = useRouter();

  const handleCreateNotebook = async () => {
    try {
      router.push("/notebook/creating");
      const res = await fetch("/api/notebooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to create notebook");
      }
      
      const data = await res.json();
      router.push(`/notebook/${data.notebook._id}`);
      console.log("Notebook created:", data.notebook);
      // Optionally, you can refresh the notebook list or update the state here
    } catch (error) {
      console.error("Error creating notebook:", error);
    } finally {
      // Any cleanup or final actions can be performed here
    }
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between">

      <DashboardTabs active={active} setActive={setActive} />

      <div className="flex items-center gap-4 mb-4 lg:mb-0">

        <SearchButton />

        <ViewSwitcher />

        <SortDropdown />

        <CreateNotebookButton onClick={handleCreateNotebook} />

      </div>

    </div>
  );
}