"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Building2,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingCompany, setRejectingCompany] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/companies");
    const data = await res.json();
    setCompanies(data);
    setLoading(false);
  };

  const updateStatus = async (userId, status, rejectionReason = null) => {
    await fetch("/api/admin/company-status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status, rejectionReason }),
    });
    fetchCompanies();
  };

  const handleRejectClick = (company) => {
    setRejectingCompany(company);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async () => {
    if (rejectingCompany) {
      await updateStatus(rejectingCompany._id, "rejected", rejectionReason);
      setShowRejectModal(false);
      setRejectingCompany(null);
      setRejectionReason("");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
    };

    const icons = {
      approved: <CheckCircle2 className="w-4 h-4" />,
      rejected: <XCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.pending
          }`}
      >
        {icons[status] || icons.pending}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.companyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: companies.length,
    approved: companies.filter(c => c.companyStatus === "approved").length,
    pending: companies.filter(c => c.companyStatus === "pending").length,
    rejected: companies.filter(c => c.companyStatus === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-[5%]">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Company Management</h1>
          <p className="text-slate-600">Review and manage company registrations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Companies</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <Building2 className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Approved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-amber-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Company</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Contact</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right p-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map((company) => (
                    <tr key={company._id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {company.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{company.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{company.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(company.companyStatus)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedCompany(company);
                              setShowProfileModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                          >
                            <Building2 className="w-4 h-4" />
                            View Profile
                          </button>
                          <button
                            onClick={() => updateStatus(company._id, "approved")}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={company.companyStatus === "approved"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectClick(company)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={company.companyStatus === "rejected"}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No companies found</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PROFILE MODAL */}
        {showProfileModal && selectedCompany && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => {
              setShowProfileModal(false);
              setSelectedCompany(null);
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold">
                    {selectedCompany.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedCompany.name}
                    </h2>
                    <p className="text-xs text-blue-100">
                      Company Profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedCompany(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* BODY */}
              <div className="p-6 space-y-6">

                {/* STATUS */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(selectedCompany.companyStatus)}
                  <div className="text-xs text-slate-400 text-right">
                    <p>Created: {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(selectedCompany.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="Email" value={selectedCompany.email} icon={<Mail />} />
                  <InfoCard label="Website" value={selectedCompany.companyProfile?.website || "Not provided"} />
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard label="Industry" value={selectedCompany.companyProfile?.industry || "Not specified"} />
                  <InfoCard label="Company Size" value={selectedCompany.companyProfile?.size || "Not specified"} />
                </div>

                {/* DESCRIPTION */}
                <InfoBlock
                  label="Description"
                  value={selectedCompany.companyProfile?.description || "No description provided."}
                />

                {/* APPROVAL DOCUMENT */}
                <div className="bg-slate-50 rounded-xl p-4 border">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Approval Document
                  </p>

                  {selectedCompany.companyProfile?.approvalDocument ? (
                    selectedCompany.companyProfile?.approvalDocumentType?.includes("pdf") ? (
                      <a
                        href={selectedCompany.companyProfile.approvalDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 underline"
                      >
                        <FileText className="w-4 h-4" />
                        View PDF Document
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <img
                        src={selectedCompany.companyProfile.approvalDocument}
                        alt="Approval Document"
                        className="max-w-sm rounded-lg border"
                      />
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No document uploaded
                    </p>
                  )}
                </div>


                {/* SOCIAL LINKS */}
                {selectedCompany.companyProfile?.socialLinks && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SocialLink label="GitHub" url={selectedCompany.companyProfile.socialLinks.github} />
                    <SocialLink label="LinkedIn" url={selectedCompany.companyProfile.socialLinks.linkedin} />
                    <SocialLink label="Portfolio" url={selectedCompany.companyProfile.socialLinks.portfolio} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && rejectingCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowRejectModal(false);
            setRejectingCompany(null);
            setRejectionReason("");
          }}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-6 py-4 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">Reject Company</h3>
              <p className="text-red-100 text-sm mt-1">
                Rejecting: {rejectingCompany.name}
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                placeholder="Enter the reason for rejection. This will be visible to the company..."
              />
              <p className="text-xs text-slate-500 mt-2">
                Providing a clear rejection reason helps companies understand what needs to be improved.
              </p>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectingCompany(null);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transition shadow-sm"
              >
                Reject Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── SMALL COMPONENTS ───────── */

const InfoCard = ({ label, value, icon }) => (
  <div className="bg-slate-50 rounded-xl p-4 border">
    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{label}</p>
    <p className="flex items-center gap-2 text-sm text-slate-800">
      {icon && <span className="w-4 h-4">{icon}</span>}
      {value}
    </p>
  </div>
);

const InfoBlock = ({ label, value }) => (
  <div className="bg-slate-50 rounded-xl p-4 border">
    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{label}</p>
    <p className="text-sm text-slate-800 whitespace-pre-wrap">{value}</p>
  </div>
);

const SocialLink = ({ label, url }) => (
  <div className="bg-slate-50 rounded-xl p-4 border text-sm">
    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{label}</p>
    {url ? (
      <a
        href={url}
        target="_blank"
        className="text-blue-600 underline break-all"
      >
        {url}
      </a>
    ) : (
      <p className="text-slate-400">Not provided</p>
    )}
  </div>
);
