// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companyStatus, setCompanyStatus] = useState(null);
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [jobForm, setJobForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     salary: "",
//     type: "full-time",
//     experience: "mid-level",
//     requirements: "",
//     skills: "",
//     benefits: "",
//     deadline: "",
//     remote: "on-site"
//   });
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplicants, setShowApplicants] = useState(false);
//   const [showApplicantProfile, setShowApplicantProfile] = useState(false);
//   const [applicantProfileLoading, setApplicantProfileLoading] = useState(false);
//   const [selectedApplicantProfile, setSelectedApplicantProfile] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     activeJobs: 0,
//     totalApplicants: 0,
//     pendingApplicants: 0
//   });
//   const [activeTab, setActiveTab] = useState("jobs");

//   // AI Suggestion Feature State
//   const [aiAnalysis, setAiAnalysis] = useState({});
//   const [analyzingApplicant, setAnalyzingApplicant] = useState(null);

//   useEffect(() => {
//     if (session?.user?.role === "company") {
//       fetchCompanyStatus();
//       fetchCompanyJobs();
//     }
//   }, [session]);

//   useEffect(() => {
//     calculateStats();
//   }, [jobs]);

//   const fetchCompanyStatus = async () => {
//     try {
//       const res = await fetch("/api/company/status");
//       const data = await res.json();
//       setCompanyStatus(data.companyStatus);
//     } catch (error) {
//       console.error("Error fetching company status:", error);
//     }
//   };

//   const fetchCompanyJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/company/jobs");
//       const data = await res.json();

//       // Ensure jobs is always an array
//       if (Array.isArray(data.jobs)) {
//         setJobs(data.jobs);
//       } else if (Array.isArray(data)) {
//         setJobs(data);
//       } else {
//         setJobs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setJobs([]); // Set empty array on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const totalJobs = jobs.length;
//     const activeJobs = jobs.filter(job => !job.isClosed).length;
//     const totalApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.length || 0), 0
//     );
//     const pendingApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => !app.status || app.status === "applied")?.length || 0), 0
//     );

//     setStats({
//       totalJobs,
//       activeJobs,
//       totalApplicants,
//       pendingApplicants
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setJobForm({
//       ...jobForm,
//       [name]: value,
//     });
//   };

//   const handleSubmitJob = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = editingJob ? `/api/company/jobs/${editingJob._id}` : "/api/company/jobs";
//       const method = editingJob ? "PATCH" : "POST";

//       const payload = {
//         title: jobForm.title,
//         description: jobForm.description,
//         location: jobForm.location,
//         salary: jobForm.salary,
//         // API expects jobType/experienceLevel/applicationDeadline, but we also keep
//         // backward-compatible fields used by the rest of the UI.
//         jobType: jobForm.type,
//         experienceLevel: jobForm.experience,
//         applicationDeadline: jobForm.deadline,
//         requirements: jobForm.requirements,
//       };

//       const res = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (editingJob) {
//           setJobs(jobs.map(job => job._id === editingJob._id ? data.job : job));
//           alert("Job updated successfully!");
//         } else {
//           setJobs([data.job, ...jobs]);
//           alert("Job posted successfully!");
//         }
//         resetJobForm();
//         setShowJobForm(false);
//         setEditingJob(null);
//       } else {
//         alert(data.message || "Failed to post job. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error posting job:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const resetJobForm = () => {
//     setJobForm({
//       title: "",
//       description: "",
//       location: "",
//       salary: "",
//       type: "full-time",
//       experience: "mid-level",
//       requirements: "",
//       skills: "",
//       benefits: "",
//       deadline: "",
//       remote: "on-site"
//     });
//   };

//   const handleEditJob = (job) => {
//     setEditingJob(job);
//     setJobForm({
//       title: job.title || "",
//       description: job.description || "",
//       location: job.location || "",
//       salary: job.salary || "",
//       type: job.type || "full-time",
//       experience: job.experience || "mid-level",
//       requirements: job.requirements || "",
//       skills: job.skills || "",
//       benefits: job.benefits || "",
//       deadline: job.deadline || "",
//       remote: job.remote || "on-site"
//     });
//     setShowJobForm(true);
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (!confirm("Are you sure you want to delete this job? ")) return;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.filter(job => job._id !== jobId));
//         alert("Job deleted successfully!");
//       } else {
//         alert(data.message || "Failed to delete job.");
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     }
//   };

//   const handleViewApplicants = (job) => {
//     setSelectedJob(job);
//     setShowApplicants(true);
//   };

//   const handleCloseJob = async (jobId, currentStatus) => {
//     const newStatus = !currentStatus;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isClosed: newStatus }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.map(job =>
//           job._id === jobId ? { ...job, isClosed: newStatus } : job
//         ));
//         alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
//       }
//     } catch (error) {
//       console.error("Error updating job status:", error);
//     }
//   };

//   const viewApplicantProfile = async (jobId, userId) => {
//     if (!userId) return;

//     try {
//       setShowApplicantProfile(true);
//       setApplicantProfileLoading(true);
//       setSelectedApplicantProfile(null);

//       const res = await fetch(
//         `/api/company/applicant?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || data?.message || "Failed to fetch applicant profile");
//       }

//       setSelectedApplicantProfile(data.profile || null);
//     } catch (error) {
//       console.error("Error fetching applicant profile:", error);
//       alert(error.message || "Error fetching applicant profile");
//       setShowApplicantProfile(false);
//     } finally {
//       setApplicantProfileLoading(false);
//     }
//   };

//   const updateApplicantStatus = async (jobId, userId, newStatus) => {
//     try {
//       if (!userId) return;

