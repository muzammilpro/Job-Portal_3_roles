// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();
//   const [companyStatus, setCompanyStatus] = useState(null);

//   useEffect(() => {
//     if (session?.user?.email) {
//       fetchCompanyStatus();
//     }
//   }, [session]);

//   const fetchCompanyStatus = async () => {
//     const res = await fetch("/api/company/status");
//     const data = await res.json();
//     setCompanyStatus(data.companyStatus);
//   };

//   if (status === "loading") {
//     return <p>Loading...</p>;
//   }

//   if (!session || session.user.role !== "company") {
//     return <h1>Access Denied</h1>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Company Dashboard</h1>

//       <p>
//         <strong>Company:</strong> {session.user.name}
//       </p>

//       <p>
//         <strong>Status:</strong>{" "}
//         {companyStatus === "approved" && (
//           <span style={{ color: "green" }}>Approved</span>
//         )}
//         {companyStatus === "pending" && (
//           <span style={{ color: "orange" }}>Pending Approval</span>
//         )}
//         {companyStatus === "rejected" && (
//           <span style={{ color: "red" }}>Rejected</span>
//         )}
//       </p>

//       <hr />

//       {/* ✅ APPROVED */}
//       {companyStatus === "approved" && (
//         <div>
//           <h2>Post a Job</h2>
//           <button onClick={() => alert("Job form goes here")}>
//             Post Job
//           </button>
//         </div>
//       )}

//       {/* ⏳ PENDING */}
//       {companyStatus === "pending" && (
//         <div>
//           <h2>Approval Pending</h2>
//           <p>
//             Your company is under review. You will be able to post jobs
//             once approved by the admin.
//           </p>
//         </div>
//       )}

