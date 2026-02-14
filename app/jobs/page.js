// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Building,
//   MapPin,
//   DollarSign,
//   Users,
//   Clock,
//   Briefcase,
//   ChevronRight,
//   CheckCircle,
//   Sparkles,
//   Filter,
//   Search,
//   TrendingUp
// } from "lucide-react";

// export default function JobsPage() {
//   const searchParams = useSearchParams();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [appliedJobs, setAppliedJobs] = useState(new Set());
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [selectedType, setSelectedType] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();

//   const jobTypes = ["all", "full-time", "part-time", "contract", "remote", "hybrid"];

//   // Initialize from URL parameters
//   useEffect(() => {
//     const query = searchParams.get('query');
//     const location = searchParams.get('location');

//     if (query) setSearchTerm(query);
//     if (location) setLocationFilter(location);
//   }, [searchParams]);

//   useEffect(() => {
//     fetchJobs();

//     if (session?.user?.role === "user") {
//       fetchAppliedJobs();
//     }
//   }, [session]);

//   useEffect(() => {
//     filterJobs();
//   }, [jobs, searchTerm, locationFilter, selectedType]);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/jobs/all");
//       if (!res.ok) throw new Error("Failed to fetch jobs");
//       const data = await res.json();
//       setJobs(data);
//       setFilteredJobs(data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//       alert("Failed to load jobs. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAppliedJobs = async () => {
//     try {
//       const res = await fetch("/api/jobs/my-applications");
//       if (res.ok) {
//         const data = await res.json();
//         const appliedJobIds = data.map(application => application.job?._id).filter(Boolean);
//         setAppliedJobs(new Set(appliedJobIds));
//       }
//     } catch (error) {
//       console.error("Error fetching applied jobs:", error);
//     }
//   };

//   const filterJobs = () => {
//     let filtered = [...jobs];

//     if (searchTerm) {
//       filtered = filtered.filter(job =>
//         job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         job.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (locationFilter) {
//       filtered = filtered.filter(job =>
//         job.location.toLowerCase().includes(locationFilter.toLowerCase())
//       );
//     }

//     if (selectedType !== "all") {
//       filtered = filtered.filter(job =>
//         job.type?.toLowerCase() === selectedType.toLowerCase()
//       );
//     }

//     setFilteredJobs(filtered);
//   };

//   const applyJob = async (jobId) => {
//     if (!session) {
//       alert("Please sign in to apply for jobs");
//       return;
//     }

//     if (session.user.role !== "user") {
//       alert("Only users can apply for jobs");
//       return;
//     }

//     try {
//       const res = await fetch("/api/jobs/apply", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setAppliedJobs(prev => new Set(prev).add(jobId));

//         // Animation feedback
//         const button = document.getElementById(`apply-btn-${jobId}`);
//         if (button) {
//           button.classList.add("applied-success");
//           setTimeout(() => {
//             button.classList.remove("applied-success");
//           }, 2000);
//         }

//         // Update the job in the list
//         setJobs(prevJobs =>
//           prevJobs.map(job =>
//             job._id === jobId
//               ? {
//                 ...job,
//                 applicants: [...(job.applicants || []), { user: session.user.id }],
//                 applicantCount: (job.applicantCount || job.applicants?.length || 0) + 1
//               }
//               : job
//           )
//         );
//       } else {
//         alert(data.message || "Failed to apply");
//       }
//     } catch (error) {
//       console.error("Error applying for job:", error);
//       alert("Error applying for job. Please try again.");
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Recently";
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffTime = Math.abs(now - date);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//       if (diffDays === 0) return "Today";
//       if (diffDays === 1) return "Yesterday";
//       if (diffDays < 7) return `${diffDays} days ago`;
//       if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     } catch {
//       return "Recently";
//     }
//   };

//   const parseSkills = (skills) => {
//     if (!skills) return [];

//     if (Array.isArray(skills)) {
//       return skills;
//     }

//     if (typeof skills === 'string') {
//       return skills
//         .split(/[,]/)
//         .map(skill => skill.trim())
//         .filter(skill => skill.length > 0);
//     }

