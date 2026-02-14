import { Suspense } from "react";
import JobsPage from "@/app/jobs/JobsPage ";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading jobs...</div>}>
      <JobsPage />
    </Suspense>
  );
}
