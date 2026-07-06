import Navbar from "@/components/layout/Navbar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import FeaturedNotebookSection from "@/components/notebooks/FeaturedNotebookSection";
import RecentNotebookSection from "@/components/notebooks/RecentNotebookSection";

import {
  featuredNotebooks,
  recentNotebooks,
} from "@/lib/notebookData";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#202124] text-white">

      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <DashboardHeader />

        <FeaturedNotebookSection
          notebooks={featuredNotebooks}
        />

        <RecentNotebookSection
          notebooks={recentNotebooks}
        />

      </div>

    </main>
  );
}