//     return [];
//   };

//   // Loading skeleton with animations
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br  from-gray-50 via-white to-blue-50/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="animate-pulse space-y-6">
//             <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-8"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
//                     <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
//                   </div>
//                   <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
//                   <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
//                   <div className="space-y-2 mb-6">
//                     <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
//                     <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
//                   </div>
//                   <div className="flex gap-2 mb-6">
//                     <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
//                     <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
//                   </div>
//                   <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
//                     <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
//                     <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
//         <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative bg-gradient-to-r from-white via-white to-white/95 backdrop-blur-sm border-b border-gray-200/50"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[7%]">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
//                   <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                     Discover Your Dream Job
//                   </h1>
//                 </div>
//                 <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
//               </div>

//               <p className="text-lg text-gray-600 max-w-2xl">
//                 Explore <span className="font-semibold text-blue-600">{filteredJobs.length}</span> curated opportunities
//                 from top companies worldwide
//               </p>

//               {/* Stats */}
//               <div className="flex flex-wrap gap-6 pt-4">
//                 <div className="flex items-center gap-2">
//                   <TrendingUp className="w-5 h-5 text-green-500" />
//                   <span className="text-sm text-gray-600">
//                     <span className="font-bold text-gray-900">{jobs.filter(j => j.applicantCount > 50).length}</span> Hot Jobs
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Briefcase className="w-5 h-5 text-blue-500" />
//                   <span className="text-sm text-gray-600">
//                     <span className="font-bold text-gray-900">{jobs.filter(j => j.type === 'remote').length}</span> Remote Positions
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {session?.user?.role === "recruiter" && (
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
//                 onClick={() => router.push("/jobs/post")}
//               >
//                 <span className="relative flex items-center justify-center gap-2">
//                   <span className="group-hover:rotate-180 transition-transform duration-300">🚀</span>
//                   Post New Job
//                 </span>
//               </motion.button>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Search and Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.1 }}
//         className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 py-4"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search jobs, companies, or keywords..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:shadow"
//               />
//             </div>

//             {/* Location Filter */}
//             <div className="flex-1 relative">
//               <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Location..."
//                 value={locationFilter}
//                 onChange={(e) => setLocationFilter(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:shadow"
//               />
//             </div>

//             {/* Filter Toggle */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300/50 rounded-xl hover:shadow transition-all duration-300"
//             >
//               <Filter className="w-5 h-5" />
//               Filters
//               <motion.span
//                 animate={{ rotate: showFilters ? 180 : 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 ↓
//               </motion.span>
//             </motion.button>
//           </div>

//           {/* Job Type Filters */}
//           <AnimatePresence>
//             {showFilters && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="mt-4"
//               >
//                 <div className="flex flex-wrap gap-2">
//                   {jobTypes.map((type) => (
//                     <motion.button
//                       key={type}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedType(type)}
//                       className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${selectedType === type
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                         }`}
//                     >
//                       {type === "all" ? "All Jobs" : type.replace("-", " ")}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Job Count */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="mb-8"
//         >
//           <p className="text-gray-600">
//             Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> of{" "}
//             <span className="font-bold text-gray-900">{jobs.length}</span> jobs
//           </p>
//         </motion.div>

//         {/* Jobs Grid */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={selectedType + searchTerm}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {filteredJobs.map((job, index) => {
//               const jobSkills = parseSkills(job.skills);
//               const isApplied = appliedJobs.has(job._id);

//               return (
//                 <motion.div
//                   key={job._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.05 }}
//                   whileHover={{ y: -5, transition: { duration: 0.2 } }}
//                   className="group relative"
//                 >
//                   {/* Glow Effect on Hover */}
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

//                   <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
//                     {/* Featured Badge */}
//                     {job.applicantCount > 50 && (
//                       <div className="absolute top-4 right-4 z-10">
//                         <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
//                           🔥 Hot Job
//                         </span>
//                       </div>
//                     )}

//                     <div className="p-6">
//                       {/* Company Header */}
//                       <div className="flex items-start justify-between mb-6">
//                         <div className="flex items-center gap-4">
//                           <div className="relative">
//                             <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl"></div>
//                             <div className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-md">
//                               {job.company?.logo ? (
//                                 <img
//                                   src={job.company.logo}
//                                   alt={job.company.name}
//                                   className="w-10 h-10 object-contain"
//                                 />
//                               ) : (
//                                 <Building className="w-7 h-7 text-blue-600" />
//                               )}
//                             </div>
//                           </div>
//                           <div>
//                             <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
//                               {job.title}
//                             </h3>
//                             <p className="text-gray-600 font-medium">
//                               {job.company?.name}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Job Type Badge */}
//                       <div className="mb-6">
//                         <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${job.type === 'remote'
//                             ? 'bg-green-100 text-green-800'
//                             : job.type === 'hybrid'
//                               ? 'bg-blue-100 text-blue-800'
//                               : 'bg-gray-100 text-gray-800'
//                           }`}>
//                           <Briefcase className="w-3 h-3 mr-2" />
//                           {job.type || "Full-time"}
//                         </span>
//                       </div>