//       const res = await fetch("/api/company/applicant-status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId, userId, status: newStatus }),
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.ok) {
//         setJobs(jobs.map(job => {
//           if (job._id === jobId) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                   ? { ...app, status: newStatus }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob && selectedJob._id === jobId) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                 ? { ...app, status: newStatus }
//                 : app
//             )
//           });
//         }

//         alert(`Applicant status updated to ${newStatus}`);
//       } else {
//         alert(data?.error || data?.message || "Failed to update applicant status");
//       }
//     } catch (error) {
//       console.error("Error updating applicant status:", error);
//     }
//   };

//   const handleGetAISuggestion = async (jobId, applicantId) => {
//     setAnalyzingApplicant(applicantId);

//     try {
//       const res = await fetch("/api/company/analyze-applicant", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ jobId, applicantId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setAiAnalysis({
//           ...aiAnalysis,
//           [applicantId]: data.analysis,
//         });
//       } else {
//         alert(data.message || "Failed to generate AI analysis");
//       }
//     } catch (error) {
//       console.error("Error getting AI suggestion:", error);
//       alert("Error generating AI analysis. Please try again.");
//     } finally {
//       setAnalyzingApplicant(null);
//     }
//   };

//   const filteredJobs = jobs.filter(job => {
//     if (filter === "active" && job.isClosed) return false;
//     if (filter === "closed" && !job.isClosed) return false;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(term) ||
//         job.description.toLowerCase().includes(term) ||
//         job.location.toLowerCase().includes(term)
//       );
//     }

//     return true;
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Enhanced loading state
//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-24 h-24 mx-auto mb-6">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-20"></div>
//               <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="text-3xl text-white">🏢</span>
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium animate-pulse">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "company") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-8">
//             <div className="w-32 h-32 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
//                 <span className="text-5xl text-white">🔒</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//             Access Restricted
//           </h1>
//           <p className="text-gray-600 mb-8 text-lg">
//             You need to be logged in as a company to access this dashboard.
//           </p>
//           <a
//             href="/api/auth/signin"
//             className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
//           >
//             <span>🔑</span>
//             Sign In as Company
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "pending") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-8">
//             <div className="w-32 h-32 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
//               <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
//                 <span className="text-5xl text-white animate-bounce">⏳</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
//             Approval Pending
//           </h1>
//           <p className="text-gray-600 mb-6 text-lg">
//             Your company registration is being reviewed by our team. You'll be notified once approved.
//           </p>
//           <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
//             <p className="text-yellow-800 font-medium">ⓘ Usually takes 24-48 hours</p>
//           </div>
//           <a
//             href="/contact"
//             className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-2xl hover:from-gray-900 hover:to-black transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
//           >
//             <span>📞</span>
//             Contact Support
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "rejected") {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-8">
//             <div className="w-32 h-32 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-2xl">
//                 <span className="text-5xl text-white">❌</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
//             Access Restricted
//           </h1>
//           <p className="text-gray-600 mb-6 text-lg">
//             Your company registration has been rejected. Please contact support for more information.
//           </p>
//           <div className="space-y-4">
//             <a
//               href="/contact"
//               className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
//             >
//               <span>🆘</span>
//               Contact Support
//             </a>
//             <a
//               href="/company/register"
//               className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
//             >
//               <span>📝</span>
//               Re-apply
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Animated Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-2xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-white/20 blur-xl rounded-2xl"></div>
//                 <div className="relative w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
//                   <span className="text-3xl text-white">🏢</span>
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
//                 <p className="text-blue-100 mt-1">
//                   Welcome back, <span className="font-semibold text-white">{session.user.name}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-3">
//               <a
//                 href="/company/profile"
//                 className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-3 bg-white/10 text-white font-semibold rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300"
//               >
//                 <span className="relative">🏢</span>
//                 <span className="relative group-hover:text-white transition-colors duration-300">
//                   Company Profile
//                 </span>
//               </a>
//               <button
//                 onClick={() => {
//                   setEditingJob(null);
//                   resetJobForm();
//                   setShowJobForm(true);
//                 }}
//                 className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white to-blue-50"></div>
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <span className="relative text-xl">+</span>
//                 <span className="relative group-hover:text-white transition-colors duration-300">
//                   Post New Job
//                 </span>
//                 <span className="relative ml-2 group-hover:translate-x-2 transition-transform duration-300">🚀</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
//         {/* Stats Cards - Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
//             <div className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium mb-2">Total Jobs</p>
//                   <h3 className="text-4xl font-bold text-gray-900">{stats.totalJobs}</h3>
//                   <p className="text-sm text-green-600 font-medium mt-2">
//                     ↑ {stats.activeJobs} Active
//                   </p>
//                 </div>
//                 <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <span className="text-2xl text-blue-600">💼</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
//             <div className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium mb-2">Active Jobs</p>
//                   <h3 className="text-4xl font-bold text-gray-900">{stats.activeJobs}</h3>
//                   <p className="text-sm text-blue-600 font-medium mt-2">
//                     {((stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100).toFixed(0)}% of total
//                   </p>
//                 </div>
//                 <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <span className="text-2xl text-green-600">✅</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>
//             <div className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium mb-2">Total Applicants</p>
//                   <h3 className="text-4xl font-bold text-gray-900">{stats.totalApplicants}</h3>
//                   <p className="text-sm text-purple-600 font-medium mt-2">
//                     Avg. {stats.totalJobs > 0 ? (stats.totalApplicants / stats.totalJobs).toFixed(1) : 0} per job
//                   </p>
//                 </div>
//                 <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <span className="text-2xl text-purple-600">👥</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-400"></div>
//             <div className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium mb-2">Pending Reviews</p>
//                   <h3 className="text-4xl font-bold text-gray-900">{stats.pendingApplicants}</h3>
//                   <p className="text-sm text-amber-600 font-medium mt-2">
//                     Needs attention
//                   </p>
//                 </div>
//                 <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                   <span className="text-2xl text-amber-600">⏳</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative group">
//                 <input
//                   type="text"
//                   placeholder="🔍 Search jobs by title, location, or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-14 pr-6 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                 />
//                 <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors">🔍</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-5 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-700 appearance-none"
//               >
//                 <option value="all">📋 All Jobs</option>
//                 <option value="active">✅ Active Jobs</option>
//                 <option value="closed">🔒 Closed Jobs</option>
//               </select>
//               <button
//                 onClick={fetchCompanyJobs}
//                 className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 font-medium rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group"
//               >
//                 <span className="group-hover:rotate-180 transition-transform duration-500">🔄</span>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-6">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center py-20 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-blue-100">
//               <div className="w-32 h-32 mx-auto mb-8 relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
//                 <div className="relative w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
//                   <span className="text-6xl">📝</span>
//                 </div>
//               </div>
//               <h3 className="text-3xl font-bold text-gray-900 mb-3">
//                 {searchTerm || filter !== "all" ? "No matching jobs found" : "No jobs posted yet"}
//               </h3>
//               <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
//                 {searchTerm || filter !== "all"
//                   ? "Try adjusting your search terms or filter criteria"
//                   : "Start by posting your first job opening to attract talented candidates!"}
//               </p>
//               {!searchTerm && filter === "all" && (
//                 <button
//                   onClick={() => setShowJobForm(true)}
//                   className="group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <span className="relative">Post Your First Job</span>
//                   <span className="relative group-hover:translate-x-2 transition-transform duration-300">🚀</span>
//                 </button>
//               )}
//             </div>
//           ) : (
//             filteredJobs.map((job, index) => (
//               <div
//                 key={job._id}
//                 className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl hover:shadow-2xl border border-blue-100 transition-all duration-500 hover:-translate-y-1"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className={`absolute top-0 left-0 w-2 h-full ${job.isClosed ? 'bg-gradient-to-b from-red-500 to-pink-500' : 'bg-gradient-to-b from-green-500 to-emerald-500'
//                   }`}></div>

//                 <div className="p-6 ml-2">
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                     {/* Job Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex items-start gap-4">
//                           <div className="relative">
//                             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-20 rounded-2xl"></div>
//                             <div className="relative w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
//                               <span className="text-2xl text-white">💼</span>
//                             </div>
//                           </div>
//                           <div>
//                             <div className="flex flex-wrap items-center gap-3 mb-2">
//                               <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                 {job.title}
//                               </h2>
//                               <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${job.isClosed
//                                 ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
//                                 : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
//                                 }`}>
//                                 {job.isClosed ? '🔒 Closed' : '✅ Active'}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 mb-3">{job.company?.name || "Your Company"}</p>

//                             <div className="flex flex-wrap items-center gap-4 mb-4">
//                               <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
//                                 <span className="text-blue-600">📍</span>
//                                 <span className="text-gray-700 font-medium">{job.location || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-xl">
//                                 <span className="text-green-600">💰</span>
//                                 <span className="text-gray-700 font-medium">{job.salary || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-xl">
//                                 <span className="text-purple-600">⏱️</span>
//                                 <span className="text-gray-700 font-medium capitalize">{job.type || "Full-time"}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="flex flex-col items-end">
//                             <p className="text-sm text-gray-500 mb-1">Posted</p>
//                             <p className="font-bold text-gray-900">{formatDate(job.createdAt)}</p>
//                             <div className="mt-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
//                               <span className="text-sm font-bold text-blue-700">{job.applicants?.length || 0} applicants</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <p className="text-gray-700 line-clamp-2 mb-6 pl-2 border-l-4 border-blue-200 pl-4">{job.description}</p>

//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {job.skills && job.skills.split(',').slice(0, 3).map((skill, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-medium rounded-lg text-sm border border-blue-100"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                         {job.skills && job.skills.split(',').length > 3 && (
//                           <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm">
//                             +{job.skills.split(',').length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3 min-w-[200px]">
//                       <button
//                         onClick={() => handleViewApplicants(job)}
//                         className="group/btn relative overflow-hidden flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300"
//                       >
//                         <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
//                         <span className="relative">👥</span>
//                         <span className="relative">View Applicants</span>
//                         <span className="relative bg-white/20 px-2.5 py-0.5 rounded-lg text-sm ml-2">
//                           {job.applicants?.length || 0}
//                         </span>
//                       </button>

//                       <div className="grid grid-cols-2 gap-3">
//                         <button
//                           onClick={() => handleEditJob(job)}
//                           className="group/edit flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
//                         >
//                           <span className="group-hover/edit:rotate-12 transition-transform">✏️</span>
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleCloseJob(job._id, job.isClosed)}
//                           className={`group/close flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-xl transition-all duration-300 ${job.isClosed
//                             ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
//                             : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
//                             }`}
//                         >
//                           <span className="group-hover/close:scale-110 transition-transform">
//                             {job.isClosed ? "🔓" : "🔒"}
//                           </span>
//                           {job.isClosed ? "Re-open" : "Close"}
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => handleDeleteJob(job._id)}
//                         className="group/delete flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
//                       >
//                         <span className="group-hover/delete:rotate-90 transition-transform duration-300">🗑️</span>
//                         <span>Delete Job</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Job Form Modal */}
//       {showJobForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
//           onClick={() => {
//             setShowJobForm(false);
//             setEditingJob(null);
//             resetJobForm();
//           }}
//         >
//           <div
//             className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                     <span className="text-xl text-white">📝</span>
//                   </div>
//                   <h2 className="text-2xl font-bold text-white">
//                     {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="text-white hover:text-gray-200 text-3xl transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmitJob} className="p-8 space-y-8">
//               {/* Form Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Left Column */}
//                 <div className="space-y-8">
//                   {/* Job Title */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Job Title <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="title"
//                       value={jobForm.title}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                       placeholder="e.g., Senior Software Engineer"
//                     />
//                   </div>

//                   {/* Location */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       value={jobForm.location}
//                       onChange={handleInputChange}
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                       placeholder="e.g., Remote, New York, San Francisco"
//                     />
//                   </div>

//                   {/* Salary */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Salary Range
//                     </label>
//                     <input
//                       type="text"
//                       name="salary"
//                       value={jobForm.salary}
//                       onChange={handleInputChange}
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                       placeholder="e.g., $80,000 - $120,000 per year"
//                     />
//                   </div>

//                   {/* Job Type */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="group">
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Job Type
//                       </label>
//                       <select
//                         name="type"
//                         value={jobForm.type}
//                         onChange={handleInputChange}
//                         className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none"
//                       >
//                         <option value="full-time">Full-time</option>
//                         <option value="part-time">Part-time</option>
//                         <option value="contract">Contract</option>
//                         <option value="internship">Internship</option>
//                         <option value="remote">Remote</option>
//                       </select>
//                     </div>

//                     <div className="group">
//                       <label className="block text-sm font-semibold text-gray-700 mb-3">
//                         Experience
//                       </label>
//                       <select
//                         name="experience"
//                         value={jobForm.experience}
//                         onChange={handleInputChange}
//                         className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none"
//                       >
//                         <option value="entry-level">Entry Level</option>
//                         <option value="mid-level">Mid Level</option>
//                         <option value="senior">Senior</option>
//                         <option value="executive">Executive</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-8">
//                   {/* Work Policy */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Work Policy
//                     </label>
//                     <select
//                       name="remote"
//                       value={jobForm.remote}
//                       onChange={handleInputChange}
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 appearance-none"
//                     >
//                       <option value="on-site">On-site</option>
//                       <option value="remote">Remote</option>
//                       <option value="hybrid">Hybrid</option>
//                     </select>
//                   </div>

//                   {/* Application Deadline */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Application Deadline
//                     </label>
//                     <input
//                       type="date"
//                       name="deadline"
//                       value={jobForm.deadline}
//                       onChange={handleInputChange}
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     />
//                   </div>

//                   {/* Skills */}
//                   <div className="group">
//                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                       Required Skills
//                     </label>
//                     <textarea
//                       name="skills"
//                       value={jobForm.skills}
//                       onChange={handleInputChange}
//                       rows="3"
//                       className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                       placeholder="React, Node.js, MongoDB, AWS, TypeScript..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Full Width Fields */}
//               <div className="space-y-8">
//                 {/* Description */}
//                 <div className="group">
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Job Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     name="description"
//                     value={jobForm.description}
//                     onChange={handleInputChange}
//                     required
//                     rows="4"
//                     className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="Describe the role, responsibilities, expectations, and what makes this position special..."
//                   />
//                 </div>

//                 {/* Requirements */}
//                 <div className="group">
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Requirements & Qualifications
//                   </label>
//                   <textarea
//                     name="requirements"
//                     value={jobForm.requirements}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="List specific requirements, qualifications, and experience needed..."
//                   />
//                 </div>

//                 {/* Benefits */}
//                 <div className="group">
//                   <label className="block text-sm font-semibold text-gray-700 mb-3">
//                     Benefits & Perks
//                   </label>
//                   <textarea
//                     name="benefits"
//                     value={jobForm.benefits}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="Health insurance, stock options, remote work, flexible hours..."
//                   />
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-4 pt-8 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="group relative overflow-hidden flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <span className="relative">
//                     {editingJob ? "Update Job Posting" : "Post Job Opening"}
//                   </span>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Applicants Modal */}
//       {showApplicants && selectedJob && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
//           onClick={() => {
//             setShowApplicants(false);
//             setSelectedJob(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                     <span className="text-xl text-white">👥</span>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">
//                       Applicants for "{selectedJob.title}"
//                     </h2>
//                     <p className="text-blue-100 mt-1">
//                       <span className="font-semibold">{selectedJob.applicants?.length || 0}</span> total applicants
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicants(false);
//                     setSelectedJob(null);
//                   }}
//                   className="text-white hover:text-gray-200 text-3xl transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-8">
//               {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
//                 <div className="text-center py-16">
//                   <div className="w-32 h-32 mx-auto mb-8 relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"></div>
//                     <div className="relative w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
//                       <span className="text-6xl">📭</span>
//                     </div>
//                   </div>
//                   <h3 className="text-3xl font-bold text-gray-900 mb-3">No applicants yet</h3>
//                   <p className="text-gray-600 mb-8 text-lg">
//                     Share this job on social media to attract more candidates
//                   </p>
//                   <div className="flex gap-4 justify-center">
//                     <button className="px-6 py-3 bg-blue-100 text-blue-600 font-semibold rounded-xl hover:bg-blue-200 transition-colors">
//                       📱 Share on LinkedIn
//                     </button>
//                     <button className="px-6 py-3 bg-green-100 text-green-600 font-semibold rounded-xl hover:bg-green-200 transition-colors">
//                       🐦 Share on Twitter
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {selectedJob.applicants.map((app, index) => (
//                     <div
//                       key={app._id || index}
//                       className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-fit"
//                     >
//                       <div className="flex flex-col md:flex-row gap-6">
//                         {/* Applicant Avatar & Info */}
//                         <div className="flex-shrink-0">
//                           <div className="relative">
//                             <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-20 rounded-2xl"></div>
//                             <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
//                               <span className="text-3xl text-white font-bold">
//                                 {(app.user?.name || "A").charAt(0).toUpperCase()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Applicant Details */}
//                         <div className="flex-1">
//                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
//                             <div>
//                               <h4 className="text-xl font-bold text-gray-900 mb-1">
//                                 {app.user?.name || "Anonymous Applicant"}
//                               </h4>
//                               <p className="text-gray-600 mb-2">{app.user?.email || "No email provided"}</p>
//                               <p className="text-sm text-gray-500">
//                                 Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
//                               </p>
//                             </div>

//                             <div className="flex items-center gap-3">

//                               <button
//                                 type="button"
//                                 onClick={() => viewApplicantProfile(selectedJob._id, app.user?._id)}
//                                 className="flex items-center gap-2 px-4 py-2 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
//                               >
//                                 <span>👤</span>
//                                 Profile
//                               </button>
//                               <select
//                                 value={app.status || "pending"}
//                                 onChange={(e) => updateApplicantStatus(selectedJob._id, app.user?._id, e.target.value)}
//                                 className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//                               >
//                                 <option value="pending">⏳ Pending</option>
//                                 <option value="reviewed">👁️ Reviewed</option>
//                                 <option value="shortlisted">⭐ Shortlisted</option>
//                                 <option value="rejected">❌ Rejected</option>
//                                 <option value="accepted">✅ Accepted</option>
//                               </select>
//                             </div>
//                           </div>

//                           {/* Status Badge */}
//                           <div className="mb-4">
//                             <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${app.status === "accepted"
//                               ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
//                               : app.status === "rejected"
//                                 ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
//                                 : app.status === "shortlisted"
//                                   ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
//                                   : app.status === "reviewed"
//                                     ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
//                                     : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border border-gray-200"
//                               }`}>
//                               {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending Review"}
//                             </span>
//                           </div>

//                           {/* Cover Letter */}
//                           {app.coverLetter && (
//                             <div className="pt-4 border-t border-gray-200">
//                               <p className="text-sm font-semibold text-gray-700 mb-2">Cover Letter:</p>
//                               <p className="text-gray-600 text-sm line-clamp-3">{app.coverLetter}</p>
//                             </div>
//                           )}

//                           {/* AI Suggestion Button */}
//                           <div className="pt-4 border-t border-gray-200 mt-4">
//                             <button
//                               onClick={() => handleGetAISuggestion(selectedJob._id, app.user?._id)}
//                               disabled={analyzingApplicant === app.user?._id || aiAnalysis[app.user?._id]}
//                               className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-bold rounded-xl transition-all duration-300 ${aiAnalysis[app.user?._id]
//                                 ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-not-allowed"
//                                 : analyzingApplicant === app.user?._id
//                                   ? "bg-gray-400 text-white cursor-wait"
//                                   : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg"
//                                 }`}
//                             >
//                               {analyzingApplicant === app.user?._id ? (
//                                 <>
//                                   <span className="animate-spin">🤖</span>
//                                   <span>Analyzing...</span>
//                                 </>
//                               ) : aiAnalysis[app.user?._id] ? (
//                                 <>
//                                   <span>✓</span>
//                                   <span>AI Analyzed</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <span>🤖</span>
//                                   <span>Get AI Suggestion</span>
//                                 </>
//                               )}
//                             </button>
//                           </div>

//                           {/* AI Analysis Results */}
//                           {aiAnalysis[app.user?._id] && (
//                             <div className="mt-6 pt-6 border-t-2 border-purple-200">
//                               <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-300">
//                                 {/* Header */}
//                                 <div className="flex items-center justify-between mb-6">
//                                   <h5 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                                     <span className="text-2xl">🤖</span>
//                                     AI Analysis
//                                   </h5>
//                                   <div className="text-right">
//                                     <div className={`text-4xl font-black ${aiAnalysis[app.user?._id].score >= 75 ? "text-green-600" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "text-orange-600" : "text-red-600"
//                                       }`}>
//                                       {aiAnalysis[app.user?._id].score}%
//                                     </div>
//                                     <div className="text-xs text-gray-600 font-medium">Suitability</div>
//                                   </div>
//                                 </div>

//                                 {/* Progress Bar */}
//                                 <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
//                                   <div
//                                     className={`h-full transition-all duration-1000 ${aiAnalysis[app.user?._id].score >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
//                                         "bg-gradient-to-r from-red-500 to-pink-500"
//                                       }`}
//                                     style={{ width: `${aiAnalysis[app.user?._id].score}%` }}
//                                   ></div>
//                                 </div>

//                                 {/* Recommendation Badge */}
//                                 <div className="mb-6">
//                                   <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${aiAnalysis[app.user?._id].recommendation === "Highly Recommended"
//                                     ? "bg-green-100 text-green-700 border-green-300"
//                                     : aiAnalysis[app.user?._id].recommendation === "Recommended"
//                                       ? "bg-blue-100 text-blue-700 border-blue-300"
//                                       : aiAnalysis[app.user?._id].recommendation === "Consider"
//                                         ? "bg-orange-100 text-orange-700 border-orange-300"
//                                         : "bg-red-100 text-red-700 border-red-300"
//                                     }`}>
//                                     {aiAnalysis[app.user?._id].recommendation}
//                                   </span>
//                                 </div>

//                                 {/* Highlights */}
//                                 {aiAnalysis[app.user?._id].highlights?.length > 0 && (
//                                   <div className="mb-4">
//                                     <h6 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
//                                       <span>✓</span>
//                                       Key Highlights
//                                     </h6>
//                                     <ul className="space-y-1">
//                                       {aiAnalysis[app.user?._id].highlights.map((highlight, idx) => (
//                                         <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
//                                           <span className="text-green-600 mt-0.5">•</span>
//                                           <span>{highlight}</span>
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   </div>
//                                 )}

//                                 {/* Concerns */}
//                                 {aiAnalysis[app.user?._id].concerns?.length > 0 && (
//                                   <div className="mb-4">
//                                     <h6 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
//                                       <span>⚠</span>
//                                       Potential Concerns
//                                     </h6>
//                                     <ul className="space-y-1">
//                                       {aiAnalysis[app.user?._id].concerns.map((concern, idx) => (
//                                         <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
//                                           <span className="text-red-600 mt-0.5">•</span>
//                                           <span>{concern}</span>
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   </div>
//                                 )}

//                                 {/* Reasoning */}
//                                 {aiAnalysis[app.user?._id].reasoning && (
//                                   <div className="bg-white/70 rounded-xl p-4 border-l-4 border-purple-500">
//                                     <p className="text-sm font-semibold text-purple-700 mb-1">AI Assessment:</p>
//                                     <p className="text-sm text-gray-700 leading-relaxed">
//                                       {aiAnalysis[app.user?._id].reasoning}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Applicant Profile Modal */}
//       {showApplicantProfile && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
//           onClick={() => {
//             setShowApplicantProfile(false);
//             setSelectedApplicantProfile(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-700 px-8 py-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//                     <span className="text-xl text-white">👤</span>
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">Applicant Profile</h2>
//                     <p className="text-gray-200 mt-1">View details submitted by the candidate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicantProfile(false);
//                     setSelectedApplicantProfile(null);
//                   }}
//                   className="text-white hover:text-gray-200 text-3xl transition-colors"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-8">
//               {applicantProfileLoading ? (
//                 <div className="text-center py-16">
//                   <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
//                     <span className="text-3xl">⏳</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">Loading profile...</p>
//                 </div>
//               ) : !selectedApplicantProfile ? (
//                 <div className="text-center py-16">
//                   <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-3xl">📭</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">No profile data available.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900">
//                           {selectedApplicantProfile.name || "Unnamed Applicant"}
//                         </h3>
//                         <p className="text-gray-600">{selectedApplicantProfile.email}</p>
//                       </div>
//                       {selectedApplicantProfile.resume && (
//                         <a
//                           href={selectedApplicantProfile.resume}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors"
//                         >
//                           <span>📄</span>
//                           Open Resume
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                       <p className="text-sm font-semibold text-gray-500 mb-2">Phone</p>
//                       <p className="text-gray-900 font-medium">{selectedApplicantProfile.phone || "Not provided"}</p>
//                     </div>
//                     <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                       <p className="text-sm font-semibold text-gray-500 mb-2">Location</p>
//                       <p className="text-gray-900 font-medium">{selectedApplicantProfile.location || "Not provided"}</p>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                     <p className="text-sm font-semibold text-gray-500 mb-3">Skills</p>
//                     {Array.isArray(selectedApplicantProfile.skills) && selectedApplicantProfile.skills.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {selectedApplicantProfile.skills.map((s, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200"
//                           >
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700">Not provided</p>
//                     )}
//                   </div>

//                   <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                     <p className="text-sm font-semibold text-gray-500 mb-3">Experience</p>
//                     <p className="text-gray-800 whitespace-pre-wrap">
//                       {selectedApplicantProfile.experience || "Not provided"}
//                     </p>
//                   </div>

//                   <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                     <p className="text-sm font-semibold text-gray-500 mb-3">Education</p>
//                     <p className="text-gray-800 whitespace-pre-wrap">
//                       {selectedApplicantProfile.education || "Not provided"}
//                     </p>
//                   </div>

//                   {selectedApplicantProfile.socialLinks && (
//                     <div className="bg-white rounded-2xl border border-gray-200 p-6">
//                       <p className="text-sm font-semibold text-gray-500 mb-3">Social Links</p>
//                       <div className="space-y-2">
//                         {Object.entries(selectedApplicantProfile.socialLinks).map(([key, value]) =>
//                           value ? (
//                             <a
//                               key={key}
//                               href={value}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block text-blue-600 hover:underline break-all"
//                             >
//                               {key}: {value}
//                             </a>
//                           ) : null
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companyStatus, setCompanyStatus] = useState(null);
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [jobForm, setJobForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     salary: "",
//     type: "full-time",
//     experience: "mid-level",
//     requirements: "",
//     skills: "",
//     benefits: "",
//     deadline: "",
//     remote: "on-site"
//   });
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplicants, setShowApplicants] = useState(false);
//   const [showApplicantProfile, setShowApplicantProfile] = useState(false);
//   const [applicantProfileLoading, setApplicantProfileLoading] = useState(false);
//   const [selectedApplicantProfile, setSelectedApplicantProfile] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     activeJobs: 0,
//     totalApplicants: 0,
//     pendingApplicants: 0
//   });
//   const [activeTab, setActiveTab] = useState("jobs");
//   const [aiAnalysis, setAiAnalysis] = useState({});
//   const [analyzingApplicant, setAnalyzingApplicant] = useState(null);
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [newCompanyName, setNewCompanyName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [rejectionReason, setRejectionReason] = useState("");

//   useEffect(() => {
//     if (session?.user?.role === "company") {
//       fetchCompanyStatus();
//       fetchCompanyJobs();
//       setCompanyName(session.user.name || "");
//       setNewCompanyName(session.user.name || "");
//     }
//   }, [session]);

//   useEffect(() => {
//     calculateStats();
//   }, [jobs]);

//   const fetchCompanyStatus = async () => {
//     try {
//       const res = await fetch("/api/company/status");
//       const data = await res.json();
//       setCompanyStatus(data.companyStatus);
//       setRejectionReason(data.rejectionReason || "");
//     } catch (error) {
//       console.error("Error fetching company status:", error);
//     }
//   };

//   const fetchCompanyJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/company/jobs");
//       const data = await res.json();

//       if (Array.isArray(data.jobs)) {
//         setJobs(data.jobs);
//       } else if (Array.isArray(data)) {
//         setJobs(data);
//       } else {
//         setJobs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const totalJobs = jobs.length;
//     const activeJobs = jobs.filter(job => !job.isClosed).length;
//     const totalApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.length || 0), 0
//     );
//     const pendingApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => !app.status || app.status === "applied")?.length || 0), 0
//     );

//     setStats({
//       totalJobs,
//       activeJobs,
//       totalApplicants,
//       pendingApplicants
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setJobForm({
//       ...jobForm,
//       [name]: value,
//     });
//   };

//   const handleSubmitJob = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = editingJob ? `/api/company/jobs/${editingJob._id}` : "/api/company/jobs";
//       const method = editingJob ? "PATCH" : "POST";

//       const payload = {
//         title: jobForm.title,
//         description: jobForm.description,
//         location: jobForm.location,
//         salary: jobForm.salary,
//         jobType: jobForm.type,
//         experienceLevel: jobForm.experience,
//         applicationDeadline: jobForm.deadline,
//         requirements: jobForm.requirements,
//         skills: jobForm.skills,
//       };

//       const res = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (editingJob) {
//           setJobs(jobs.map(job => job._id === editingJob._id ? data.job : job));
//           alert("Job updated successfully!");
//         } else {
//           setJobs([data.job, ...jobs]);
//           alert("Job posted successfully!");
//         }
//         resetJobForm();
//         setShowJobForm(false);
//         setEditingJob(null);
//       } else {
//         alert(data.message || "Failed to post job. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error posting job:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const resetJobForm = () => {
//     setJobForm({
//       title: "",
//       description: "",
//       location: "",
//       salary: "",
//       type: "full-time",
//       experience: "mid-level",
//       requirements: "",
//       skills: "",
//       benefits: "",
//       deadline: "",
//       remote: "on-site"
//     });
//   };

//   const handleEditJob = (job) => {
//     setEditingJob(job);

//     // Format date for input field (YYYY-MM-DD)
//     let formattedDeadline = "";
//     if (job.applicationDeadline) {
//       const date = new Date(job.applicationDeadline);
//       formattedDeadline = date.toISOString().split('T')[0];
//     }

//     setJobForm({
//       title: job.title || "",
//       description: job.description || "",
//       location: job.location || "",
//       salary: job.salary || "",
//       type: job.jobType || "full-time",
//       experience: job.experienceLevel || "mid-level",
//       requirements: job.requirements || "",
//       skills: job.skills || "",
//       benefits: job.benefits || "",
//       deadline: formattedDeadline,
//       remote: job.remote || "on-site"
//     });
//     setShowJobForm(true);
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.filter(job => job._id !== jobId));
//         alert("Job deleted successfully!");
//       } else {
//         alert(data.message || "Failed to delete job.");
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     }
//   };

//   const handleViewApplicants = (job) => {
//     setSelectedJob(job);
//     setShowApplicants(true);
//   };

//   const handleCloseJob = async (jobId, currentStatus) => {
//     const newStatus = !currentStatus;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isClosed: newStatus }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.map(job =>
//           job._id === jobId ? { ...job, isClosed: newStatus } : job
//         ));
//         alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
//       }
//     } catch (error) {
//       console.error("Error updating job status:", error);
//     }
//   };

//   const viewApplicantProfile = async (jobId, userId) => {
//     if (!userId) return;

//     try {
//       setShowApplicantProfile(true);
//       setApplicantProfileLoading(true);
//       setSelectedApplicantProfile(null);

//       const res = await fetch(
//         `/api/company/applicant?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || data?.message || "Failed to fetch applicant profile");
//       }

//       setSelectedApplicantProfile(data.profile || null);
//     } catch (error) {
//       console.error("Error fetching applicant profile:", error);
//       alert(error.message || "Error fetching applicant profile");
//       setShowApplicantProfile(false);
//     } finally {
//       setApplicantProfileLoading(false);
//     }
//   };

//   const updateApplicantStatus = async (jobId, userId, newStatus) => {
//     try {
//       if (!userId) return;

//       const res = await fetch("/api/company/applicant-status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId, userId, status: newStatus }),
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.ok) {
//         setJobs(jobs.map(job => {
//           if (job._id === jobId) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                   ? { ...app, status: newStatus }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob && selectedJob._id === jobId) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                 ? { ...app, status: newStatus }
//                 : app
//             )
//           });
//         }

//         alert(`Applicant status updated to ${newStatus}`);
//       } else {
//         alert(data?.error || data?.message || "Failed to update applicant status");
//       }
//     } catch (error) {
//       console.error("Error updating applicant status:", error);
//     }
//   };

//   const handleGetAISuggestion = async (jobId, applicantId) => {
//     setAnalyzingApplicant(applicantId);

//     try {
//       const res = await fetch("/api/company/analyze-applicant", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ jobId, applicantId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setAiAnalysis({
//           ...aiAnalysis,
//           [applicantId]: data.analysis,
//         });
//       } else {
//         alert(data.message || "Failed to generate AI analysis");
//       }
//     } catch (error) {
//       console.error("Error getting AI suggestion:", error);
//       alert("Error generating AI analysis. Please try again.");
//     } finally {
//       setAnalyzingApplicant(null);
//     }
//   };

//   const handleEditCompanyName = () => {
//     setIsEditingName(true);
//   };

//   const handleCancelEditName = () => {
//     setIsEditingName(false);
//     setNewCompanyName(companyName);
//   };

//   const handleSaveCompanyName = async () => {
//     if (!newCompanyName.trim()) {
//       alert("Company name cannot be empty");
//       return;
//     }

//     try {
//       const res = await fetch("/api/company/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newCompanyName.trim() }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setCompanyName(newCompanyName.trim());
//         setIsEditingName(false);
//         alert("Company name updated successfully!");
//         // Optionally refresh the session to update the displayed name
//         window.location.reload();
//       } else {
//         alert(data.message || "Failed to update company name");
//       }
//     } catch (error) {
//       console.error("Error updating company name:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const filteredJobs = jobs.filter(job => {
//     if (filter === "active" && job.isClosed) return false;
//     if (filter === "closed" && !job.isClosed) return false;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(term) ||
//         job.description.toLowerCase().includes(term) ||
//         job.location.toLowerCase().includes(term)
//       );
//     }

//     return true;
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Loading state
//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-16 h-16 mx-auto mb-4">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
//               <div className="absolute inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="text-2xl text-white">🏢</span>
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "company") {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-20 h-20 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-3xl text-white">🔒</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h1>
//           <p className="text-gray-600 mb-6">
//             You need to be logged in as a company to access this dashboard.
//           </p>
//           <a
//             href="/api/auth/signin"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
//           >
//             <span>Sign In as Company</span>
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "pending") {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-20 h-20 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
//               <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-3xl text-white">⏳</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Approval Pending</h1>
//           <p className="text-gray-600 mb-4">
//             Your company registration is being reviewed by our team. You'll be notified once approved.
//           </p>
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
//             <p className="text-yellow-800 text-sm">Usually takes 24-48 hours</p>
//           </div>
//           <a
//             href="/contact"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300"
//           >
//             Contact Support
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "rejected") {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-20 h-20 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-3xl text-white">❌</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Registration Rejected</h1>
//           <p className="text-gray-600 mb-6">
//             Your company registration has been rejected. Please contact support for more information.
//           </p>

//           {rejectionReason && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-left">
//               <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
//               <p className="text-red-700 text-sm whitespace-pre-wrap">{rejectionReason}</p>
//             </div>
//           )}

//           <div className="space-y-3">
//             <a
//               href="/contact"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300"
//             >
//               Contact Support
//             </a>
//             <a
//               href="/company/register"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
//             >
//               Re-apply
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-[8%]">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
//                 <span className="text-2xl text-white">🏢</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-white">Company Dashboard</h1>
//                 <p className="text-blue-100 text-sm">
//                   Welcome back, <span className="font-semibold">{session.user.name}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-col sm:flex-row gap-2">
//               <a
//                 href="/company/profile"
//                 className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300 text-sm"
//               >
//                 <span>Company Profile</span>
//               </a>
//               <button
//                 onClick={() => {
//                   setEditingJob(null);
//                   resetJobForm();
//                   setShowJobForm(true);
//                 }}
//                 className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-sm"
//               >
//                 <span className="text-lg">+</span>
//                 <span>Post New Job</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Company Settings Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-500 mb-2">Company Name</h3>
//               {isEditingName ? (
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="text"
//                     value={newCompanyName}
//                     onChange={(e) => setNewCompanyName(e.target.value)}
//                     placeholder="Enter company name"
//                     className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
//                   />
//                   <button
//                     onClick={handleSaveCompanyName}
//                     className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
//                     Save
//                   </button>
//                   <button
//                     onClick={handleCancelEditName}
//                     className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300">
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-3">
//                   <p className="text-xl font-bold text-gray-900">{companyName || "Your Company"}</p>
//                   <button
//                     onClick={handleEditCompanyName}
//                     className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300">
//                     <span>✏️</span>
//                     Edit Name
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</h3>
//                 <p className="text-xs text-green-600 font-medium mt-1">
//                   {stats.activeJobs} Active
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <span className="text-xl text-blue-600">💼</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.activeJobs}</h3>
//                 <p className="text-xs text-blue-600 font-medium mt-1">
//                   {((stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100).toFixed(0)}% of total
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                 <span className="text-xl text-green-600">✅</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Total Applicants</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalApplicants}</h3>
//                 <p className="text-xs text-purple-600 font-medium mt-1">
//                   Avg. {stats.totalJobs > 0 ? (stats.totalApplicants / stats.totalJobs).toFixed(1) : 0} per job
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                 <span className="text-xl text-purple-600">👥</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
//                 <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingApplicants}</h3>
//                 <p className="text-xs text-amber-600 font-medium mt-1">
//                   Needs attention
//                 </p>
//               </div>
//               <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
//                 <span className="text-xl text-amber-600">⏳</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//             <div className="flex-1">
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
//                 <input
//                   type="text"
//                   placeholder="Search jobs by title, location, or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400 text-sm"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 text-sm"
//               >
//                 <option value="all">All Jobs</option>
//                 <option value="active">Active Jobs</option>
//                 <option value="closed">Closed Jobs</option>
//               </select>
//               <button
//                 onClick={fetchCompanyJobs}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-300 text-sm"
//               >
//                 <span>🔄</span>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-4">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
//               <div className="w-20 h-20 mx-auto mb-4">
//                 <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
//                   <span className="text-3xl text-gray-400">💼</span>
//                 </div>
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-2">
//                 {searchTerm || filter !== "all" ? "No matching jobs found" : "No jobs posted yet"}
//               </h3>
//               <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
//                 {searchTerm || filter !== "all"
//                   ? "Try adjusting your search terms or filter criteria"
//                   : "Start by posting your first job opening to attract talented candidates!"}
//               </p>
//               {!searchTerm && filter === "all" && (
//                 <button
//                   onClick={() => setShowJobForm(true)}
//                   className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 text-sm"
//                 >
//                   <span>+</span>
//                   Post Your First Job
//                 </button>
//               )}
//             </div>
//           ) : (
//             filteredJobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
//               >
//                 <div className={`p-5 ${job.isClosed ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
//                     {/* Job Info */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex items-start gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                             <span className="text-lg text-white">💼</span>
//                           </div>
//                           <div>
//                             <div className="flex flex-wrap items-center gap-2 mb-1">
//                               <h2 className="text-lg font-bold text-gray-900">
//                                 {job.title}
//                               </h2>
//                               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${job.isClosed
//                                 ? 'bg-red-100 text-red-700'
//                                 : 'bg-green-100 text-green-700'
//                                 }`}>
//                                 {job.isClosed ? 'Closed' : 'Active'}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 text-sm mb-3">{job.company?.name || "Your Company"}</p>

//                             <div className="flex flex-wrap items-center gap-2 mb-3">
//                               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg text-sm">
//                                 <span className="text-blue-600">📍</span>
//                                 <span className="text-gray-700 font-medium">{job.location || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-lg text-sm">
//                                 <span className="text-green-600">💰</span>
//                                 <span className="text-gray-700 font-medium">{job.salary || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg text-sm">
//                                 <span className="text-purple-600">⏱️</span>
//                                 <span className="text-gray-700 font-medium capitalize">{job.type || "Full-time"}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right hidden sm:block">
//                           <p className="text-xs text-gray-500 mb-1">Posted</p>
//                           <p className="font-medium text-gray-900 text-sm">{formatDate(job.createdAt)}</p>
//                           <div className="mt-2 px-2.5 py-1 bg-blue-50 rounded-full inline-block">
//                             <span className="text-xs font-semibold text-blue-700">{job.applicants?.length || 0} applicants</span>
//                           </div>
//                         </div>
//                       </div>

//                       <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>

//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {job.skills && job.skills.split(',').slice(0, 3).map((skill, idx) => (
//                           <span
//                             key={idx}
//                             className="px-2.5 py-1 bg-gray-100 text-gray-700 font-medium rounded-lg text-xs border border-gray-200"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                         {job.skills && job.skills.split(',').length > 3 && (
//                           <span className="px-2.5 py-1 bg-gray-100 text-gray-600 font-medium rounded-lg text-xs">
//                             +{job.skills.split(',').length - 3} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-2 min-w-[200px]">
//                       <button
//                         onClick={() => handleViewApplicants(job)}
//                         className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300 text-sm"
//                       >
//                         <span>👥</span>
//                         View Applicants
//                         <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
//                           {job.applicants?.length || 0}
//                         </span>
//                       </button>

//                       <div className="grid grid-cols-2 gap-2">
//                         <button
//                           onClick={() => handleEditJob(job)}
//                           className="flex items-center justify-center gap-2 px-3 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm"
//                         >
//                           <span>✏️</span>
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleCloseJob(job._id, job.isClosed)}
//                           className={`flex items-center justify-center gap-2 px-3 py-2 font-medium rounded-lg transition-all duration-300 text-sm ${job.isClosed
//                             ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
//                             : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
//                             }`}
//                         >
//                           {job.isClosed ? (
//                             <>
//                               <span>🔓</span>
//                               Re-open
//                             </>
//                           ) : (
//                             <>
//                               <span>🔒</span>
//                               Close
//                             </>
//                           )}
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => handleDeleteJob(job._id)}
//                         className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-sm"
//                       >
//                         <span>🗑️</span>
//                         Delete Job
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Job Form Modal */}
//       {showJobForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowJobForm(false);
//             setEditingJob(null);
//             resetJobForm();
//           }}
//         >
//           <div
//             className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-lg text-white">📝</span>
//                   </div>
//                   <h2 className="text-lg font-bold text-white">
//                     {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmitJob} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Job Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={jobForm.title}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Senior Software Engineer"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={jobForm.location}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Remote, New York, San Francisco"
//                   />
//                 </div>

