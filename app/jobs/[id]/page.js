// "use client";

// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ViewJobPage() {
//   const params = useParams();
//   const id = params?.id;
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasApplied, setHasApplied] = useState(false);
//   const [applying, setApplying] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchJobDetails();
//     }
//   }, [id]);

//   const fetchJobDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`/api/jobs/${id}`);

//       if (!res.ok) {
//         if (res.status === 404) {
//           throw new Error("Job not found");
//         }
//         throw new Error("Failed to fetch job details");
//       }

//       const data = await res.json();
//       setJob(data);

//       // Check if user has already applied
//       if (session?.user?.role === "user") {
//         checkApplicationStatus(data);
//       }
//     } catch (error) {
//       console.error("Error fetching job:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkApplicationStatus = (jobData) => {
//     const userId = session.user.id;
//     const hasApplied = jobData.applicants?.some(
//       applicant => applicant.user?._id === userId || applicant.user === userId
//     );
//     setHasApplied(hasApplied);
//   };

//   const handleApply = async () => {
//     if (!session) {
//       alert("Please sign in to apply for this job");
//       router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
//       return;
//     }

//     if (session.user.role !== "user") {
//       alert("Only users can apply for jobs");
//       return;
//     }

//     setApplying(true);
//     try {
//       const res = await fetch("/api/jobs/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId: id }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setHasApplied(true);
//         // Update applicant count
//         setJob(prev => ({
//           ...prev,
//           applicants: [...(prev.applicants || []), { user: session.user.id }],
//           applicantCount: (prev.applicantCount || prev.applicants?.length || 0) + 1
//         }));
//         alert("Application submitted successfully!");
//       } else {
//         alert(data.message || "Failed to apply for job");
//       }
//     } catch (error) {
//       console.error("Error applying:", error);
//       alert("Error applying for job. Please try again.");
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleSaveJob = async () => {
//     if (!session) {
//       alert("Please sign in to save jobs");
//       return;
//     }

//     try {
//       const res = await fetch("/api/user/save-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId: id }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert("Job saved successfully!");
//       } else {
//         alert(data.message || "Failed to save job");
//       }
//     } catch (error) {
//       console.error("Error saving job:", error);
//       alert("Error saving job");
//     }
//   };

//   const handleShare = () => {
//     const url = window.location.href;
//     navigator.clipboard.writeText(url);
//     alert("Link copied to clipboard!");
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Recently";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatSalary = (salary) => {
//     if (!salary) return "Not specified";
//     if (typeof salary === 'string') return salary;

//     if (typeof salary === 'number') {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         maximumFractionDigits: 0
//       }).format(salary);
//     }

//     return salary;
//   };

//   const parseListItems = (text) => {
//     if (!text) return [];
//     if (Array.isArray(text)) return text;

//     return text
//       .split(/[\n•\-]/)
//       .map(item => item.trim())
//       .filter(item => item.length > 0);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="animate-pulse">
//             {/* Header skeleton */}
//             <div className="bg-white rounded-2xl p-8 mb-6">
//               <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 {[1, 2, 3].map(i => (
//                   <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
//                 ))}
//               </div>
//             </div>

//             {/* Content skeleton */}
//             <div className="bg-white rounded-2xl p-8">
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
//               <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
//               <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
//               <div className="h-4 bg-gray-200 rounded w-4/6"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto px-4">
//           <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
//             <span className="text-4xl">⚠️</span>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
//           <p className="text-gray-600 mb-6">
//             {error || "The job you're looking for doesn't exist or has been removed."}
//           </p>
//           <div className="space-x-4">
//             <button
//               onClick={() => router.push("/jobs")}
//               className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Browse Jobs
//             </button>
//             <button
//               onClick={() => router.back()}
//               className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!job) return null;

//   const requirements = parseListItems(job.requirements);
//   const responsibilities = parseListItems(job.responsibilities);
//   const skills = parseListItems(job.skills);
//   const benefits = parseListItems(job.benefits);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex justify-between items-start">
//             <div>
//               <button
//                 onClick={() => router.back()}
//                 className="flex items-center text-blue-100 hover:text-white mb-6"
//               >
//                 <span className="mr-2">←</span>
//                 Back to Jobs
//               </button>
//               <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
//               <div className="flex flex-wrap items-center gap-4 text-blue-100">
//                 <div className="flex items-center">
//                   <span className="mr-2">🏢</span>
//                   <span className="font-medium">{job.company?.name}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="mr-2">📍</span>
//                   <span>{job.location}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="mr-2">⏰</span>
//                   <span>Posted {formatDate(job.createdAt)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="hidden md:flex flex-col gap-3">
//               {session?.user?.role === "user" && (
//                 <button
//                   onClick={handleApply}
//                   disabled={hasApplied || applying}
//                   className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
//                     hasApplied
//                       ? "bg-green-600 text-white cursor-not-allowed"
//                       : applying
//                       ? "bg-blue-400 text-white cursor-wait"
//                       : "bg-white text-blue-600 hover:bg-blue-50"
//                   }`}
//                 >
//                   {applying ? (
//                     "Applying..."
//                   ) : hasApplied ? (
//                     <span className="flex items-center">
//                       <span className="mr-2">✓</span>
//                       Applied
//                     </span>
//                   ) : (
//                     <span className="flex items-center">
//                       <span className="mr-2">💼</span>
//                       Apply Now
//                     </span>
//                   )}
//                 </button>
//               )}
//               <button
//                 onClick={handleSaveJob}
//                 className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="flex items-center">
//                   <span className="mr-2">⭐</span>
//                   Save Job
//                 </span>
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="flex items-center">
//                   <span className="mr-2">🔗</span>
//                   Share
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Action Buttons */}
//       <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex gap-3">
//             {session?.user?.role === "user" && (
//               <button
//                 onClick={handleApply}
//                 disabled={hasApplied || applying}
//                 className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
//                   hasApplied
//                     ? "bg-green-600 text-white cursor-not-allowed"
//                     : applying
//                     ? "bg-blue-400 text-white cursor-wait"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }`}
//               >
//                 {applying ? "Applying..." : hasApplied ? "Applied" : "Apply Now"}
//               </button>
//             )}
//             <button
//               onClick={handleSaveJob}
//               className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <span className="flex items-center justify-center">
//                 <span className="mr-2">⭐</span>
//                 Save
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Job Details */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Key Information */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Details</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Employment Type</p>
//                     <p className="font-medium text-gray-900">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
//                         {job.type || "Full-time"}
//                       </span>
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Experience Level</p>
//                     <p className="font-medium text-gray-900">{job.experience || "Not specified"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Education</p>
//                     <p className="font-medium text-gray-900">{job.education || "Not specified"}</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Salary</p>
//                     <p className="font-medium text-gray-900 text-xl">
//                       {formatSalary(job.salary)}
//                       {job.salary && <span className="text-sm text-gray-500 ml-2">per year</span>}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Remote Policy</p>
//                     <p className="font-medium text-gray-900">
//                       <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-700">
//                         {job.remote || "On-site"}
//                       </span>
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
//                     <p className="font-medium text-gray-900">
//                       {job.deadline ? formatDate(job.deadline) : "Not specified"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
//               </div>
//             </div>