//                       {/* Job Details Grid */}
//                       <div className="grid grid-cols-2 gap-4 mb-6">
//                         <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
//                           <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
//                             <MapPin className="w-5 h-5 text-blue-600" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Location</p>
//                             <p className="font-medium text-gray-900 truncate">{job.location}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
//                           <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
//                             <DollarSign className="w-5 h-5 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Salary</p>
//                             <p className="font-medium text-gray-900">{job.salary || "Competitive"}</p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
//                           <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
//                             <Users className="w-5 h-5 text-purple-600" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Applicants</p>
//                             <p className="font-medium text-gray-900">
//                               {job.applicantCount || job.applicants?.length || 0}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
//                           <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
//                             <Clock className="w-5 h-5 text-orange-600" />
//                           </div>
//                           <div>
//                             <p className="text-sm text-gray-500">Posted</p>
//                             <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Description Preview */}
//                       <p className="text-gray-600 line-clamp-2 mb-6 p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
//                         {job.description}
//                       </p>

//                       {/* Skills */}
//                       {jobSkills.length > 0 && (
//                         <div className="mb-6">
//                           <p className="text-sm font-medium text-gray-700 mb-3">Required Skills:</p>
//                           <div className="flex flex-wrap gap-2">
//                             {jobSkills.slice(0, 4).map((skill, index) => (
//                               <motion.span
//                                 key={index}
//                                 initial={{ opacity: 0, scale: 0.8 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 transition={{ delay: index * 0.1 }}
//                                 className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200/50 hover:border-blue-300 transition-colors"
//                               >
//                                 {skill}
//                               </motion.span>
//                             ))}
//                             {jobSkills.length > 4 && (
//                               <span className="px-3 py-1.5 text-gray-500 text-sm font-medium">
//                                 +{jobSkills.length - 4} more
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {/* Actions */}
//                       <div className="flex justify-between items-center pt-6 border-t border-gray-200/50">
//                         <motion.div whileHover={{ x: 5 }}>
//                           <Link
//                             href={`/jobs/${job._id}`}
//                             className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
//                           >
//                             View Details
//                             <motion.span
//                               animate={{ x: [0, 5, 0] }}
//                               transition={{ repeat: Infinity, duration: 2 }}
//                               className="ml-2 inline-block"
//                             >
//                               <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
//                             </motion.span>
//                           </Link>
//                         </motion.div>

//                         {session?.user?.role === "user" && (
//                           <motion.button
//                             id={`apply-btn-${job._id}`}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => applyJob(job._id)}
//                             disabled={isApplied}
//                             className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${isApplied
//                                 ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
//                                 : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/25"
//                               }`}
//                           >
//                             {isApplied ? (
//                               <span className="flex items-center gap-2">
//                                 <CheckCircle className="w-5 h-5" />
//                                 Applied
//                               </span>
//                             ) : (
//                               <span className="flex items-center gap-2">
//                                 <Briefcase className="w-5 h-5" />
//                                 Apply Now
//                               </span>
//                             )}