//                 {/* Salary */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Range
//                   </label>
//                   <input
//                     type="text"
//                     name="salary"
//                     value={jobForm.salary}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., $80,000 - $120,000 per year"
//                   />
//                 </div>

//                 {/* Job Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Type
//                   </label>
//                   <select
//                     name="type"
//                     value={jobForm.type}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="full-time">Full-time</option>
//                     <option value="part-time">Part-time</option>
//                     <option value="contract">Contract</option>
//                     <option value="internship">Internship</option>
//                     <option value="remote">Remote</option>
//                   </select>
//                 </div>

//                 {/* Experience */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Experience Level
//                   </label>
//                   <select
//                     name="experience"
//                     value={jobForm.experience}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="entry-level">Entry Level</option>
//                     <option value="mid-level">Mid Level</option>
//                     <option value="senior">Senior</option>
//                     <option value="executive">Executive</option>
//                   </select>
//                 </div>

//                 {/* Work Policy */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Work Policy
//                   </label>
//                   <select
//                     name="remote"
//                     value={jobForm.remote}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="on-site">On-site</option>
//                     <option value="remote">Remote</option>
//                     <option value="hybrid">Hybrid</option>
//                   </select>
//                 </div>

//                 {/* Application Deadline */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Application Deadline
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={jobForm.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>

//                 {/* Skills */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Required Skills
//                   </label>
//                   <textarea
//                     name="skills"
//                     value={jobForm.skills}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="React, Node.js, MongoDB, AWS, TypeScript..."
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Job Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={jobForm.description}
//                   onChange={handleInputChange}
//                   required
//                   rows="4"
//                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Describe the role, responsibilities, expectations..."
//                 />
//               </div>

//               {/* Requirements */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Requirements & Qualifications
//                 </label>
//                 <textarea
//                   name="requirements"
//                   value={jobForm.requirements}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="List specific requirements, qualifications, and experience needed..."
//                 />
//               </div>

//               {/* Benefits */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Benefits & Perks
//                 </label>
//                 <textarea
//                   name="benefits"
//                   value={jobForm.benefits}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Health insurance, stock options, remote work, flexible hours..."
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
//                 >
//                   {editingJob ? "Update Job Posting" : "Post Job Opening"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Applicants Modal */}
//       {showApplicants && selectedJob && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicants(false);
//             setSelectedJob(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-lg text-white">👥</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">
//                       Applicants for "{selectedJob.title}"
//                     </h2>
//                     <p className="text-blue-100 text-sm">
//                       {selectedJob.applicants?.length || 0} total applicants
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicants(false);
//                     setSelectedJob(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4">
//                     <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
//                       <span className="text-3xl text-gray-400">📭</span>
//                     </div>
//                   </div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">No applicants yet</h3>
//                   <p className="text-gray-600 mb-4 text-sm">
//                     Share this job on social media to attract more candidates
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <button className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors text-sm">
//                       Share on LinkedIn
//                     </button>
//                     <button className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-colors text-sm">
//                       Share on Twitter
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                   {selectedJob.applicants.map((app, index) => (
//                     <div
//                       key={app._id || index}
//                       className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-all duration-300"
//                     >
//                       <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-shrink-0">
//                           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
//                             <span className="text-white font-bold">
//                               {(app.user?.name || "A").charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
//                             <div>
//                               <h4 className="font-bold text-gray-900 text-sm">
//                                 {app.user?.name || "Anonymous Applicant"}
//                               </h4>
//                               <p className="text-gray-600 text-xs mb-1">{app.user?.email || "No email provided"}</p>
//                               <p className="text-xs text-gray-500">
//                                 Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
//                               </p>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => viewApplicantProfile(selectedJob._id, app.user?._id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
//                               >
//                                 <span>👤</span>
//                                 Profile
//                               </button>
//                               <select
//                                 value={app.status || "pending"}
//                                 onChange={(e) => updateApplicantStatus(selectedJob._id, app.user?._id, e.target.value)}
//                                 className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
//                               >
//                                 <option value="pending">Pending</option>
//                                 <option value="reviewed">Reviewed</option>
//                                 <option value="shortlisted">Shortlisted</option>
//                                 <option value="rejected">Rejected</option>
//                                 <option value="accepted">Accepted</option>
//                               </select>
//                             </div>
//                           </div>

//                           {/* Status Badge */}
//                           <div className="mb-3">
//                             <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${app.status === "accepted"
//                               ? "bg-green-100 text-green-700 border border-green-200"
//                               : app.status === "rejected"
//                                 ? "bg-red-100 text-red-700 border border-red-200"
//                                 : app.status === "shortlisted"
//                                   ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
//                                   : app.status === "reviewed"
//                                     ? "bg-blue-100 text-blue-700 border border-blue-200"
//                                     : "bg-gray-100 text-gray-700 border border-gray-200"
//                               }`}>
//                               {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending Review"}
//                             </span>
//                           </div>

//                           {/* Cover Letter */}
//                           {app.coverLetter && (
//                             <div className="pt-3 border-t border-gray-200">
//                               <p className="text-xs font-semibold text-gray-700 mb-1">Cover Letter:</p>
//                               <p className="text-gray-600 text-xs line-clamp-2">{app.coverLetter}</p>
//                             </div>
//                           )}

//                           {/* AI Suggestion Button */}
//                           <div className="pt-3 border-t border-gray-200 mt-3">
//                             <button
//                               onClick={() => handleGetAISuggestion(selectedJob._id, app.user?._id)}
//                               disabled={analyzingApplicant === app.user?._id || aiAnalysis[app.user?._id]}
//                               className={`w-full flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 text-xs ${aiAnalysis[app.user?._id]
//                                 ? "bg-green-600 text-white cursor-not-allowed"
//                                 : analyzingApplicant === app.user?._id
//                                   ? "bg-gray-400 text-white cursor-wait"
//                                   : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md"
//                                 }`}
//                             >
//                               {analyzingApplicant === app.user?._id ? (
//                                 <>
//                                   <span className="animate-spin">⟳</span>
//                                   <span>Analyzing...</span>
//                                 </>
//                               ) : aiAnalysis[app.user?._id] ? (
//                                 <>
//                                   <span>✓</span>
//                                   <span>AI Analyzed</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <span>🤖</span>
//                                   <span>Get AI Suggestion</span>
//                                 </>
//                               )}
//                             </button>
//                           </div>

//                           {/* AI Analysis Results */}
//                           {aiAnalysis[app.user?._id] && (
//                             <div className="mt-4 pt-4 border-t border-purple-200">
//                               <div className="bg-purple-50 rounded-lg p-3 border border-purple-300">
//                                 <div className="flex items-center justify-between mb-3">
//                                   <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1">
//                                     <span>🤖</span>
//                                     AI Analysis
//                                   </h5>
//                                   <div className="text-right">
//                                     <div className={`text-lg font-black ${aiAnalysis[app.user?._id].score >= 75 ? "text-green-600" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "text-orange-600" : "text-red-600"
//                                       }`}>
//                                       {aiAnalysis[app.user?._id].score}%
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Progress Bar */}
//                                 <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
//                                   <div
//                                     className={`h-full transition-all duration-1000 ${aiAnalysis[app.user?._id].score >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
//                                         "bg-gradient-to-r from-red-500 to-pink-500"
//                                       }`}
//                                     style={{ width: `${aiAnalysis[app.user?._id].score}%` }}
//                                   ></div>
//                                 </div>

//                                 {/* Recommendation Badge */}
//                                 <div className="mb-3">
//                                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${aiAnalysis[app.user?._id].recommendation === "Highly Recommended"
//                                     ? "bg-green-100 text-green-700 border border-green-300"
//                                     : aiAnalysis[app.user?._id].recommendation === "Recommended"
//                                       ? "bg-blue-100 text-blue-700 border border-blue-300"
//                                       : aiAnalysis[app.user?._id].recommendation === "Consider"
//                                         ? "bg-orange-100 text-orange-700 border border-orange-300"
//                                         : "bg-red-100 text-red-700 border border-red-300"
//                                     }`}>
//                                     {aiAnalysis[app.user?._id].recommendation}
//                                   </span>
//                                 </div>

//                                 {/* Highlights & Concerns */}
//                                 {aiAnalysis[app.user?._id].reasoning && (
//                                   <div className="bg-white rounded p-2 border-l-4 border-purple-500">
//                                     <p className="text-xs font-semibold text-purple-700 mb-1">AI Assessment:</p>
//                                     <p className="text-xs text-gray-700 leading-relaxed">
//                                       {aiAnalysis[app.user?._id].reasoning}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Applicant Profile Modal */}
//       {showApplicantProfile && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicantProfile(false);
//             setSelectedApplicantProfile(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gray-900 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-lg text-white">👤</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Applicant Profile</h2>
//                     <p className="text-gray-200 text-sm">View details submitted by the candidate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicantProfile(false);
//                     setSelectedApplicantProfile(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {applicantProfileLoading ? (
//                 <div className="text-center py-12">
//                   <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
//                     <span className="text-2xl text-gray-400">⏳</span>
//                   </div>
//                   <p className="text-gray-600 font-medium text-sm">Loading profile...</p>
//                 </div>
//               ) : !selectedApplicantProfile ? (
//                 <div className="text-center py-12">
//                   <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-2xl text-gray-400">📭</span>
//                   </div>
//                   <p className="text-gray-600 font-medium text-sm">No profile data available.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                       <div>
//                         <h3 className="font-bold text-gray-900">
//                           {selectedApplicantProfile.name || "Unnamed Applicant"}
//                         </h3>
//                         <p className="text-gray-600 text-sm">{selectedApplicantProfile.email}</p>
//                       </div>
//                       {selectedApplicantProfile.resume && (
//                         <a
//                           href={selectedApplicantProfile.resume}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors text-sm"
//                         >
//                           <span>📄</span>
//                           Open Resume
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <p className="text-xs font-semibold text-gray-500 mb-1">Phone</p>
//                       <p className="text-gray-900 font-medium">{selectedApplicantProfile.phone || "Not provided"}</p>
//                     </div>
//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <p className="text-xs font-semibold text-gray-500 mb-1">Location</p>
//                       <p className="text-gray-900 font-medium">{selectedApplicantProfile.location || "Not provided"}</p>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-lg border border-gray-200 p-4">
//                     <p className="text-xs font-semibold text-gray-500 mb-2">Skills</p>
//                     {Array.isArray(selectedApplicantProfile.skills) && selectedApplicantProfile.skills.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {selectedApplicantProfile.skills.map((s, idx) => (
//                           <span
//                             key={idx}
//                             className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium border border-gray-200"
//                           >
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700 text-sm">Not provided</p>
//                     )}
//                   </div>

//                   <div className="bg-white rounded-lg border border-gray-200 p-4">
//                     <p className="text-xs font-semibold text-gray-500 mb-2">Experience</p>
//                     <p className="text-gray-800 text-sm whitespace-pre-wrap">
//                       {selectedApplicantProfile.experience || "Not provided"}
//                     </p>
//                   </div>

//                   <div className="bg-white rounded-lg border border-gray-200 p-4">
//                     <p className="text-xs font-semibold text-gray-500 mb-2">Education</p>
//                     {Array.isArray(selectedApplicantProfile.education) && selectedApplicantProfile.education.length > 0 ? (
//                       <div className="space-y-3">
//                         {selectedApplicantProfile.education.map((edu, index) => (
//                           <div key={index} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
//                             <p className="text-sm font-medium text-gray-900">
//                               {edu.degree} in {edu.field}
//                             </p>
//                             <p className="text-xs text-gray-600">{edu.institution}</p>
//                             <p className="text-xs text-gray-500">
//                               {edu.startDate} - {edu.endDate}
//                               {edu.gpa && ` • GPA: ${edu.gpa}`}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700 text-sm">Not provided</p>
//                     )}
//                   </div>

//                   {selectedApplicantProfile.socialLinks && (
//                     <div className="bg-white rounded-lg border border-gray-200 p-4">
//                       <p className="text-xs font-semibold text-gray-500 mb-2">Social Links</p>
//                       <div className="space-y-1">
//                         {Object.entries(selectedApplicantProfile.socialLinks).map(([key, value]) =>
//                           value ? (
//                             <a
//                               key={key}
//                               href={value}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block text-blue-600 hover:underline text-sm break-all"
//                             >
//                               {key}: {value}
//                             </a>
//                           ) : null
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companyStatus, setCompanyStatus] = useState(null);
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [jobForm, setJobForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     salary: "",
//     type: "full-time",
//     experience: "mid-level",
//     requirements: "",
//     skills: "",
//     benefits: "",
//     deadline: "",
//     remote: "on-site"
//   });
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplicants, setShowApplicants] = useState(false);
//   const [showApplicantProfile, setShowApplicantProfile] = useState(false);
//   const [applicantProfileLoading, setApplicantProfileLoading] = useState(false);
//   const [selectedApplicantProfile, setSelectedApplicantProfile] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     activeJobs: 0,
//     totalApplicants: 0,
//     pendingApplicants: 0,
//     interviewedApplicants: 0
//   });
//   const [activeTab, setActiveTab] = useState("jobs");
//   const [aiAnalysis, setAiAnalysis] = useState({});
//   const [analyzingApplicant, setAnalyzingApplicant] = useState(null);
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [newCompanyName, setNewCompanyName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [selectedApplicantForEmail, setSelectedApplicantForEmail] = useState(null);
//   const [emailForm, setEmailForm] = useState({
//     subject: "",
//     message: "",
//     scheduleDate: "",
//     scheduleTime: "",
//     interviewDate: "",
//     interviewTime: "",
//     interviewType: "virtual",
//     interviewLink: ""
//   });
//   const [sendingEmail, setSendingEmail] = useState(false);
//   const [emailTemplates, setEmailTemplates] = useState([
//     { id: 1, name: "Interview Invitation", subject: "Interview Invitation for {jobTitle}", message: "Dear {applicantName},\n\nThank you for applying to the {jobTitle} position at {companyName}.\n\nWe were impressed with your application and would like to invite you for an interview.\n\nPlease let us know your availability.\n\nBest regards,\n{companyName} Team" },
//     { id: 2, name: "Technical Round", subject: "Technical Interview - {jobTitle}", message: "Hello {applicantName},\n\nCongratulations! You have been shortlisted for the technical interview for {jobTitle}.\n\nPlease come prepared for a coding assessment.\n\nBest regards,\n{companyName} Hiring Team" },
//     { id: 3, name: "HR Round", subject: "HR Interview - {jobTitle}", message: "Dear {applicantName},\n\nWe'd like to schedule an HR interview for the {jobTitle} position.\n\nThis will be a behavioral and cultural fit assessment.\n\nLooking forward to speaking with you.\n\nRegards,\nHR Team" }
//   ]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");

//   useEffect(() => {
//     if (session?.user?.role === "company") {
//       fetchCompanyStatus();
//       fetchCompanyJobs();
//       setCompanyName(session.user.name || "");
//       setNewCompanyName(session.user.name || "");
//     }
//   }, [session]);

//   useEffect(() => {
//     calculateStats();
//   }, [jobs]);

//   const fetchCompanyStatus = async () => {
//     try {
//       const res = await fetch("/api/company/status");
//       const data = await res.json();
//       setCompanyStatus(data.companyStatus);
//       setRejectionReason(data.rejectionReason || "");
//     } catch (error) {
//       console.error("Error fetching company status:", error);
//     }
//   };

//   const fetchCompanyJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/company/jobs");
//       const data = await res.json();

//       if (Array.isArray(data.jobs)) {
//         setJobs(data.jobs);
//       } else if (Array.isArray(data)) {
//         setJobs(data);
//       } else {
//         setJobs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const totalJobs = jobs.length;
//     const activeJobs = jobs.filter(job => !job.isClosed).length;
//     const totalApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.length || 0), 0
//     );
//     const pendingApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => !app.status || app.status === "applied")?.length || 0), 0
//     );
//     const interviewedApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => app.status === "interviewed")?.length || 0), 0
//     );

//     setStats({
//       totalJobs,
//       activeJobs,
//       totalApplicants,
//       pendingApplicants,
//       interviewedApplicants
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setJobForm({
//       ...jobForm,
//       [name]: value,
//     });
//   };

//   const handleEmailInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmailForm({
//       ...emailForm,
//       [name]: value,
//     });
//   };

//   const handleTemplateSelect = (templateId) => {
//     const template = emailTemplates.find(t => t.id === templateId);
//     if (template) {
//       const applicantName = selectedApplicantForEmail?.user?.name || "Applicant";
//       const jobTitle = selectedJob?.title || "Position";

//       setEmailForm({
//         ...emailForm,
//         subject: template.subject
//           .replace("{applicantName}", applicantName)
//           .replace("{jobTitle}", jobTitle)
//           .replace("{companyName}", companyName),
//         message: template.message
//           .replace("{applicantName}", applicantName)
//           .replace("{jobTitle}", jobTitle)
//           .replace("{companyName}", companyName)
//       });
//       setSelectedTemplate(templateId);
//     }
//   };

//   const handleSendEmail = async (e) => {
//     e.preventDefault();

//     if (!selectedApplicantForEmail?.user?.email) {
//       alert("Applicant email not found");
//       return;
//     }

//     setSendingEmail(true);

//     try {
//       // TEMPORARILY SKIP STATUS UPDATE TO TEST EMAIL SENDING
//       // First update the status to "interviewed"
//       /*
//       const statusRes = await fetch("/api/company/applicant-status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           jobId: selectedJob._id,
//           userId: selectedApplicantForEmail.user._id,
//           status: "interviewed"
//         }),
//       });

//       if (!statusRes.ok) {
//         throw new Error("Failed to update applicant status");
//       }
//       */

//       // Then send the email
//       const emailRes = await fetch("/api/send-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: selectedApplicantForEmail.user.email,
//           applicantName: selectedApplicantForEmail.user.name,
//           subject: emailForm.subject,
//           message: emailForm.message,
//           jobId: selectedJob._id,
//           jobTitle: selectedJob.title,
//           companyName: companyName,
//           interviewDate: emailForm.interviewDate,
//           interviewTime: emailForm.interviewTime,
//           interviewType: emailForm.interviewType,
//           interviewLink: emailForm.interviewLink,
//           scheduleDate: emailForm.scheduleDate,
//           scheduleTime: emailForm.scheduleTime
//         }),
//       });

//       const emailData = await emailRes.json();

//       if (emailRes.ok) {
//         // Update local state
//         setJobs(jobs.map(job => {
//           if (job._id === selectedJob._id) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === selectedApplicantForEmail.user._id)
//                   ? { ...app, status: "interviewed" }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === selectedApplicantForEmail.user._id)
//                 ? { ...app, status: "interviewed" }
//                 : app
//             )
//           });
//         }

//         alert("Email sent successfully and status updated to 'Interviewed'!");
//         setShowEmailModal(false);
//         setSelectedApplicantForEmail(null);
//         setEmailForm({
//           subject: "",
//           message: "",
//           scheduleDate: "",
//           scheduleTime: "",
//           interviewDate: "",
//           interviewTime: "",
//           interviewType: "virtual",
//           interviewLink: ""
//         });
//       } else {
//         console.error("Email API Error Response:", emailData);
//         throw new Error(emailData.error || emailData.message || "Failed to send email");
//       }
//     } catch (error) {
//       console.error("Error sending email:", error);
//       console.error("Error details:", {
//         message: error.message,
//         stack: error.stack
//       });
//       alert(`Failed to send email: ${error.message || "Unknown error"}. Check console for details.`);
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   const openEmailModal = (applicant) => {
//     setSelectedApplicantForEmail(applicant);

//     // Set default subject and message
//     const defaultSubject = `Interview Invitation for ${selectedJob?.title}`;
//     const defaultMessage = `Dear ${applicant.user?.name || 'Applicant'},

// Thank you for applying to the ${selectedJob?.title} position at ${companyName}.

// We were impressed with your application and would like to invite you for an interview.

// Please let us know your availability.

// Best regards,
// ${companyName} Hiring Team`;

//     setEmailForm({
//       ...emailForm,
//       subject: defaultSubject,
//       message: defaultMessage
//     });

//     setShowEmailModal(true);
//   };

//   const handleSubmitJob = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = editingJob ? `/api/company/jobs/${editingJob._id}` : "/api/company/jobs";
//       const method = editingJob ? "PATCH" : "POST";

//       const payload = {
//         title: jobForm.title,
//         description: jobForm.description,
//         location: jobForm.location,
//         salary: jobForm.salary,
//         jobType: jobForm.type,
//         experienceLevel: jobForm.experience,
//         applicationDeadline: jobForm.deadline,
//         requirements: jobForm.requirements,
//         skills: jobForm.skills,
//       };

//       const res = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (editingJob) {
//           setJobs(jobs.map(job => job._id === editingJob._id ? data.job : job));
//           alert("Job updated successfully!");
//         } else {
//           setJobs([data.job, ...jobs]);
//           alert("Job posted successfully!");
//         }
//         resetJobForm();
//         setShowJobForm(false);
//         setEditingJob(null);
//       } else {
//         alert(data.message || "Failed to post job. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error posting job:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const resetJobForm = () => {
//     setJobForm({
//       title: "",
//       description: "",
//       location: "",
//       salary: "",
//       type: "full-time",
//       experience: "mid-level",
//       requirements: "",
//       skills: "",
//       benefits: "",
//       deadline: "",
//       remote: "on-site"
//     });
//   };

//   const handleEditJob = (job) => {
//     setEditingJob(job);

//     // Format date for input field (YYYY-MM-DD)
//     let formattedDeadline = "";
//     if (job.applicationDeadline) {
//       const date = new Date(job.applicationDeadline);
//       formattedDeadline = date.toISOString().split('T')[0];
//     }

//     setJobForm({
//       title: job.title || "",
//       description: job.description || "",
//       location: job.location || "",
//       salary: job.salary || "",
//       type: job.jobType || "full-time",
//       experience: job.experienceLevel || "mid-level",
//       requirements: job.requirements || "",
//       skills: job.skills || "",
//       benefits: job.benefits || "",
//       deadline: formattedDeadline,
//       remote: job.remote || "on-site"
//     });
//     setShowJobForm(true);
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.filter(job => job._id !== jobId));
//         alert("Job deleted successfully!");
//       } else {
//         alert(data.message || "Failed to delete job.");
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     }
//   };

//   const handleViewApplicants = (job) => {
//     setSelectedJob(job);
//     setShowApplicants(true);
//   };

//   const handleCloseJob = async (jobId, currentStatus) => {
//     const newStatus = !currentStatus;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isClosed: newStatus }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.map(job =>
//           job._id === jobId ? { ...job, isClosed: newStatus } : job
//         ));
//         alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
//       }
//     } catch (error) {
//       console.error("Error updating job status:", error);
//     }
//   };

//   const viewApplicantProfile = async (jobId, userId) => {
//     if (!userId) return;

//     try {
//       setShowApplicantProfile(true);
//       setApplicantProfileLoading(true);
//       setSelectedApplicantProfile(null);

//       const res = await fetch(
//         `/api/company/applicant?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || data?.message || "Failed to fetch applicant profile");
//       }

//       setSelectedApplicantProfile(data.profile || null);
//     } catch (error) {
//       console.error("Error fetching applicant profile:", error);
//       alert(error.message || "Error fetching applicant profile");
//       setShowApplicantProfile(false);
//     } finally {
//       setApplicantProfileLoading(false);
//     }
//   };

//   const updateApplicantStatus = async (jobId, userId, newStatus) => {
//     try {
//       if (!userId) return;

//       const res = await fetch("/api/company/applicant-status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId, userId, status: newStatus }),
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.ok) {
//         setJobs(jobs.map(job => {
//           if (job._id === jobId) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                   ? { ...app, status: newStatus }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob && selectedJob._id === jobId) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                 ? { ...app, status: newStatus }
//                 : app
//             )
//           });
//         }

//         alert(`Applicant status updated to ${newStatus}`);
//       } else {
//         alert(data?.error || data?.message || "Failed to update applicant status");
//       }
//     } catch (error) {
//       console.error("Error updating applicant status:", error);
//     }
//   };

//   const handleGetAISuggestion = async (jobId, applicantId) => {
//     setAnalyzingApplicant(applicantId);

//     try {
//       const res = await fetch("/api/company/analyze-applicant", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ jobId, applicantId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setAiAnalysis({
//           ...aiAnalysis,
//           [applicantId]: data.analysis,
//         });
//       } else {
//         alert(data.message || "Failed to generate AI analysis");
//       }
//     } catch (error) {
//       console.error("Error getting AI suggestion:", error);
//       alert("Error generating AI analysis. Please try again.");
//     } finally {
//       setAnalyzingApplicant(null);
//     }
//   };

//   const handleEditCompanyName = () => {
//     setIsEditingName(true);
//   };

//   const handleCancelEditName = () => {
//     setIsEditingName(false);
//     setNewCompanyName(companyName);
//   };

//   const handleSaveCompanyName = async () => {
//     if (!newCompanyName.trim()) {
//       alert("Company name cannot be empty");
//       return;
//     }

//     try {
//       const res = await fetch("/api/company/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newCompanyName.trim() }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setCompanyName(newCompanyName.trim());
//         setIsEditingName(false);
//         alert("Company name updated successfully!");
//         // Optionally refresh the session to update the displayed name
//         window.location.reload();
//       } else {
//         alert(data.message || "Failed to update company name");
//       }
//     } catch (error) {
//       console.error("Error updating company name:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const filteredJobs = jobs.filter(job => {
//     if (filter === "active" && job.isClosed) return false;
//     if (filter === "closed" && !job.isClosed) return false;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(term) ||
//         job.description.toLowerCase().includes(term) ||
//         job.location.toLowerCase().includes(term)
//       );
//     }

//     return true;
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   // Loading state
//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh]">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 mx-auto mb-4">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
//               <div className="absolute inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="text-3xl text-white">🏢</span>
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "company") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">🔒</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h1>
//           <p className="text-gray-600 mb-6">
//             You need to be logged in as a company to access this dashboard.
//           </p>
//           <a
//             href="/api/auth/signin"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             <span>Sign In as Company</span>
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "pending") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
//               <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">⏳</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Approval Pending</h1>
//           <p className="text-gray-600 mb-4">
//             Your company registration is being reviewed by our team. You'll be notified once approved.
//           </p>
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
//             <p className="text-yellow-800 text-sm">Usually takes 24-48 hours</p>
//           </div>
//           <a
//             href="/contact"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
//           >
//             Contact Support
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "rejected") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">❌</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Registration Rejected</h1>
//           <p className="text-gray-600 mb-6">
//             Your company registration has been rejected. Please contact support for more information.
//           </p>

//           {rejectionReason && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-left">
//               <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
//               <p className="text-red-700 text-sm whitespace-pre-wrap">{rejectionReason}</p>
//             </div>
//           )}

//           <div className="space-y-3">
//             <a
//               href="/contact"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5"
//             >
//               Contact Support
//             </a>
//             <a
//               href="/company/register"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
//             >
//               Re-apply
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/5"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-[8%] relative">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-3xl text-white">🏢</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
//                 <p className="text-blue-100 text-sm">
//                   Welcome back, <span className="font-semibold">{session.user.name}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <a
//                 href="/company/profile"
//                 className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 <span>🏢</span>
//                 <span className="hidden sm:inline">Company Profile</span>
//               </a>
//               <button
//                 onClick={() => {
//                   setEditingJob(null);
//                   resetJobForm();
//                   setShowJobForm(true);
//                 }}
//                 className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
//               >
//                 <span className="text-xl">+</span>
//                 <span className="hidden sm:inline">Post New Job</span>
//                 <span className="sm:hidden">Post Job</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Company Settings Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-500 mb-2">Company Name</h3>
//               {isEditingName ? (
//                 <div className="flex flex-col md:flex-row md:items-center gap-3">
//                   <input
//                     type="text"
//                     value={newCompanyName}
//                     onChange={(e) => setNewCompanyName(e.target.value)}
//                     placeholder="Enter company name"
//                     className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 transition-all duration-300"
//                   />
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSaveCompanyName}
//                       className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancelEditName}
//                       className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                   <div>
//                     <p className="text-2xl font-bold text-gray-900">{companyName || "Your Company"}</p>
//                     <p className="text-sm text-gray-500 mt-1">Manage your company information</p>
//                   </div>
//                   <button
//                     onClick={handleEditCompanyName}
//                     className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 w-full md:w-auto">
//                     <span>✏️</span>
//                     Edit Name
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Total Jobs</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</h3>
//                 <p className="text-xs text-blue-600 font-medium mt-2">
//                   {stats.activeJobs} Active
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">💼</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</h3>
//                 <p className="text-xs text-green-600 font-medium mt-2">
//                   {((stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100).toFixed(0)}% of total
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">✅</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Total Applicants</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</h3>
//                 <p className="text-xs text-purple-600 font-medium mt-2">
//                   Avg. {stats.totalJobs > 0 ? (stats.totalApplicants / stats.totalJobs).toFixed(1) : 0} per job
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">👥</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Pending Reviews</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApplicants}</h3>
//                 <p className="text-xs text-amber-600 font-medium mt-2">
//                   Needs attention
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">⏳</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Interviewed</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.interviewedApplicants}</h3>
//                 <p className="text-xs text-indigo-600 font-medium mt-2">
//                   Scheduled interviews
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">🎯</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
//                 <input
//                   type="text"
//                   placeholder="Search jobs by title, location, or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700"
//               >
//                 <option value="all">All Jobs</option>
//                 <option value="active">Active Jobs</option>
//                 <option value="closed">Closed Jobs</option>
//               </select>
//               <button
//                 onClick={fetchCompanyJobs}
//                 className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 border-2 border-gray-300 hover:shadow-md"
//               >
//                 <span className="text-lg">🔄</span>
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-6">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
//               <div className="w-24 h-24 mx-auto mb-6">
//                 <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
//                   <span className="text-4xl text-gray-400">💼</span>
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 {searchTerm || filter !== "all" ? "No matching jobs found" : "No jobs posted yet"}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {searchTerm || filter !== "all"
//                   ? "Try adjusting your search terms or filter criteria"
//                   : "Start by posting your first job opening to attract talented candidates!"}
//               </p>
//               {!searchTerm && filter === "all" && (
//                 <button
//                   onClick={() => setShowJobForm(true)}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
//                 >
//                   <span className="text-xl">+</span>
//                   Post Your First Job
//                 </button>
//               )}
//             </div>
//           ) : (
//             filteredJobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
//               >
//                 <div className={`p-6 ${job.isClosed ? 'border-l-4 border-red-500 bg-red-50/30' : 'border-l-4 border-green-500 bg-green-50/30'}`}>
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                     {/* Job Info */}
//                     <div className="flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
//                         <div className="flex items-start gap-4">
//                           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
//                             <span className="text-xl text-white">💼</span>
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-2 mb-2">
//                               <h2 className="text-xl font-bold text-gray-900">
//                                 {job.title}
//                               </h2>
//                               <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${job.isClosed
//                                 ? 'bg-red-100 text-red-700 border border-red-200'
//                                 : 'bg-green-100 text-green-700 border border-green-200'
//                                 }`}>
//                                 {job.isClosed ? 'CLOSED' : 'ACTIVE'}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 text-sm mb-4">{job.company?.name || companyName}</p>

//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                               <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
//                                 <span className="text-blue-600">📍</span>
//                                 <span className="text-gray-700 font-medium">{job.location || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
//                                 <span className="text-green-600">💰</span>
//                                 <span className="text-gray-700 font-medium">{job.salary || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
//                                 <span className="text-purple-600">⏱️</span>
//                                 <span className="text-gray-700 font-medium capitalize">{job.type || "Full-time"}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs text-gray-500 mb-1">Posted</p>
//                           <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
//                           <div className="mt-3 px-3 py-1.5 bg-blue-50 rounded-full inline-block border border-blue-100">
//                             <span className="text-sm font-bold text-blue-700">{job.applicants?.length || 0} applicants</span>
//                           </div>
//                         </div>
//                       </div>

//                       <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {job.skills && job.skills.split(',').slice(0, 4).map((skill, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm border border-gray-200"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                         {job.skills && job.skills.split(',').length > 4 && (
//                           <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm">
//                             +{job.skills.split(',').length - 4} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3 min-w-[220px]">
//                       <button
//                         onClick={() => handleViewApplicants(job)}
//                         className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                       >
//                         <span className="text-lg">👥</span>
//                         View Applicants
//                         <span className="bg-white/20 px-2 py-1 rounded text-sm">
//                           {job.applicants?.length || 0}
//                         </span>
//                       </button>

//                       <div className="grid grid-cols-2 gap-2">
//                         <button
//                           onClick={() => handleEditJob(job)}
//                           className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300"
//                         >
//                           <span>✏️</span>
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleCloseJob(job._id, job.isClosed)}
//                           className={`flex items-center justify-center gap-2 px-3 py-2.5 font-medium rounded-xl transition-all duration-300 ${job.isClosed
//                             ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
//                             : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-md"
//                             }`}
//                         >
//                           {job.isClosed ? (
//                             <>
//                               <span>🔓</span>
//                               Re-open
//                             </>
//                           ) : (
//                             <>
//                               <span>🔒</span>
//                               Close
//                             </>
//                           )}
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => handleDeleteJob(job._id)}
//                         className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                       >
//                         <span className="text-lg">🗑️</span>
//                         Delete Job
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Job Form Modal */}
//       {showJobForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowJobForm(false);
//             setEditingJob(null);
//             resetJobForm();
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">📝</span>
//                   </div>
//                   <h2 className="text-lg font-bold text-white">
//                     {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmitJob} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Job Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={jobForm.title}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Senior Software Engineer"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={jobForm.location}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Remote, New York, San Francisco"
//                   />
//                 </div>