//             {/* Responsibilities */}
//             {responsibilities.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsibilities</h2>
//                 <ul className="space-y-3">
//                   {responsibilities.map((item, index) => (
//                     <li key={index} className="flex items-start">
//                       <span className="text-blue-500 mr-3 mt-1">•</span>
//                       <span className="text-gray-700">{item}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Requirements */}
//             {requirements.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
//                 <ul className="space-y-3">
//                   {requirements.map((req, index) => (
//                     <li key={index} className="flex items-start">
//                       <span className="text-green-500 mr-3 mt-1">✓</span>
//                       <span className="text-gray-700">{req}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Skills */}
//             {skills.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
//                 <div className="flex flex-wrap gap-3">
//                   {skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-100"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Benefits */}
//             {benefits.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits & Perks</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {benefits.map((benefit, index) => (
//                     <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                       <span className="mr-3">🎁</span>
//                       <span className="text-gray-700">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-8">
//             {/* Company Card */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About the Company</h2>
//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mr-4">
//                     <span className="text-3xl">🏢</span>
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900">{job.company?.name}</h3>
//                     <p className="text-sm text-gray-600">{job.company?.industry || "Technology"}</p>
//                   </div>
//                 </div>

//                 <div className="pt-4 border-t border-gray-100">
//                   <p className="text-gray-700 text-sm">
//                     {job.company?.description || "A leading company in their industry."}
//                   </p>
//                 </div>

//                 <div className="space-y-3 pt-4 border-t border-gray-100">
//                   <div className="flex items-center text-sm">
//                     <span className="text-gray-500 mr-2">👥</span>
//                     <span className="text-gray-700">{job.company?.size || "Not specified"}</span>
//                   </div>
//                   <div className="flex items-center text-sm">
//                     <span className="text-gray-500 mr-2">🌐</span>
//                     <a 
//                       href={job.company?.website} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       {job.company?.website || "Website not available"}
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Application Stats */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Application Stats</h2>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Total Applicants</span>
//                   <span className="font-bold text-gray-900">
//                     {job.applicantCount || job.applicants?.length || 0}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Views</span>
//                   <span className="font-bold text-gray-900">{job.views || "Not tracked"}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Posted</span>
//                   <span className="font-bold text-gray-900">{formatDate(job.createdAt)}</span>
//                 </div>
//               </div>

//               <div className="mt-6 pt-6 border-t border-gray-100">
//                 <div className="text-center">
//                   <div className="text-3xl font-bold text-gray-900 mb-2">
//                     {Math.min(100, Math.floor(((job.applicantCount || 0) / 100) * 100))}%
//                   </div>
//                   <p className="text-sm text-gray-600">Application rate</p>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Apply */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
//               <p className="text-gray-600 mb-6">
//                 Submit your application now. The hiring team is actively reviewing applications.
//               </p>

//               {session?.user?.role === "user" ? (
//                 <button
//                   onClick={handleApply}
//                   disabled={hasApplied || applying}
//                   className={`w-full py-3 rounded-lg font-medium transition-all duration-200 mb-4 ${
//                     hasApplied
//                       ? "bg-green-600 text-white cursor-not-allowed"
//                       : applying
//                       ? "bg-blue-400 text-white cursor-wait"
//                       : "bg-blue-600 text-white hover:bg-blue-700"
//                   }`}
//                 >
//                   {applying ? "Applying..." : hasApplied ? "✓ Applied Successfully" : "Apply Now"}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`)}
//                   className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-4"
//                 >
//                   Sign In to Apply
//                 </button>
//               )}

