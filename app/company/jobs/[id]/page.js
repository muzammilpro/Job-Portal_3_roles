import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import Link from "next/link";

export default async function ViewJobPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "company") {
    redirect("/api/auth/signin");
  }

  const { jobId } = params; // destructure here
  await connectDB();

  const job = await Job.findById(jobId)
    .populate({
      path: "applicants.user",
      select: "name email profile",
    })
    .lean();

  if (!job) redirect("/company/dashboard");

  const applicants = job.applicants?.map((a) => ({
    id: a.user?._id.toString(),
    name: a.user?.name,
    email: a.user?.email,
    phone: a.user?.profile?.phone,
    location: a.user?.profile?.location,
    status: a.status,
    appliedAt: a.appliedAt,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      <Link href="/company/dashboard" className="text-blue-600">
        ← Back to Dashboard
      </Link>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600">{job.description}</p>
        <div className="flex flex-wrap gap-4 text-sm mt-2">
          <span className="px-2 py-1 bg-gray-100 rounded">
            Location: {job.location || "Remote"}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded">Type: {job.jobType}</span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            Experience: {job.experienceLevel}
          </span>
          {job.salary && (
            <span className="px-2 py-1 bg-gray-100 rounded">Salary: {job.salary}</span>
          )}
          {job.applicationDeadline && (
            <span className="px-2 py-1 bg-gray-100 rounded">
              Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </span>
          )}
          <span
            className={`px-2 py-1 rounded ${
              job.isClosed ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {job.isClosed ? "Closed" : "Active"}
          </span>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No applicants yet
                </td>
              </tr>
            )}
            {applicants.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.email}</td>
                <td className="p-3">{a.phone || "-"}</td>
                <td className="p-3">{a.location || "-"}</td>
                <td className="p-3 text-center">{a.status}</td>
                <td className="p-3 text-center">
                  {new Date(a.appliedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