//                 {/* Salary */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Range
//                   </label>
//                   <input
//                     type="text"
//                     name="salary"
//                     value={jobForm.salary}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., $80,000 - $120,000 per year"
//                   />
//                 </div>

//                 {/* Job Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Type
//                   </label>
//                   <select
//                     name="type"
//                     value={jobForm.type}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="full-time">Full-time</option>
//                     <option value="part-time">Part-time</option>
//                     <option value="contract">Contract</option>
//                     <option value="internship">Internship</option>
//                     <option value="remote">Remote</option>
//                   </select>
//                 </div>

//                 {/* Experience */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Experience Level
//                   </label>
//                   <select
//                     name="experience"
//                     value={jobForm.experience}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="entry-level">Entry Level</option>
//                     <option value="mid-level">Mid Level</option>
//                     <option value="senior">Senior</option>
//                     <option value="executive">Executive</option>
//                   </select>
//                 </div>

//                 {/* Work Policy */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Work Policy
//                   </label>
//                   <select
//                     name="remote"
//                     value={jobForm.remote}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="on-site">On-site</option>
//                     <option value="remote">Remote</option>
//                     <option value="hybrid">Hybrid</option>
//                   </select>
//                 </div>

//                 {/* Application Deadline */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Application Deadline
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={jobForm.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>

//                 {/* Skills */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Required Skills
//                   </label>
//                   <textarea
//                     name="skills"
//                     value={jobForm.skills}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="React, Node.js, MongoDB, AWS, TypeScript..."
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Job Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={jobForm.description}
//                   onChange={handleInputChange}
//                   required
//                   rows="4"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Describe the role, responsibilities, expectations..."
//                 />
//               </div>

//               {/* Requirements */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Requirements & Qualifications
//                 </label>
//                 <textarea
//                   name="requirements"
//                   value={jobForm.requirements}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="List specific requirements, qualifications, and experience needed..."
//                 />
//               </div>

//               {/* Benefits */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Benefits & Perks
//                 </label>
//                 <textarea
//                   name="benefits"
//                   value={jobForm.benefits}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Health insurance, stock options, remote work, flexible hours..."
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                 >
//                   {editingJob ? "Update Job Posting" : "Post Job Opening"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Applicants Modal */}
//       {showApplicants && selectedJob && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicants(false);
//             setSelectedJob(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">👥</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">
//                       Applicants for "{selectedJob.title}"
//                     </h2>
//                     <p className="text-blue-100 text-sm">
//                       {selectedJob.applicants?.length || 0} total applicants
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicants(false);
//                     setSelectedJob(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 mx-auto mb-4">
//                     <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
//                       <span className="text-4xl text-gray-400">📭</span>
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants yet</h3>
//                   <p className="text-gray-600 mb-6">
//                     Share this job on social media to attract more candidates
//                   </p>
//                   <div className="flex flex-wrap gap-3 justify-center">
//                     <button className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors shadow-sm">
//                       Share on LinkedIn
//                     </button>
//                     <button className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-colors shadow-sm">
//                       Share on Twitter
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                   {selectedJob.applicants.map((app, index) => (
//                     <div
//                       key={app._id || index}
//                       className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
//                     >
//                       <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-shrink-0">
//                           <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
//                             <span className="text-white font-bold text-lg">
//                               {(app.user?.name || "A").charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
//                             <div>
//                               <h4 className="font-bold text-gray-900">
//                                 {app.user?.name || "Anonymous Applicant"}
//                               </h4>
//                               <p className="text-gray-600 text-sm mb-1">{app.user?.email || "No email provided"}</p>
//                               <p className="text-xs text-gray-500">
//                                 Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
//                               </p>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => viewApplicantProfile(selectedJob._id, app.user?._id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
//                               >
//                                 <span>👤</span>
//                                 Profile
//                               </button>
//                               <button
//                                 onClick={() => openEmailModal(app)}
//                                 className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs"
//                               >
//                                 <span>✉️</span>
//                                 Invite
//                               </button>
//                               <select
//                                 value={app.status || "pending"}
//                                 onChange={(e) => updateApplicantStatus(selectedJob._id, app.user?._id, e.target.value)}
//                                 className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
//                               >
//                                 <option value="pending">Pending</option>
//                                 <option value="reviewed">Reviewed</option>
//                                 <option value="shortlisted">Shortlisted</option>
//                                 <option value="rejected">Rejected</option>
//                                 <option value="interviewed">Interviewed</option>
//                                 <option value="accepted">Accepted</option>
//                               </select>
//                             </div>
//                           </div>

//                           {/* Status Badge */}
//                           <div className="mb-3">
//                             <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${app.status === "accepted"
//                               ? "bg-green-100 text-green-700 border border-green-200"
//                               : app.status === "rejected"
//                                 ? "bg-red-100 text-red-700 border border-red-200"
//                                 : app.status === "interviewed"
//                                   ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
//                                   : app.status === "shortlisted"
//                                     ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
//                                     : app.status === "reviewed"
//                                       ? "bg-blue-100 text-blue-700 border border-blue-200"
//                                       : "bg-gray-100 text-gray-700 border border-gray-200"
//                               }`}>
//                               {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending Review"}
//                             </span>
//                           </div>

//                           {/* Cover Letter */}
//                           {app.coverLetter && (
//                             <div className="pt-3 border-t border-gray-200">
//                               <p className="text-xs font-semibold text-gray-700 mb-1">Cover Letter:</p>
//                               <p className="text-gray-600 text-xs line-clamp-2">{app.coverLetter}</p>
//                             </div>
//                           )}

//                           {/* Action Buttons */}
//                           <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 mt-3">
//                             <button
//                               onClick={() => handleGetAISuggestion(selectedJob._id, app.user?._id)}
//                               disabled={analyzingApplicant === app.user?._id || aiAnalysis[app.user?._id]}
//                               className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 text-xs flex-1 ${aiAnalysis[app.user?._id]
//                                 ? "bg-green-600 text-white cursor-not-allowed shadow-md"
//                                 : analyzingApplicant === app.user?._id
//                                   ? "bg-gray-400 text-white cursor-wait"
//                                   : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md"
//                                 }`}
//                             >
//                               {analyzingApplicant === app.user?._id ? (
//                                 <>
//                                   <span className="animate-spin">⟳</span>
//                                   <span>Analyzing...</span>
//                                 </>
//                               ) : aiAnalysis[app.user?._id] ? (
//                                 <>
//                                   <span>✓</span>
//                                   <span>AI Analyzed</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <span>🤖</span>
//                                   <span>AI Analysis</span>
//                                 </>
//                               )}
//                             </button>

//                             <button
//                               onClick={() => openEmailModal(app)}
//                               className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs flex-1"
//                             >
//                               <span>✉️</span>
//                               <span>Send Email</span>
//                             </button>
//                           </div>

//                           {/* AI Analysis Results */}
//                           {aiAnalysis[app.user?._id] && (
//                             <div className="mt-4 pt-4 border-t border-purple-200">
//                               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-300">
//                                 <div className="flex items-center justify-between mb-3">
//                                   <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
//                                     <span className="text-lg">🤖</span>
//                                     AI Analysis
//                                   </h5>
//                                   <div className="text-right">
//                                     <div className={`text-2xl font-black ${aiAnalysis[app.user?._id].score >= 75 ? "text-green-600" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "text-orange-600" : "text-red-600"
//                                       }`}>
//                                       {aiAnalysis[app.user?._id].score}%
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Progress Bar */}
//                                 <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
//                                   <div
//                                     className={`h-full transition-all duration-1000 ${aiAnalysis[app.user?._id].score >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
//                                         "bg-gradient-to-r from-red-500 to-pink-500"
//                                       }`}
//                                     style={{ width: `${aiAnalysis[app.user?._id].score}%` }}
//                                   ></div>
//                                 </div>

//                                 {/* Recommendation Badge */}
//                                 <div className="mb-3">
//                                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${aiAnalysis[app.user?._id].recommendation === "Highly Recommended"
//                                     ? "bg-green-100 text-green-700 border border-green-300"
//                                     : aiAnalysis[app.user?._id].recommendation === "Recommended"
//                                       ? "bg-blue-100 text-blue-700 border border-blue-300"
//                                       : aiAnalysis[app.user?._id].recommendation === "Consider"
//                                         ? "bg-orange-100 text-orange-700 border border-orange-300"
//                                         : "bg-red-100 text-red-700 border border-red-300"
//                                     }`}>
//                                     {aiAnalysis[app.user?._id].recommendation}
//                                   </span>
//                                 </div>

//                                 {/* Highlights & Concerns */}
//                                 {aiAnalysis[app.user?._id].reasoning && (
//                                   <div className="bg-white/80 rounded-lg p-3 border-l-4 border-purple-500">
//                                     <p className="text-xs font-semibold text-purple-700 mb-1">AI Assessment:</p>
//                                     <p className="text-xs text-gray-700 leading-relaxed">
//                                       {aiAnalysis[app.user?._id].reasoning}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Email Modal */}
//       {showEmailModal && selectedApplicantForEmail && (
//         <div
//           className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowEmailModal(false);
//             setSelectedApplicantForEmail(null);
//             setEmailForm({
//               subject: "",
//               message: "",
//               scheduleDate: "",
//               scheduleTime: "",
//               interviewDate: "",
//               interviewTime: "",
//               interviewType: "virtual",
//               interviewLink: ""
//             });
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">✉️</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Send Interview Invitation</h2>
//                     <p className="text-emerald-100 text-sm">
//                       To: {selectedApplicantForEmail.user?.name} ({selectedApplicantForEmail.user?.email})
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                     setEmailForm({
//                       subject: "",
//                       message: "",
//                       scheduleDate: "",
//                       scheduleTime: "",
//                       interviewDate: "",
//                       interviewTime: "",
//                       interviewType: "virtual",
//                       interviewLink: ""
//                     });
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSendEmail} className="p-6 space-y-6">
//               {/* Email Templates */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quick Templates
//                 </label>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                   {emailTemplates.map((template) => (
//                     <button
//                       type="button"
//                       key={template.id}
//                       onClick={() => handleTemplateSelect(template.id)}
//                       className={`p-3 border rounded-xl text-sm font-medium transition-all duration-300 ${selectedTemplate === template.id
//                         ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
//                         : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                         }`}
//                     >
//                       {template.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Subject */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Subject <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={emailForm.subject}
//                   onChange={handleEmailInputChange}
//                   name="subject"
//                   required
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   placeholder="Interview Invitation for..."
//                 />
//               </div>

//               {/* Interview Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Date
//                   </label>
//                   <input
//                     type="date"
//                     value={emailForm.interviewDate}
//                     onChange={handleEmailInputChange}
//                     name="interviewDate"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Time
//                   </label>
//                   <input
//                     type="time"
//                     value={emailForm.interviewTime}
//                     onChange={handleEmailInputChange}
//                     name="interviewTime"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Type
//                   </label>
//                   <select
//                     value={emailForm.interviewType}
//                     onChange={handleEmailInputChange}
//                     name="interviewType"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="virtual">Virtual/Online</option>
//                     <option value="in-person">In-person</option>
//                     <option value="phone">Phone Call</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Meeting Link (if virtual)
//                   </label>
//                   <input
//                     type="text"
//                     value={emailForm.interviewLink}
//                     onChange={handleEmailInputChange}
//                     name="interviewLink"
//                     placeholder="https://meet.google.com/..."
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               {/* Message */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Message <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={emailForm.message}
//                   onChange={handleEmailInputChange}
//                   name="message"
//                   required
//                   rows="6"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Write your email message here..."
//                 />
//               </div>

//               {/* Note */}
//               <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
//                 <p className="text-sm text-blue-700">
//                   <span className="font-semibold">Note:</span> Sending this email will automatically update the applicant's status to "Interviewed".
//                 </p>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                     setEmailForm({
//                       subject: "",
//                       message: "",
//                       scheduleDate: "",
//                       scheduleTime: "",
//                       interviewDate: "",
//                       interviewTime: "",
//                       interviewType: "virtual",
//                       interviewLink: ""
//                     });
//                   }}
//                   className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={sendingEmail}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {sendingEmail ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="animate-spin">⟳</span>
//                       Sending...
//                     </span>
//                   ) : (
//                     "Send Email & Mark as Interviewed"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Applicant Profile Modal */}
//       {showApplicantProfile && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicantProfile(false);
//             setSelectedApplicantProfile(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">👤</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Applicant Profile</h2>
//                     <p className="text-gray-200 text-sm">View details submitted by the candidate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicantProfile(false);
//                     setSelectedApplicantProfile(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {applicantProfileLoading ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
//                     <span className="text-3xl text-gray-400">⏳</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">Loading profile...</p>
//                 </div>
//               ) : !selectedApplicantProfile ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-3xl text-gray-400">📭</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">No profile data available.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900">
//                           {selectedApplicantProfile.name || "Unnamed Applicant"}
//                         </h3>
//                         <p className="text-gray-600">{selectedApplicantProfile.email}</p>
//                       </div>
//                       {selectedApplicantProfile.resume && (
//                         <a
//                           href={selectedApplicantProfile.resume}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                         >
//                           <span className="text-lg">📄</span>
//                           <span>Open Resume</span>
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
//                       <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.phone || "Not provided"}</p>
//                     </div>
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
//                       <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.location || "Not provided"}</p>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Skills</p>
//                     {Array.isArray(selectedApplicantProfile.skills) && selectedApplicantProfile.skills.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {selectedApplicantProfile.skills.map((s, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium border border-gray-200"
//                           >
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700">Not provided</p>
//                     )}
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Experience</p>
//                     <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
//                       {selectedApplicantProfile.experience || "Not provided"}
//                     </p>
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Education</p>
//                     {Array.isArray(selectedApplicantProfile.education) && selectedApplicantProfile.education.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedApplicantProfile.education.map((edu, index) => (
//                           <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//                             <p className="font-medium text-gray-900">
//                               {edu.degree} in {edu.field}
//                             </p>
//                             <p className="text-gray-600">{edu.institution}</p>
//                             <p className="text-sm text-gray-500">
//                               {edu.startDate} - {edu.endDate}
//                               {edu.gpa && ` • GPA: ${edu.gpa}`}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700">Not provided</p>
//                     )}
//                   </div>

//                   {selectedApplicantProfile.socialLinks && (
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-2">Social Links</p>
//                       <div className="space-y-2">
//                         {Object.entries(selectedApplicantProfile.socialLinks).map(([key, value]) =>
//                           value ? (
//                             <a
//                               key={key}
//                               href={value}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block text-blue-600 hover:underline break-all"
//                             >
//                               {key}: {value}
//                             </a>
//                           ) : null
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Email Modal */}
//       {showEmailModal && selectedApplicantForEmail && (
//         <div
//           className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowEmailModal(false);
//             setSelectedApplicantForEmail(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">✉️</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Send Interview Invitation</h2>
//                     <p className="text-green-100 text-sm">
//                       To: {selectedApplicantForEmail.user?.name || "Applicant"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSendEmail} className="p-6 space-y-6">
//               {/* Template Selector */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Template
//                 </label>
//                 <select
//                   value={selectedTemplate}
//                   onChange={(e) => handleTemplateSelect(parseInt(e.target.value))}
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                 >
//                   <option value="">Select a template...</option>
//                   {emailTemplates.map((template) => (
//                     <option key={template.id} value={template.id}>
//                       {template.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Subject */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subject <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="subject"
//                   value={emailForm.subject}
//                   onChange={handleEmailInputChange}
//                   required
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   placeholder="Interview Invitation for Software Engineer"
//                 />
//               </div>

//               {/* Message */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Message <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="message"
//                   value={emailForm.message}
//                   onChange={handleEmailInputChange}
//                   required
//                   rows="6"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Dear candidate, we would like to invite you for an interview..."
//                 />
//               </div>

//               {/* Interview Details Section */}
//               <div className="border-t-2 border-gray-200 pt-6">
//                 <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <span>📅</span>
//                   Interview Details (Optional)
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Interview Date */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Interview Date
//                     </label>
//                     <input
//                       type="date"
//                       name="interviewDate"
//                       value={emailForm.interviewDate}
//                       onChange={handleEmailInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                     />
//                   </div>

//                   {/* Interview Time */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Interview Time
//                     </label>
//                     <input
//                       type="time"
//                       name="interviewTime"
//                       value={emailForm.interviewTime}
//                       onChange={handleEmailInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                     />
//                   </div>

//                   {/* Interview Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Interview Type
//                     </label>
//                     <select
//                       name="interviewType"
//                       value={emailForm.interviewType}
//                       onChange={handleEmailInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                     >
//                       <option value="virtual">Virtual (Online)</option>
//                       <option value="in-person">In-Person</option>
//                       <option value="phone">Phone Call</option>
//                     </select>
//                   </div>

//                   {/* Interview Link */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Meeting Link (for virtual)
//                     </label>
//                     <input
//                       type="url"
//                       name="interviewLink"
//                       value={emailForm.interviewLink}
//                       onChange={handleEmailInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                       placeholder="https://meet.google.com/..."
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-6 border-t-2 border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                   }}
//                   className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={sendingEmail}
//                   className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${sendingEmail
//                     ? "bg-gray-400 text-white cursor-wait"
//                     : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg"
//                     }`}
//                 >
//                   {sendingEmail ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="animate-spin">⟳</span>
//                       Sending...
//                     </span>
//                   ) : (
//                     <span className="flex items-center justify-center gap-2">
//                       <span>✉️</span>
//                       Send Email
//                     </span>
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [companyStatus, setCompanyStatus] = useState(null);
//   const [showJobForm, setShowJobForm] = useState(false);
//   const [jobForm, setJobForm] = useState({
//     title: "",
//     description: "",
//     location: "",
//     salary: "",
//     type: "full-time",
//     experience: "mid-level",
//     requirements: "",
//     skills: "",
//     benefits: "",
//     deadline: "",
//     remote: "on-site"
//   });
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showApplicants, setShowApplicants] = useState(false);
//   const [showApplicantProfile, setShowApplicantProfile] = useState(false);
//   const [applicantProfileLoading, setApplicantProfileLoading] = useState(false);
//   const [selectedApplicantProfile, setSelectedApplicantProfile] = useState(null);
//   const [editingJob, setEditingJob] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [stats, setStats] = useState({
//     totalJobs: 0,
//     activeJobs: 0,
//     totalApplicants: 0,
//     pendingApplicants: 0,
//     interviewedApplicants: 0
//   });
//   const [aiAnalysis, setAiAnalysis] = useState({});
//   const [analyzingApplicant, setAnalyzingApplicant] = useState(null);
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [newCompanyName, setNewCompanyName] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [showEmailModal, setShowEmailModal] = useState(false);
//   const [selectedApplicantForEmail, setSelectedApplicantForEmail] = useState(null);
//   const [emailForm, setEmailForm] = useState({
//     subject: "",
//     message: "",
//     scheduleDate: "",
//     scheduleTime: "",
//     interviewDate: "",
//     interviewTime: "",
//     interviewType: "virtual",
//     interviewLink: ""
//   });
//   const [sendingEmail, setSendingEmail] = useState(false);
//   const [emailTemplates, setEmailTemplates] = useState([
//     { id: 1, name: "Interview Invitation", subject: "Interview Invitation for {jobTitle}", message: "Dear {applicantName},\n\nThank you for applying to the {jobTitle} position at {companyName}.\n\nWe were impressed with your application and would like to invite you for an interview.\n\nPlease let us know your availability.\n\nBest regards,\n{companyName} Team" },
//     { id: 2, name: "Technical Round", subject: "Technical Interview - {jobTitle}", message: "Hello {applicantName},\n\nCongratulations! You have been shortlisted for the technical interview for {jobTitle}.\n\nPlease come prepared for a coding assessment.\n\nBest regards,\n{companyName} Hiring Team" },
//     { id: 3, name: "HR Round", subject: "HR Interview - {jobTitle}", message: "Dear {applicantName},\n\nWe'd like to schedule an HR interview for the {jobTitle} position.\n\nThis will be a behavioral and cultural fit assessment.\n\nLooking forward to speaking with you.\n\nRegards,\nHR Team" }
//   ]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");

//   useEffect(() => {
//     if (session?.user?.role === "company") {
//       fetchCompanyStatus();
//       fetchCompanyJobs();
//       setCompanyName(session.user.name || "");
//       setNewCompanyName(session.user.name || "");
//     }
//   }, [session]);

//   useEffect(() => {
//     calculateStats();
//   }, [jobs]);

//   const fetchCompanyStatus = async () => {
//     try {
//       const res = await fetch("/api/company/status");
//       const data = await res.json();
//       setCompanyStatus(data.companyStatus);
//       setRejectionReason(data.rejectionReason || "");
//     } catch (error) {
//       console.error("Error fetching company status:", error);
//     }
//   };

//   const fetchCompanyJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/company/jobs");
//       const data = await res.json();

//       if (Array.isArray(data.jobs)) {
//         setJobs(data.jobs);
//       } else if (Array.isArray(data)) {
//         setJobs(data);
//       } else {
//         setJobs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       setJobs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const totalJobs = jobs.length;
//     const activeJobs = jobs.filter(job => !job.isClosed).length;
//     const totalApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.length || 0), 0
//     );
//     const pendingApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => !app.status || app.status === "applied")?.length || 0), 0
//     );
//     const interviewedApplicants = jobs.reduce((total, job) =>
//       total + (job.applicants?.filter(app => app.status === "interviewed")?.length || 0), 0
//     );

//     setStats({
//       totalJobs,
//       activeJobs,
//       totalApplicants,
//       pendingApplicants,
//       interviewedApplicants
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setJobForm({
//       ...jobForm,
//       [name]: value,
//     });
//   };

//   const handleEmailInputChange = (e) => {
//     const { name, value } = e.target;
//     setEmailForm({
//       ...emailForm,
//       [name]: value,
//     });
//   };

//   const handleTemplateSelect = (templateId) => {
//     const template = emailTemplates.find(t => t.id === templateId);
//     if (template) {
//       const applicantName = selectedApplicantForEmail?.user?.name || "Applicant";
//       const jobTitle = selectedJob?.title || "Position";

//       setEmailForm({
//         ...emailForm,
//         subject: template.subject
//           .replace("{applicantName}", applicantName)
//           .replace("{jobTitle}", jobTitle)
//           .replace("{companyName}", companyName),
//         message: template.message
//           .replace("{applicantName}", applicantName)
//           .replace("{jobTitle}", jobTitle)
//           .replace("{companyName}", companyName)
//       });
//       setSelectedTemplate(templateId);
//     }
//   };

//   const handleSendEmail = async (e) => {
//     e.preventDefault();

//     if (!selectedApplicantForEmail?.user?.email) {
//       alert("Applicant email not found");
//       return;
//     }

//     setSendingEmail(true);

//     try {
//       const emailRes = await fetch("/api/send-email", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           to: selectedApplicantForEmail.user.email,
//           applicantName: selectedApplicantForEmail.user.name,
//           subject: emailForm.subject,
//           message: emailForm.message,
//           jobId: selectedJob._id,
//           jobTitle: selectedJob.title,
//           companyName: companyName,
//           interviewDate: emailForm.interviewDate,
//           interviewTime: emailForm.interviewTime,
//           interviewType: emailForm.interviewType,
//           interviewLink: emailForm.interviewLink,
//           scheduleDate: emailForm.scheduleDate,
//           scheduleTime: emailForm.scheduleTime
//         }),
//       });

//       const emailData = await emailRes.json();

//       if (emailRes.ok) {
//         setJobs(jobs.map(job => {
//           if (job._id === selectedJob._id) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === selectedApplicantForEmail.user._id)
//                   ? { ...app, status: "interviewed" }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === selectedApplicantForEmail.user._id)
//                 ? { ...app, status: "interviewed" }
//                 : app
//             )
//           });
//         }

//         alert("Email sent successfully and status updated to 'Interviewed'!");
//         setShowEmailModal(false);
//         setSelectedApplicantForEmail(null);
//         setEmailForm({
//           subject: "",
//           message: "",
//           scheduleDate: "",
//           scheduleTime: "",
//           interviewDate: "",
//           interviewTime: "",
//           interviewType: "virtual",
//           interviewLink: ""
//         });
//       } else {
//         console.error("Email API Error Response:", emailData);
//         throw new Error(emailData.error || emailData.message || "Failed to send email");
//       }
//     } catch (error) {
//       console.error("Error sending email:", error);
//       alert(`Failed to send email: ${error.message || "Unknown error"}. Check console for details.`);
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   const openEmailModal = (applicant) => {
//     setSelectedApplicantForEmail(applicant);

//     const defaultSubject = `Interview Invitation for ${selectedJob?.title}`;
//     const defaultMessage = `Dear ${applicant.user?.name || 'Applicant'},

// Thank you for applying to the ${selectedJob?.title} position at ${companyName}.

// We were impressed with your application and would like to invite you for an interview.

// Please let us know your availability.

// Best regards,
// ${companyName} Hiring Team`;

//     setEmailForm({
//       ...emailForm,
//       subject: defaultSubject,
//       message: defaultMessage
//     });

//     setShowEmailModal(true);
//   };

//   const handleSubmitJob = async (e) => {
//     e.preventDefault();

//     try {
//       const endpoint = editingJob ? `/api/company/jobs/${editingJob._id}` : "/api/company/jobs";
//       const method = editingJob ? "PATCH" : "POST";

//       const payload = {
//         title: jobForm.title,
//         description: jobForm.description,
//         location: jobForm.location,
//         salary: jobForm.salary,
//         jobType: jobForm.type,
//         experienceLevel: jobForm.experience,
//         applicationDeadline: jobForm.deadline,
//         requirements: jobForm.requirements,
//         skills: jobForm.skills,
//       };

//       const res = await fetch(endpoint, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (editingJob) {
//           setJobs(jobs.map(job => job._id === editingJob._id ? data.job : job));
//           alert("Job updated successfully!");
//         } else {
//           setJobs([data.job, ...jobs]);
//           alert("Job posted successfully!");
//         }
//         resetJobForm();
//         setShowJobForm(false);
//         setEditingJob(null);
//       } else {
//         alert(data.message || "Failed to post job. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error posting job:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const resetJobForm = () => {
//     setJobForm({
//       title: "",
//       description: "",
//       location: "",
//       salary: "",
//       type: "full-time",
//       experience: "mid-level",
//       requirements: "",
//       skills: "",
//       benefits: "",
//       deadline: "",
//       remote: "on-site"
//     });
//   };

//   const handleEditJob = (job) => {
//     setEditingJob(job);

//     let formattedDeadline = "";
//     if (job.applicationDeadline) {
//       const date = new Date(job.applicationDeadline);
//       formattedDeadline = date.toISOString().split('T')[0];
//     }

//     setJobForm({
//       title: job.title || "",
//       description: job.description || "",
//       location: job.location || "",
//       salary: job.salary || "",
//       type: job.jobType || "full-time",
//       experience: job.experienceLevel || "mid-level",
//       requirements: job.requirements || "",
//       skills: job.skills || "",
//       benefits: job.benefits || "",
//       deadline: formattedDeadline,
//       remote: job.remote || "on-site"
//     });
//     setShowJobForm(true);
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (!confirm("Are you sure you want to delete this job?")) return;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "DELETE",
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.filter(job => job._id !== jobId));
//         alert("Job deleted successfully!");
//       } else {
//         alert(data.message || "Failed to delete job.");
//       }
//     } catch (error) {
//       console.error("Error deleting job:", error);
//     }
//   };

//   const handleViewApplicants = (job) => {
//     setSelectedJob(job);
//     setShowApplicants(true);
//   };

//   const handleCloseJob = async (jobId, currentStatus) => {
//     const newStatus = !currentStatus;

//     try {
//       const res = await fetch(`/api/company/jobs/${jobId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ isClosed: newStatus }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setJobs(jobs.map(job =>
//           job._id === jobId ? { ...job, isClosed: newStatus } : job
//         ));
//         alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
//       }
//     } catch (error) {
//       console.error("Error updating job status:", error);
//     }
//   };

//   const viewApplicantProfile = async (jobId, userId) => {
//     if (!userId) return;

//     try {
//       setShowApplicantProfile(true);
//       setApplicantProfileLoading(true);
//       setSelectedApplicantProfile(null);

//       const res = await fetch(
//         `/api/company/applicant?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || data?.message || "Failed to fetch applicant profile");
//       }

//       setSelectedApplicantProfile(data.profile || null);
//     } catch (error) {
//       console.error("Error fetching applicant profile:", error);
//       alert(error.message || "Error fetching applicant profile");
//       setShowApplicantProfile(false);
//     } finally {
//       setApplicantProfileLoading(false);
//     }
//   };

//   const updateApplicantStatus = async (jobId, userId, newStatus) => {
//     try {
//       if (!userId) return;

//       const res = await fetch("/api/company/applicant-status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId, userId, status: newStatus }),
//       });
//       const data = await res.json().catch(() => ({}));

//       if (res.ok) {
//         setJobs(jobs.map(job => {
//           if (job._id === jobId) {
//             return {
//               ...job,
//               applicants: job.applicants.map(app =>
//                 (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                   ? { ...app, status: newStatus }
//                   : app
//               )
//             };
//           }
//           return job;
//         }));

//         if (selectedJob && selectedJob._id === jobId) {
//           setSelectedJob({
//             ...selectedJob,
//             applicants: selectedJob.applicants.map(app =>
//               (app.user?._id === userId || app.user?._id?.toString?.() === userId)
//                 ? { ...app, status: newStatus }
//                 : app
//             )
//           });
//         }

//         alert(`Applicant status updated to ${newStatus}`);
//       } else {
//         alert(data?.error || data?.message || "Failed to update applicant status");
//       }
//     } catch (error) {
//       console.error("Error updating applicant status:", error);
//     }
//   };

//   const handleGetAISuggestion = async (jobId, applicantId) => {
//     setAnalyzingApplicant(applicantId);

//     try {
//       const res = await fetch("/api/company/analyze-applicant", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ jobId, applicantId }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setAiAnalysis({
//           ...aiAnalysis,
//           [applicantId]: data.analysis,
//         });
//       } else {
//         alert(data.message || "Failed to generate AI analysis");
//       }
//     } catch (error) {
//       console.error("Error getting AI suggestion:", error);
//       alert("Error generating AI analysis. Please try again.");
//     } finally {
//       setAnalyzingApplicant(null);
//     }
//   };

//   const handleEditCompanyName = () => {
//     setIsEditingName(true);
//   };

//   const handleCancelEditName = () => {
//     setIsEditingName(false);
//     setNewCompanyName(companyName);
//   };

//   const handleSaveCompanyName = async () => {
//     if (!newCompanyName.trim()) {
//       alert("Company name cannot be empty");
//       return;
//     }

//     try {
//       const res = await fetch("/api/company/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newCompanyName.trim() }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setCompanyName(newCompanyName.trim());
//         setIsEditingName(false);
//         alert("Company name updated successfully!");
//         window.location.reload();
//       } else {
//         alert(data.message || "Failed to update company name");
//       }
//     } catch (error) {
//       console.error("Error updating company name:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   const filteredJobs = jobs.filter(job => {
//     if (filter === "active" && job.isClosed) return false;
//     if (filter === "closed" && !job.isClosed) return false;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       return (
//         job.title.toLowerCase().includes(term) ||
//         job.description.toLowerCase().includes(term) ||
//         job.location.toLowerCase().includes(term)
//       );
//     }

//     return true;
//   });

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh]">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 mx-auto mb-4">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
//               <div className="absolute inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
//                 <span className="text-3xl text-white">C</span>
//               </div>
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session || session.user.role !== "company") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">X</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h1>
//           <p className="text-gray-600 mb-6">
//             You need to be logged in as a company to access this dashboard.
//           </p>
//           <a
//             href="/api/auth/signin"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             Sign In as Company
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "pending") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
//               <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">!</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Approval Pending</h1>
//           <p className="text-gray-600 mb-4">
//             Your company registration is being reviewed by our team. You'll be notified once approved.
//           </p>
//           <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
//             <p className="text-yellow-800 text-sm">Usually takes 24-48 hours</p>
//           </div>
//           <a
//             href="/contact"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
//           >
//             Contact Support
//           </a>
//         </div>
//       </div>
//     );
//   }

