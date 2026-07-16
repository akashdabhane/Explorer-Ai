'use client';

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import FeaturedNotebookSection from "@/components/notebooks/FeaturedNotebookSection";
import RecentNotebookSection from "@/components/notebooks/RecentNotebookSection";

import {
  featuredNotebooks,
  recentNotebooks,
} from "@/lib/notebookData";

export default function DashboardPage() {
  const [active, setActive] = useState("All");


  const handleDeleteNotebook = async (notebookId) => {
    try {
      const res = await fetch(`/api/notebooks/${notebookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to delete notebook");
      }

      // Optionally, you can update the state to remove the deleted notebook from the UI
    } catch (error) {
      console.error("Error deleting notebook:", error);
    }
  }


  const updateNotebookTitle = async (notebookId, newTitle) => {
    try {
      const res = await fetch(`/api/notebooks/${notebookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!res.ok) {
        throw new Error("Failed to update notebook title");
      }

      // Optionally, you can update the state to reflect the new title in the UI
    } catch (error) {
      console.error("Error updating notebook title:", error);
    }
  }


  const fetchNotebooks = async () => {
    try {
      const res = await fetch("/api/notebooks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notebooks");
      }
      
      const data = await res.json();
      // Handle the fetched data as needed
    } catch (error) {
      console.error("Error fetching notebooks:", error);
    }
  }

  useEffect(() => {
    fetchNotebooks();
  }, []);
  

  return (
    <main className="min-h-screen bg-[#202124] text-white">

      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <DashboardHeader active={active} setActive={setActive} />

        {active === "All" || active === "Featured notebooks" ? (
          <FeaturedNotebookSection
            notebooks={featuredNotebooks}
          />
        ) : null}

        {active === "All" || active === "My notebooks" ? (
          <RecentNotebookSection
            notebooks={recentNotebooks}
          />
        ) : null}

      </div>

    </main>
  );
}