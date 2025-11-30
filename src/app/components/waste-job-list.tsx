"use client";

import { useEffect, useState } from "react";
import { WasteJob, WasteJobCard } from "./waste-job-card";
import { Loader2 } from "lucide-react";

export function WasteJobList() {
  const [wasteJobs, setWasteJobs] = useState<WasteJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWasteJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/wastejobs");
        if (!response.ok) {
          throw new Error("Failed to fetch waste jobs");
        }
        const data = await response.json();
        setWasteJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (wasteJobs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>No waste jobs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {wasteJobs.map((job) => (
        <WasteJobCard key={job.id} wasteJob={job} variant={job.status} />
      ))}
    </div>
  );
}