//   if (companyStatus === "rejected") {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh] p-4">
//         <div className="text-center max-w-md">
//           <div className="relative mb-6">
//             <div className="w-24 h-24 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
//               <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
//                 <span className="text-4xl text-white">X</span>
//               </div>
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Registration Rejected</h1>
//           <p className="text-gray-600 mb-6">
//             Your company registration has been rejected. Please contact support for more information.
//           </p>

//           {rejectionReason && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-left">
//               <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
//               <p className="text-red-700 text-sm whitespace-pre-wrap">{rejectionReason}</p>
//             </div>
//           )}

//           <div className="space-y-3">
//             <a
//               href="/contact"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5"
//             >
//               Contact Support
//             </a>
//             <a
//               href="/company/register"
//               className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
//             >
//               Re-apply
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg relative overflow-hidden">
//         <div className="absolute inset-0 bg-black/5"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-[8%] relative">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex items-center gap-3">
//               <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-3xl text-white">C</span>
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
//                 <p className="text-blue-100 text-sm">
//                   Welcome back, <span className="font-semibold">{session.user.name}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <a
//                 href="/company/profile"
//                 className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
//               >
//                 Company Profile
//               </a>
//               <button
//                 onClick={() => {
//                   setEditingJob(null);
//                   resetJobForm();
//                   setShowJobForm(true);
//                 }}
//                 className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
//               >
//                 <span className="text-xl">+</span>
//                 Post New Job
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Company Settings Card */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="flex-1">
//               <h3 className="text-sm font-semibold text-gray-500 mb-2">Company Name</h3>
//               {isEditingName ? (
//                 <div className="flex flex-col md:flex-row md:items-center gap-3">
//                   <input
//                     type="text"
//                     value={newCompanyName}
//                     onChange={(e) => setNewCompanyName(e.target.value)}
//                     placeholder="Enter company name"
//                     className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 transition-all duration-300"
//                   />
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSaveCompanyName}
//                       className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancelEditName}
//                       className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                   <div>
//                     <p className="text-2xl font-bold text-gray-900">{companyName || "Your Company"}</p>
//                     <p className="text-sm text-gray-500 mt-1">Manage your company information</p>
//                   </div>
//                   <button
//                     onClick={handleEditCompanyName}
//                     className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 w-full md:w-auto">
//                     Edit Name
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Total Jobs</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</h3>
//                 <p className="text-xs text-blue-600 font-medium mt-2">
//                   {stats.activeJobs} Active
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">J</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</h3>
//                 <p className="text-xs text-green-600 font-medium mt-2">
//                   {((stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100).toFixed(0)}% of total
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">A</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Total Applicants</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</h3>
//                 <p className="text-xs text-purple-600 font-medium mt-2">
//                   Avg. {stats.totalJobs > 0 ? (stats.totalApplicants / stats.totalJobs).toFixed(1) : 0} per job
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">P</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Pending Reviews</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApplicants}</h3>
//                 <p className="text-xs text-amber-600 font-medium mt-2">
//                   Needs attention
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">R</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Interviewed</p>
//                 <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.interviewedApplicants}</h3>
//                 <p className="text-xs text-indigo-600 font-medium mt-2">
//                   Scheduled interviews
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <span className="text-2xl text-white">I</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search jobs by title, location, or description..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-4 pr-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                 />
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700"
//               >
//                 <option value="all">All Jobs</option>
//                 <option value="active">Active Jobs</option>
//                 <option value="closed">Closed Jobs</option>
//               </select>
//               <button
//                 onClick={fetchCompanyJobs}
//                 className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 border-2 border-gray-300 hover:shadow-md"
//               >
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-6">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
//               <div className="w-24 h-24 mx-auto mb-6">
//                 <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
//                   <span className="text-4xl text-gray-400">J</span>
//                 </div>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-3">
//                 {searchTerm || filter !== "all" ? "No matching jobs found" : "No jobs posted yet"}
//               </h3>
//               <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                 {searchTerm || filter !== "all"
//                   ? "Try adjusting your search terms or filter criteria"
//                   : "Start by posting your first job opening to attract talented candidates!"}
//               </p>
//               {!searchTerm && filter === "all" && (
//                 <button
//                   onClick={() => setShowJobForm(true)}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
//                 >
//                   <span className="text-xl">+</span>
//                   Post Your First Job
//                 </button>
//               )}
//             </div>
//           ) : (
//             filteredJobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
//               >
//                 <div className={`p-6 ${job.isClosed ? 'border-l-4 border-red-500 bg-red-50/30' : 'border-l-4 border-green-500 bg-green-50/30'}`}>
//                   <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                     {/* Job Info */}
//                     <div className="flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
//                         <div className="flex items-start gap-4">
//                           <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
//                             <span className="text-xl text-white">J</span>
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-2 mb-2">
//                               <h2 className="text-xl font-bold text-gray-900">
//                                 {job.title}
//                               </h2>
//                               <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${job.isClosed
//                                 ? 'bg-red-100 text-red-700 border border-red-200'
//                                 : 'bg-green-100 text-green-700 border border-green-200'
//                                 }`}>
//                                 {job.isClosed ? 'CLOSED' : 'ACTIVE'}
//                               </span>
//                             </div>
//                             <p className="text-gray-600 text-sm mb-4">{job.company?.name || companyName}</p>

