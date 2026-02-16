// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function UserDashboard() {
//   const { data: session, status } = useSession();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (session?.user?.email) {
//       fetchProfile();
//     }
//   }, [session]);

//   const fetchProfile = async () => {
//     const res = await fetch("/api/user/profile");
//     const data = await res.json();
//     setProfile(data);
//     setLoading(false);
//   };

//   if (status === "loading" || loading) {
//     return <p>Loading dashboard...</p>;
//   }

//   if (!session || session.user.role !== "user") {
//     return <h1>Access Denied</h1>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>User Dashboard</h1>

//       <div style={{ marginBottom: "20px" }}>
//         <h2>Profile</h2>
//         <p><strong>Name:</strong> {profile.name}</p>
//         <p><strong>Email:</strong> {profile.email}</p>
//         <p><strong>Role:</strong> {profile.role}</p>
//         <p>
//           <strong>Joined:</strong>{" "}
//           {new Date(profile.createdAt).toDateString()}
//         </p>
//       </div>

//       <hr />

//       <div>
//         <h2>My Applications</h2>
//         {profile.applications?.length === 0 && (
//           <p>You have not applied for any jobs yet.</p>
//         )}

//         {profile.applications?.map((app) => (
//           <div key={app._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
//             <p><strong>Job:</strong> {app.jobTitle}</p>
//             <p><strong>Status:</strong> {app.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function UserDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (session?.user?.role === "user") {
//       fetchAppliedJobs();
//     }
//   }, [session]);

//   const fetchAppliedJobs = async () => {
//     const res = await fetch("/api/user/applied-jobs");
//     const data = await res.json();
//     setJobs(data);
//     setLoading(false);
//   };

//   if (status === "loading" || loading) {
//     return <p>Loading dashboard...</p>;
//   }

//   if (!session || session.user.role !== "user") {
//     return <h1>Access Denied</h1>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>User Dashboard</h1>

//       <h2>My Applied Jobs</h2>

//       {jobs.length === 0 && (
//         <p>You have not applied for any jobs yet.</p>
//       )}

//       {jobs.map((job) => (
//         <div
//           key={job._id}
//           style={{
//             border: "1px solid #ccc",
//             padding: "15px",
//             marginBottom: "10px",
//           }}
//         >
//           <h3>{job.title}</h3>
//           <p>{job.description}</p>

//           <p>
//             <strong>Company:</strong> {job.company.name}
//           </p>

//           <p>
//             <strong>Applied On:</strong>{" "}
//             {new Date(job.createdAt).toDateString()}
//           </p>

//           <p>
//             <strong>Status:</strong>{" "}
//             <span style={{ color: "blue" }}>Applied</span>
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function UserDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalApplied: 0,
//     pending: 0,
//     shortlisted: 0,
//     rejected: 0
//   });
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     if (session?.user?.role === "applicant") {
//       fetchAppliedJobs();
//     }
//   }, [session]);

//   // Poll for real-time-ish status updates so changes by company reflect quickly.
//   useEffect(() => {
//     if (!session?.user?.role || session.user.role !== "applicant") return;

//     const interval = setInterval(() => {
//       fetchAppliedJobs();
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [session]);

//   const fetchAppliedJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/user/applied-jobs");
//       const data = await res.json();

//       // Ensure jobs is always an array
//       let jobsArray = [];
//       if (Array.isArray(data)) {
//         jobsArray = data;
//       } else if (data && Array.isArray(data.jobs)) {
//         jobsArray = data.jobs;
//       }

//       setJobs(jobsArray);
//       calculateStats(jobsArray);
//     } catch (error) {
//       console.error("Error fetching applied jobs:", error);
//       setJobs([]);
//       calculateStats([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (jobsData) => {
//     const stats = {
//       totalApplied: jobsData.length,
//       pending: jobsData.filter(job => !job.status || job.status === "pending").length,
//       shortlisted: jobsData.filter(job => job.status === "shortlisted").length,
//       rejected: jobsData.filter(job => job.status === "rejected").length
//     };
//     setStats(stats);
//   };

