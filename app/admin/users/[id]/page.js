"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiShield,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiFileText,
  FiGlobe,
  FiLinkedin,
  FiTwitter,
  FiGithub,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiSettings,
  FiTrendingUp,
  FiDollarSign,
  FiAward,
  FiBook,
  FiCode,
  FiUsers,
  FiFile,
  FiUpload,
  FiDownload,
  FiFilePlus,
  FiFileMinus,
  FiHardDrive
} from "react-icons/fi";
import {
  MdAdminPanelSettings,
  MdBusiness,
  MdPerson,
  MdVerified,
  MdWarning,
  MdWork,
  MdSchool,
  MdDescription,
  MdAttachment,
  MdPictureAsPdf,
  MdImage,
  MdInsertDriveFile
} from "react-icons/md";

export default function UserProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setEditableUser(data.user);
          addNotification("User profile loaded successfully", "success");
        } else {
          throw new Error(data.error || "Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        addNotification("Failed to load user profile", "error");
        router.push("/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, router]);

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editableUser),
      });

      const data = await response.json();

      if (data.success) {
        setUser(editableUser);
        setIsEditing(false);
        addNotification("Profile updated successfully", "success");
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error) {
      addNotification(error.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditableUser(user);
    setIsEditing(false);
  };

  // Handle input change for nested objects
  const handleInputChange = (path, value) => {
    setEditableUser(prev => {
      const newUser = { ...prev };
      const keys = path.split('.');
      let current = newUser;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newUser;
    });
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(prev => ({ ...prev, companyStatus: newStatus }));
        setEditableUser(prev => ({ ...prev, companyStatus: newStatus }));
        addNotification(`Status updated to ${newStatus}`, "success");
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      addNotification(error.message || "Failed to update status", "error");
    }
  };

  // Handle role change
  const handleRoleChange = async (newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(prev => ({ ...prev, role: newRole }));
        setEditableUser(prev => ({ ...prev, role: newRole }));
        addNotification(`Role updated to ${newRole}`, "success");
      } else {
        throw new Error(data.error || "Failed to update role");
      }
    } catch (error) {
      addNotification(error.message || "Failed to update role", "error");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <MdAdminPanelSettings className="text-lg" />;
      case 'company': return <MdBusiness className="text-lg" />;
      case 'applicant': return <MdPerson className="text-lg" />;
      default: return <FiUser className="text-lg" />;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheckCircle className="text-emerald-500" />;
      case 'pending': return <FiClock className="text-amber-500" />;
      case 'rejected': return <MdWarning className="text-rose-500" />;
      default: return <FiActivity className="text-gray-400" />;
    }
  };

  // Get document icon based on mime type or file extension
  const getDocumentIcon = (document) => {
    if (!document) return <FiFile className="text-gray-400" />;
    
    const fileName = document.fileName || '';
    const fileType = document.fileType || '';
    
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) {
      return <MdPictureAsPdf className="text-rose-500 text-xl" />;
    } else if (fileType.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName)) {
      return <MdImage className="text-blue-500 text-xl" />;
    } else if (fileType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return <FiFileText className="text-indigo-500 text-xl" />;
    } else {
      return <MdInsertDriveFile className="text-gray-500 text-xl" />;
    }
  };

  // Download document
  const downloadDocument = (document) => {
    if (!document) {
      addNotification("No document available", "error");
      return;
    }

    try {
      // Handle base64 data
      if (document.fileData) {
        // Determine MIME type
        let mimeType = document.fileType || 'application/octet-stream';
        
        // Create data URL
        const dataUrl = document.fileData.startsWith('data:') 
          ? document.fileData 
          : `data:${mimeType};base64,${document.fileData}`;
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = document.fileName || `document-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        addNotification(`Downloaded: ${document.fileName}`, "success");
      } 
      // Handle URL
      else if (document.url) {
        const link = document.createElement('a');
        link.href = document.url;
        link.download = document.fileName || `document-${Date.now()}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      else {
        addNotification("Document data not available", "error");
      }
    } catch (error) {
      console.error("Download error:", error);
      addNotification("Failed to download document", "error");
    }
  };

  // Open document in new tab for viewing
  const viewDocument = (document) => {
    if (!document) return;

    try {
      if (document.fileData) {
        let mimeType = document.fileType || 'application/octet-stream';
        const dataUrl = document.fileData.startsWith('data:') 
          ? document.fileData 
          : `data:${mimeType};base64,${document.fileData}`;
        
        window.open(dataUrl, '_blank');
      } else if (document.url) {
        window.open(document.url, '_blank');
      }
    } catch (error) {
      console.error("View error:", error);
      addNotification("Failed to open document", "error");
    }
  };

  // Check if company has approval documents
  const hasApprovalDocuments = () => {
    return user?.companyProfile?.approvalDocuments?.length > 0 || 
           user?.companyProfile?.approvalDocument || 
           user?.companyProfile?.verificationDocuments?.length > 0;
  };

  // Get all approval documents
  const getApprovalDocuments = () => {
    const documents = [];
    
    // Check for approvalDocuments array
    if (user?.companyProfile?.approvalDocuments?.length > 0) {
      documents.push(...user.companyProfile.approvalDocuments);
    }
    
    // Check for single approvalDocument
    if (user?.companyProfile?.approvalDocument) {
      documents.push({
        fileName: user.companyProfile.approvalDocumentName || 'approval-document.pdf',
        fileData: user.companyProfile.approvalDocument,
        fileType: user.companyProfile.approvalDocumentType || 'application/pdf',
        fileSize: user.companyProfile.approvalDocumentSize,
        uploadedAt: user.companyProfile.approvalDocumentUploadedAt,
        status: user.companyProfile.approvalDocumentStatus || user.companyStatus
      });
    }
    
    // Check for verificationDocuments
    if (user?.companyProfile?.verificationDocuments?.length > 0) {
      documents.push(...user.companyProfile.verificationDocuments);
    }
    
    return documents;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-700">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center">
            <FiUser className="text-3xl text-rose-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-600 text-sm mb-4">The user you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg 
              hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium text-sm"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const approvalDocuments = getApprovalDocuments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              px-4 py-3 rounded-lg shadow-xl backdrop-blur-lg transform transition-all duration-300
              animate-slideInRight
              ${notification.type === "success"
                ? "bg-gradient-to-r from-emerald-500/95 via-green-500/95 to-emerald-600/95 text-white border border-emerald-400/20"
                : "bg-gradient-to-r from-rose-500/95 via-red-500/95 to-rose-600/95 text-white border border-rose-400/20"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">
                {notification.type === "success" ? "✓" : "✗"}
              </span>
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
            <div className="h-0.5 mt-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 animate-progress"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="pt-[5%]">
            <button
              onClick={() => router.push("/admin/users")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-2"
            >
              ← Back to Users
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600 text-sm mt-1">Manage user details and permissions</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg 
                hover:from-blue-600 hover:to-cyan-700 active:scale-95 transition-all duration-200 
                shadow-md hover:shadow-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {isEditing ? (
                <>
                  <FiSave className={isSaving ? 'animate-spin' : ''} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </>
              ) : (
                <>
                  <FiEdit2 />
                  Edit Profile
                </>
              )}
            </button>

            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 
                  active:scale-95 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <FiX />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 
                flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase()}
                {user?.profile?.profileImage && (
                  <img
                    src={`data:image/jpeg;base64,${user.profile.profileImage}`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 
                  flex items-center justify-center text-white">
                  {getRoleIcon(user.role)}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                      user.role === 'company' ? 'bg-violet-100 text-violet-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>

                    {(user.role === 'company' || user.companyStatus) && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.companyStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        user.companyStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {getStatusIcon(user.companyStatus)}
                        {user.companyStatus ? user.companyStatus.charAt(0).toUpperCase() + user.companyStatus.slice(1) : 'No Status'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <FiMail className="text-gray-400" />
                      <span>{user.email}</span>
                    </div>

                    {(user?.profile?.phone || user?.companyProfile?.phone) && (
                      <div className="flex items-center gap-1.5">
                        <FiPhone className="text-gray-400" />
                        <span>{user?.profile?.phone || user?.companyProfile?.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-gray-400" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  {(user.role === "company") && (
                    <select
                      value={user.companyStatus || ""}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 
                        focus:ring-blue-500 transition-all duration-200 outline-none bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  )}

                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 
                      focus:ring-blue-500 transition-all duration-200 outline-none bg-white"
                  >
                    <option value="applicant">Applicant</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Additional Info */}
              {(user?.companyProfile?.companyName || user?.profile?.location || user?.companyProfile?.location) && (
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                  {(user.role === 'company' && user?.companyProfile?.description) && (
                    <div className="flex items-center gap-1.5">
                      <FiBriefcase className="text-gray-400" />
                      <span className="text-sm text-gray-700">{user.companyProfile.description.substring(0, 50)}...</span>
                    </div>
                  )}

                  {(user?.profile?.location || user?.companyProfile?.location) && (
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="text-gray-400" />
                      <span className="text-sm text-gray-700">{user?.profile?.location || user?.companyProfile?.location}</span>
                    </div>
                  )}

                  {user?.companyProfile?.website && (
                    <div className="flex items-center gap-1.5">
                      <FiGlobe className="text-gray-400" />
                      <a
                        href={user.companyProfile.website.startsWith('http') ? user.companyProfile.website : `https://${user.companyProfile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
            <div className="border-b border-gray-200/50">
              <nav className="flex space-x-4 px-6 overflow-x-auto" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Details
                </button>
                {user.role === "applicant" && (
                  <button
                    onClick={() => setActiveTab("applicant")}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === "applicant"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Applicant Info
                  </button>
                )}
                {user.role === "company" && (
                  <>
                    <button
                      onClick={() => setActiveTab("company")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === "company"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Company Info
                    </button>
                    <button
                      onClick={() => setActiveTab("documents")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-1 ${
                        activeTab === "documents"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <FiFile className="text-sm" />
                      Documents
                      {approvalDocuments.length > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {approvalDocuments.length}
                        </span>
                      )}
                    </button>
                  </>
                )}
                {user.role === "admin" && (
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === "security"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Security
                  </button>
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user.role === "company" ? (
                      <>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Company Name</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.name ? '✓' : '✗'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                              <MdBusiness className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">{user?.companyProfile?.companyName || user?.name || 'Not set'}</div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Industry</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.companyProfile?.industry ? '✓' : '✗'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                              <FiBriefcase className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">{user?.companyProfile?.industry || 'Not specified'}</div>
                        </div>

                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Website</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.companyProfile?.website ? '✓' : '✗'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                              <FiGlobe className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">{user?.companyProfile?.website ? 'Available' : 'Not provided'}</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Documents</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{approvalDocuments.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                              <FiFile className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Approval documents</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Profile Completion</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.profile?.profileCompletion || 0}%</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                              <FiUser className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Profile completeness</div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Jobs Applied</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.profile?.jobsApplied || 0}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center">
                              <FiFileText className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Total jobs applied</div>
                        </div>

                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-4 border border-violet-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Interviews</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.profile?.interviews || 0}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center">
                              <FiActivity className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Scheduled interviews</div>
                        </div>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Skills</p>
                              <p className="text-lg font-bold text-gray-900 mt-1">{user?.profile?.skills?.length || 0}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
                              <FiCode className="text-white text-lg" />
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Total skills</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Profile Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Summary</h3>
                    <div className="space-y-3">
                      {user.role === "company" ? (
                        <>
                          {user?.companyProfile?.description && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Company Description</h4>
                              <p className="text-sm text-gray-600">{user.companyProfile.description}</p>
                            </div>
                          )}

                          {user?.companyProfile?.industry && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Industry</h4>
                              <p className="text-sm text-gray-600">{user.companyProfile.industry}</p>
                            </div>
                          )}

                          {!user?.companyProfile?.description && !user?.companyProfile?.industry && (
                            <p className="text-sm text-gray-500 italic">No company information available</p>
                          )}
                        </>
                      ) : (
                        <>
                          {user?.profile?.bio && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                              <p className="text-sm text-gray-600">{user.profile.bio}</p>
                            </div>
                          )}

                          {user?.profile?.skills && user.profile.skills.length > 0 && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {user.profile.skills.map((skill, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {!user?.profile?.bio && (!user?.profile?.skills || user.profile.skills.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No profile information available</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUser.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editableUser.email || ""}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editableUser?.profile?.phone || editableUser?.companyProfile?.phone || ""}
                            onChange={(e) => handleInputChange(user.role === 'company' ? "companyProfile.phone" : "profile.phone", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                            {user?.profile?.phone || user?.companyProfile?.phone || "Not provided"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUser?.profile?.location || editableUser?.companyProfile?.location || ""}
                            onChange={(e) => handleInputChange(user.role === 'company' ? "companyProfile.location" : "profile.location", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                            {user?.profile?.location || user?.companyProfile?.location || "Not provided"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded capitalize">{user.role}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Account Created</label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{formatDate(user.createdAt)}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Last Updated</label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{formatDate(user.updatedAt)}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">User ID</label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded font-mono">{user._id?.substring(0, 12)}...</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "applicant" && user.role === "applicant" && (
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Bio</h3>
                    {isEditing ? (
                      <textarea
                        value={editableUser?.profile?.bio || ""}
                        onChange={(e) => handleInputChange("profile.bio", e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                          focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded whitespace-pre-line">
                        {user?.profile?.bio || "No bio provided"}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Skills</h3>
                      {isEditing && (
                        <button
                          onClick={() => {
                            const newSkills = [...(editableUser?.profile?.skills || [])];
                            newSkills.push("");
                            handleInputChange("profile.skills", newSkills);
                          }}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Add Skill
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        {(editableUser?.profile?.skills || []).map((skill, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...(editableUser?.profile?.skills || [])];
                                newSkills[index] = e.target.value;
                                handleInputChange("profile.skills", newSkills);
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                                focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Add a skill"
                            />
                            <button
                              onClick={() => {
                                const newSkills = [...(editableUser?.profile?.skills || [])];
                                newSkills.splice(index, 1);
                                handleInputChange("profile.skills", newSkills);
                              }}
                              className="px-3 py-2 text-red-500 hover:text-red-700"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {(user?.profile?.skills?.length === 0 || !user?.profile?.skills) && (
                          <p className="text-sm text-gray-500 italic">No skills added</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Experience</h3>
                    {user?.profile?.experience?.length > 0 ? (
                      <div className="space-y-4">
                        {user.profile.experience.map((exp, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{exp.title}</h4>
                                <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </p>
                              </div>
                              <MdWork className="text-gray-400 text-xl" />
                            </div>
                            {exp.description && (
                              <p className="text-sm text-gray-600 mt-3">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No experience added</p>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Education</h3>
                    {user?.profile?.education?.length > 0 ? (
                      <div className="space-y-4">
                        {user.profile.education.map((edu, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{edu.degree} in {edu.field}</h4>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {edu.startDate} - {edu.endDate}
                                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                                </p>
                              </div>
                              <MdSchool className="text-gray-400 text-xl" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No education added</p>
                    )}
                  </div>

                  {/* Resume */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Resume</h3>
                    {user?.profile?.resume ? (
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getDocumentIcon(user.profile.resume)}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{user.profile.resume.fileName || 'Resume'}</h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {user.profile.resume.fileType || 'PDF'} • {formatFileSize(user.profile.resume.fileSize || 0)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewDocument(user.profile.resume)}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-xs flex items-center gap-1"
                            >
                              <FiEye className="text-sm" />
                              View
                            </button>
                            <button
                              onClick={() => downloadDocument(user.profile.resume)}
                              className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs flex items-center gap-1"
                            >
                              <FiDownload className="text-sm" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No resume uploaded</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "company" && user.role === "company" && (
                <div className="space-y-6">
                  {/* Company Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Company Description</h3>
                    {isEditing ? (
                      <textarea
                        value={editableUser?.companyProfile?.description || ""}
                        onChange={(e) => handleInputChange("companyProfile.description", e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                          focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Describe your company..."
                      />
                    ) : (
                      <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded whitespace-pre-line">
                        {user?.companyProfile?.description || "No description provided"}
                      </p>
                    )}
                  </div>

                  {/* Company Details */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUser?.companyProfile?.industry || ""}
                            onChange={(e) => handleInputChange("companyProfile.industry", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Technology, Finance, etc."
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user?.companyProfile?.industry || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company Size</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUser?.companyProfile?.size || ""}
                            onChange={(e) => handleInputChange("companyProfile.size", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="e.g., 50-100 employees"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user?.companyProfile?.size || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                        {isEditing ? (
                          <input
                            type="url"
                            value={editableUser?.companyProfile?.website || ""}
                            onChange={(e) => handleInputChange("companyProfile.website", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="https://example.com"
                          />
                        ) : user?.companyProfile?.website ? (
                          <a
                            href={user.companyProfile.website.startsWith('http') ? user.companyProfile.website : `https://${user.companyProfile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors block bg-gray-50 p-2 rounded"
                          >
                            {user.companyProfile.website}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded">Not provided</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editableUser?.companyProfile?.phone || ""}
                            onChange={(e) => handleInputChange("companyProfile.phone", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user?.companyProfile?.phone || "Not provided"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableUser?.companyProfile?.location || ""}
                            onChange={(e) => handleInputChange("companyProfile.location", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="City, Country"
                          />
                        ) : (
                          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{user?.companyProfile?.location || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && user.role === "company" && (
                <div className="space-y-6">
                  {/* Approval Documents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Approval Documents</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        user.companyStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        user.companyStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {getStatusIcon(user.companyStatus)}
                        {user.companyStatus ? user.companyStatus.charAt(0).toUpperCase() + user.companyStatus.slice(1) : 'No Status'}
                      </span>
                    </div>

                    {approvalDocuments.length > 0 ? (
                      <div className="space-y-3">
                        {approvalDocuments.map((doc, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                {getDocumentIcon(doc)}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {doc.fileName || `Approval Document ${index + 1}`}
                                    </h4>
                                    {doc.status && (
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                        doc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                        doc.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                        'bg-rose-100 text-rose-800'
                                      }`}>
                                        {doc.status}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    {doc.fileType && <span>{doc.fileType.split('/').pop().toUpperCase()}</span>}
                                    {doc.fileSize && <span>{formatFileSize(doc.fileSize)}</span>}
                                    {doc.uploadedAt && <span>Uploaded: {formatDate(doc.uploadedAt)}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => viewDocument(doc)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Document"
                                >
                                  <FiEye className="text-lg" />
                                </button>
                                <button
                                  onClick={() => downloadDocument(doc)}
                                  className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                  title="Download Document"
                                >
                                  <FiDownload className="text-lg" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                          <FiFile className="text-2xl text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">No Documents Available</h4>
                        <p className="text-xs text-gray-500">
                          This company hasn't uploaded any approval documents yet.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Document Status Info */}
                  {approvalDocuments.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start gap-3">
                        <FiFileText className="text-blue-500 text-lg mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Document Information</h4>
                          <p className="text-xs text-blue-700">
                            These documents are used for company verification. You can view or download them as needed.
                            {user.companyStatus === 'pending' && ' The status will be updated after document verification.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "security" && session?.user?.role === "admin" && (
                <div className="space-y-6">
                  {/* Danger Zone */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Danger Zone</h3>
                    <div className="p-4 border border-rose-200 bg-rose-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-rose-900">Delete Account</p>
                          <p className="text-xs text-rose-700 mt-0.5">Permanently delete this user account</p>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg 
                          hover:from-rose-600 hover:to-pink-700 transition-all duration-200 text-sm font-medium">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Status</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                  user.status === 'suspended' ? 'bg-rose-100 text-rose-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.role === 'admin' ? 'bg-amber-100 text-amber-800' :
                  user.role === 'company' ? 'bg-violet-100 text-violet-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {user.role?.toUpperCase()}
                </span>
              </div>

              {user.role === 'company' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Company Status</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    user.companyStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    user.companyStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {user.companyStatus?.toUpperCase() || 'N/A'}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-xs text-gray-600">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Stats</h3>
            <div className="space-y-3">
              {user.role === 'company' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Company Name</span>
                    <span className="text-xs font-medium text-gray-700">{user?.name ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Industry</span>
                    <span className="text-xs font-medium text-gray-700">{user?.companyProfile?.industry ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Website</span>
                    <span className="text-xs font-medium text-gray-700">{user?.companyProfile?.website ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-xs font-medium text-gray-700">{user?.companyProfile?.location ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Company Size</span>
                    <span className="text-xs font-medium text-gray-700">{user?.companyProfile?.size ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-xs font-medium text-gray-700">{user?.companyProfile?.description ? '✓' : '✗'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Documents</span>
                    <span className="text-xs font-medium text-gray-700">{approvalDocuments.length}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Completion</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${user?.profile?.profileCompletion || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">{user?.profile?.profileCompletion || 0}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Jobs Applied</span>
                    <span className="text-xs font-medium text-gray-700">{user?.profile?.jobsApplied || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Interviews</span>
                    <span className="text-xs font-medium text-gray-700">{user?.profile?.interviews || 0}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills</span>
                    <span className="text-xs font-medium text-gray-700">{user?.profile?.skills?.length || 0}</span>
                  </div>

                  {user.role === 'applicant' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Experience</span>
                        <span className="text-xs font-medium text-gray-700">{user?.profile?.experience?.length || 0}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Education</span>
                        <span className="text-xs font-medium text-gray-700">{user?.profile?.education?.length || 0}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(user?.profile?.socialLinks || user?.companyProfile?.socialLinks) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {user?.profile?.socialLinks?.linkedin && (
                  <a
                    href={user.profile.socialLinks.linkedin.startsWith('http') ? user.profile.socialLinks.linkedin : `https://${user.profile.socialLinks.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiLinkedin className="text-blue-700" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {user?.profile?.socialLinks?.github && (
                  <a
                    href={user.profile.socialLinks.github.startsWith('http') ? user.profile.socialLinks.github : `https://${user.profile.socialLinks.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <FiGithub />
                    <span>GitHub</span>
                  </a>
                )}

                {user?.profile?.socialLinks?.portfolio && (
                  <a
                    href={user.profile.socialLinks.portfolio.startsWith('http') ? user.profile.socialLinks.portfolio : `https://${user.profile.socialLinks.portfolio}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <FiGlobe className="text-gray-400" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}