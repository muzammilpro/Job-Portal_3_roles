"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ApplicantProfilePage() {
  const params = useParams();
  const [applicant, setApplicant] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/company/applicant/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setApplicant(data.user);
      });
  }, [params.id]);

  const updateStatus = async (newStatus) => {
    setStatus(newStatus);
    const applications = applicant.applications || [];
    if (applications.length > 0) {
      await fetch(`/api/company/applicant/${applications[0]._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      alert("Status updated");
    }
  };

  if (!applicant) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">{applicant.name}'s Profile</h1>
      <p>Email: {applicant.email}</p>
      <p>Phone: {applicant.phone}</p>

      <h2 className="mt-4 font-semibold">Update Status</h2>
      <button onClick={() => updateStatus("Accepted")} className="mr-2 bg-green-500 text-white px-2 rounded">Accept</button>
      <button onClick={() => updateStatus("Rejected")} className="bg-red-500 text-white px-2 rounded">Reject</button>
    </div>
  );
}