//               <p className="text-sm text-gray-500 text-center">
//                 Application ends {job.deadline ? formatDate(job.deadline) : "soon"}
//               </p>
//             </div>

//             {/* Similar Jobs */}
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Jobs</h2>
//               <div className="space-y-4">
//                 <div 
//                   onClick={() => router.push(`/jobs/1`)}
//                   className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//                 >
//                   <h4 className="font-medium text-gray-900 mb-1">Senior Full Stack Developer</h4>
//                   <p className="text-sm text-gray-600 mb-2">Tech Corp Inc.</p>
//                   <div className="flex items-center text-xs text-gray-500">
//                     <span className="mr-3">📍 Remote</span>
//                     <span>💰 $120k</span>
//                   </div>
//                 </div>
//                 <div 
//                   onClick={() => router.push(`/jobs/2`)}
//                   className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
//                 >
//                   <h4 className="font-medium text-gray-900 mb-1">Frontend Developer</h4>
//                   <p className="text-sm text-gray-600 mb-2">Digital Solutions</p>
//                   <div className="flex items-center text-xs text-gray-500">
//                     <span className="mr-3">📍 New York</span>
//                     <span>💰 $95k</span>
//                   </div>
//                 </div>
//                 <a 
//                   href="/jobs" 
//                   className="block text-center text-blue-600 font-medium hover:text-blue-700 pt-4 border-t border-gray-100"
//                 >
//                   View More Jobs →
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Report Job */}
//         <div className="mt-8 text-center">
//           <button className="text-sm text-gray-500 hover:text-gray-700">
//             <span className="flex items-center justify-center">
//               <span className="mr-2">🚩</span>
//               Report this job
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useSession } from "next-auth/react";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   ArrowLeft,
//   Building,
//   MapPin,
//   Calendar,
//   Clock,
//   Briefcase,
//   DollarSign,
//   Users,
//   Eye,
//   CheckCircle,
//   Bookmark,
//   Share2,
//   Award,
//   TrendingUp,
//   Star,
//   ExternalLink,
//   ChevronRight,
//   Target,
//   Heart,
//   Send,
//   AlertCircle,
//   GraduationCap,
//   Zap,
//   Shield,
//   Coffee,
//   Globe,
//   Smartphone
// } from "lucide-react";

// export default function ViewJobPage() {
//   const params = useParams();
//   const id = params?.id;
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [job, setJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasApplied, setHasApplied] = useState(false);
//   const [applying, setApplying] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [showShareToast, setShowShareToast] = useState(false);

//   useEffect(() => {
//     if (id) {
//       fetchJobDetails();
//     }
//   }, [id]);

//   const fetchJobDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`/api/jobs/${id}`);

//       if (!res.ok) {
//         if (res.status === 404) {
//           throw new Error("Job not found");
//         }
//         throw new Error("Failed to fetch job details");
//       }

//       const data = await res.json();
//       setJob(data);

//       if (session?.user?.role === "user") {
//         checkApplicationStatus(data);
//         checkSavedStatus();
//       }
//     } catch (error) {
//       console.error("Error fetching job:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkApplicationStatus = (jobData) => {
//     const userId = session.user.id;
//     const hasApplied = jobData.applicants?.some(
//       applicant => applicant.user?._id === userId || applicant.user === userId
//     );
//     setHasApplied(hasApplied);
//   };

//   const checkSavedStatus = async () => {
//     try {
//       const res = await fetch(`/api/user/saved-jobs/${id}`);
//       if (res.ok) {
//         const data = await res.json();
//         setIsSaved(data.isSaved);
//       }
//     } catch (error) {
//       console.error("Error checking saved status:", error);
//     }
//   };

//   const handleApply = async () => {
//     if (!session) {
//       router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
//       return;
//     }

//     if (session.user.role !== "user") {
//       alert("Only users can apply for jobs");
//       return;
//     }

//     setApplying(true);
//     try {
//       const res = await fetch("/api/jobs/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId: id }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setHasApplied(true);
//         setJob(prev => ({
//           ...prev,
//           applicants: [...(prev.applicants || []), { user: session.user.id }],
//           applicantCount: (prev.applicantCount || prev.applicants?.length || 0) + 1
//         }));
//       } else {
//         alert(data.message || "Failed to apply for job");
//       }
//     } catch (error) {
//       console.error("Error applying:", error);
//       alert("Error applying for job. Please try again.");
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleSaveJob = async () => {
//     if (!session) {
//       router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
//       return;
//     }

//     try {
//       const res = await fetch("/api/user/save-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId: id }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setIsSaved(!isSaved);
//       }
//     } catch (error) {
//       console.error("Error saving job:", error);
//     }
//   };

//   const handleShare = async () => {
//     const url = window.location.href;

//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: job?.title,
//           text: `Check out this job: ${job?.title} at ${job?.company?.name}`,
//           url: url,
//         });
//       } catch (error) {
//         console.error('Error sharing:', error);
//       }
//     } else {
//       await navigator.clipboard.writeText(url);
//       setShowShareToast(true);
//       setTimeout(() => setShowShareToast(false), 3000);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Recently";
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - date);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return "Today";
//     if (diffDays === 1) return "Yesterday";
//     if (diffDays < 7) return `${diffDays} days ago`;
//     if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

//     return date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatSalary = (salary) => {
//     if (!salary) return "Competitive Salary";
//     if (typeof salary === 'string') return salary;