//                             <div className="flex flex-wrap items-center gap-2 mb-4">
//                               <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
//                                 <span className="text-gray-700 font-medium">{job.location || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
//                                 <span className="text-gray-700 font-medium">{job.salary || "Not specified"}</span>
//                               </div>
//                               <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
//                                 <span className="text-gray-700 font-medium capitalize">{job.type || "Full-time"}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs text-gray-500 mb-1">Posted</p>
//                           <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
//                           <div className="mt-3 px-3 py-1.5 bg-blue-50 rounded-full inline-block border border-blue-100">
//                             <span className="text-sm font-bold text-blue-700">{job.applicants?.length || 0} applicants</span>
//                           </div>
//                         </div>
//                       </div>

//                       <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {job.skills && job.skills.split(',').slice(0, 4).map((skill, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm border border-gray-200"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                         {job.skills && job.skills.split(',').length > 4 && (
//                           <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm">
//                             +{job.skills.split(',').length - 4} more
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col gap-3 min-w-[220px]">
//                       <button
//                         onClick={() => handleViewApplicants(job)}
//                         className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                       >
//                         View Applicants
//                         <span className="bg-white/20 px-2 py-1 rounded text-sm">
//                           {job.applicants?.length || 0}
//                         </span>
//                       </button>

//                       <div className="grid grid-cols-2 gap-2">
//                         <button
//                           onClick={() => handleEditJob(job)}
//                           className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300"
//                         >
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleCloseJob(job._id, job.isClosed)}
//                           className={`flex items-center justify-center gap-2 px-3 py-2.5 font-medium rounded-xl transition-all duration-300 ${job.isClosed
//                             ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
//                             : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-md"
//                             }`}
//                         >
//                           {job.isClosed ? "Re-open" : "Close"}
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => handleDeleteJob(job._id)}
//                         className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                       >
//                         Delete Job
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Job Form Modal */}
//       {showJobForm && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowJobForm(false);
//             setEditingJob(null);
//             resetJobForm();
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">F</span>
//                   </div>
//                   <h2 className="text-lg font-bold text-white">
//                     {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
//                   </h2>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSubmitJob} className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Job Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={jobForm.title}
//                     onChange={handleInputChange}
//                     required
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Senior Software Engineer"
//                   />
//                 </div>

//                 {/* Location */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={jobForm.location}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., Remote, New York, San Francisco"
//                   />
//                 </div>

//                 {/* Salary */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Salary Range
//                   </label>
//                   <input
//                     type="text"
//                     name="salary"
//                     value={jobForm.salary}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                     placeholder="e.g., $80,000 - $120,000 per year"
//                   />
//                 </div>

//                 {/* Job Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Job Type
//                   </label>
//                   <select
//                     name="type"
//                     value={jobForm.type}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="full-time">Full-time</option>
//                     <option value="part-time">Part-time</option>
//                     <option value="contract">Contract</option>
//                     <option value="internship">Internship</option>
//                     <option value="remote">Remote</option>
//                   </select>
//                 </div>

//                 {/* Experience */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Experience Level
//                   </label>
//                   <select
//                     name="experience"
//                     value={jobForm.experience}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="entry-level">Entry Level</option>
//                     <option value="mid-level">Mid Level</option>
//                     <option value="senior">Senior</option>
//                     <option value="executive">Executive</option>
//                   </select>
//                 </div>

//                 {/* Work Policy */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Work Policy
//                   </label>
//                   <select
//                     name="remote"
//                     value={jobForm.remote}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="on-site">On-site</option>
//                     <option value="remote">Remote</option>
//                     <option value="hybrid">Hybrid</option>
//                   </select>
//                 </div>

//                 {/* Application Deadline */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Application Deadline
//                   </label>
//                   <input
//                     type="date"
//                     name="deadline"
//                     value={jobForm.deadline}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>

//                 {/* Skills */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Required Skills
//                   </label>
//                   <textarea
//                     name="skills"
//                     value={jobForm.skills}
//                     onChange={handleInputChange}
//                     rows="2"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                     placeholder="React, Node.js, MongoDB, AWS, TypeScript..."
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Job Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   value={jobForm.description}
//                   onChange={handleInputChange}
//                   required
//                   rows="4"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Describe the role, responsibilities, expectations..."
//                 />
//               </div>

