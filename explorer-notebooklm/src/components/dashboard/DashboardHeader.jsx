import DashboardTabs from "../common/DashboardTabs";
import SearchButton from "../common/SearchButton";
import ViewSwitcher from "../common/ViewSwitcher";
import SortDropdown from "../common/SortDropdown";
import CreateNotebookButton from "../common/CreateNotebookButton";

export default function DashboardHeader() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between">

      <DashboardTabs />

      <div className="flex items-center gap-4 mb-4 lg:mb-0">

        <SearchButton />

        <ViewSwitcher />

        <SortDropdown />

        <CreateNotebookButton />

      </div>

    </div>
  );
}