//   const withdrawApplication = async (jobId) => {
//     if (!confirm("Are you sure you want to withdraw this application?")) return;

//     try {
//       const res = await fetch(`/api/user/withdraw-application`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId }),
//       });

//       if (res.ok) {
//         alert("Application withdrawn successfully!");
//         fetchAppliedJobs(); // Refresh the list
//       } else {
//         const data = await res.json();
//         alert(data.message || "Failed to withdraw application");
//       }
//     } catch (error) {
//       console.error("Error withdrawing application:", error);
//       alert("Error withdrawing application");
//     }
//   };

//   const filteredJobs = jobs.filter(job => {
//     // Filter by status
//     if (filter !== "all" && job.status !== filter) return false;

//     // Filter by search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(term) ||
//         job.company?.name.toLowerCase().includes(term) ||
//         job.description.toLowerCase().includes(term)
//       );
//     }

//     return true;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "accepted": return "bg-green-100 text-green-800 border-green-200";
//       case "shortlisted": return "bg-green-100 text-green-800 border-green-200";
//       case "rejected": return "bg-red-100 text-red-800 border-red-200";
//       case "reviewed": return "bg-purple-100 text-purple-800 border-purple-200";
//       default: return "bg-blue-100 text-blue-800 border-blue-200";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending": return "Pending";
//       case "accepted": return "Accepted";
//       case "shortlisted": return "Shortlisted";
//       case "rejected": return "Not Selected";
//       case "reviewed": return "Under Review";
//       default: return "Applied";
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//     return formatDate(dateString);
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header Skeleton */}
//           <div className="animate-pulse mb-8">
//             <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//             <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//           </div>

//           {/* Stats Skeleton */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                 <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//               </div>
//             ))}
//           </div>