//     if (typeof salary === 'number') {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         maximumFractionDigits: 0
//       }).format(salary);
//     }

//     return salary;
//   };

//   const parseListItems = (text) => {
//     if (!text) return [];
//     if (Array.isArray(text)) return text;

//     return text
//       .split(/[\n•\-]/)
//       .map(item => item.trim())
//       .filter(item => item.length > 0);
//   };

//   const getJobTypeColor = (type) => {
//     const colors = {
//       'full-time': 'from-blue-500 to-blue-600',
//       'part-time': 'from-purple-500 to-purple-600',
//       'contract': 'from-green-500 to-green-600',
//       'remote': 'from-cyan-500 to-cyan-600',
//       'hybrid': 'from-orange-500 to-orange-600',
//       'internship': 'from-pink-500 to-pink-600'
//     };
//     return colors[type?.toLowerCase()] || 'from-gray-500 to-gray-600';
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="animate-pulse space-y-8">
//             {/* Header skeleton */}
//             <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl h-64"></div>

//             {/* Content skeleton */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2 space-y-6">
//                 {[1, 2, 3, 4].map(i => (
//                   <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
//                     <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-6"></div>
//                     <div className="space-y-3">
//                       <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
//                       <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="space-y-6">
//                 {[1, 2, 3].map(i => (
//                   <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 h-64"></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="text-center max-w-md"
//         >
//           <div className="relative mb-8">
//             <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-2xl opacity-50"></div>
//             <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
//               <AlertCircle className="w-16 h-16 text-red-500" />
//             </div>
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
//             Job Not Found
//           </h1>
//           <p className="text-gray-600 mb-8">
//             {error || "The job you're looking for doesn't exist or has been removed."}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push("/jobs")}
//               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
//             >
//               Browse All Jobs
//             </motion.button>
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.back()}
//               className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
//             >
//               Go Back
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   if (!job) return null;

//   const requirements = parseListItems(job.requirements);
//   const responsibilities = parseListItems(job.responsibilities);
//   const skills = parseListItems(job.skills);
//   const benefits = parseListItems(job.benefits);

//   const similarJobs = [
//     { id: 1, title: "Senior Full Stack Developer", company: "Tech Corp Inc.", location: "Remote", salary: "$120k", type: "remote" },
//     { id: 2, title: "Frontend Developer", company: "Digital Solutions", location: "New York", salary: "$95k", type: "full-time" },
//     { id: 3, title: "DevOps Engineer", company: "Cloud Systems", location: "San Francisco", salary: "$140k", type: "hybrid" }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Share Toast */}
//       <AnimatePresence>
//         {showShareToast && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed bottom-8 right-8 z-50"
//           >
//             <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
//               <CheckCircle className="w-5 h-5" />
//               <span className="font-medium">Link copied to clipboard!</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative overflow-hidden"
//       >
//         {/* Background Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>

//         {/* Pattern Overlay */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0" style={{
//             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
//             backgroundSize: '30px 30px'
//           }}></div>
//         </div>

//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* Back Button */}
//           <motion.button
//             whileHover={{ x: -5 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => router.back()}
//             className="flex items-center text-white/80 hover:text-white mb-8 group"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
//             Back to Jobs
//           </motion.button>

//           {/* Job Title and Info */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
//                     <span className="flex items-center gap-2">
//                       <TrendingUp className="w-4 h-4" />
//                       🔥 Hot Job
//                     </span>
//                   </div>
//                   <span className={`px-4 py-1.5 bg-gradient-to-r ${getJobTypeColor(job.type)} text-white rounded-full text-sm font-medium`}>
//                     {job.type || "Full-time"}
//                   </span>
//                 </div>

//                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
//                   {job.title}
//                 </h1>

//                 <div className="flex flex-wrap items-center gap-6 text-white/90">
//                   <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
//                       <Building className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">{job.company?.name}</p>
//                       <p className="text-sm opacity-80">{job.company?.industry}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
//                       <MapPin className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">{job.location}</p>
//                       <p className="text-sm opacity-80">{job.remote || "On-site"}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
//                       <Calendar className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <p className="font-semibold">Posted</p>
//                       <p className="text-sm opacity-80">{formatDate(job.createdAt)}</p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>

//             {/* Action Buttons - Desktop */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//               className="hidden lg:block"
//             >
//               <div className="space-y-4">
//                 {session?.user?.role === "user" && (
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleApply}
//                     disabled={hasApplied || applying}
//                     className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
//                       hasApplied
//                         ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed"
//                         : applying
//                         ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white cursor-wait"
//                         : "bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:shadow-2xl"
//                     }`}
//                   >
//                     <div className="flex items-center justify-center gap-3">
//                       {applying ? (
//                         <>
//                           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Applying...
//                         </>
//                       ) : hasApplied ? (
//                         <>
//                           <CheckCircle className="w-6 h-6" />
//                           Applied Successfully
//                         </>
//                       ) : (
//                         <>
//                           <Send className="w-5 h-5" />
//                           Apply Now
//                         </>
//                       )}
//                     </div>
//                   </motion.button>
//                 )}

//                 <div className="grid grid-cols-2 gap-4">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleSaveJob}
//                     className="p-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     {isSaved ? (
//                       <>
//                         <Heart className="w-5 h-5 fill-current text-red-400" />
//                         <span>Saved</span>
//                       </>
//                     ) : (
//                       <>
//                         <Bookmark className="w-5 h-5" />
//                         <span>Save</span>
//                       </>
//                     )}
//                   </motion.button>