//               {/* Requirements */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Requirements & Qualifications
//                 </label>
//                 <textarea
//                   name="requirements"
//                   value={jobForm.requirements}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="List specific requirements, qualifications, and experience needed..."
//                 />
//               </div>

//               {/* Benefits */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Benefits & Perks
//                 </label>
//                 <textarea
//                   name="benefits"
//                   value={jobForm.benefits}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Health insurance, stock options, remote work, flexible hours..."
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowJobForm(false);
//                     setEditingJob(null);
//                     resetJobForm();
//                   }}
//                   className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//                 >
//                   {editingJob ? "Update Job Posting" : "Post Job Opening"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Applicants Modal */}
//       {showApplicants && selectedJob && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicants(false);
//             setSelectedJob(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">A</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">
//                       Applicants for "{selectedJob.title}"
//                     </h2>
//                     <p className="text-blue-100 text-sm">
//                       {selectedJob.applicants?.length || 0} total applicants
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicants(false);
//                     setSelectedJob(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 mx-auto mb-4">
//                     <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
//                       <span className="text-4xl text-gray-400">0</span>
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants yet</h3>
//                   <p className="text-gray-600 mb-6">
//                     Share this job on social media to attract more candidates
//                   </p>
//                   <div className="flex flex-wrap gap-3 justify-center">
//                     <button className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors shadow-sm">
//                       Share on LinkedIn
//                     </button>
//                     <button className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-colors shadow-sm">
//                       Share on Twitter
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                   {selectedJob.applicants.map((app, index) => (
//                     <div
//                       key={app._id || index}
//                       className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
//                     >
//                       <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-shrink-0">
//                           <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
//                             <span className="text-white font-bold text-lg">
//                               {(app.user?.name || "A").charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex-1">
//                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
//                             <div>
//                               <h4 className="font-bold text-gray-900">
//                                 {app.user?.name || "Anonymous Applicant"}
//                               </h4>
//                               <p className="text-gray-600 text-sm mb-1">{app.user?.email || "No email provided"}</p>
//                               <p className="text-xs text-gray-500">
//                                 Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
//                               </p>
//                             </div>

//                             <div className="flex flex-wrap items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() => viewApplicantProfile(selectedJob._id, app.user?._id)}
//                                 className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
//                               >
//                                 Profile
//                               </button>
//                               <button
//                                 onClick={() => openEmailModal(app)}
//                                 className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs"
//                               >
//                                 Invite
//                               </button>
//                               <select
//                                 value={app.status || "pending"}
//                                 onChange={(e) => updateApplicantStatus(selectedJob._id, app.user?._id, e.target.value)}
//                                 className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
//                               >
//                                 <option value="pending">Pending</option>
//                                 <option value="reviewed">Reviewed</option>
//                                 <option value="shortlisted">Shortlisted</option>
//                                 <option value="rejected">Rejected</option>
//                                 <option value="interviewed">Interviewed</option>
//                                 <option value="accepted">Accepted</option>
//                               </select>
//                             </div>
//                           </div>

//                           {/* Status Badge */}
//                           <div className="mb-3">
//                             <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${app.status === "accepted"
//                               ? "bg-green-100 text-green-700 border border-green-200"
//                               : app.status === "rejected"
//                                 ? "bg-red-100 text-red-700 border border-red-200"
//                                 : app.status === "interviewed"
//                                   ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
//                                   : app.status === "shortlisted"
//                                     ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
//                                     : app.status === "reviewed"
//                                       ? "bg-blue-100 text-blue-700 border border-blue-200"
//                                       : "bg-gray-100 text-gray-700 border border-gray-200"
//                               }`}>
//                               {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending Review"}
//                             </span>
//                           </div>

//                           {/* Cover Letter */}
//                           {app.coverLetter && (
//                             <div className="pt-3 border-t border-gray-200">
//                               <p className="text-xs font-semibold text-gray-700 mb-1">Cover Letter:</p>
//                               <p className="text-gray-600 text-xs line-clamp-2">{app.coverLetter}</p>
//                             </div>
//                           )}

//                           {/* Action Buttons */}
//                           <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 mt-3">
//                             <button
//                               onClick={() => handleGetAISuggestion(selectedJob._id, app.user?._id)}
//                               disabled={analyzingApplicant === app.user?._id || aiAnalysis[app.user?._id]}
//                               className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 text-xs flex-1 ${aiAnalysis[app.user?._id]
//                                 ? "bg-green-600 text-white cursor-not-allowed shadow-md"
//                                 : analyzingApplicant === app.user?._id
//                                   ? "bg-gray-400 text-white cursor-wait"
//                                   : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md"
//                                 }`}
//                             >
//                               {analyzingApplicant === app.user?._id ? (
//                                 <>
//                                   <span className="animate-spin">⟳</span>
//                                   <span>Analyzing...</span>
//                                 </>
//                               ) : aiAnalysis[app.user?._id] ? (
//                                 <>
//                                   <span>✓</span>
//                                   <span>AI Analyzed</span>
//                                 </>
//                               ) : (
//                                 <>
//                                   <span>AI Analysis</span>
//                                 </>
//                               )}
//                             </button>

//                             <button
//                               onClick={() => openEmailModal(app)}
//                               className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs flex-1"
//                             >
//                               <span>Send Email</span>
//                             </button>
//                           </div>

//                           {/* AI Analysis Results */}
//                           {aiAnalysis[app.user?._id] && (
//                             <div className="mt-4 pt-4 border-t border-purple-200">
//                               <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-300">
//                                 <div className="flex items-center justify-between mb-3">
//                                   <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
//                                     AI Analysis
//                                   </h5>
//                                   <div className="text-right">
//                                     <div className={`text-2xl font-black ${aiAnalysis[app.user?._id].score >= 75 ? "text-green-600" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "text-orange-600" : "text-red-600"
//                                       }`}>
//                                       {aiAnalysis[app.user?._id].score}%
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Progress Bar */}
//                                 <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
//                                   <div
//                                     className={`h-full transition-all duration-1000 ${aiAnalysis[app.user?._id].score >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
//                                       aiAnalysis[app.user?._id].score >= 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
//                                         "bg-gradient-to-r from-red-500 to-pink-500"
//                                       }`}
//                                     style={{ width: `${aiAnalysis[app.user?._id].score}%` }}
//                                   ></div>
//                                 </div>

//                                 {/* Recommendation Badge */}
//                                 <div className="mb-3">
//                                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${aiAnalysis[app.user?._id].recommendation === "Highly Recommended"
//                                     ? "bg-green-100 text-green-700 border border-green-300"
//                                     : aiAnalysis[app.user?._id].recommendation === "Recommended"
//                                       ? "bg-blue-100 text-blue-700 border border-blue-300"
//                                       : aiAnalysis[app.user?._id].recommendation === "Consider"
//                                         ? "bg-orange-100 text-orange-700 border border-orange-300"
//                                         : "bg-red-100 text-red-700 border border-red-300"
//                                     }`}>
//                                     {aiAnalysis[app.user?._id].recommendation}
//                                   </span>
//                                 </div>

//                                 {/* Highlights & Concerns */}
//                                 {aiAnalysis[app.user?._id].reasoning && (
//                                   <div className="bg-white/80 rounded-lg p-3 border-l-4 border-purple-500">
//                                     <p className="text-xs font-semibold text-purple-700 mb-1">AI Assessment:</p>
//                                     <p className="text-xs text-gray-700 leading-relaxed">
//                                       {aiAnalysis[app.user?._id].reasoning}
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Applicant Profile Modal */}
//       {showApplicantProfile && (
//         <div
//           className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowApplicantProfile(false);
//             setSelectedApplicantProfile(null);
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">P</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Applicant Profile</h2>
//                     <p className="text-gray-200 text-sm">View details submitted by the candidate</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowApplicantProfile(false);
//                     setSelectedApplicantProfile(null);
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {applicantProfileLoading ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
//                     <span className="text-3xl text-gray-400">...</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">Loading profile...</p>
//                 </div>
//               ) : !selectedApplicantProfile ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-3xl text-gray-400">X</span>
//                   </div>
//                   <p className="text-gray-600 font-medium">No profile data available.</p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900">
//                           {selectedApplicantProfile.name || "Unnamed Applicant"}
//                         </h3>
//                         <p className="text-gray-600">{selectedApplicantProfile.email}</p>
//                       </div>
//                       {selectedApplicantProfile.resume && (
//                         <a
//                           href={selectedApplicantProfile.resume}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//                         >
//                           Open Resume
//                         </a>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
//                       <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.phone || "Not provided"}</p>
//                     </div>
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
//                       <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.location || "Not provided"}</p>
//                     </div>
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Skills</p>
//                     {Array.isArray(selectedApplicantProfile.skills) && selectedApplicantProfile.skills.length > 0 ? (
//                       <div className="flex flex-wrap gap-2">
//                         {selectedApplicantProfile.skills.map((s, idx) => (
//                           <span
//                             key={idx}
//                             className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium border border-gray-200"
//                           >
//                             {s}
//                           </span>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700">Not provided</p>
//                     )}
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Experience</p>
//                     <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
//                       {selectedApplicantProfile.experience || "Not provided"}
//                     </p>
//                   </div>

//                   <div className="bg-white rounded-xl border border-gray-200 p-4">
//                     <p className="text-sm font-semibold text-gray-500 mb-2">Education</p>
//                     {Array.isArray(selectedApplicantProfile.education) && selectedApplicantProfile.education.length > 0 ? (
//                       <div className="space-y-4">
//                         {selectedApplicantProfile.education.map((edu, index) => (
//                           <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//                             <p className="font-medium text-gray-900">
//                               {edu.degree} in {edu.field}
//                             </p>
//                             <p className="text-gray-600">{edu.institution}</p>
//                             <p className="text-sm text-gray-500">
//                               {edu.startDate} - {edu.endDate}
//                               {edu.gpa && ` • GPA: ${edu.gpa}`}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-700">Not provided</p>
//                     )}
//                   </div>

//                   {selectedApplicantProfile.socialLinks && (
//                     <div className="bg-white rounded-xl border border-gray-200 p-4">
//                       <p className="text-sm font-semibold text-gray-500 mb-2">Social Links</p>
//                       <div className="space-y-2">
//                         {Object.entries(selectedApplicantProfile.socialLinks).map(([key, value]) =>
//                           value ? (
//                             <a
//                               key={key}
//                               href={value}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="block text-blue-600 hover:underline break-all"
//                             >
//                               {key}: {value}
//                             </a>
//                           ) : null
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Email Modal */}
//       {showEmailModal && selectedApplicantForEmail && (
//         <div
//           className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => {
//             setShowEmailModal(false);
//             setSelectedApplicantForEmail(null);
//             setEmailForm({
//               subject: "",
//               message: "",
//               scheduleDate: "",
//               scheduleTime: "",
//               interviewDate: "",
//               interviewTime: "",
//               interviewType: "virtual",
//               interviewLink: ""
//             });
//           }}
//         >
//           <div
//             className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                     <span className="text-xl text-white">E</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-white">Send Interview Invitation</h2>
//                     <p className="text-emerald-100 text-sm">
//                       To: {selectedApplicantForEmail.user?.name} ({selectedApplicantForEmail.user?.email})
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                     setEmailForm({
//                       subject: "",
//                       message: "",
//                       scheduleDate: "",
//                       scheduleTime: "",
//                       interviewDate: "",
//                       interviewTime: "",
//                       interviewType: "virtual",
//                       interviewLink: ""
//                     });
//                   }}
//                   className="text-white hover:text-gray-200 transition-colors text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSendEmail} className="p-6 space-y-6">
//               {/* Email Templates */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Quick Templates
//                 </label>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                   {emailTemplates.map((template) => (
//                     <button
//                       type="button"
//                       key={template.id}
//                       onClick={() => handleTemplateSelect(template.id)}
//                       className={`p-3 border rounded-xl text-sm font-medium transition-all duration-300 ${selectedTemplate === template.id
//                         ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
//                         : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
//                         }`}
//                     >
//                       {template.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Subject */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Subject <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={emailForm.subject}
//                   onChange={handleEmailInputChange}
//                   name="subject"
//                   required
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   placeholder="Interview Invitation for..."
//                 />
//               </div>

//               {/* Interview Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Date
//                   </label>
//                   <input
//                     type="date"
//                     value={emailForm.interviewDate}
//                     onChange={handleEmailInputChange}
//                     name="interviewDate"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Time
//                   </label>
//                   <input
//                     type="time"
//                     value={emailForm.interviewTime}
//                     onChange={handleEmailInputChange}
//                     name="interviewTime"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Interview Type
//                   </label>
//                   <select
//                     value={emailForm.interviewType}
//                     onChange={handleEmailInputChange}
//                     name="interviewType"
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   >
//                     <option value="virtual">Virtual/Online</option>
//                     <option value="in-person">In-person</option>
//                     <option value="phone">Phone Call</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Meeting Link (if virtual)
//                   </label>
//                   <input
//                     type="text"
//                     value={emailForm.interviewLink}
//                     onChange={handleEmailInputChange}
//                     name="interviewLink"
//                     placeholder="https://meet.google.com/..."
//                     className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
//                   />
//                 </div>
//               </div>

//               {/* Message */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Message <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={emailForm.message}
//                   onChange={handleEmailInputChange}
//                   name="message"
//                   required
//                   rows="6"
//                   className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none"
//                   placeholder="Write your email message here..."
//                 />
//               </div>

//               {/* Note */}
//               <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
//                 <p className="text-sm text-blue-700">
//                   <span className="font-semibold">Note:</span> Sending this email will automatically update the applicant's status to "Interviewed".
//                 </p>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowEmailModal(false);
//                     setSelectedApplicantForEmail(null);
//                     setEmailForm({
//                       subject: "",
//                       message: "",
//                       scheduleDate: "",
//                       scheduleTime: "",
//                       interviewDate: "",
//                       interviewTime: "",
//                       interviewType: "virtual",
//                       interviewLink: ""
//                     });
//                   }}
//                   className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={sendingEmail}
//                   className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
//                 >
//                   {sendingEmail ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="animate-spin">⟳</span>
//                       Sending...
//                     </span>
//                   ) : (
//                     "Send Email & Mark as Interviewed"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CompanyDashboard() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyStatus, setCompanyStatus] = useState(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "full-time",
    experienceLevel: "mid-level",
    requirements: "",
    skills: "",
    benefits: "",
    applicationDeadline: "",
    remote: "on-site"
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [showApplicantProfile, setShowApplicantProfile] = useState(false);
  const [applicantProfileLoading, setApplicantProfileLoading] = useState(false);
  const [selectedApplicantProfile, setSelectedApplicantProfile] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    pendingApplicants: 0,
    shortlistedApplicants: 0
  });
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingApplicant, setAnalyzingApplicant] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedApplicantForEmail, setSelectedApplicantForEmail] = useState(null);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    scheduleDate: "",
    scheduleTime: "",
    interviewDate: "",
    interviewTime: "",
    interviewType: "virtual",
    interviewLink: ""
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState([
    { id: 1, name: "Interview Invitation", subject: "Interview Invitation for {jobTitle}", message: "Dear {applicantName},\n\nThank you for applying to the {jobTitle} position at {companyName}.\n\nWe were impressed with your application and would like to invite you for an interview.\n\nPlease let us know your availability.\n\nBest regards,\n{companyName} Team" },
    { id: 2, name: "Technical Round", subject: "Technical Interview - {jobTitle}", message: "Hello {applicantName},\n\nCongratulations! You have been shortlisted for the technical interview for {jobTitle}.\n\nPlease come prepared for a coding assessment.\n\nBest regards,\n{companyName} Hiring Team" },
    { id: 3, name: "HR Round", subject: "HR Interview - {jobTitle}", message: "Dear {applicantName},\n\nWe'd like to schedule an HR interview for the {jobTitle} position.\n\nThis will be a behavioral and cultural fit assessment.\n\nLooking forward to speaking with you.\n\nRegards,\nHR Team" }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    if (session?.user?.role === "company") {
      fetchCompanyStatus();
      fetchCompanyJobs();
      setCompanyName(session.user.name || "");
      setNewCompanyName(session.user.name || "");
    }
  }, [session]);

  useEffect(() => {
    calculateStats();
  }, [jobs]);

  const fetchCompanyStatus = async () => {
    try {
      const res = await fetch("/api/company/status");
      const data = await res.json();
      setCompanyStatus(data.companyStatus);
      setRejectionReason(data.rejectionReason || "");
    } catch (error) {
      console.error("Error fetching company status:", error);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/company/jobs");
      const data = await res.json();

      if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => !job.isClosed).length;
    const totalApplicants = jobs.reduce((total, job) =>
      total + (job.applicants?.length || 0), 0
    );
    const pendingApplicants = jobs.reduce((total, job) =>
      total + (job.applicants?.filter(app => !app.status || app.status === "pending")?.length || 0), 0
    );
    const shortlistedApplicants = jobs.reduce((total, job) =>
      total + (job.applicants?.filter(app => app.status === "shortlisted")?.length || 0), 0
    );

    setStats({
      totalJobs,
      activeJobs,
      totalApplicants,
      pendingApplicants,
      shortlistedApplicants
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm({
      ...jobForm,
      [name]: value,
    });
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm({
      ...emailForm,
      [name]: value,
    });
  };

  const handleTemplateSelect = (templateId) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      const applicantName = selectedApplicantForEmail?.user?.name || "Applicant";
      const jobTitle = selectedJob?.title || "Position";

      setEmailForm({
        ...emailForm,
        subject: template.subject
          .replace("{applicantName}", applicantName)
          .replace("{jobTitle}", jobTitle)
          .replace("{companyName}", companyName),
        message: template.message
          .replace("{applicantName}", applicantName)
          .replace("{jobTitle}", jobTitle)
          .replace("{companyName}", companyName)
      });
      setSelectedTemplate(templateId);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!selectedApplicantForEmail?.user?.email) {
      alert("Applicant email not found");
      return;
    }

    setSendingEmail(true);

    try {
      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedApplicantForEmail.user.email,
          applicantName: selectedApplicantForEmail.user.name,
          subject: emailForm.subject,
          message: emailForm.message,
          jobId: selectedJob._id,
          jobTitle: selectedJob.title,
          companyName: companyName,
          interviewDate: emailForm.interviewDate,
          interviewTime: emailForm.interviewTime,
          interviewType: emailForm.interviewType,
          interviewLink: emailForm.interviewLink,
          scheduleDate: emailForm.scheduleDate,
          scheduleTime: emailForm.scheduleTime
        }),
      });

      const emailData = await emailRes.json();

      if (emailRes.ok) {
        // Update local state to shortlisted instead of interviewed
        setJobs(jobs.map(job => {
          if (job._id === selectedJob._id) {
            return {
              ...job,
              applicants: job.applicants.map(app =>
                (app.user?._id === selectedApplicantForEmail.user._id)
                  ? { ...app, status: "shortlisted" }
                  : app
              )
            };
          }
          return job;
        }));

        if (selectedJob) {
          setSelectedJob({
            ...selectedJob,
            applicants: selectedJob.applicants.map(app =>
              (app.user?._id === selectedApplicantForEmail.user._id)
                ? { ...app, status: "shortlisted" }
                : app
            )
          });
        }

        alert("Email sent successfully and status updated to 'Shortlisted'!");
        setShowEmailModal(false);
        setSelectedApplicantForEmail(null);
        setEmailForm({
          subject: "",
          message: "",
          scheduleDate: "",
          scheduleTime: "",
          interviewDate: "",
          interviewTime: "",
          interviewType: "virtual",
          interviewLink: ""
        });
      } else {
        console.error("Email API Error Response:", emailData);
        throw new Error(emailData.error || emailData.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(`Failed to send email: ${error.message || "Unknown error"}. Check console for details.`);
    } finally {
      setSendingEmail(false);
    }
  };

  const openEmailModal = (applicant) => {
    setSelectedApplicantForEmail(applicant);

    const defaultSubject = `Interview Invitation for ${selectedJob?.title}`;
    const defaultMessage = `Dear ${applicant.user?.name || 'Applicant'},

Thank you for applying to the ${selectedJob?.title} position at ${companyName}.

We were impressed with your application and would like to invite you for an interview.

Please let us know your availability.

Best regards,
${companyName} Hiring Team`;

    setEmailForm({
      ...emailForm,
      subject: defaultSubject,
      message: defaultMessage
    });

    setShowEmailModal(true);
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

    try {
      const endpoint = editingJob ? `/api/company/jobs/${editingJob._id}` : "/api/company/jobs";
      const method = editingJob ? "PATCH" : "POST";

      // Prepare the payload according to your Job model schema
      const payload = {
        title: jobForm.title.trim(),
        description: jobForm.description.trim(),
        location: jobForm.location.trim(),
        salary: jobForm.salary.trim(),
        jobType: jobForm.jobType,
        experienceLevel: jobForm.experienceLevel,
        applicationDeadline: jobForm.applicationDeadline || null,
        requirements: jobForm.requirements?.trim() || "",
        skills: jobForm.skills?.trim() || "",
        benefits: jobForm.benefits?.trim() || "",
        remote: jobForm.remote || "on-site"
      };

      // Remove empty fields for PATCH request
      if (method === "PATCH") {
        Object.keys(payload).forEach(key => {
          if (payload[key] === "" || payload[key] === null) {
            delete payload[key];
          }
        });
      }

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (editingJob) {
          setJobs(jobs.map(job => job._id === editingJob._id ? data.job : job));
          alert("Job updated successfully!");
        } else {
          setJobs([data.job, ...jobs]);
          alert("Job posted successfully!");
        }
        resetJobForm();
        setShowJobForm(false);
        setEditingJob(null);
      } else {
        alert(data.message || "Failed to post job. Please try again.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: "",
      description: "",
      location: "",
      salary: "",
      jobType: "full-time",
      experienceLevel: "mid-level",
      requirements: "",
      skills: "",
      benefits: "",
      applicationDeadline: "",
      remote: "on-site"
    });
  };

  const handleEditJob = (job) => {
    setEditingJob(job);

    // Format date for input field (YYYY-MM-DD)
    let formattedDeadline = "";
    if (job.applicationDeadline) {
      const date = new Date(job.applicationDeadline);
      formattedDeadline = date.toISOString().split('T')[0];
    }

    // Map job fields to form fields
    setJobForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      jobType: job.jobType || "full-time",
      experienceLevel: job.experienceLevel || "mid-level",
      requirements: job.requirements || "",
      skills: job.skills || "",
      benefits: job.benefits || "",
      applicationDeadline: formattedDeadline,
      remote: job.remote || "on-site"
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/company/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
        alert("Job deleted successfully!");
      } else {
        alert(data.message || "Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setShowApplicants(true);
  };

  const handleCloseJob = async (jobId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const res = await fetch(`/api/company/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isClosed: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setJobs(jobs.map(job =>
          job._id === jobId ? { ...job, isClosed: newStatus } : job
        ));
        alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const viewApplicantProfile = async (jobId, userId) => {
    if (!userId) return;

    try {
      setShowApplicantProfile(true);
      setApplicantProfileLoading(true);
      setSelectedApplicantProfile(null);

      const res = await fetch(
        `/api/company/applicant?jobId=${encodeURIComponent(jobId)}&userId=${encodeURIComponent(userId)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to fetch applicant profile");
      }

      setSelectedApplicantProfile(data.profile || null);
    } catch (error) {
      console.error("Error fetching applicant profile:", error);
      alert(error.message || "Error fetching applicant profile");
      setShowApplicantProfile(false);
    } finally {
      setApplicantProfileLoading(false);
    }
  };

  const updateApplicantStatus = async (jobId, userId, newStatus) => {
    try {
      if (!userId) return;

      const res = await fetch("/api/company/applicant-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, userId, status: newStatus }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setJobs(jobs.map(job => {
          if (job._id === jobId) {
            return {
              ...job,
              applicants: job.applicants.map(app =>
                (app.user?._id === userId || app.user?._id?.toString?.() === userId)
                  ? { ...app, status: newStatus }
                  : app
              )
            };
          }
          return job;
        }));

        if (selectedJob && selectedJob._id === jobId) {
          setSelectedJob({
            ...selectedJob,
            applicants: selectedJob.applicants.map(app =>
              (app.user?._id === userId || app.user?._id?.toString?.() === userId)
                ? { ...app, status: newStatus }
                : app
            )
          });
        }

        alert(`Applicant status updated to ${newStatus}`);
      } else {
        alert(data?.error || data?.message || "Failed to update applicant status");
      }
    } catch (error) {
      console.error("Error updating applicant status:", error);
    }
  };

  const handleGetAISuggestion = async (jobId, applicantId) => {
    setAnalyzingApplicant(applicantId);

    try {
      const res = await fetch("/api/company/analyze-applicant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId, applicantId }),
      });

      const data = await res.json();

      if (data.success) {
        setAiAnalysis({
          ...aiAnalysis,
          [applicantId]: data.analysis,
        });
      } else {
        alert(data.message || "Failed to generate AI analysis");
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      alert("Error generating AI analysis. Please try again.");
    } finally {
      setAnalyzingApplicant(null);
    }
  };

  const handleEditCompanyName = () => {
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewCompanyName(companyName);
  };

  const handleSaveCompanyName = async () => {
    if (!newCompanyName.trim()) {
      alert("Company name cannot be empty");
      return;
    }

    try {
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCompanyName.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setCompanyName(newCompanyName.trim());
        setIsEditingName(false);
        alert("Company name updated successfully!");
        window.location.reload();
      } else {
        alert(data.message || "Failed to update company name");
      }
    } catch (error) {
      console.error("Error updating company name:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === "active" && job.isClosed) return false;
    if (filter === "closed" && !job.isClosed) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }

    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-3xl text-white">C</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "company") {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">X</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in as a company to access this dashboard.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Sign In as Company
          </a>
        </div>
      </div>
    );
  }

  if (companyStatus === "pending") {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-20"></div>
              <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">!</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Approval Pending</h1>
          <p className="text-gray-600 mb-4">
            Your company registration is being reviewed by our team. You'll be notified once approved.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
            <p className="text-yellow-800 text-sm">Usually takes 24-48 hours</p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (companyStatus === "rejected") {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-xl opacity-30"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-pink-600 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                <span className="text-4xl text-white">X</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Registration Rejected</h1>
          <p className="text-gray-600 mb-6">
            Your company registration has been rejected. Please contact support for more information.
          </p>

          {rejectionReason && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
              <p className="text-red-700 text-sm whitespace-pre-wrap">{rejectionReason}</p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Contact Support
            </a>
            <a
              href="/company/register"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Re-apply
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-[8%] relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  Welcome back, <span className="font-semibold">{session.user.name}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/company/profile"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white font-medium rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Company Profile
              </a>
              <button
                onClick={() => {
                  setEditingJob(null);
                  resetJobForm();
                  setShowJobForm(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <span className="text-xl">+</span>
                Post New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Company Settings Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Company Name</h3>
              {isEditingName ? (
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 transition-all duration-300"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveCompanyName}
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg">
                      Save
                    </button>
                    <button
                      onClick={handleCancelEditName}
                      className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{companyName || "Your Company"}</p>
                    <p className="text-sm text-gray-500 mt-1">Manage your company information</p>
                  </div>
                  <button
                    onClick={handleEditCompanyName}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 w-full md:w-auto">
                    Edit Name
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJobs}</h3>
                <p className="text-xs text-blue-600 font-medium mt-2">
                  {stats.activeJobs} Active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">J</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</h3>
                <p className="text-xs text-green-600 font-medium mt-2">
                  {((stats.activeJobs / Math.max(stats.totalJobs, 1)) * 100).toFixed(0)}% of total
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">A</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Applicants</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplicants}</h3>
                <p className="text-xs text-purple-600 font-medium mt-2">
                  Avg. {stats.totalJobs > 0 ? (stats.totalApplicants / stats.totalJobs).toFixed(1) : 0} per job
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">P</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Reviews</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApplicants}</h3>
                <p className="text-xs text-amber-600 font-medium mt-2">
                  Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">R</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Shortlisted</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.shortlistedApplicants}</h3>
                <p className="text-xs text-indigo-600 font-medium mt-2">
                  For interviews
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white">S</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700"
              >
                <option value="all">All Jobs</option>
                <option value="active">Active Jobs</option>
                <option value="closed">Closed Jobs</option>
              </select>
              <button
                onClick={fetchCompanyJobs}
                className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 border-2 border-gray-300 hover:shadow-md"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-4xl text-gray-400">J</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {searchTerm || filter !== "all" ? "No matching jobs found" : "No jobs posted yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search terms or filter criteria"
                  : "Start by posting your first job opening to attract talented candidates!"}
              </p>
              {!searchTerm && filter === "all" && (
                <button
                  onClick={() => setShowJobForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-md"
                >
                  <span className="text-xl">+</span>
                  Post Your First Job
                </button>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className={`p-6 ${job.isClosed ? 'border-l-4 border-red-500 bg-red-50/30' : 'border-l-4 border-green-500 bg-green-50/30'}`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-xl text-white">J</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h2 className="text-xl font-bold text-gray-900">
                                {job.title}
                              </h2>
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${job.isClosed
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : 'bg-green-100 text-green-700 border border-green-200'
                                }`}>
                                {job.isClosed ? 'CLOSED' : 'ACTIVE'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{job.company?.name || companyName}</p>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                                <span className="text-gray-700 font-medium">{job.location || "Not specified"}</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                                <span className="text-gray-700 font-medium">{job.salary || "Not specified"}</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                                <span className="text-gray-700 font-medium capitalize">{job.jobType || "Full-time"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Posted</p>
                          <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                          <div className="mt-3 px-3 py-1.5 bg-blue-50 rounded-full inline-block border border-blue-100">
                            <span className="text-sm font-bold text-blue-700">{job.applicants?.length || 0} applicants</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills && job.skills.split(',').slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 font-medium rounded-lg text-sm border border-gray-200"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                        {job.skills && job.skills.split(',').length > 4 && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-medium rounded-lg text-sm">
                            +{job.skills.split(',').length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 min-w-[220px]">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
                      >
                        View Applicants
                        <span className="bg-white/20 px-2 py-1 rounded text-sm">
                          {job.applicants?.length || 0}
                        </span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="flex items-center justify-center gap-2 px-3 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleCloseJob(job._id, job.isClosed)}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 font-medium rounded-xl transition-all duration-300 ${job.isClosed
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
                            : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 shadow-md"
                            }`}
                        >
                          {job.isClosed ? "Re-open" : "Close"}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
                      >
                        Delete Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowJobForm(false);
            setEditingJob(null);
            resetJobForm();
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-white">F</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    resetJobForm();
                  }}
                  className="text-white hover:text-gray-200 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitJob} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={jobForm.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                    placeholder="e.g., Remote, New York, San Francisco"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={jobForm.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                    placeholder="e.g., $80,000 - $120,000 per year"
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={jobForm.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={jobForm.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Work Policy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Policy
                  </label>
                  <select
                    name="remote"
                    value={jobForm.remote}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  >
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Application Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={jobForm.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <textarea
                    name="skills"
                    value={jobForm.skills}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
                    placeholder="React, Node.js, MongoDB, AWS, TypeScript..."
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={jobForm.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="Describe the role, responsibilities, expectations..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements & Qualifications
                </label>
                <textarea
                  name="requirements"
                  value={jobForm.requirements}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="List specific requirements, qualifications, and experience needed..."
                />
              </div>

              {/* Benefits */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  name="benefits"
                  value={jobForm.benefits}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="Health insurance, stock options, remote work, flexible hours..."
                />
              </div> */}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowJobForm(false);
                    setEditingJob(null);
                    resetJobForm();
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
                >
                  {editingJob ? "Update Job Posting" : "Post Job Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicants && selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowApplicants(false);
            setSelectedJob(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-white">A</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Applicants for "{selectedJob.title}"
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {selectedJob.applicants?.length || 0} total applicants
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowApplicants(false);
                    setSelectedJob(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {(!selectedJob.applicants || selectedJob.applicants.length === 0) ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-4xl text-gray-400">0</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No applicants yet</h3>
                  <p className="text-gray-600 mb-6">
                    Share this job on social media to attract more candidates
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg hover:bg-blue-200 transition-colors shadow-sm">
                      Share on LinkedIn
                    </button>
                    <button className="px-4 py-2 bg-green-100 text-green-600 font-medium rounded-lg hover:bg-green-200 transition-colors shadow-sm">
                      Share on Twitter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {selectedJob.applicants.map((app, index) => (
                    <div
                      key={app._id || index}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {(app.user?.name || "A").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {app.user?.name || "Anonymous Applicant"}
                              </h4>
                              <p className="text-gray-600 text-sm mb-1">{app.user?.email || "No email provided"}</p>
                              <p className="text-xs text-gray-500">
                                Applied on {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => viewApplicantProfile(selectedJob._id, app.user?._id)}
                                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-xs"
                              >
                                Profile
                              </button>
                              <button
                                onClick={() => openEmailModal(app)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs"
                              >
                                Invite
                              </button>
                              <select
                                value={app.status || "pending"}
                                onChange={(e) => updateApplicantStatus(selectedJob._id, app.user?._id, e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="accepted">Accepted</option>
                              </select>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="mb-3">
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${app.status === "accepted"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : app.status === "rejected"
                                ? "bg-red-100 text-red-700 border border-red-200"
                                : app.status === "shortlisted"
                                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                                  : app.status === "reviewed"
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}>
                              {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending Review"}
                            </span>
                          </div>

                          {/* Cover Letter */}
                          {app.coverLetter && (
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-700 mb-1">Cover Letter:</p>
                              <p className="text-gray-600 text-xs line-clamp-2">{app.coverLetter}</p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 mt-3">
                            <button
                              onClick={() => handleGetAISuggestion(selectedJob._id, app.user?._id)}
                              disabled={analyzingApplicant === app.user?._id || aiAnalysis[app.user?._id]}
                              className={`flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-lg transition-all duration-300 text-xs flex-1 ${aiAnalysis[app.user?._id]
                                ? "bg-green-600 text-white cursor-not-allowed shadow-md"
                                : analyzingApplicant === app.user?._id
                                  ? "bg-gray-400 text-white cursor-wait"
                                  : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md"
                                }`}
                            >
                              {analyzingApplicant === app.user?._id ? (
                                <>
                                  <span className="animate-spin">⟳</span>
                                  <span>Analyzing...</span>
                                </>
                              ) : aiAnalysis[app.user?._id] ? (
                                <>
                                  <span>✓</span>
                                  <span>AI Analyzed</span>
                                </>
                              ) : (
                                <>
                                  <span>AI Analysis</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => openEmailModal(app)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 text-xs flex-1"
                            >
                              <span>Send Email</span>
                            </button>
                          </div>

                          {/* AI Analysis Results */}
                          {aiAnalysis[app.user?._id] && (
                            <div className="mt-4 pt-4 border-t border-purple-200">
                              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-300">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                                    AI Analysis
                                  </h5>
                                  <div className="text-right">
                                    <div className={`text-2xl font-black ${aiAnalysis[app.user?._id].score >= 75 ? "text-green-600" :
                                      aiAnalysis[app.user?._id].score >= 50 ? "text-orange-600" : "text-red-600"
                                      }`}>
                                      {aiAnalysis[app.user?._id].score}%
                                    </div>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                                  <div
                                    className={`h-full transition-all duration-1000 ${aiAnalysis[app.user?._id].score >= 75 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                                      aiAnalysis[app.user?._id].score >= 50 ? "bg-gradient-to-r from-orange-500 to-amber-500" :
                                        "bg-gradient-to-r from-red-500 to-pink-500"
                                      }`}
                                    style={{ width: `${aiAnalysis[app.user?._id].score}%` }}
                                  ></div>
                                </div>

                                {/* Recommendation Badge */}
                                <div className="mb-3">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${aiAnalysis[app.user?._id].recommendation === "Highly Recommended"
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : aiAnalysis[app.user?._id].recommendation === "Recommended"
                                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                                      : aiAnalysis[app.user?._id].recommendation === "Consider"
                                        ? "bg-orange-100 text-orange-700 border border-orange-300"
                                        : "bg-red-100 text-red-700 border border-red-300"
                                    }`}>
                                    {aiAnalysis[app.user?._id].recommendation}
                                  </span>
                                </div>

                                {/* Highlights & Concerns */}
                                {aiAnalysis[app.user?._id].reasoning && (
                                  <div className="bg-white/80 rounded-lg p-3 border-l-4 border-purple-500">
                                    <p className="text-xs font-semibold text-purple-700 mb-1">AI Assessment:</p>
                                    <p className="text-xs text-gray-700 leading-relaxed">
                                      {aiAnalysis[app.user?._id].reasoning}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Applicant Profile Modal */}
      {showApplicantProfile && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowApplicantProfile(false);
            setSelectedApplicantProfile(null);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-white">P</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Applicant Profile</h2>
                    <p className="text-gray-200 text-sm">View details submitted by the candidate</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowApplicantProfile(false);
                    setSelectedApplicantProfile(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {applicantProfileLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-3xl text-gray-400">...</span>
                  </div>
                  <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
              ) : !selectedApplicantProfile ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-gray-400">X</span>
                  </div>
                  <p className="text-gray-600 font-medium">No profile data available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedApplicantProfile.name || "Unnamed Applicant"}
                        </h3>
                        <p className="text-gray-600">{selectedApplicantProfile.email}</p>
                      </div>
                      {selectedApplicantProfile.resume && (
                        <a
                          href={selectedApplicantProfile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Open Resume
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.phone || "Not provided"}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Location</p>
                      <p className="text-gray-900 font-medium text-lg">{selectedApplicantProfile.location || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Skills</p>
                    {Array.isArray(selectedApplicantProfile.skills) && selectedApplicantProfile.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedApplicantProfile.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium border border-gray-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">Not provided</p>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Experience</p>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedApplicantProfile.experience || "Not provided"}
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Education</p>
                    {Array.isArray(selectedApplicantProfile.education) && selectedApplicantProfile.education.length > 0 ? (
                      <div className="space-y-4">
                        {selectedApplicantProfile.education.map((edu, index) => (
                          <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <p className="font-medium text-gray-900">
                              {edu.degree} in {edu.field}
                            </p>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">
                              {edu.startDate} - {edu.endDate}
                              {edu.gpa && ` • GPA: ${edu.gpa}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-700">Not provided</p>
                    )}
                  </div>

                  {selectedApplicantProfile.socialLinks && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <p className="text-sm font-semibold text-gray-500 mb-2">Social Links</p>
                      <div className="space-y-2">
                        {Object.entries(selectedApplicantProfile.socialLinks).map(([key, value]) =>
                          value ? (
                            <a
                              key={key}
                              href={value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-blue-600 hover:underline break-all"
                            >
                              {key}: {value}
                            </a>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedApplicantForEmail && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowEmailModal(false);
            setSelectedApplicantForEmail(null);
            setEmailForm({
              subject: "",
              message: "",
              scheduleDate: "",
              scheduleTime: "",
              interviewDate: "",
              interviewTime: "",
              interviewType: "virtual",
              interviewLink: ""
            });
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-white">E</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Send Interview Invitation</h2>
                    <p className="text-emerald-100 text-sm">
                      To: {selectedApplicantForEmail.user?.name} ({selectedApplicantForEmail.user?.email})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedApplicantForEmail(null);
                    setEmailForm({
                      subject: "",
                      message: "",
                      scheduleDate: "",
                      scheduleTime: "",
                      interviewDate: "",
                      interviewTime: "",
                      interviewType: "virtual",
                      interviewLink: ""
                    });
                  }}
                  className="text-white hover:text-gray-200 transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-6">
              {/* Email Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {emailTemplates.map((template) => (
                    <button
                      type="button"
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-3 border rounded-xl text-sm font-medium transition-all duration-300 ${selectedTemplate === template.id
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={handleEmailInputChange}
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
                  placeholder="Interview Invitation for..."
                />
              </div>

              {/* Interview Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date
                  </label>
                  <input
                    type="date"
                    value={emailForm.interviewDate}
                    onChange={handleEmailInputChange}
                    name="interviewDate"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Time
                  </label>
                  <input
                    type="time"
                    value={emailForm.interviewTime}
                    onChange={handleEmailInputChange}
                    name="interviewTime"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={emailForm.interviewType}
                    onChange={handleEmailInputChange}
                    name="interviewType"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
                  >
                    <option value="virtual">Virtual/Online</option>
                    <option value="in-person">In-person</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (if virtual)
                  </label>
                  <input
                    type="text"
                    value={emailForm.interviewLink}
                    onChange={handleEmailInputChange}
                    name="interviewLink"
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={handleEmailInputChange}
                  name="message"
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/30 focus:border-green-500 focus:bg-white transition-all duration-300 resize-none"
                  placeholder="Write your email message here..."
                />
              </div>

              {/* Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Note:</span> Sending this email will automatically update the applicant's status to "Shortlisted".
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedApplicantForEmail(null);
                    setEmailForm({
                      subject: "",
                      message: "",
                      scheduleDate: "",
                      scheduleTime: "",
                      interviewDate: "",
                      interviewTime: "",
                      interviewType: "virtual",
                      interviewLink: ""
                    });
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⟳</span>
                      Sending...
                    </span>
                  ) : (
                    "Send Email & Mark as Shortlisted"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}