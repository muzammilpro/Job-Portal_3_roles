"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FiUsers, 
  FiUser, 
  FiBriefcase, 
  FiShield, 
  FiCheckCircle, 
  FiClock, 
  FiThumbsUp, 
  FiThumbsDown,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiMail,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSave,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiMoreVertical
} from "react-icons/fi";
import { 
  MdAdminPanelSettings,
  MdBusiness,
  MdPerson
} from "react-icons/md";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState("");
  const [editingStatus, setEditingStatus] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [notifications, setNotifications] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add notification
  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Check if user is admin
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/");
      } else {
        fetchUsers();
      }
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, router]);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/users");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        addNotification(`Loaded ${data.users.length} users`, "success");
      } else {
        addNotification(data.error || "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      addNotification("Failed to load users. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    const user = users.find(u => u._id === userId);
    const originalRole = user?.role;
    
    // Optimistic update
    setUsers(prev => prev.map(user =>
      user._id === userId ? { ...user, role: newRole } : user
    ));
    setEditingUserId(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setUsers(prev => prev.map(user =>
          user._id === userId ? { ...user, role: originalRole } : user
        ));
        throw new Error(data.error);
      }
      
      addNotification(`Updated ${user?.name}'s role to ${newRole}`, "success");
    } catch (error) {
      addNotification(error.message || "Failed to update role", "error");
    }
  };

  // Handle company status change
  const handleStatusChange = async (userId, newStatus) => {
    const user = users.find(u => u._id === userId);
    const originalStatus = user?.companyStatus;
    
    // Optimistic update
    setUsers(prev => prev.map(user =>
      user._id === userId ? { ...user, companyStatus: newStatus } : user
    ));

    try {
      const response = await fetch("/api/admin/users/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setUsers(prev => prev.map(user =>
          user._id === userId ? { ...user, companyStatus: originalStatus } : user
        ));
        throw new Error(data.error);
      }
      
      addNotification(`Updated company status to ${newStatus}`, "success");
    } catch (error) {
      addNotification(error.message || "Failed to update status", "error");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    // Optimistic update
    const userToDelete = users.find(u => u._id === userId);
    setUsers(prev => prev.filter(user => user._id !== userId));

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setUsers(prev => [...prev, userToDelete]);
        throw new Error(data.error);
      }
      
      addNotification(`Deleted user: ${userName}`, "success");
    } catch (error) {
      addNotification(error.message || "Failed to delete user", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete multiple users
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      addNotification("No users selected", "error");
      return;
    }

    if (!confirm(`Delete ${selectedUsers.length} selected users?`)) {
      return;
    }

    setIsDeleting(true);
    const originalUsers = users;
    setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
    setSelectedUsers([]);

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      const data = await response.json();

      if (!data.success) {
        setUsers(originalUsers);
        throw new Error(data.error);
      }
      
      addNotification(`Deleted ${selectedUsers.length} users`, "success");
    } catch (error) {
      addNotification(error.message || "Failed to delete users", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all users on current page
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user._id));
    }
  };

  // Sort users
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.companyStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Statistics
  const stats = [
    { label: "Total Users", value: users.length, icon: FiUsers, color: "from-blue-500 to-cyan-500" },
    { label: "Applicants", value: users.filter(u => u.role === "applicant").length, icon: FiUser, color: "from-emerald-500 to-teal-500" },
    { label: "Companies", value: users.filter(u => u.role === "company").length, icon: FiBriefcase, color: "from-violet-500 to-purple-500" },
    { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: FiShield, color: "from-amber-500 to-orange-500" },
    { label: "Active", value: users.filter(u => u.status === "active").length, icon: FiCheckCircle, color: "from-green-500 to-emerald-500" },
    { label: "Pending", value: users.filter(u => u.companyStatus === "pending").length, icon: FiClock, color: "from-yellow-500 to-amber-500" },
    { label: "Approved", value: users.filter(u => u.companyStatus === "approved").length, icon: FiThumbsUp, color: "from-lime-500 to-green-500" },
    { label: "Rejected", value: users.filter(u => u.companyStatus === "rejected").length, icon: FiThumbsDown, color: "from-rose-500 to-pink-500" },
  ];

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FiMoreVertical className="text-gray-400 text-sm" />;
    return sortConfig.direction === "asc" ? 
      <FiChevronUp className="text-blue-500 text-sm" /> : 
      <FiChevronDown className="text-blue-500 text-sm" />;
  };

  // Generate random color for avatar
  const getAvatarColor = (id) => {
    const colors = [
      "from-blue-500 to-cyan-400",
      "from-purple-500 to-pink-500",
      "from-emerald-500 to-teal-400",
      "from-amber-500 to-orange-400",
      "from-rose-500 to-pink-400",
      "from-indigo-500 to-blue-400",
      "from-green-500 to-emerald-400",
      "from-violet-500 to-purple-400"
    ];
    return colors[id.charCodeAt(0) % colors.length];
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <MdAdminPanelSettings className="text-lg" />;
      case 'company': return <MdBusiness className="text-lg" />;
      case 'applicant': return <MdPerson className="text-lg" />;
      default: return <FiUser className="text-lg" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-cyan-400 border-r-transparent rounded-full animate-spin animate-delay-100"></div>
        </div>
        <p className="mt-6 text-base font-medium text-gray-700 animate-pulse">Loading users...</p>
        <p className="mt-1 text-sm text-gray-500">Please wait while we fetch user data</p>
      </div>
    );
  }

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
      <div className="mb-6 space-y-4 pt-[5%]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage all users and their permissions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchUsers}
              disabled={isLoading}
              className="group px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
                active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              <FiRefreshCw className={`text-gray-600 transition-transform group-hover:rotate-180 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setStatusFilter("all");
                setSelectedUsers([]);
                setCurrentPage(1);
              }}
              className="group px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg 
                hover:from-blue-600 hover:to-cyan-700 active:scale-95 transition-all duration-200 
                shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
            >
              <FiRefreshCw className="transition-transform group-hover:rotate-90" />
              <span className="font-medium">Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 
                  hover:-translate-y-0.5 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                     style={{ backgroundImage: `linear-gradient(to bottom right, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}
                ></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-lg" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200/50">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-base group-hover:scale-110 transition-transform" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300/50 rounded-lg 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300
                    placeholder:text-gray-400 text-gray-700 bg-white/50 backdrop-blur-sm text-sm
                    hover:border-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center group/clear"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600 transition-colors text-sm" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group px-3 py-2.5 border border-gray-300/50 rounded-lg hover:bg-gray-50 
                  active:scale-95 transition-all duration-200 flex items-center gap-2 font-medium text-sm
                  bg-white/50 backdrop-blur-sm"
              >
                <FiFilter className="text-gray-600 group-hover:rotate-90 transition-transform" />
                Filters
                <span className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                  <FiChevronDown className="text-sm" />
                </span>
              </button>
              
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="group px-3 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg 
                    hover:from-rose-600 hover:to-pink-700 active:scale-95 transition-all duration-200 
                    shadow-md hover:shadow-lg flex items-center gap-2 font-medium text-sm disabled:opacity-50"
                >
                  <FiTrash2 className="group-hover:scale-110 transition-transform" />
                  Delete ({selectedUsers.length})
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:border-blue-500 
                  focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="all">All Roles</option>
                <option value="applicant">Applicant</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:border-blue-500 
                  focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Items per page</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300/50 rounded-lg focus:border-blue-500 
                  focus:ring-2 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 border-b border-gray-200/50">
                <th className="p-3 pl-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border border-gray-300 text-blue-600 
                      focus:ring-1 focus:ring-blue-500 transition-all duration-200 cursor-pointer
                      hover:border-blue-400"
                  />
                </th>
                <th 
                  className="p-3 text-left text-xs font-semibold text-gray-900 cursor-pointer 
                    hover:bg-gray-200/30 transition-colors duration-200 group"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    <span>User</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th 
                  className="p-3 text-left text-xs font-semibold text-gray-900 cursor-pointer 
                    hover:bg-gray-200/30 transition-colors duration-200 group"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center gap-1">
                    <span>Email</span>
                    {getSortIcon("email")}
                  </div>
                </th>
                <th 
                  className="p-3 text-left text-xs font-semibold text-gray-900 cursor-pointer 
                    hover:bg-gray-200/30 transition-colors duration-200 group"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center gap-1">
                    <span>Role</span>
                    {getSortIcon("role")}
                  </div>
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-900">Status</th>
                <th 
                  className="p-3 text-left text-xs font-semibold text-gray-900 cursor-pointer 
                    hover:bg-gray-200/30 transition-colors duration-200 group"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    <span>Joined</span>
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="p-3 text-left text-xs font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="group hover:bg-gradient-to-r hover:from-blue-50/10 hover:to-cyan-50/10 transition-all duration-300"
                >
                  <td className="p-3 pl-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUserSelection(user._id)}
                      className="w-4 h-4 rounded border border-gray-300 text-blue-600 
                        focus:ring-1 focus:ring-blue-500 transition-all duration-200 cursor-pointer
                        hover:border-blue-400"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(user._id)} 
                          flex items-center justify-center text-white font-semibold text-sm shadow-md
                          group-hover:scale-105 transition-transform duration-300`}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white 
                          ${user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{user.name}</p>
                        {user.companyName && (
                          <p className="text-xs text-gray-600 mt-0.5 group-hover:text-gray-800 transition-colors">{user.companyName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors truncate max-w-[200px]">{user.email}</span>
                      <button
                        onClick={() => window.location.href = `mailto:${user.email}`}
                        className="text-gray-400 hover:text-blue-600 transition-colors duration-200 
                          hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                        title="Send email"
                      >
                        <FiMail className="text-sm" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    {editingUserId === user._id ? (
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="px-3 py-1.5 border border-blue-500 rounded-md focus:ring-1 
                          focus:ring-blue-500 transition-all duration-200 outline-none text-sm
                          bg-white/50 backdrop-blur-sm w-32"
                        autoFocus
                      >
                        <option value="applicant">Applicant</option>
                        <option value="company">Company</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
                        transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-default
                        shadow-sm hover:shadow-md ${
                        user.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        user.role === 'company' ? 'bg-violet-50 text-violet-700 border border-violet-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {user.role === "company" ? (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium 
                          transition-all duration-200 shadow-sm hover:shadow-md ${
                          user.companyStatus === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          user.companyStatus === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {user.companyStatus === 'approved' ? <FiThumbsUp className="text-xs" /> : 
                           user.companyStatus === 'rejected' ? <FiThumbsDown className="text-xs" /> : 
                           <FiClock className="text-xs" />}
                          {user.companyStatus.charAt(0).toUpperCase() + user.companyStatus.slice(1)}
                        </span>
                        <select
                          value={editingStatus}
                          onChange={(e) => {
                            setEditingStatus(e.target.value);
                            if (e.target.value) {
                              handleStatusChange(user._id, e.target.value);
                            }
                          }}
                          className="px-2 py-1 border border-gray-300 rounded text-xs 
                            focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none
                            bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 w-20"
                        >
                          <option value="">Change</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">—</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="text-gray-900 text-sm font-medium group-hover:text-blue-600 transition-colors">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(user.createdAt).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {editingUserId === user._id ? (
                        <>
                          <button
                            onClick={() => handleRoleChange(user._id, editingRole)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white 
                              rounded-md hover:from-emerald-600 hover:to-green-700 active:scale-95 
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 font-medium text-xs"
                          >
                            <FiSave className="group-hover:rotate-12 transition-transform" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white 
                              rounded-md hover:from-gray-600 hover:to-gray-700 active:scale-95 
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 font-medium text-xs"
                          >
                            <FiX />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingUserId(user._id);
                              setEditingRole(user.role);
                            }}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
                              rounded-md hover:from-blue-600 hover:to-cyan-700 active:scale-95 
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 font-medium text-xs"
                            title="Edit role"
                          >
                            <FiEdit2 className="text-xs" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            disabled={isDeleting}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white 
                              rounded-md hover:from-rose-600 hover:to-pink-700 active:scale-95 
                              transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 
                              disabled:cursor-not-allowed flex items-center gap-1 font-medium text-xs"
                            title="Delete user"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white 
                              rounded-md hover:from-gray-600 hover:to-gray-700 active:scale-95 
                              transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 font-medium text-xs"
                            title="View details"
                          >
                            <FiEye className="text-xs" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State */}
          {currentUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100/50 via-cyan-100/50 to-purple-100/50 
                flex items-center justify-center backdrop-blur-sm">
                <FiUsers className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No users in the system yet"}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white 
                  rounded-lg hover:from-blue-600 hover:to-cyan-700 active:scale-95 
                  transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-600">
                <span className="font-medium">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)}</span>
                <span className="mx-2">•</span>
                <span>Total: {filteredUsers.length} users</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300/50 hover:bg-gray-50/50 
                    active:scale-95 transition-all duration-200 disabled:opacity-50 
                    disabled:cursor-not-allowed hover:border-gray-400
                    backdrop-blur-sm"
                >
                  <FiChevronLeft className="text-sm" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg transition-all duration-200 active:scale-95 
                          flex items-center justify-center font-medium text-sm backdrop-blur-sm ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md scale-105'
                            : 'border border-gray-300/50 hover:bg-gray-50/50 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-1 text-gray-400 text-sm">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 rounded-lg transition-all duration-200 active:scale-95 
                          flex items-center justify-center font-medium text-sm border border-gray-300/50 
                          hover:bg-gray-50/50 hover:border-gray-400 backdrop-blur-sm`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300/50 hover:bg-gray-50/50 
                    active:scale-95 transition-all duration-200 disabled:opacity-50 
                    disabled:cursor-not-allowed hover:border-gray-400
                    backdrop-blur-sm"
                >
                  <FiChevronRight className="text-sm" />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-medium">Go to:</span>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
                      setCurrentPage(page);
                    }}
                    className="w-16 px-3 py-1.5 border border-gray-300/50 rounded-lg 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-100 
                      transition-all duration-200 text-center font-medium text-sm
                      bg-white/50 backdrop-blur-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs">/ {totalPages}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}