//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={handleShare}
//                     className="p-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     <Share2 className="w-5 h-5" />
//                     <span>Share</span>
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Mobile Action Buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//         className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex gap-3">
//             {session?.user?.role === "user" && (
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleApply}
//                 disabled={hasApplied || applying}
//                 className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                   hasApplied
//                     ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//                     : applying
//                     ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
//                     : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//                 }`}
//               >
//                 <div className="flex items-center justify-center gap-2">
//                   {applying ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Applying...
//                     </>
//                   ) : hasApplied ? (
//                     <>
//                       <CheckCircle className="w-5 h-5" />
//                       Applied
//                     </>
//                   ) : (
//                     <>
//                       <Send className="w-5 h-5" />
//                       Apply Now
//                     </>
//                   )}
//                 </div>
//               </motion.button>
//             )}

//             <div className="flex gap-2">
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleSaveJob}
//                 className="p-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
//               >
//                 {isSaved ? (
//                   <Heart className="w-5 h-5 fill-current text-red-500" />
//                 ) : (
//                   <Bookmark className="w-5 h-5" />
//                 )}
//               </motion.button>
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleShare}
//                 className="p-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
//               >
//                 <Share2 className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="grid grid-cols-1 lg:grid-cols-3 gap-8"
//         >
//           {/* Left Column - Job Details */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Quick Stats */}
//             <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
//                 <div className="flex items-center justify-between mb-3">
//                   <DollarSign className="w-8 h-8 text-blue-600" />
//                   <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded-full">Salary</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{formatSalary(job.salary)}</p>
//                 <p className="text-sm text-gray-600 mt-1">per year</p>
//               </div>

//               <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
//                 <div className="flex items-center justify-between mb-3">
//                   <Users className="w-8 h-8 text-green-600" />
//                   <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">Applicants</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{job.applicantCount || job.applicants?.length || 0}</p>
//                 <p className="text-sm text-gray-600 mt-1">Total applied</p>
//               </div>

//               <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50">
//                 <div className="flex items-center justify-between mb-3">
//                   <Eye className="w-8 h-8 text-purple-600" />
//                   <span className="text-xs font-semibold text-purple-800 bg-purple-200 px-2 py-1 rounded-full">Views</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{job.views || "1.2k"}</p>
//                 <p className="text-sm text-gray-600 mt-1">Total views</p>
//               </div>

//               <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50">
//                 <div className="flex items-center justify-between mb-3">
//                   <Clock className="w-8 h-8 text-orange-600" />
//                   <span className="text-xs font-semibold text-orange-800 bg-orange-200 px-2 py-1 rounded-full">Deadline</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {job.deadline ? formatDate(job.deadline) : "Soon"}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">Apply before</p>
//               </div>
//             </motion.div>

//             {/* Job Description */}
//             <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
//                   <Target className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                   Job Description
//                 </h2>
//               </div>
//               <div className="prose max-w-none">
//                 <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
//               </div>
//             </motion.div>

//             {/* Responsibilities */}
//             {responsibilities.length > 0 && (
//               <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
//                     <Zap className="w-6 h-6 text-green-600" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Key Responsibilities
//                   </h2>
//                 </div>
//                 <ul className="space-y-4">
//                   {responsibilities.map((item, index) => (
//                     <motion.li
//                       key={index}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="flex items-start p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl hover:bg-gray-50/80 transition-colors group"
//                     >
//                       <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
//                         {index + 1}
//                       </span>
//                       <span className="text-gray-700">{item}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </motion.div>
//             )}

//             {/* Requirements */}
//             {requirements.length > 0 && (
//               <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 flex items-center justify-center">
//                     <Award className="w-6 h-6 text-red-600" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Requirements
//                   </h2>
//                 </div>
//                 <ul className="space-y-4">
//                   {requirements.map((req, index) => (
//                     <motion.li
//                       key={index}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="flex items-center p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl hover:bg-gray-50/80 transition-colors"
//                     >
//                       <CheckCircle className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
//                       <span className="text-gray-700">{req}</span>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </motion.div>
//             )}