//                             {/* Animated background on apply */}
//                             <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
//                           </motion.button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </AnimatePresence>

//         {/* Empty State */}
//         {filteredJobs.length === 0 && !loading && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-center py-20"
//           >
//             <div className="relative w-32 h-32 mx-auto mb-8">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-xl opacity-50"></div>
//               <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
//                 <Briefcase className="w-16 h-16 text-gray-400" />
//               </div>
//             </div>
//             <h3 className="text-3xl font-bold text-gray-900 mb-3">
//               No jobs found
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               {searchTerm || selectedType !== "all"
//                 ? "Try adjusting your search or filter criteria"
//                 : "Check back soon for new opportunities!"}
//             </p>
//             {(searchTerm || locationFilter || selectedType !== "all") && (
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setLocationFilter("");
//                   setSelectedType("all");
//                   router.push("/jobs");
//                 }}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </motion.div>
//         )}
//       </div>

//       {/* Floating Action Button for Recruiters */}
//       {session?.user?.role === "recruiter" && (
//         <motion.button
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 1 }}
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => router.push("/jobs/post")}
//           className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl z-50 group"
//         >
//           <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">
//             ✨
//           </span>
//         </motion.button>
//       )}

//       {/* Add custom CSS for apply animation */}
//       <style jsx>{`
//         .applied-success {
//           animation: successPulse 2s ease;
//         }
        
//         @keyframes successPulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
//           }
//         }
        
//         /* Smooth scrolling */
//         html {
//           scroll-behavior: smooth;
//         }
        
//         /* Custom scrollbar */
//         ::-webkit-scrollbar {
//           width: 10px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 5px;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
//           border-radius: 5px;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(to bottom, #2563eb, #7c3aed);
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Briefcase,
  ChevronRight,
  CheckCircle,
  Sparkles,
  Filter,
  Search,
  TrendingUp
} from "lucide-react";

