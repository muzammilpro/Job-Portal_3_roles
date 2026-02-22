"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Search,
  Briefcase,
  Building2,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Star,
  Target,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Featured jobs state
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalCompanies: 0,
    approvedCompanies: 0,
    totalApplicants: 0,
    totalApplications: 0,
    successRate: 0,
    totalHired: 0,
    loading: true,
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/homepage');
        const data = await res.json();
        if (data.success) {
          setStats({ ...data.stats, loading: false });
        } else {
          setStats(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Failed to fetch homepage stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  // Fetch featured jobs
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await fetch('/api/jobs/search?limit=6');
        const data = await res.json();
        if (data.success) {
          setFeaturedJobs(data.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    window.location.href = `/jobs?${params.toString()}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jobTitles = ["Frontend Developer", "UX Designer", "Data Scientist", "Product Manager"];
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to determine user role for UI
  const getUserRole = () => {
    if (!session?.user?.role) return null;
    
    // Handle multiple role naming conventions
    const role = session.user.role.toLowerCase();
    
    if (role === "admin" || role === "administrator") return "admin";
    if (role === "company" || role === "employer" || role === "recruiter") return "company";
    if (role === "user" || role === "applicant" || role === "candidate" || role === "jobseeker") return "applicant";
    
    return role;
  };

  const userRole = getUserRole();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              Trusted by {stats.loading ? "..." : `${stats.approvedCompanies.toLocaleString()}+`} companies
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Find Your
            <motion.span
              key={currentJobIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="block mt-2"
            >
              Dream {jobTitles[currentJobIndex]} Job
            </motion.span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join <span className="font-bold text-blue-600">50,000+</span> professionals and connect with
            <span className="font-bold text-purple-600">{stats.loading ? "..." : ` ${stats.approvedCompanies.toLocaleString()}+ `}</span>
            top companies hiring now. Your next career move starts here.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-2xl shadow-blue-200/50 border border-blue-100">
              <div className="flex-1 flex items-center px-6 py-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none text-lg placeholder-gray-400"
                />
              </div>
              <div className="flex-1 flex items-center px-6 py-4 border-l border-gray-100">
                <Target className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full outline-none text-lg placeholder-gray-400"
                />
              </div>
              <button type="submit" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search Jobs
              </button>
            </form>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-20"
          >
            {!session ? (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
                  >
                    Get Started
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link href="/signup/user">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center gap-3"
                  >
                    <Users className="w-5 h-5" />
                    Join Free
                  </motion.button>
                </Link>
              </>
            ) : userRole === "applicant" ? (
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  <Briefcase className="w-5 h-5" />
                  Browse {stats.loading ? "..." : `${stats.activeJobs.toLocaleString()}+`} Jobs
                </motion.button>
              </Link>
            ) : userRole === "company" ? (
              <Link href="/company/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  <Rocket className="w-5 h-5" />
                  Post a Job - Get Matched
                </motion.button>
              </Link>
            ) : userRole === "admin" ? (
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </motion.button>
              </Link>
            ) : (
              // Fallback for any other roles
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                  <Briefcase className="w-5 h-5" />
                  Browse Jobs
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { label: "Jobs Posted", value: stats.loading ? "..." : `${stats.totalJobs.toLocaleString()}+`, icon: Briefcase, color: "blue" },
              { label: "Companies", value: stats.loading ? "..." : `${stats.approvedCompanies.toLocaleString()}+`, icon: Building2, color: "purple" },
              { label: "Hired", value: stats.loading ? "..." : `${stats.totalHired.toLocaleString()}+`, icon: Users, color: "green" },
              { label: "Success Rate", value: stats.loading ? "..." : `${stats.successRate}%`, icon: TrendingUp, color: "orange" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${
                  stat.color === "blue" ? "bg-blue-100" :
                  stat.color === "purple" ? "bg-purple-100" :
                  stat.color === "green" ? "bg-green-100" :
                  "bg-orange-100"
                } mb-4`}>
                  <stat.icon className={`w-8 h-8 ${
                    stat.color === "blue" ? "text-blue-600" :
                    stat.color === "purple" ? "text-purple-600" :
                    stat.color === "green" ? "text-green-600" :
                    "text-orange-600"
                  }`} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Featured <span className="text-blue-600">Opportunities</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover your next career move from our latest job openings
          </p>
        </motion.div>

        {jobsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {job.company?.name || "Company"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {job.jobType}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {job.experienceLevel}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <Target className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>

                    {job.salary && (
                      <div className="text-green-600 font-semibold mb-4">
                        {job.salary}
                      </div>
                    )}

                    <Link href={`/jobs/${job._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        View Details
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-3"
                >
                  View All Jobs
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Jobs Available</h3>
            <p className="text-gray-500">Check back soon for new opportunities!</p>
          </div>
        )}
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Everything You Need to <span className="text-blue-600">Succeed</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powerful tools for job seekers, companies, and administrators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "For Job Seekers",
              description: "AI-powered job matching, personalized recommendations, and application tracking.",
              icon: Briefcase,
              color: "blue",
              features: ["Smart Job Matching", "Resume Builder", "Interview Prep", "Salary Insights"],
              gradient: "from-blue-500 to-cyan-500",
              link: "/jobs"
            },
            {
              title: "For Companies",
              description: "Advanced hiring tools, candidate screening, and employer branding.",
              icon: Building2,
              color: "purple",
              features: ["AI Screening", "Branded Career Pages", "Team Collaboration", "Analytics Dashboard"],
              gradient: "from-purple-500 to-pink-500",
              link: "/company/dashboard"
            },
            {
              title: "Admin Control",
              description: "Complete platform management, verification systems, and analytics.",
              icon: Shield,
              color: "gray",
              features: ["Company Verification", "Content Moderation", "User Management", "Platform Analytics"],
              gradient: "from-gray-700 to-gray-900",
              link: "/admin/dashboard"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 ${hoveredCard === index ? 'shadow-2xl' : ''
                }`}
            >
              <div className="p-8">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Star className="w-4 h-4 text-yellow-500 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`px-8 py-6 bg-gradient-to-r ${feature.gradient} bg-opacity-5`}>
                <Link
                  href={feature.link}
                  className="inline-flex items-center text-blue-600 font-semibold group"
                >
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Success <span className="text-purple-600">Stories</span>
            </h2>
            <p className="text-gray-600 text-lg">What our users say about us</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Senior Product Designer",
                company: "TechVision",
                content: "Found my dream remote job in 2 weeks! The AI matching is incredible.",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Hiring Manager",
                company: "CloudScale Inc.",
                content: "We hired 5 top developers in a month. The platform saved us 40+ hours of screening.",
                rating: 5
              },
              {
                name: "Alex Thompson",
                role: "Platform Admin",
                company: "StartupHub",
                content: "Managing thousands of users and jobs has never been this efficient.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands who've found their perfect match. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!session ? (
              <>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <Link href="/jobs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Browse Jobs
                  </motion.button>
                </Link>
              </>
            ) : userRole === "applicant" ? (
              <Link href="/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                >
                  Browse {stats.loading ? "..." : `${stats.activeJobs.toLocaleString()}+`} Jobs
                </motion.button>
              </Link>
            ) : userRole === "company" ? (
              <Link href="/company/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                >
                  Post Your First Job
                </motion.button>
              </Link>
            ) : (
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-gray-800 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
                >
                  Go to Dashboard
                </motion.button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}