//       {/* ❌ REJECTED */}
//       {companyStatus === "rejected" && (
//         <div>
//           <h2>Access Restricted</h2>
//           <p>
//             Your company has been rejected by the admin.
//             You cannot post jobs.
//           </p>
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
  const [companyStatus, setCompanyStatus] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "full-time",
    experienceLevel: "mid-level",
    applicationDeadline: "",
    requirements: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
  });

  // New state for applicant viewing and AI analysis
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState({});
  const [analyzingApplicant, setAnalyzingApplicant] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchCompanyStatus();
    }
  }, [session]);

  useEffect(() => {
    if (companyStatus === "approved") {
      fetchCompanyJobs();
    }
  }, [companyStatus]);

  const fetchCompanyStatus = async () => {
    try {
      const res = await fetch("/api/company/status");
      const data = await res.json();
      if (data.success) {
        setCompanyStatus(data.companyStatus);
      }
    } catch (error) {
      console.error("Error fetching company status:", error);
    }
  };

  const fetchCompanyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch("/api/company/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);

        // Calculate stats
        const totalApplicants = data.jobs.reduce((total, job) =>
          total + (job.applicants?.length || 0), 0
        );

        setStats({
          totalJobs: data.jobs.length,
          activeJobs: data.jobs.filter(job => !job.isClosed).length,
          totalApplicants: totalApplicants
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm({
      ...jobForm,
      [name]: value,
    });
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/company/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobForm),
      });

      const data = await res.json();

      if (data.success) {
        const newJob = data.job;
        setJobs([newJob, ...jobs]);

        // Update stats
        setStats(prev => ({
          ...prev,
          totalJobs: prev.totalJobs + 1,
          activeJobs: prev.activeJobs + 1
        }));

        setJobForm({
          title: "",
          description: "",
          location: "",
          salary: "",
          jobType: "full-time",
          experienceLevel: "mid-level",
          applicationDeadline: "",
          requirements: "",
          skills: "",
        });
        setShowJobForm(false);
        alert("Job posted successfully!");
      } else {
        alert(data.message || "Failed to post job. Please try again.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/company/jobs/${jobId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        const deletedJob = jobs.find(job => job._id === jobId);
        setJobs(jobs.filter(job => job._id !== jobId));

        // Update stats
        setStats(prev => ({
          ...prev,
          totalJobs: prev.totalJobs - 1,
          activeJobs: prev.activeJobs - (deletedJob?.isClosed ? 0 : 1),
          totalApplicants: prev.totalApplicants - (deletedJob?.applicants?.length || 0)
        }));

        alert("Job deleted successfully!");
      } else {
        alert(data.message || "Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = !currentStatus; // Toggle isClosed

    try {
      const res = await fetch(`/api/company/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isClosed: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setJobs(jobs.map(job =>
          job._id === jobId ? { ...job, isClosed: newStatus } : job
        ));

        // Update stats
        setStats(prev => ({
          ...prev,
          activeJobs: newStatus ? prev.activeJobs - 1 : prev.activeJobs + 1
        }));

        alert(`Job ${newStatus ? "closed" : "re-opened"} successfully!`);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleViewApplicants = async (job) => {
    if (!job.applicants || job.applicants.length === 0) {
      alert("No applicants yet for this job.");
      return;
    }

    setSelectedJob(job);
    setShowApplicantsModal(true);
    setLoadingApplicants(true);

    try {
      // Fetch detailed applicant information
      const applicantDetails = await Promise.all(
        job.applicants.map(async (applicant) => {
          const res = await fetch(`/api/company/applicant/${applicant.user}`);
          const data = await res.json();
          return {
            ...applicant,
            details: data.success ? data.applicant : null,
          };
        })
      );

      setApplicants(applicantDetails);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      alert("Error loading applicants. Please try again.");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleGetAISuggestion = async (jobId, applicantId, applicantName) => {
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

  if (status === "loading") {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "company") {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1 style={{ color: "red" }}>Access Denied</h1>
        <p>You must be logged in as a company to access this page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Dashboard Header */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h1 style={{ marginBottom: "10px", color: "#333" }}>Company Dashboard</h1>

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "5px 0" }}>
              <strong>Company:</strong> {session.user.name}
            </p>
            <p style={{ margin: "5px 0" }}>
              <strong>Email:</strong> {session.user.email}
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ margin: "5px 0" }}>
              <strong>Account Status:</strong>{" "}
              {companyStatus === "approved" && (
                <span style={{
                  color: "green",
                  backgroundColor: "#e6ffe6",
                  padding: "3px 10px",
                  borderRadius: "15px",
                  fontSize: "0.9em"
                }}>
                  ✓ Approved
                </span>
              )}
              {companyStatus === "pending" && (
                <span style={{
                  color: "orange",
                  backgroundColor: "#fff9e6",
                  padding: "3px 10px",
                  borderRadius: "15px",
                  fontSize: "0.9em"
                }}>
                  ⏳ Pending Approval
                </span>
              )}
              {companyStatus === "rejected" && (
                <span style={{
                  color: "red",
                  backgroundColor: "#ffe6e6",
                  padding: "3px 10px",
                  borderRadius: "15px",
                  fontSize: "0.9em"
                }}>
                  ✗ Rejected
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ APPROVED COMPANY CONTENT */}
      {companyStatus === "approved" && (
        <div>
          {/* Stats Overview */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#0070f3" }}>{stats.totalJobs}</h3>
              <p style={{ margin: 0, color: "#666" }}>Total Jobs</p>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#4CAF50" }}>{stats.activeJobs}</h3>
              <p style={{ margin: 0, color: "#666" }}>Active Jobs</p>
            </div>
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#ff9800" }}>{stats.totalApplicants}</h3>
              <p style={{ margin: 0, color: "#666" }}>Total Applicants</p>
            </div>
          </div>

          {/* Header with Post Job Button */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}>
            <div>
              <h2 style={{ margin: 0 }}>Job Management</h2>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Manage your job postings and applications
              </p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              style={{
                padding: "10px 25px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1em",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ fontSize: "1.2em" }}>+</span> Post New Job
            </button>
          </div>

          {/* Job Posting Form Modal */}
          {showJobForm && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                width: "90%",
                maxWidth: "800px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <h2 style={{ margin: 0 }}>Post a New Job</h2>
                  <button
                    onClick={() => setShowJobForm(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5em",
                      cursor: "pointer",
                      color: "#666"
                    }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitJob}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "20px"
                  }}>
                    <div>
                      <label>Job Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={jobForm.title}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Senior Software Engineer"
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                      />
                    </div>
                    <div>
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={jobForm.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Remote, New York, etc."
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label>Job Description *</label>
                    <textarea
                      name="description"
                      value={jobForm.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Detailed job description, responsibilities..."
                      style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label>Requirements & Skills</label>
                    <textarea
                      name="requirements"
                      value={jobForm.requirements}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Required qualifications, skills, experience..."
                      style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                    />
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "30px"
                  }}>
                    <div>
                      <label>Salary Range</label>
                      <input
                        type="text"
                        name="salary"
                        value={jobForm.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., $80,000 - $120,000"
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                      />
                    </div>
                    <div>
                      <label>Application Deadline</label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={jobForm.applicationDeadline}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
                    <button
                      type="button"
                      onClick={() => setShowJobForm(false)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: loading ? "#ccc" : "#0070f3",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    >
                      {loading ? "Posting..." : "Post Job"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Applicants Modal with AI Analysis */}
          {showApplicantsModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              overflow: "auto",
            }}>
              <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                width: "95%",
                maxWidth: "1200px",
                maxHeight: "90vh",
                overflowY: "auto",
                margin: "20px",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "15px"
                }}>
                  <div>
                    <h2 style={{ margin: 0, marginBottom: "5px" }}>
                      Applicants for: {selectedJob?.title}
                    </h2>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9em" }}>
                      {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowApplicantsModal(false);
                      setApplicants([]);
                      setAiAnalysis({});
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5em",
                      cursor: "pointer",
                      color: "#666",
                      padding: "5px 10px"
                    }}
                  >
                    ✕
                  </button>
                </div>

                {loadingApplicants ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <p>Loading applicants...</p>
                  </div>
                ) : applicants.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <p>No applicants found.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {applicants.map((applicant) => {
                      const details = applicant.details;
                      const analysis = aiAnalysis[applicant.user];
                      const isAnalyzing = analyzingApplicant === applicant.user;

                      return (
                        <div
                          key={applicant.user}
                          style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "10px",
                            padding: "20px",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          {/* Applicant Header */}
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "15px"
                          }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: "0 0 5px 0" }}>
                                {details?.name || "Unknown"}
                              </h3>
                              <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "0.9em" }}>
                                📧 {details?.email || "No email"}
                              </p>
                              <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "0.9em" }}>
                                📅 Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                              </p>
                              <span style={{
                                padding: "3px 10px",
                                backgroundColor: applicant.status === "accepted" ? "#e6ffe6" :
                                  applicant.status === "shortlisted" ? "#fff9e6" :
                                    applicant.status === "rejected" ? "#ffe6e6" : "#e6f3ff",
                                color: applicant.status === "accepted" ? "#2e7d32" :
                                  applicant.status === "shortlisted" ? "#f57c00" :
                                    applicant.status === "rejected" ? "#c62828" : "#1976d2",
                                borderRadius: "15px",
                                fontSize: "0.85em",
                                fontWeight: "500",
                                display: "inline-block",
                                marginTop: "5px"
                              }}>
                                Status: {applicant.status}
                              </span>
                            </div>

                            <button
                              onClick={() => handleGetAISuggestion(selectedJob._id, applicant.user, details?.name)}
                              disabled={isAnalyzing || analysis}
                              style={{
                                padding: "10px 20px",
                                backgroundColor: analysis ? "#4CAF50" : isAnalyzing ? "#ccc" : "#9C27B0",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: isAnalyzing || analysis ? "not-allowed" : "pointer",
                                fontSize: "0.9em",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                              }}
                            >
                              {isAnalyzing ? "🤖 Analyzing..." :
                                analysis ? "✓ AI Analyzed" :
                                  "🤖 Get AI Suggestion"}
                            </button>
                          </div>

                          {/* Applicant Profile Summary */}
                          {details && (
                            <div style={{
                              backgroundColor: "white",
                              padding: "15px",
                              borderRadius: "8px",
                              marginBottom: "15px"
                            }}>
                              <div style={{ marginBottom: "10px" }}>
                                <strong>Location:</strong> {details.profile?.location || "Not specified"}
                              </div>
                              {details.profile?.skills && details.profile.skills.length > 0 && (
                                <div style={{ marginBottom: "10px" }}>
                                  <strong>Skills:</strong>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>
                                    {details.profile.skills.map((skill, idx) => (
                                      <span
                                        key={idx}
                                        style={{
                                          padding: "3px 10px",
                                          backgroundColor: "#e3f2fd",
                                          color: "#1976d2",
                                          borderRadius: "12px",
                                          fontSize: "0.85em"
                                        }}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {details.profile?.experience && details.profile.experience.length > 0 && (
                                <div>
                                  <strong>Experience:</strong>
                                  <div style={{ marginTop: "5px", fontSize: "0.9em" }}>
                                    {details.profile.experience.slice(0, 2).map((exp, idx) => (
                                      <div key={idx} style={{ marginBottom: "5px", color: "#555" }}>
                                        • {exp.title} at {exp.company} ({exp.startDate} - {exp.current ? "Present" : exp.endDate})
                                      </div>
                                    ))}
                                    {details.profile.experience.length > 2 && (
                                      <div style={{ color: "#888", fontSize: "0.85em" }}>
                                        +{details.profile.experience.length - 2} more...
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Analysis Results */}
                          {analysis && (
                            <div style={{
                              backgroundColor: "white",
                              border: `2px solid ${analysis.recommendation === "Highly Recommended" ? "#4CAF50" :
                                  analysis.recommendation === "Recommended" ? "#2196F3" :
                                    analysis.recommendation === "Consider" ? "#FF9800" : "#f44336"
                                }`,
                              borderRadius: "8px",
                              padding: "20px",
                              marginTop: "15px"
                            }}>
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "15px"
                              }}>
                                <h4 style={{ margin: 0, color: "#333" }}>
                                  🤖 AI Analysis
                                </h4>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{
                                    fontSize: "2em",
                                    fontWeight: "bold",
                                    color: analysis.score >= 75 ? "#4CAF50" :
                                      analysis.score >= 50 ? "#FF9800" : "#f44336"
                                  }}>
                                    {analysis.score}%
                                  </div>
                                  <div style={{ fontSize: "0.8em", color: "#666" }}>
                                    Suitability Score
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div style={{
                                width: "100%",
                                height: "10px",
                                backgroundColor: "#f0f0f0",
                                borderRadius: "5px",
                                overflow: "hidden",
                                marginBottom: "15px"
                              }}>
                                <div style={{
                                  width: `${analysis.score}%`,
                                  height: "100%",
                                  backgroundColor: analysis.score >= 75 ? "#4CAF50" :
                                    analysis.score >= 50 ? "#FF9800" : "#f44336",
                                  transition: "width 0.5s ease"
                                }}></div>
                              </div>

                              {/* Recommendation Badge */}
                              <div style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                backgroundColor:
                                  analysis.recommendation === "Highly Recommended" ? "#e8f5e9" :
                                    analysis.recommendation === "Recommended" ? "#e3f2fd" :
                                      analysis.recommendation === "Consider" ? "#fff3e0" : "#ffebee",
                                color:
                                  analysis.recommendation === "Highly Recommended" ? "#2e7d32" :
                                    analysis.recommendation === "Recommended" ? "#1976d2" :
                                      analysis.recommendation === "Consider" ? "#e65100" : "#c62828",
                                borderRadius: "20px",
                                fontWeight: "bold",
                                fontSize: "0.95em",
                                marginBottom: "15px"
                              }}>
                                {analysis.recommendation}
                              </div>

                              {/* Highlights */}
                              {analysis.highlights && analysis.highlights.length > 0 && (
                                <div style={{ marginBottom: "15px" }}>
                                  <h5 style={{ margin: "0 0 10px 0", color: "#4CAF50", fontSize: "1em" }}>
                                    ✓ Key Highlights
                                  </h5>
                                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                    {analysis.highlights.map((highlight, idx) => (
                                      <li key={idx} style={{ marginBottom: "5px", color: "#555" }}>
                                        {highlight}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Concerns */}
                              {analysis.concerns && analysis.concerns.length > 0 && (
                                <div style={{ marginBottom: "15px" }}>
                                  <h5 style={{ margin: "0 0 10px 0", color: "#f44336", fontSize: "1em" }}>
                                    ⚠ Potential Concerns
                                  </h5>
                                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                                    {analysis.concerns.map((concern, idx) => (
                                      <li key={idx} style={{ marginBottom: "5px", color: "#555" }}>
                                        {concern}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Reasoning */}
                              {analysis.reasoning && (
                                <div style={{
                                  backgroundColor: "#f5f5f5",
                                  padding: "12px",
                                  borderRadius: "6px",
                                  borderLeft: "3px solid #9C27B0"
                                }}>
                                  <strong style={{ color: "#9C27B0" }}>AI Assessment:</strong>
                                  <p style={{ margin: "5px 0 0 0", color: "#555", lineHeight: "1.6" }}>
                                    {analysis.reasoning}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Jobs List */}
          {loadingJobs ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "50px",
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#666", marginBottom: "10px" }}>No jobs posted yet</h3>
              <p style={{ color: "#999", marginBottom: "20px" }}>
                Start by posting your first job opening to attract candidates!
              </p>
              <button
                onClick={() => setShowJobForm(true)}
                style={{
                  padding: "10px 25px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {jobs.map((job) => (
                <div key={job._id} style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  padding: "25px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.3em" }}>{job.title}</h3>
                        <span style={{
                          padding: "3px 10px",
                          backgroundColor: job.isClosed ? "#ffe6e6" : "#e6ffe6",
                          color: job.isClosed ? "#c62828" : "#2e7d32",
                          borderRadius: "15px",
                          fontSize: "0.8em",
                          fontWeight: "500"
                        }}>
                          {job.isClosed ? "Closed" : "Active"}
                        </span>
                      </div>

                      {job.location && (
                        <div style={{ marginBottom: "10px" }}>
                          <span style={{ color: "#666", fontSize: "0.9em" }}>📍 Location: </span>
                          <span style={{ fontWeight: "500" }}>{job.location}</span>
                        </div>
                      )}

                      <div style={{ marginBottom: "15px" }}>
                        <p style={{
                          margin: "10px 0",
                          color: "#555",
                          lineHeight: "1.6"
                        }}>
                          {job.description.length > 200
                            ? `${job.description.substring(0, 200)}...`
                            : job.description}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                        <div style={{ color: "#666", fontSize: "0.9em" }}>
                          <strong>Applicants:</strong> {job.applicants?.length || 0}
                        </div>
                        <div style={{ color: "#888", fontSize: "0.9em" }}>
                          <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "20px" }}>
                      <button
                        onClick={() => handleToggleJobStatus(job._id, job.isClosed)}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: job.isClosed ? "#4CAF50" : "#ff9800",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9em",
                          fontWeight: "500"
                        }}
                      >
                        {job.isClosed ? "Re-open Job" : "Close Job"}
                      </button>
                      <button
                        onClick={() => handleViewApplicants(job)}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9em",
                          fontWeight: "500"
                        }}
                      >
                        View Applicants ({job.applicants?.length || 0})
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "#ff4444",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "0.9em",
                          fontWeight: "500"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ⏳ PENDING */}
      {companyStatus === "pending" && (
        <div style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "3em", marginBottom: "20px", color: "#ff9800" }}>⏳</div>
          <h2 style={{ color: "#333" }}>Approval Pending</h2>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Your company registration is currently under review by our admin team.
            You will be able to post jobs once your company has been approved.
            This process typically takes 1-2 business days.
          </p>
        </div>
      )}

      {/* ❌ REJECTED */}
      {companyStatus === "rejected" && (
        <div style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "3em", marginBottom: "20px", color: "#f44336" }}>❌</div>
          <h2 style={{ color: "#333" }}>Access Restricted</h2>
          <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Your company registration has been rejected by the admin team.
            You cannot post jobs or access company features.
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useSession } from "next-auth/react";
// import { useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session } = useSession();
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");

//   const postJob = async () => {
//     const res = await fetch("/api/jobs", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, description, location }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Job posted successfully");
//       setTitle("");
//       setDescription("");
//       setLocation("");
//     } else {
//       alert(data.message);
//     }
//   };

//   if (!session || session.user.role !== "company") {
//     return <h1>Access Denied</h1>;
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Company Dashboard</h1>

//       <h2>Post a Job</h2>

//       <input
//         placeholder="Job Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <textarea
//         placeholder="Job Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       <input
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//       />

//       <button onClick={postJob}>Post Job</button>
//     </div>
//   );
// }



// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function CompanyDashboard() {
//   const { data: session, status } = useSession();

//   const [companyStatus, setCompanyStatus] = useState("pending");
//   const [loading, setLoading] = useState(true);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");

//   useEffect(() => {
//     if (session?.user?.role === "company") {
//       fetchCompanyStatus();
//     }
//   }, [session]);

//   const fetchCompanyStatus = async () => {
//     const res = await fetch("/api/company/status");
//     const data = await res.json();

//     // SAFETY FALLBACK
//     setCompanyStatus(data?.status || "pending");
//     setLoading(false);
//   };

//   const postJob = async () => {
//     if (companyStatus !== "approved") {
//       alert("Your company is not approved to post jobs.");
//       return;
//     }

//     const res = await fetch("/api/jobs", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, description, location }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("Job posted successfully");
//       setTitle("");
//       setDescription("");
//       setLocation("");
//     } else {
//       alert(data.message);
//     }
//   };

//   if (status === "loading" || loading) {
//     return <p>Loading dashboard...</p>;
//   }

//   if (!session || session.user.role !== "company") {
//     return <h1>Access Denied</h1>;
//   }

//   const statusColor =
//     companyStatus === "approved"
//       ? "green"
//       : companyStatus === "rejected"
//       ? "red"
//       : "orange";

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Company Dashboard</h1>

//       {/* COMPANY STATUS */}
//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         <p>
//           <strong>Company Status:</strong>{" "}
//           <span style={{ color: statusColor, fontWeight: "bold" }}>
//             {companyStatus ? companyStatus.toUpperCase() : "PENDING"}
//           </span>
//         </p>

//         {companyStatus === "pending" && (
//           <p>Your account is under admin review.</p>
//         )}

//         {companyStatus === "rejected" && (
//           <p>Your company was rejected. You cannot post jobs.</p>
//         )}
//       </div>

//       {/* JOB POST FORM */}
//       <h2>Post a Job</h2>

//       <input
//         placeholder="Job Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         disabled={companyStatus !== "approved"}
//       />

//       <textarea
//         placeholder="Job Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         disabled={companyStatus !== "approved"}
//       />

//       <input
//         placeholder="Location"
//         value={location}
//         onChange={(e) => setLocation(e.target.value)}
//         disabled={companyStatus !== "approved"}
//       />

//       <br />

//       <button
//         onClick={postJob}
//         disabled={companyStatus !== "approved"}
//         style={{
//           marginTop: "10px",
//           backgroundColor:
//             companyStatus === "approved" ? "blue" : "gray",
//           color: "white",
//           cursor:
//             companyStatus === "approved" ? "pointer" : "not-allowed",
//         }}
//       >
//         Post Job
//       </button>
//     </div>
//   );
// }


// "use client";

// import { useEffect, useState } from "react";

// export default function CompanyPage() {
//   const [companyStatus, setCompanyStatus] = useState(null);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const res = await fetch("/api/company/status", {
//           credentials: "include",
//         });

//         console.log("Status API:", res.status);

//         if (!res.ok) return;

//         const data = await res.json();
//         setCompanyStatus(data.companyStatus);
//       } catch (err) {
//         console.error("Failed to fetch company status", err);
//       }
//     };

//     fetchStatus();
//   }, []);

//   if (!companyStatus) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>

//       {companyStatus === "pending" && (
//         <p className="text-yellow-600 font-semibold">
//           ⏳ Your company account is pending approval.
//         </p>
//       )}

//       {companyStatus === "approved" && (
//         <p className="text-green-600 font-semibold">
//           ✅ Your company account is approved.
//         </p>
//       )}

//       {companyStatus === "rejected" && (
//         <p className="text-red-600 font-semibold">
//           ❌ Your company account has been rejected.
//         </p>
//       )}
//     </div>
//   );
// }