//           {/* Jobs Skeleton */}
//           <div className="space-y-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                 <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
//                 <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-2/3"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "applicant") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
//         <div className="text-center">
//           <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <span className="text-4xl"></span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
//           <p className="text-gray-600 mb-6">
//             You need to be logged in as an applicant to access this dashboard.
//           </p>
//           <a
//             href="/api/auth/signin"
//             className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Sign In
//           </a>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//                 Welcome back, {session.user.name}!
//               </h1>
//               <p className="text-gray-600">
//                 Track your job applications and manage your career journey
//               </p>
//             </div>
//             <div className="mt-4 md:mt-0 flex items-center space-x-4">
//               <span className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-full">
//                 {session.user.email}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Applied</p>
//                 <h3 className="text-3xl font-bold text-gray-900">{stats.totalApplied}</h3>
//               </div>
//               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
//                 <span className="text-2xl text-blue-600"></span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Pending</p>
//                 <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
//               </div>
//               <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
//                 <span className="text-2xl text-yellow-600"></span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Shortlisted</p>
//                 <h3 className="text-3xl font-bold text-gray-900">{stats.shortlisted}</h3>
//               </div>
//               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
//                 <span className="text-2xl text-green-600"></span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Rejected</p>
//                 <h3 className="text-3xl font-bold text-gray-900">{stats.rejected}</h3>
//               </div>
//               <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
//                 <span className="text-2xl text-red-600"></span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 mb-2">My Applications</h2>
//               <p className="text-gray-600">
//                 Track and manage all your job applications
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               {/* Search */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search applications..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
//                 />
//                 <span className="absolute left-3 top-2.5"></span>
//               </div>

//               {/* Filter */}
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">All Applications</option>
//                 <option value="pending">Pending</option>
//                 <option value="shortlisted">Shortlisted</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Applications List */}
//         <div className="space-y-6">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
//               <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                 <span className="text-4xl">📄</span>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 No applications found
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 {searchTerm || filter !== "all"
//                   ? "Try adjusting your search or filter"
//                   : "You haven't applied to any jobs yet"}
//               </p>
//               {!searchTerm && filter === "all" && (
//                 <a
//                   href="/jobs"
//                   className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Browse Jobs
//                 </a>
//               )}
//             </div>
//           ) : (
//             filteredJobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group"
//               >
//                 <div className="p-6">
//                   <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
//                     {/* Job Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-4">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
//                             {job.title}
//                           </h3>
//                           <div className="flex items-center text-gray-600 mb-3">
//                             <span className="mr-2"></span>
//                             <span className="font-medium">{job.company?.name}</span>
//                           </div>
//                         </div>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(job.status)}`}>
//                           {getStatusText(job.status)}
//                         </span>
//                       </div>

//                       <p className="text-gray-600 line-clamp-2 mb-6">
//                         {job.description}
//                       </p>

//                       <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <span className="mr-2"></span>
//                           <span>{job.location}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="mr-2"></span>
//                           <span>{job.salary || "Competitive"}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="mr-2"></span>
//                           <span>Applied {formatTimeAgo(job.createdAt)}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex flex-col gap-3">
//                       <button
//                         onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
//                         className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                       >
//                         <span className="mr-2"></span>
//                         View Job
//                       </button>

//                       {(!job.status || job.status === "applied") && (
//                         <button
//                           onClick={() => withdrawApplication(job._id)}
//                           className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
//                         >
//                           <span className="mr-2"></span>
//                           Withdraw
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Application Details */}
//                   <div className="mt-6 pt-6 border-t border-gray-100">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-500 mb-1">Application ID</p>
//                         <p className="font-mono text-sm text-gray-900">
//                           {job.applicationId || "APP-" + job._id.slice(-8).toUpperCase()}
//                         </p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-500 mb-1">Last Updated</p>
//                         <p className="font-medium text-gray-900">
//                           {formatDate(job.updatedAt || job.createdAt)}
//                         </p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-500 mb-1">Job Type</p>
//                         <p className="font-medium text-gray-900">
//                           {job.type || "Full-time"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Profile Summary */}
//         <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Strength</h3>
//               <p className="text-gray-600 mb-4">
//                 Complete your profile to increase your chances of getting hired
//               </p>
//               <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
//               </div>
//               <p className="text-sm text-gray-500">75% Complete</p>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <a
//                 href="/profile"
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <span className="mr-2"></span>
//                 Complete Profile
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Application Timeline</h3>
//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                   <span className="text-blue-600">1</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">Applications Submitted</p>
//                   <p className="text-sm text-gray-500">{stats.totalApplied} jobs applied</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                   <span className="text-green-600">2</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">Under Review</p>
//                   <p className="text-sm text-gray-500">{stats.pending} pending review</p>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-4">
//                   <span className="text-purple-600">3</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">Shortlisted</p>
//                   <p className="text-sm text-gray-500">{stats.shortlisted} shortlisted</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <a
//                 href="/jobs"
//                 className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors group"
//               >
//                 <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
//                   <span className="text-2xl"></span>
//                 </div>
//                 <p className="font-medium text-gray-900">Browse Jobs</p>
//               </a>
//               <a
//                 href="/profile"
//                 className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors group"
//               >
//                 <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
//                   <span className="text-2xl">👤</span>
//                 </div>
//                 <p className="font-medium text-gray-900">Edit Profile</p>
//               </a>
//               <a
//                 href="/resume"
//                 className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors group"
//               >
//                 <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
//                   <span className="text-2xl">📄</span>
//                 </div>
//                 <p className="font-medium text-gray-900">Upload Resume</p>
//               </a>
//               <a
//                 href="/settings"
//                 className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors group"
//               >
//                 <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200">
//                   <span className="text-2xl"></span>
//                 </div>
//                 <p className="font-medium text-gray-900">Settings</p>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  HiOutlineBriefcase, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineDocumentReport,
  HiOutlineLogout,
  HiOutlineBookmark,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineChevronRight,
  HiOutlineStar,
  HiOutlineAcademicCap,
  HiOutlineCode,
  HiOutlineTemplate
} from "react-icons/hi";
import { 
  FaBriefcase, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaUserAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaIdCard,
  FaChartLine,
  FaUsers,
  FaRocket,
  FaFileSignature,
  FaSignOutAlt,
  FaBookmark,
  FaBell,
  FaCog,
  FaEdit,
  FaTrashAlt,
  FaSyncAlt,
  FaExternalLinkAlt,
  FaChevronRight,
  FaStar,
  FaGraduationCap,
  FaLaptopCode,
  FaFilePdf,
  FaBuilding, // Added missing FaBuilding import
  FaClock,
  FaFilter as FaFilterIcon
} from "react-icons/fa";
import { MdDashboard, MdWork, MdPendingActions, MdApproval, MdCancel } from "react-icons/md";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplied: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    interviews: 0
  });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (session?.user?.role === "applicant") {
      fetchAppliedJobs();
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.role || session.user.role !== "applicant") return;

    const interval = setInterval(() => {
      fetchAppliedJobs();
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/applied-jobs");
      const data = await res.json();

      let jobsArray = [];
      if (Array.isArray(data)) {
        jobsArray = data;
      } else if (data && Array.isArray(data.jobs)) {
        jobsArray = data.jobs;
      }

      setJobs(jobsArray);
      calculateStats(jobsArray);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setJobs([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobsData) => {
    const stats = {
      totalApplied: jobsData.length,
      pending: jobsData.filter(job => !job.status || job.status === "pending" || job.status === "applied").length,
      shortlisted: jobsData.filter(job => job.status === "shortlisted" || job.status === "accepted").length,
      rejected: jobsData.filter(job => job.status === "rejected").length,
      interviews: jobsData.filter(job => job.status === "interview" || job.status === "reviewed").length
    };
    setStats(stats);
  };

  const withdrawApplication = async (jobId) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;

    try {
      const res = await fetch(`/api/user/withdraw-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (res.ok) {
        alert("Application withdrawn successfully!");
        fetchAppliedJobs();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to withdraw application");
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      alert("Error withdrawing application");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter !== "all" && job.status !== filter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        job.title?.toLowerCase().includes(term) ||
        job.company?.name?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
      case "shortlisted":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 shadow-sm";
      case "rejected":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-sm";
      case "reviewed":
      case "interview":
        return "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200 shadow-sm";
      case "pending":
      case "applied":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 shadow-sm";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 shadow-sm";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
      case "shortlisted":
        return <FaCheckCircle className="w-4 h-4" />;
      case "rejected":
        return <FaTimesCircle className="w-4 h-4" />;
      case "reviewed":
      case "interview":
        return <FaHourglassHalf className="w-4 h-4" />;
      case "pending":
      case "applied":
        return <MdPendingActions className="w-4 h-4" />;
      default:
        return <FaFileAlt className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending Review";
      case "applied": return "Application Sent";
      case "accepted": return "Accepted";
      case "shortlisted": return "Shortlisted";
      case "rejected": return "Not Selected";
      case "reviewed": return "Under Review";
      case "interview": return "Interview Stage";
      default: return "Applied";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl"></div>
              <div className="flex-1">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/4 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/3"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24"></div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-gray-200 to-gray-100 rounded-2xl"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "applicant") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-red-100 to-rose-100 rounded-3xl flex items-center justify-center shadow-lg">
            <MdCancel className="text-5xl text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-lg text-gray-600 mb-8">
            You need to be logged in as an applicant to access this dashboard.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaSignOutAlt className="w-5 h-5 mr-2" />
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
   

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaBriefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                +{stats.totalApplied > 0 ? '12%' : '0%'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalApplied}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <HiOutlineBriefcase className="w-4 h-4 mr-1" />
              Total Applied
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MdPendingActions className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pending}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <FaHourglassHalf className="w-4 h-4 mr-1" />
              Under Review
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaCheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {stats.shortlisted > 0 ? 'Selected' : 'Applied'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.shortlisted}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <HiOutlineCheckCircle className="w-4 h-4 mr-1" />
              Shortlisted
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                Interviews
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.interviews}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <FaHourglassHalf className="w-4 h-4 mr-1" />
              Interview Stage
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaTimesCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                {stats.rejected > 0 ? 'Next Time' : 'None'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.rejected}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <HiOutlineXCircle className="w-4 h-4 mr-1" />
              Not Selected
            </p>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <FaFileSignature className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <FaRocket className="w-3 h-3 text-blue-500 mr-1" />
                  Track and manage all your job applications
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 transition-all duration-300 group-hover:border-blue-300 focus:bg-white"
                />
              </div>

              <div className="relative group">
                <FaFilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 group-hover:border-blue-300 focus:bg-white"
                >
                  <option value="all">All Applications</option>
                  <option value="pending">Pending Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Not Selected</option>
                  <option value="interview">Interview Stage</option>
                </select>
              </div>

              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-white shadow-md text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === "list" 
                      ? "bg-white shadow-md text-blue-600" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List - Enhanced Cards */}
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-16 px-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                <FaFileAlt className="text-5xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No applications found
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't applied to any jobs yet"}
              </p>
              {!searchTerm && filter === "all" && (
                <a
                  href="/jobs"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaBriefcase className="w-5 h-5 mr-2" />
                  Browse Jobs
                  <FaChevronRight className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:border-blue-200 transform hover:-translate-y-2"
              >
                <div className="p-6">
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <FaBriefcase className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FaBuilding className="w-3 h-3 mr-1" />
                          {job.company?.name}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1.5">{getStatusText(job.status)}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <FaMapMarkerAlt className="w-3 h-3 mr-2 text-gray-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <FaDollarSign className="w-3 h-3 mr-2 text-gray-400" />
                      <span className="truncate">{job.salary || "Competitive"}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <FaCalendarAlt className="w-3 h-3 mr-2 text-gray-400" />
                      <span>Applied {formatTimeAgo(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <FaIdCard className="w-3 h-3 mr-2 text-gray-400" />
                      <span className="truncate">ID: {job._id.slice(-6)}</span>
                    </div>
                  </div>

                  {/* Application Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">Application Progress</span>
                      <span className="text-xs font-semibold text-blue-600">
                        {job.status === "accepted" ? "100%" : 
                         job.status === "shortlisted" ? "75%" : 
                         job.status === "reviewed" ? "50%" : 
                         job.status === "interview" ? "60%" :
                         job.status === "pending" ? "25%" : "10%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: job.status === "accepted" ? "100%" : 
                                 job.status === "shortlisted" ? "75%" : 
                                 job.status === "interview" ? "60%" :
                                 job.status === "reviewed" ? "50%" : 
                                 job.status === "pending" ? "25%" : "10%" 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                      className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 group/btn"
                    >
                      <FaExternalLinkAlt className="w-3 h-3 mr-2" />
                      View Details
                    </button>

                    {(!job.status || job.status === "pending" || job.status === "applied") && (
                      <button
                        onClick={() => withdrawApplication(job._id)}
                        className="flex items-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-all duration-300 group/btn"
                      >
                        <FaTrashAlt className="w-3 h-3 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                        Withdraw
                      </button>
                    )}

                    {job.status === "shortlisted" && (
                      <button className="flex items-center px-4 py-2 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-all duration-300">
                        <FaCheckCircle className="w-3 h-3 mr-2" />
                        Accept Offer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Profile Summary */}
        <div className="mt-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-white mb-6 md:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-2xl">
                  <FaStar className="w-6 h-6 text-yellow-300" />
                </div>
                <h3 className="text-2xl font-bold">Profile Strength</h3>
              </div>
              <p className="text-blue-100 mb-4 text-lg">
                Complete your profile to increase your chances of getting hired
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-md">
                  <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                    <div className="bg-white h-3 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">75%</span>
              </div>
            </div>
            <div>
              <a
                href="/profile"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaEdit className="w-5 h-5 mr-2" />
                Complete Profile
                <FaChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats and Actions */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <HiOutlineChartBar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Application Timeline</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  {stats.totalApplied > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">Applications Submitted</p>
                    <span className="text-sm font-bold text-blue-600">{stats.totalApplied}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stats.totalApplied} jobs applied</p>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((stats.totalApplied / 10) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-yellow-600 font-bold">2</span>
                  </div>
                  {stats.pending > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">Under Review</p>
                    <span className="text-sm font-bold text-yellow-600">{stats.pending}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stats.pending} applications pending</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  {stats.shortlisted > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">Shortlisted</p>
                    <span className="text-sm font-bold text-green-600">{stats.shortlisted}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stats.shortlisted} positions shortlisted</p>
                </div>
              </div>

              <div className="flex items-start group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-purple-600 font-bold">4</span>
                  </div>
                  {stats.interviews > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">Interviews</p>
                    <span className="text-sm font-bold text-purple-600">{stats.interviews}</span>
                  </div>
                  <p className="text-sm text-gray-500">{stats.interviews} interview stages</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <FaRocket className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="/jobs"
                className="group p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaBriefcase className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Browse Jobs</p>
                <p className="text-xs text-gray-500 text-center mt-1">Find new opportunities</p>
              </a>

              <a
                href="/profile"
                className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaEdit className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Edit Profile</p>
                <p className="text-xs text-gray-500 text-center mt-1">Update your info</p>
              </a>

              <a
                href="/resume"
                className="group p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:from-purple-100 hover:to-violet-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaFilePdf className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Upload Resume</p>
                <p className="text-xs text-gray-500 text-center mt-1">PDF or DOC format</p>
              </a>

              <a
                href="/skills"
                className="group p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaLaptopCode className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Add Skills</p>
                <p className="text-xs text-gray-500 text-center mt-1">Showcase expertise</p>
              </a>

              <a
                href="/education"
                className="group p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaGraduationCap className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Education</p>
                <p className="text-xs text-gray-500 text-center mt-1">Add qualifications</p>
              </a>

              <a
                href="/settings"
                className="group p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl hover:from-gray-100 hover:to-slate-100 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gray-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaCog className="text-xl text-white" />
                </div>
                <p className="font-semibold text-gray-900 text-center">Settings</p>
                <p className="text-xs text-gray-500 text-center mt-1">Preferences</p>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <FaBell className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <button 
              onClick={() => fetchAppliedJobs()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <FaSyncAlt className="w-3 h-3 mr-1" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {jobs.slice(0, 3).map((job, index) => (
              <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-xl transition-all duration-300">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    job.status === "shortlisted" ? "bg-green-100" :
                    job.status === "accepted" ? "bg-green-100" :
                    job.status === "rejected" ? "bg-red-100" :
                    job.status === "reviewed" ? "bg-purple-100" :
                    job.status === "interview" ? "bg-purple-100" :
                    "bg-blue-100"
                  }`}>
                    {job.status === "shortlisted" || job.status === "accepted" ? <FaCheckCircle className="text-green-600" /> :
                     job.status === "rejected" ? <FaTimesCircle className="text-red-600" /> :
                     job.status === "reviewed" || job.status === "interview" ? <FaHourglassHalf className="text-purple-600" /> :
                     <MdPendingActions className="text-blue-600" />}
                  </div>
                  {index === 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Application for {job.title} at {job.company?.name}
                    </p>
                    <span className="text-xs text-gray-500">{formatTimeAgo(job.updatedAt || job.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Status updated to {getStatusText(job.status)}
                  </p>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}