// Create a separate component that uses useSearchParams
function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const jobTypes = ["all", "full-time", "part-time", "contract", "remote", "hybrid"];

  // Initialize from URL parameters
  useEffect(() => {
    const query = searchParams.get('query');
    const location = searchParams.get('location');

    if (query) setSearchTerm(query);
    if (location) setLocationFilter(location);
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();

    if (session?.user?.role === "user") {
      fetchAppliedJobs();
    }
  }, [session]);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, locationFilter, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs/all");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch("/api/jobs/my-applications");
      if (res.ok) {
        const data = await res.json();
        const appliedJobIds = data.map(application => application.job?._id).filter(Boolean);
        setAppliedJobs(new Set(appliedJobIds));
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(job =>
        job.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  };

  const applyJob = async (jobId) => {
    if (!session) {
      alert("Please sign in to apply for jobs");
      return;
    }

    if (session.user.role !== "user") {
      alert("Only users can apply for jobs");
      return;
    }

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedJobs(prev => new Set(prev).add(jobId));

        // Animation feedback
        const button = document.getElementById(`apply-btn-${jobId}`);
        if (button) {
          button.classList.add("applied-success");
          setTimeout(() => {
            button.classList.remove("applied-success");
          }, 2000);
        }

        // Update the job in the list
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === jobId
              ? {
                  ...job,
                  applicants: [...(job.applicants || []), { user: session.user.id }],
                  applicantCount: (job.applicantCount || job.applicants?.length || 0) + 1
                }
              : job
          )
        );
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Error applying for job. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return "Recently";
    }
  };

  const parseSkills = (skills) => {
    if (!skills) return [];

    if (Array.isArray(skills)) {
      return skills;
    }

    if (typeof skills === 'string') {
      return skills
        .split(/[,]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }

    return [];
  };

  // Loading skeleton with animations
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
                    <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-r from-white via-white to-white/95 backdrop-blur-sm border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[7%]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
                  <h1 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Discover Your Dream Job
                  </h1>
                </div>
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>

              <p className="text-lg text-gray-600 max-w-2xl">
                Explore <span className="font-semibold text-blue-600">{filteredJobs.length}</span> curated opportunities
                from top companies worldwide
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{jobs.filter(j => j.applicantCount > 50).length}</span> Hot Jobs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{jobs.filter(j => j.type === 'remote').length}</span> Remote Positions
                  </span>
                </div>
              </div>
            </div>

            {session?.user?.role === "recruiter" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                onClick={() => router.push("/jobs/post")}
              >
                <span className="relative flex items-center justify-center gap-2">
                  <span className="group-hover:rotate-180 transition-transform duration-300">🚀</span>
                  Post New Job
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:shadow"
              />
            </div>

            {/* Location Filter */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 outline-none shadow-sm hover:shadow"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300/50 rounded-xl hover:shadow transition-all duration-300"
            >
              <Filter className="w-5 h-5" />
              Filters
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ↓
              </motion.span>
            </motion.button>
          </div>

          {/* Job Type Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-300 ${
                        selectedType === type
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type === "all" ? "All Jobs" : type.replace("-", " ")}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredJobs.length}</span> of{" "}
            <span className="font-bold text-gray-900">{jobs.length}</span> jobs
          </p>
        </motion.div>

        {/* Jobs Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedType + searchTerm}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job, index) => {
              const jobSkills = parseSkills(job.skills);
              const isApplied = appliedJobs.has(job._id);

              return (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative"
                >
                  {/* Glow Effect on Hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
                    {/* Featured Badge */}
                    {job.applicantCount > 50 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          🔥 Hot Job
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Company Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl"></div>
                            <div className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-md">
                              {job.company?.logo ? (
                                <img
                                  src={job.company.logo}
                                  alt={job.company.name}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <Building className="w-7 h-7 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 font-medium">
                              {job.company?.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Job Type Badge */}
                      <div className="mb-6">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                          job.type === 'remote'
                            ? 'bg-green-100 text-green-800'
                            : job.type === 'hybrid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <Briefcase className="w-3 h-3 mr-2" />
                          {job.type || "Full-time"}
                        </span>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium text-gray-900 truncate">{job.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Salary</p>
                            <p className="font-medium text-gray-900">{job.salary || "Competitive"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Applicants</p>
                            <p className="font-medium text-gray-900">
                              {job.applicantCount || job.applicants?.length || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Posted</p>
                            <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="text-gray-600 line-clamp-2 mb-6 p-3 bg-gradient-to-r from-gray-50/50 to-transparent rounded-lg">
                        {job.description}
                      </p>

                      {/* Skills */}
                      {jobSkills.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-medium text-gray-700 mb-3">Required Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {jobSkills.slice(0, 4).map((skill, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200/50 hover:border-blue-300 transition-colors"
                              >
                                {skill}
                              </motion.span>
                            ))}
                            {jobSkills.length > 4 && (
                              <span className="px-3 py-1.5 text-gray-500 text-sm font-medium">
                                +{jobSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-6 border-t border-gray-200/50">
                        <motion.div whileHover={{ x: 5 }}>
                          <Link
                            href={`/jobs/${job._id}`}
                            className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
                          >
                            View Details
                            <motion.span
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="ml-2 inline-block"
                            >
                              <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                            </motion.span>
                          </Link>
                        </motion.div>

                        {session?.user?.role === "user" && (
                          <motion.button
                            id={`apply-btn-${job._id}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyJob(job._id)}
                            disabled={isApplied}
                            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                              isApplied
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-blue-500/25"
                            }`}
                          >
                            {isApplied ? (
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Applied
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Apply Now
                              </span>
                            )}

                            {/* Animated background on apply */}
                            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-xl opacity-50"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back soon for new opportunities!"}
            </p>
            {(searchTerm || locationFilter || selectedType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                  setSelectedType("all");
                  router.push("/jobs");
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating Action Button for Recruiters */}
      {session?.user?.role === "recruiter" && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/jobs/post")}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl z-50 group"
        >
          <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">
            ✨
          </span>
        </motion.button>
      )}

      {/* Add custom CSS for apply animation */}
      <style jsx>{`
        .applied-success {
          animation: successPulse 2s ease;
        }
        
        @keyframes successPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}

// Main page component with Suspense boundary
export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20"></div>
                    <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}