//             {/* Skills */}
//             {skills.length > 0 && (
//               <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
//                     <Star className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Required Skills
//                   </h2>
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   {skills.map((skill, index) => (
//                     <motion.span
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: index * 0.05 }}
//                       whileHover={{ scale: 1.05 }}
//                       className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
//                     >
//                       {skill}
//                     </motion.span>
//                   ))}
//                 </div>
//               </motion.div>
//             )}

//             {/* Benefits */}
//             {benefits.length > 0 && (
//               <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center">
//                     <Coffee className="w-6 h-6 text-yellow-600" />
//                   </div>
//                   <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Benefits & Perks
//                   </h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {benefits.map((benefit, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       whileHover={{ y: -5 }}
//                       className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/50 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 group"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
//                           {index % 4 === 0 && <Shield className="w-6 h-6 text-yellow-600" />}
//                           {index % 4 === 1 && <Smartphone className="w-6 h-6 text-yellow-600" />}
//                           {index % 4 === 2 && <Globe className="w-6 h-6 text-yellow-600" />}
//                           {index % 4 === 3 && <Coffee className="w-6 h-6 text-yellow-600" />}
//                         </div>
//                         <span className="text-gray-700 font-medium">{benefit}</span>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Right Column - Sidebar */}
//           <div className="space-y-8">
//             {/* Company Card */}
//             <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="relative">
//                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
//                   <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//                     <Building className="w-8 h-8 text-blue-600" />
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900">{job.company?.name}</h3>
//                   <p className="text-gray-600">{job.company?.industry}</p>
//                 </div>
//               </div>

//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 {job.company?.description || "A leading company in their industry, dedicated to innovation and excellence."}
//               </p>

//               <div className="space-y-4 pt-6 border-t border-gray-200/50">
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Company Size</span>
//                   <span className="font-semibold text-gray-900">{job.company?.size || "501-1000"}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Founded</span>
//                   <span className="font-semibold text-gray-900">{job.company?.founded || "2010"}</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600">Location</span>
//                   <span className="font-semibold text-gray-900">{job.company?.location || "Global"}</span>
//                 </div>
//               </div>

//               {job.company?.website && (
//                 <motion.a
//                   whileHover={{ scale: 1.02 }}
//                   href={job.company.website}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-6 w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300/50 rounded-xl font-medium text-gray-900 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                   Visit Website
//                   <ExternalLink className="w-4 h-4" />
//                 </motion.a>
//               )}
//             </motion.div>

//             {/* Quick Apply Card */}
//             <motion.div
//               variants={itemVariants}
//               className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl border border-blue-200/50 p-8 backdrop-blur-sm"
//             >
//               <div className="text-center mb-6">
//                 <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
//                   <Send className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
//                 <p className="text-gray-600">
//                   Submit your application now. The hiring team is actively reviewing applications.
//                 </p>
//               </div>

//               {session?.user?.role === "user" ? (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleApply}
//                   disabled={hasApplied || applying}
//                   className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-4 ${
//                     hasApplied
//                       ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
//                       : applying
//                       ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
//                       : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl"
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-3">
//                     {applying ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Applying...
//                       </>
//                     ) : hasApplied ? (
//                       <>
//                         <CheckCircle className="w-6 h-6" />
//                         Applied Successfully
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-5 h-5" />
//                         Apply Now
//                       </>
//                     )}
//                   </div>
//                 </motion.button>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`)}
//                   className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 mb-4"
//                 >
//                   Sign In to Apply
//                 </motion.button>
//               )}

//               <div className="text-center text-sm text-gray-500">
//                 <Clock className="w-4 h-4 inline-block mr-2" />
//                 Apply before {job.deadline ? formatDate(job.deadline) : "soon"}
//               </div>
//             </motion.div>

//             {/* Similar Jobs */}
//             <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
//                 <TrendingUp className="w-6 h-6 text-blue-600" />
//                 Similar Jobs
//               </h3>
//               <div className="space-y-4">
//                 {similarJobs.map((similarJob, index) => (
//                   <motion.div
//                     key={similarJob.id}
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ x: 5 }}
//                     onClick={() => router.push(`/jobs/${similarJob.id}`)}
//                     className="p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-2xl border border-gray-200/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
//                         {similarJob.title}
//                       </h4>
//                       <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600">
//                         {similarJob.type}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 text-sm mb-3">{similarJob.company}</p>
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center text-gray-500">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         {similarJob.location}
//                       </div>
//                       <div className="font-semibold text-gray-900">
//                         {similarJob.salary}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//               <motion.a
//                 whileHover={{ x: 5 }}
//                 href="/jobs"
//                 className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
//               >
//                 View All Jobs
//                 <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//               </motion.a>
//             </motion.div>

//             {/* Additional Info */}
//             <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
//               <h3 className="text-xl font-bold text-gray-900 mb-6">Job Details</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
//                       <Briefcase className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <span className="text-gray-700">Experience</span>
//                   </div>
//                   <span className="font-semibold text-gray-900">{job.experience || "3+ years"}</span>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
//                       <GraduationCap className="w-5 h-5 text-green-600" />
//                     </div>
//                     <span className="text-gray-700">Education</span>
//                   </div>
//                   <span className="font-semibold text-gray-900">{job.education || "Bachelor's"}</span>
//                 </div>

//                 <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
//                       <Clock className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <span className="text-gray-700">Work Hours</span>
//                   </div>
//                   <span className="font-semibold text-gray-900">40 hrs/week</span>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Report Job */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="mt-12 text-center"
//         >
//           <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 mx-auto">
//             <AlertCircle className="w-4 h-4" />
//             Report this job
//           </button>
//         </motion.div>
//       </div>

//       {/* Floating Apply Button for Mobile */}
//       {!loading && !error && session?.user?.role === "user" && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent pointer-events-none lg:hidden z-50"
//         >
//           <motion.button
//             whileTap={{ scale: 0.95 }}
//             onClick={handleApply}
//             disabled={hasApplied || applying}
//             className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 pointer-events-auto shadow-2xl ${
//               hasApplied
//                 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
//                 : applying
//                 ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
//                 : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
//             }`}
//           >
//             <div className="flex items-center justify-center gap-3">
//               {applying ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Applying...
//                 </>
//               ) : hasApplied ? (
//                 <>
//                   <CheckCircle className="w-6 h-6" />
//                   Applied Successfully
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   Apply Now
//                 </>
//               )}
//             </div>
//           </motion.button>
//         </motion.div>
//       )}
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  DollarSign,
  Users,
  Eye,
  CheckCircle,
  Bookmark,
  Share2,
  Award,
  TrendingUp,
  Star,
  ExternalLink,
  ChevronRight,
  Target,
  Heart,
  Send,
  AlertCircle,
  GraduationCap,
  Zap,
  Shield,
  Coffee,
  Globe,
  Smartphone
} from "lucide-react";

export default function ViewJobPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Debug: Log session data
  useEffect(() => {
    console.log('🔍 Job Detail Page - Session Debug:');
    console.log('Status:', status);
    console.log('Session:', session);
    console.log('User:', session?.user);
    console.log('Role:', session?.user?.role);
    console.log('Is Applicant Role?:', session?.user?.role === 'applicant');
  }, [session, status]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/jobs/${id}`);

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Job not found");
        }
        throw new Error("Failed to fetch job details");
      }

      const data = await res.json();
      setJob(data);

      // Check application status only if applicant is authenticated
      if (status === "authenticated" && session?.user?.role === "applicant") {
        checkApplicationStatus(data);
        checkSavedStatus();
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = (jobData) => {
    const userId = session?.user?.id;
    if (!userId) return;

    const hasApplied = jobData.applicants?.some(
      applicant => applicant.user?._id === userId || applicant.user === userId
    );
    setHasApplied(hasApplied || false);
  };

  const checkSavedStatus = async () => {
    try {
      const res = await fetch(`/api/user/saved-jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved || false);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  const handleApply = async () => {
    // First check if we're still loading session
    if (status === "loading") {
      alert("Please wait while we verify your session...");
      return;
    }

    // If not authenticated, redirect to sign in
    if (status === "unauthenticated") {
      router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
      return;
    }

    // Check if user role is 'applicant'
    if (session?.user?.role !== "applicant") {
      alert("Only applicants can apply for jobs. Please sign in with an applicant account.");
      router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
      return;
    }

    setApplying(true);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setHasApplied(true);
        setJob(prev => ({
          ...prev,
          applicants: [...(prev.applicants || []), { user: session.user.id }],
          applicantCount: (prev.applicantCount || prev.applicants?.length || 0) + 1
        }));
      } else {
        alert(data.message || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying:", error);
      alert("Error applying for job. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (status === "unauthenticated") {
      router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`);
      return;
    }

    if (session?.user?.role !== "applicant") {
      alert("Only applicants can save jobs");
      return;
    }

    try {
      const res = await fetch("/api/user/save-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: `Check out this job: ${job?.title} at ${job?.company?.name}`,
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSalary = (salary) => {
    if (!salary) return "Competitive Salary";
    if (typeof salary === 'string') return salary;

    if (typeof salary === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(salary);
    }

    return salary;
  };

  const parseListItems = (text) => {
    if (!text) return [];
    if (Array.isArray(text)) return text;

    return text
      .split(/[\n•\-]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'from-blue-500 to-blue-600',
      'part-time': 'from-purple-500 to-purple-600',
      'contract': 'from-green-500 to-green-600',
      'remote': 'from-cyan-500 to-cyan-600',
      'hybrid': 'from-orange-500 to-orange-600',
      'internship': 'from-pink-500 to-pink-600'
    };
    return colors[type?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Show loading state while checking authentication
  if (status === "loading" && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-3xl h-64"></div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
                    <div className="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-2xl opacity-50"></div>
            <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Job Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The job you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/jobs")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 shadow-md"
            >
              Browse All Jobs
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!job) return null;

  const requirements = parseListItems(job.requirements);
  const responsibilities = parseListItems(job.responsibilities);
  const skills = parseListItems(job.skills);
  const benefits = parseListItems(job.benefits);

  const similarJobs = [
    { id: 1, title: "Senior Full Stack Developer", company: "Tech Corp Inc.", location: "Remote", salary: "$120k", type: "remote" },
    { id: 2, title: "Frontend Developer", company: "Digital Solutions", location: "New York", salary: "$95k", type: "full-time" },
    { id: 3, title: "DevOps Engineer", company: "Cloud Systems", location: "San Francisco", salary: "$140k", type: "hybrid" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Link copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center text-white/80 hover:text-white mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </motion.button>

          {/* Job Title and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      🔥 Hot Job
                    </span>
                  </div>
                  <span className={`px-4 py-1.5 bg-gradient-to-r ${getJobTypeColor(job.type)} text-white rounded-full text-sm font-medium`}>
                    {job.type || "Full-time"}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{job.company?.name}</p>
                      <p className="text-sm opacity-80">{job.company?.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{job.location}</p>
                      <p className="text-sm opacity-80">{job.remote || "On-site"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Posted</p>
                      <p className="text-sm opacity-80">{formatDate(job.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="space-y-4">
                {session?.user?.role === "applicant" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    disabled={hasApplied || applying}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${hasApplied
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed"
                      : applying
                        ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white cursor-wait"
                        : "bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:shadow-2xl"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {applying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Applying...
                        </>
                      ) : hasApplied ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Applied Successfully
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Apply Now
                        </>
                      )}
                    </div>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`)}
                    className="w-full py-4 bg-gradient-to-r from-white to-gray-100 text-gray-900 font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      Sign In to Apply
                    </div>
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveJob}
                    disabled={!session?.user}
                    className={`p-4 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${session?.user
                      ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      : "bg-white/5 border-white/10 text-white/50 cursor-not-allowed"
                      }`}
                  >
                    {isSaved ? (
                      <>
                        <Heart className="w-5 h-5 fill-current text-red-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        <span>Save</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="p-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3">
            {session?.user?.role === "applicant" ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                disabled={hasApplied || applying}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${hasApplied
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : applying
                    ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {applying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Applying...
                    </>
                  ) : hasApplied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Applied
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Apply Now
                    </>
                  )}
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`)}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Sign In to Apply
                </div>
              </motion.button>
            )}

            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveJob}
                disabled={!session?.user}
                className={`p-3 border-2 rounded-xl transition-all duration-300 ${session?.user
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isSaved ? (
                  <Heart className="w-5 h-5 fill-current text-red-500" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-800 bg-blue-200 px-2 py-1 rounded-full">Salary</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatSalary(job.salary)}</p>
                <p className="text-sm text-gray-600 mt-1">per year</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <span className="text-xs font-semibold text-green-800 bg-green-200 px-2 py-1 rounded-full">Applicants</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{job.applicantCount || job.applicants?.length || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Total applied</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-center justify-between mb-3">
                  <Eye className="w-8 h-8 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-800 bg-purple-200 px-2 py-1 rounded-full">Views</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{job.views || "1.2k"}</p>
                <p className="text-sm text-gray-600 mt-1">Total views</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-800 bg-orange-200 px-2 py-1 rounded-full">Deadline</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {job.applicationDeadline ? formatDate(job.applicationDeadline) : "Soon"}
                </p>
                <p className="text-sm text-gray-600 mt-1">Apply before</p>
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Job Description
                </h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </motion.div>

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Key Responsibilities
                  </h2>
                </div>
                <ul className="space-y-4">
                  {responsibilities.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl hover:bg-gray-50/80 transition-colors group"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Requirements
                  </h2>
                </div>
                <ul className="space-y-4">
                  {requirements.map((req, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-xl hover:bg-gray-50/80 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Required Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center">
                    <Coffee className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Benefits & Perks
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200/50 hover:border-yellow-200 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {index % 4 === 0 && <Shield className="w-6 h-6 text-yellow-600" />}
                          {index % 4 === 1 && <Smartphone className="w-6 h-6 text-yellow-600" />}
                          {index % 4 === 2 && <Globe className="w-6 h-6 text-yellow-600" />}
                          {index % 4 === 3 && <Coffee className="w-6 h-6 text-yellow-600" />}
                        </div>
                        <span className="text-gray-700 font-medium">{benefit}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Company Card */}
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.company?.name}</h3>
                  <p className="text-gray-600">{job.company?.industry}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {job.company?.description || "A leading company in their industry, dedicated to innovation and excellence."}
              </p>

              <div className="space-y-4 pt-6 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Size</span>
                  <span className="font-semibold text-gray-900">{job.company?.size || "501-1000"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Founded</span>
                  <span className="font-semibold text-gray-900">{job.company?.founded || "2010"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900">{job.company?.location || "Global"}</span>
                </div>
              </div>

              {job.company?.website && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300/50 rounded-xl font-medium text-gray-900 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </motion.div>

            {/* Quick Apply Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl border border-blue-200/50 p-8 backdrop-blur-sm"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
                <p className="text-gray-600">
                  Submit your application now. The hiring team is actively reviewing applications.
                </p>
              </div>

              {session?.user?.role === "applicant" ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={hasApplied || applying}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 mb-4 ${hasApplied
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : applying
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl"
                    }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    {applying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Applying...
                      </>
                    ) : hasApplied ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        Applied Successfully
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Apply Now
                      </>
                    )}
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/api/auth/signin?callbackUrl=/jobs/${id}`)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 mb-4"
                >
                  Sign In to Apply
                </motion.button>
              )}

              <div className="text-center text-sm text-gray-500">
                <Clock className="w-4 h-4 inline-block mr-2" />
                Apply before {job.deadline ? formatDate(job.deadline) : "soon"}
              </div>
            </motion.div>

            {/* Similar Jobs */}
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Similar Jobs
              </h3>
              <div className="space-y-4">
                {similarJobs.map((similarJob, index) => (
                  <motion.div
                    key={similarJob.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    onClick={() => router.push(`/jobs/${similarJob.id}`)}
                    className="p-4 bg-gradient-to-r from-gray-50/50 to-transparent rounded-2xl border border-gray-200/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {similarJob.title}
                      </h4>
                      <span className="px-2 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600">
                        {similarJob.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{similarJob.company}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {similarJob.location}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {similarJob.salary}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.a
                whileHover={{ x: 5 }}
                href="/jobs"
                className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                View All Jobs
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Additional Info */}
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Job Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Experience</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.experience || "3+ years"}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700">Education</span>
                  </div>
                  <span className="font-semibold text-gray-900">{job.education || "Bachelor's"}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700">Work Hours</span>
                  </div>
                  <span className="font-semibold text-gray-900">40 hrs/week</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Report Job */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 mx-auto">
            <AlertCircle className="w-4 h-4" />
            Report this job
          </button>
        </motion.div>
      </div>

      {/* Floating Apply Button for Mobile */}
      {!loading && !error && session?.user?.role === "applicant" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent pointer-events-none lg:hidden z-50"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleApply}
            disabled={hasApplied || applying}
            className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 pointer-events-auto shadow-2xl ${hasApplied
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              : applying
                ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              }`}
          >
            <div className="flex items-center justify-center gap-3">
              {applying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : hasApplied ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Applied Successfully
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Apply Now
                </>
              )}
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}