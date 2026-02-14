// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function AdminUsersPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editingRole, setEditingRole] = useState("");
//   const [editingStatus, setEditingStatus] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
//   const [notifications, setNotifications] = useState([]);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Add notification
//   const addNotification = (message, type = "success") => {
//     const id = Date.now();
//     setNotifications(prev => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setNotifications(prev => prev.filter(n => n.id !== id));
//     }, 3000);
//   };

//   // Check if user is admin
//   useEffect(() => {
//     if (status === "authenticated") {
//       if (session?.user?.role !== "admin") {
//         router.push("/");
//       } else {
//         fetchUsers();
//       }
//     } else if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, session, router]);

//   // Fetch all users
//   const fetchUsers = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/admin/users");
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();

//       if (data.success) {
//         setUsers(data.users);
//         addNotification(`Loaded ${data.users.length} users`, "success");
//       } else {
//         addNotification(data.error || "Failed to fetch users", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       addNotification("Failed to load users. Please try again.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Handle role change
//   const handleRoleChange = async (userId, newRole) => {
//     const user = users.find(u => u._id === userId);
//     const originalRole = user?.role;
    
//     // Optimistic update
//     setUsers(prev => prev.map(user =>
//       user._id === userId ? { ...user, role: newRole } : user
//     ));
//     setEditingUserId(null);

//     try {
//       const response = await fetch("/api/admin/users", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: newRole }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => prev.map(user =>
//           user._id === userId ? { ...user, role: originalRole } : user
//         ));
//         throw new Error(data.error);
//       }
      
//       addNotification(`Updated ${user?.name}'s role to ${newRole}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to update role", "error");
//     }
//   };

//   // Handle company status change
//   const handleStatusChange = async (userId, newStatus) => {
//     const user = users.find(u => u._id === userId);
//     const originalStatus = user?.companyStatus;
    
//     // Optimistic update
//     setUsers(prev => prev.map(user =>
//       user._id === userId ? { ...user, companyStatus: newStatus } : user
//     ));

//     try {
//       const response = await fetch("/api/admin/users/status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, status: newStatus }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => prev.map(user =>
//           user._id === userId ? { ...user, companyStatus: originalStatus } : user
//         ));
//         throw new Error(data.error);
//       }
      
//       addNotification(`Updated company status to ${newStatus}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to update status", "error");
//     }
//   };

//   // Delete user
//   const handleDeleteUser = async (userId, userName) => {
//     if (!confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
//       return;
//     }

//     setIsDeleting(true);
//     // Optimistic update
//     const userToDelete = users.find(u => u._id === userId);
//     setUsers(prev => prev.filter(user => user._id !== userId));

//     try {
//       const response = await fetch(`/api/admin/users?id=${userId}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => [...prev, userToDelete]);
//         throw new Error(data.error);
//       }
      
//       addNotification(`Deleted user: ${userName}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to delete user", "error");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Delete multiple users
//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) {
//       addNotification("No users selected", "error");
//       return;
//     }

//     if (!confirm(`Delete ${selectedUsers.length} selected users?`)) {
//       return;
//     }

//     setIsDeleting(true);
//     const originalUsers = users;
//     setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
//     setSelectedUsers([]);

//     try {
//       const response = await fetch("/api/admin/users/bulk", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userIds: selectedUsers }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         setUsers(originalUsers);
//         throw new Error(data.error);
//       }
      
//       addNotification(`Deleted ${selectedUsers.length} users`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to delete users", "error");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Toggle user selection
//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev =>
//       prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   // Select all users on current page
//   const toggleSelectAll = () => {
//     if (selectedUsers.length === currentUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(currentUsers.map(user => user._id));
//     }
//   };

//   // Sort users
//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
//     }));
//   };

//   // Filter and sort users
//   const filteredUsers = users
//     .filter(user => {
//       const matchesSearch = 
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesRole = roleFilter === "all" || user.role === roleFilter;
//       const matchesStatus = statusFilter === "all" || user.companyStatus === statusFilter;

//       return matchesSearch && matchesRole && matchesStatus;
//     })
//     .sort((a, b) => {
//       const aVal = a[sortConfig.key];
//       const bVal = b[sortConfig.key];
      
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

//   // Statistics
//   const stats = [
//     { label: "Total Users", value: users.length, icon: "👥", color: "bg-gradient-to-r from-blue-500 to-blue-600" },
//     { label: "Applicants", value: users.filter(u => u.role === "applicant").length, icon: "👤", color: "bg-gradient-to-r from-green-500 to-emerald-600" },
//     { label: "Companies", value: users.filter(u => u.role === "company").length, icon: "🏢", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
//     { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: "👑", color: "bg-gradient-to-r from-red-500 to-red-600" },
//     { label: "Active", value: users.filter(u => u.status === "active").length, icon: "✅", color: "bg-gradient-to-r from-emerald-500 to-emerald-600" },
//     { label: "Pending", value: users.filter(u => u.companyStatus === "pending").length, icon: "⏳", color: "bg-gradient-to-r from-amber-500 to-amber-600" },
//     { label: "Approved", value: users.filter(u => u.companyStatus === "approved").length, icon: "👍", color: "bg-gradient-to-r from-green-500 to-green-600" },
//     { label: "Rejected", value: users.filter(u => u.companyStatus === "rejected").length, icon: "👎", color: "bg-gradient-to-r from-rose-500 to-rose-600" },
//   ];

//   // Get sort icon
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return "↕️";
//     return sortConfig.direction === "asc" ? "↑" : "↓";
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center justify-center p-4">
//         <div className="relative">
//           <div className="w-24 h-24 border-4 border-blue-100 rounded-full"></div>
//           <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//         <p className="mt-6 text-lg font-medium text-gray-700">Loading users...</p>
//         <p className="mt-2 text-sm text-gray-500">Please wait while we fetch user data</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
//       {/* Notifications */}
//       <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             className={`
//               px-5 py-3 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300
//               ${notification.type === "success" 
//                 ? "bg-gradient-to-r from-green-500/95 to-emerald-600/95 text-white border border-green-400/20" 
//                 : "bg-gradient-to-r from-red-500/95 to-rose-600/95 text-white border border-red-400/20"
//               }
//               animate-[slideInRight_0.3s_ease-out]
//             `}
//           >
//             <div className="flex items-center gap-3">
//               <span className="text-lg">{notification.type === "success" ? "✅" : "❌"}</span>
//               <span className="font-medium">{notification.message}</span>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Header */}
//       <div className="mb-8 space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//               User Management
//             </h1>
//             <p className="text-gray-600 mt-2">Manage all users and their permissions</p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button
//               onClick={fetchUsers}
//               disabled={isLoading}
//               className="px-5 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 
//                 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md 
//                 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//             >
//               <span className={`text-lg ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
//               <span className="font-medium">Refresh</span>
//             </button>
            
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setRoleFilter("all");
//                 setStatusFilter("all");
//                 setSelectedUsers([]);
//               }}
//               className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl 
//                 hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all duration-200 
//                 shadow-md hover:shadow-lg flex items-center gap-2"
//             >
//               <span className="text-lg">🔄</span>
//               <span className="font-medium">Reset</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 
//                 hover:-translate-y-1 border border-gray-100 animate-[fadeInUp_0.5s_ease-out]"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                   <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
//                 </div>
//                 <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-inner`}>
//                   {stat.icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
//         {/* Filters */}
//         <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <span className="text-gray-400 text-lg">🔍</span>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or company..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl 
//                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300
//                     placeholder:text-gray-400 text-gray-700"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center"
//                   >
//                     <span className="text-gray-400 hover:text-gray-600 transition-colors">✕</span>
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-5 py-3.5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 
//                   active:scale-95 transition-all duration-200 flex items-center gap-2 font-medium"
//               >
//                 <span className="text-lg">⚙️</span>
//                 Filters
//                 <span className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
//                   ▼
//                 </span>
//               </button>
              
//               {selectedUsers.length > 0 && (
//                 <button
//                   onClick={handleBulkDelete}
//                   disabled={isDeleting}
//                   className="px-5 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl 
//                     hover:from-red-600 hover:to-rose-700 active:scale-95 transition-all duration-200 
//                     shadow-md hover:shadow-lg flex items-center gap-2 font-medium disabled:opacity-50"
//                 >
//                   <span className="text-lg">{isDeleting ? '⏳' : '🗑️'}</span>
//                   Delete ({selectedUsers.length})
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 
//                   focus:ring-4 focus:ring-blue-100 transition-all duration-300"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="applicant">Applicant</option>
//                 <option value="company">Company</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 
//                   focus:ring-4 focus:ring-blue-100 transition-all duration-300"
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="rejected">Rejected</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
//               <select
//                 value={itemsPerPage}
//                 onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 
//                   focus:ring-4 focus:ring-blue-100 transition-all duration-300"
//               >
//                 <option value="5">5 per page</option>
//                 <option value="10">10 per page</option>
//                 <option value="25">25 per page</option>
//                 <option value="50">50 per page</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                 <th className="p-4 pl-6">
//                   <input
//                     type="checkbox"
//                     checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
//                     onChange={toggleSelectAll}
//                     className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 
//                       focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
//                   />
//                 </th>
//                 <th 
//                   className="p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer 
//                     hover:bg-gray-200/50 transition-colors duration-200"
//                   onClick={() => handleSort("name")}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>User</span>
//                     <span className="text-gray-400">{getSortIcon("name")}</span>
//                   </div>
//                 </th>
//                 <th 
//                   className="p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer 
//                     hover:bg-gray-200/50 transition-colors duration-200"
//                   onClick={() => handleSort("email")}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>Email</span>
//                     <span className="text-gray-400">{getSortIcon("email")}</span>
//                   </div>
//                 </th>
//                 <th 
//                   className="p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer 
//                     hover:bg-gray-200/50 transition-colors duration-200"
//                   onClick={() => handleSort("role")}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>Role</span>
//                     <span className="text-gray-400">{getSortIcon("role")}</span>
//                   </div>
//                 </th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-900">Status</th>
//                 <th 
//                   className="p-4 text-left text-sm font-semibold text-gray-900 cursor-pointer 
//                     hover:bg-gray-200/50 transition-colors duration-200"
//                   onClick={() => handleSort("createdAt")}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span>Joined</span>
//                     <span className="text-gray-400">{getSortIcon("createdAt")}</span>
//                   </div>
//                 </th>
//                 <th className="p-4 text-left text-sm font-semibold text-gray-900">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {currentUsers.map((user, index) => (
//                 <tr
//                   key={user._id}
//                   className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white transition-all duration-200 group"
//                 >
//                   <td className="p-4 pl-6">
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.includes(user._id)}
//                       onChange={() => toggleUserSelection(user._id)}
//                       className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 
//                         focus:ring-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
//                     />
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-4">
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
//                           flex items-center justify-center text-white font-bold text-lg shadow-md">
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white 
//                           bg-gradient-to-r from-green-500 to-emerald-600"></div>
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900">{user.name}</p>
//                         {user.companyName && (
//                           <p className="text-sm text-gray-600 mt-0.5">{user.companyName}</p>
//                         )}
//                         <p className="text-xs text-gray-500 mt-1">ID: {user._id?.substring(0, 8)}...</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <span className="text-gray-700 font-medium">{user.email}</span>
//                       <button
//                         onClick={() => window.location.href = `mailto:${user.email}`}
//                         className="text-gray-400 hover:text-blue-600 transition-colors duration-200 
//                           hover:scale-110 active:scale-95"
//                         title="Send email"
//                       >
//                         <span className="text-lg">✉️</span>
//                       </button>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     {editingUserId === user._id ? (
//                       <select
//                         value={editingRole}
//                         onChange={(e) => setEditingRole(e.target.value)}
//                         className="px-4 py-2 border-2 border-blue-500 rounded-lg focus:ring-2 
//                           focus:ring-blue-500 transition-all duration-200 outline-none"
//                         autoFocus
//                       >
//                         <option value="applicant">Applicant</option>
//                         <option value="company">Company</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     ) : (
//                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold 
//                         transition-all duration-200 hover:scale-105 active:scale-95 cursor-default ${
//                         user.role === 'admin' ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200 shadow-sm' :
//                         user.role === 'company' ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200 shadow-sm' :
//                         'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 shadow-sm'
//                       }`}>
//                         {user.role === 'admin' ? '👑' : user.role === 'company' ? '🏢' : '👤'}
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-4">
//                     {user.role === "company" ? (
//                       <div className="flex items-center gap-3">
//                         <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold 
//                           transition-all duration-200 ${
//                           user.companyStatus === 'approved' ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200 shadow-sm' :
//                           user.companyStatus === 'rejected' ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200 shadow-sm' :
//                           'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200 shadow-sm'
//                         }`}>
//                           {user.companyStatus === 'approved' ? '✅' : 
//                            user.companyStatus === 'rejected' ? '❌' : '⏳'}
//                           {user.companyStatus.charAt(0).toUpperCase() + user.companyStatus.slice(1)}
//                         </span>
//                         <select
//                           value={editingStatus}
//                           onChange={(e) => {
//                             setEditingStatus(e.target.value);
//                             if (e.target.value) {
//                               handleStatusChange(user._id, e.target.value);
//                             }
//                           }}
//                           className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm 
//                             focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none"
//                         >
//                           <option value="">Change</option>
//                           <option value="pending">Pending</option>
//                           <option value="approved">Approve</option>
//                           <option value="rejected">Reject</option>
//                         </select>
//                       </div>
//                     ) : (
//                       <span className="text-gray-400 italic">—</span>
//                     )}
//                   </td>
//                   <td className="p-4">
//                     <div className="flex flex-col">
//                       <span className="text-gray-900 font-medium">
//                         {new Date(user.createdAt).toLocaleDateString('en-US', { 
//                           month: 'short', 
//                           day: 'numeric', 
//                           year: 'numeric' 
//                         })}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {new Date(user.createdAt).toLocaleTimeString('en-US', { 
//                           hour: '2-digit', 
//                           minute: '2-digit' 
//                         })}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex gap-2">
//                       {editingUserId === user._id ? (
//                         <>
//                           <button
//                             onClick={() => handleRoleChange(user._id, editingRole)}
//                             className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
//                               rounded-lg hover:from-green-600 hover:to-emerald-700 active:scale-95 
//                               transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
//                           >
//                             <span>💾</span>
//                             Save
//                           </button>
//                           <button
//                             onClick={() => setEditingUserId(null)}
//                             className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white 
//                               rounded-lg hover:from-gray-600 hover:to-gray-700 active:scale-95 
//                               transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
//                           >
//                             <span>✕</span>
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               setEditingUserId(user._id);
//                               setEditingRole(user.role);
//                             }}
//                             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
//                               rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 
//                               transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
//                           >
//                             <span>✏️</span>
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user._id, user.name)}
//                             disabled={isDeleting}
//                             className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white 
//                               rounded-lg hover:from-red-600 hover:to-rose-700 active:scale-95 
//                               transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 
//                               disabled:cursor-not-allowed flex items-center gap-2 font-medium"
//                           >
//                             <span>{isDeleting ? '⏳' : '🗑️'}</span>
//                           </button>
//                           <button
//                             onClick={() => router.push(`/admin/users/${user._id}`)}
//                             className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white 
//                               rounded-lg hover:from-gray-600 hover:to-gray-700 active:scale-95 
//                               transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
//                           >
//                             <span>👁️</span>
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Empty State */}
//           {currentUsers.length === 0 && (
//             <div className="text-center py-16">
//               <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 
//                 flex items-center justify-center animate-pulse">
//                 <span className="text-5xl">👥</span>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">No users found</h3>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 {searchTerm || roleFilter !== "all" || statusFilter !== "all"
//                   ? "Try adjusting your filters or search terms"
//                   : "No users in the system yet"}
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setRoleFilter("all");
//                   setStatusFilter("all");
//                 }}
//                 className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
//                   rounded-xl hover:from-blue-600 hover:to-blue-700 active:scale-95 
//                   transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && filteredUsers.length > 0 && (
//           <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//               <div className="text-sm text-gray-600">
//                 <span className="font-medium">Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)}</span>
//                 <span className="mx-2">•</span>
//                 <span>Total: {filteredUsers.length} users</span>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="p-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 
//                     active:scale-95 transition-all duration-200 disabled:opacity-50 
//                     disabled:cursor-not-allowed hover:border-gray-400"
//                 >
//                   ←
//                 </button>
                
//                 <div className="flex items-center gap-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum;
//                     if (totalPages <= 5) {
//                       pageNum = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNum = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNum = totalPages - 4 + i;
//                     } else {
//                       pageNum = currentPage - 2 + i;
//                     }

//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`w-12 h-12 rounded-xl transition-all duration-200 active:scale-95 
//                           flex items-center justify-center font-medium ${
//                           currentPage === pageNum
//                             ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
//                             : 'border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   })}
                  
//                   {totalPages > 5 && currentPage < totalPages - 2 && (
//                     <>
//                       <span className="px-2 text-gray-400">...</span>
//                       <button
//                         onClick={() => setCurrentPage(totalPages)}
//                         className={`w-12 h-12 rounded-xl transition-all duration-200 active:scale-95 
//                           flex items-center justify-center font-medium border-2 border-gray-300 
//                           hover:bg-gray-50 hover:border-gray-400`}
//                       >
//                         {totalPages}
//                       </button>
//                     </>
//                   )}
//                 </div>
                
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="p-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 
//                     active:scale-95 transition-all duration-200 disabled:opacity-50 
//                     disabled:cursor-not-allowed hover:border-gray-400"
//                 >
//                   →
//                 </button>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-600 font-medium">Go to:</span>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     min="1"
//                     max={totalPages}
//                     value={currentPage}
//                     onChange={(e) => {
//                       const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
//                       setCurrentPage(page);
//                     }}
//                     className="w-24 px-4 py-2.5 border-2 border-gray-300 rounded-xl 
//                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
//                       transition-all duration-200 text-center font-medium"
//                   />
//                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                     <span className="text-gray-400">/ {totalPages}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function AdminUsersPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editingRole, setEditingRole] = useState("");
//   const [editingStatus, setEditingStatus] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
//   const [notifications, setNotifications] = useState([]);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Add notification
//   const addNotification = (message, type = "success") => {
//     const id = Date.now();
//     setNotifications(prev => [...prev, { id, message, type }]);
//     setTimeout(() => {
//       setNotifications(prev => prev.filter(n => n.id !== id));
//     }, 3000);
//   };

//   // Check if user is admin
//   useEffect(() => {
//     if (status === "authenticated") {
//       if (session?.user?.role !== "admin") {
//         router.push("/");
//       } else {
//         fetchUsers();
//       }
//     } else if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, session, router]);

//   // Fetch all users
//   const fetchUsers = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch("/api/admin/users");
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();

//       if (data.success) {
//         setUsers(data.users);
//         addNotification(`Loaded ${data.users.length} users`, "success");
//       } else {
//         addNotification(data.error || "Failed to fetch users", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       addNotification("Failed to load users. Please try again.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Handle role change
//   const handleRoleChange = async (userId, newRole) => {
//     const user = users.find(u => u._id === userId);
//     const originalRole = user?.role;
    
//     // Optimistic update
//     setUsers(prev => prev.map(user =>
//       user._id === userId ? { ...user, role: newRole } : user
//     ));
//     setEditingUserId(null);

//     try {
//       const response = await fetch("/api/admin/users", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, role: newRole }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => prev.map(user =>
//           user._id === userId ? { ...user, role: originalRole } : user
//         ));
//         throw new Error(data.error);
//       }
      
//       addNotification(`Updated ${user?.name}'s role to ${newRole}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to update role", "error");
//     }
//   };

//   // Handle company status change
//   const handleStatusChange = async (userId, newStatus) => {
//     const user = users.find(u => u._id === userId);
//     const originalStatus = user?.companyStatus;
    
//     // Optimistic update
//     setUsers(prev => prev.map(user =>
//       user._id === userId ? { ...user, companyStatus: newStatus } : user
//     ));

//     try {
//       const response = await fetch("/api/admin/users/status", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, status: newStatus }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => prev.map(user =>
//           user._id === userId ? { ...user, companyStatus: originalStatus } : user
//         ));
//         throw new Error(data.error);
//       }
      
//       addNotification(`Updated company status to ${newStatus}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to update status", "error");
//     }
//   };

//   // Delete user
//   const handleDeleteUser = async (userId, userName) => {
//     if (!confirm(`Are you sure you want to delete "${userName}"? This action cannot be undone.`)) {
//       return;
//     }

//     setIsDeleting(true);
//     // Optimistic update
//     const userToDelete = users.find(u => u._id === userId);
//     setUsers(prev => prev.filter(user => user._id !== userId));

//     try {
//       const response = await fetch(`/api/admin/users?id=${userId}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (!data.success) {
//         // Revert on error
//         setUsers(prev => [...prev, userToDelete]);
//         throw new Error(data.error);
//       }
      
//       addNotification(`Deleted user: ${userName}`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to delete user", "error");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Delete multiple users
//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) {
//       addNotification("No users selected", "error");
//       return;
//     }

//     if (!confirm(`Delete ${selectedUsers.length} selected users?`)) {
//       return;
//     }

//     setIsDeleting(true);
//     const originalUsers = users;
//     setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
//     setSelectedUsers([]);

//     try {
//       const response = await fetch("/api/admin/users/bulk", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userIds: selectedUsers }),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         setUsers(originalUsers);
//         throw new Error(data.error);
//       }
      
//       addNotification(`Deleted ${selectedUsers.length} users`, "success");
//     } catch (error) {
//       addNotification(error.message || "Failed to delete users", "error");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   // Toggle user selection
//   const toggleUserSelection = (userId) => {
//     setSelectedUsers(prev =>
//       prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   // Select all users on current page
//   const toggleSelectAll = () => {
//     if (selectedUsers.length === currentUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(currentUsers.map(user => user._id));
//     }
//   };

//   // Sort users
//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
//     }));
//   };

//   // Filter and sort users
//   const filteredUsers = users
//     .filter(user => {
//       const matchesSearch = 
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesRole = roleFilter === "all" || user.role === roleFilter;
//       const matchesStatus = statusFilter === "all" || user.companyStatus === statusFilter;

//       return matchesSearch && matchesRole && matchesStatus;
//     })
//     .sort((a, b) => {
//       const aVal = a[sortConfig.key];
//       const bVal = b[sortConfig.key];
      
//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//   // Pagination
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

//   // Statistics
//   const stats = [
//     { label: "Total Users", value: users.length, icon: "👥" },
//     { label: "Applicants", value: users.filter(u => u.role === "applicant").length, icon: "👤" },
//     { label: "Companies", value: users.filter(u => u.role === "company").length, icon: "🏢" },
//     { label: "Admins", value: users.filter(u => u.role === "admin").length, icon: "👑" },
//     { label: "Active", value: users.filter(u => u.status === "active").length, icon: "✅" },
//     { label: "Pending", value: users.filter(u => u.companyStatus === "pending").length, icon: "⏳" },
//     { label: "Approved", value: users.filter(u => u.companyStatus === "approved").length, icon: "👍" },
//     { label: "Rejected", value: users.filter(u => u.companyStatus === "rejected").length, icon: "👎" },
//   ];

//   // Get sort icon
//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return "↕️";
//     return sortConfig.direction === "asc" ? "↑" : "↓";
//   };

//   if (isLoading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p>Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       {/* Notifications */}
//       <div style={styles.notificationsContainer}>
//         {notifications.map((notification) => (
//           <div
//             key={notification.id}
//             style={{
//               ...styles.notification,
//               ...(notification.type === "success" 
//                 ? styles.successNotification 
//                 : styles.errorNotification)
//             }}
//           >
//             <div style={styles.notificationContent}>
//               <span style={styles.notificationIcon}>
//                 {notification.type === "success" ? "✅" : "❌"}
//               </span>
//               <span style={styles.notificationText}>{notification.message}</span>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Header */}
//       <div style={styles.header}>
//         <div style={styles.headerTop}>
//           <div>
//             <h1 style={styles.title}>User Management</h1>
//             <p style={styles.subtitle}>Manage all users and their permissions</p>
//           </div>
//           <div style={styles.headerActions}>
//             <button
//               onClick={fetchUsers}
//               disabled={isLoading}
//               style={styles.refreshButton}
//             >
//               <span style={{...styles.buttonIcon, ...(isLoading ? styles.spinning : {})}}>🔄</span>
//               <span style={styles.buttonText}>Refresh</span>
//             </button>
            
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setRoleFilter("all");
//                 setStatusFilter("all");
//                 setSelectedUsers([]);
//               }}
//               style={styles.resetButton}
//             >
//               <span style={styles.buttonIcon}>🔄</span>
//               <span style={styles.buttonText}>Reset</span>
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div style={styles.statsContainer}>
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               style={styles.statCard}
//             >
//               <div style={styles.statContent}>
//                 <div>
//                   <p style={styles.statNumber}>{stat.value}</p>
//                   <p style={styles.statLabel}>{stat.label}</p>
//                 </div>
//                 <div style={styles.statIconContainer}>
//                   {stat.icon}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div style={styles.mainCard}>
//         {/* Filters */}
//         <div style={styles.filtersSection}>
//           <div style={styles.filtersRow}>
//             <div style={styles.searchContainer}>
//               <div style={styles.searchIconWrapper}>
//                 <span style={styles.searchIcon}>🔍</span>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or company..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 style={styles.searchInput}
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   style={styles.clearSearchButton}
//                 >
//                   <span style={styles.clearSearchIcon}>✕</span>
//                 </button>
//               )}
//             </div>
            
//             <div style={styles.filterActions}>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 style={styles.filterToggleButton}
//               >
//                 <span style={styles.buttonIcon}>⚙️</span>
//                 Filters
//                 <span style={{...styles.arrowIcon, transform: showFilters ? 'rotate(180deg)' : 'none'}}>
//                   ▼
//                 </span>
//               </button>
              
//               {selectedUsers.length > 0 && (
//                 <button
//                   onClick={handleBulkDelete}
//                   disabled={isDeleting}
//                   style={styles.bulkDeleteButton}
//                 >
//                   <span style={styles.buttonIcon}>{isDeleting ? '⏳' : '🗑️'}</span>
//                   Delete ({selectedUsers.length})
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           <div style={{
//             ...styles.advancedFilters,
//             maxHeight: showFilters ? '160px' : '0',
//             opacity: showFilters ? 1 : 0,
//             padding: showFilters ? '16px' : '0 16px'
//           }}>
//             <div style={styles.filterGrid}>
//               <div>
//                 <label style={styles.filterLabel}>Role</label>
//                 <select
//                   value={roleFilter}
//                   onChange={(e) => setRoleFilter(e.target.value)}
//                   style={styles.filterSelect}
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="applicant">Applicant</option>
//                   <option value="company">Company</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div>
//                 <label style={styles.filterLabel}>Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   style={styles.filterSelect}
//                 >
//                   <option value="all">All Statuses</option>
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>

//               <div>
//                 <label style={styles.filterLabel}>Items per page</label>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => setItemsPerPage(Number(e.target.value))}
//                   style={styles.filterSelect}
//                 >
//                   <option value="5">5 per page</option>
//                   <option value="10">10 per page</option>
//                   <option value="25">25 per page</option>
//                   <option value="50">50 per page</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div style={styles.tableWrapper}>
//           <table style={styles.table}>
//             <thead>
//               <tr style={styles.tableHeader}>
//                 <th style={styles.checkboxHeaderCell}>
//                   <input
//                     type="checkbox"
//                     checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
//                     onChange={toggleSelectAll}
//                     style={styles.checkbox}
//                   />
//                 </th>
//                 <th 
//                   style={styles.tableHeaderCell}
//                   onClick={() => handleSort("name")}
//                 >
//                   <div style={styles.sortHeader}>
//                     <span>User</span>
//                     <span style={styles.sortIcon}>{getSortIcon("name")}</span>
//                   </div>
//                 </th>
//                 <th 
//                   style={styles.tableHeaderCell}
//                   onClick={() => handleSort("email")}
//                 >
//                   <div style={styles.sortHeader}>
//                     <span>Email</span>
//                     <span style={styles.sortIcon}>{getSortIcon("email")}</span>
//                   </div>
//                 </th>
//                 <th 
//                   style={styles.tableHeaderCell}
//                   onClick={() => handleSort("role")}
//                 >
//                   <div style={styles.sortHeader}>
//                     <span>Role</span>
//                     <span style={styles.sortIcon}>{getSortIcon("role")}</span>
//                   </div>
//                 </th>
//                 <th style={styles.tableHeaderCell}>Status</th>
//                 <th 
//                   style={styles.tableHeaderCell}
//                   onClick={() => handleSort("createdAt")}
//                 >
//                   <div style={styles.sortHeader}>
//                     <span>Joined</span>
//                     <span style={styles.sortIcon}>{getSortIcon("createdAt")}</span>
//                   </div>
//                 </th>
//                 <th style={styles.tableHeaderCell}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   style={styles.tableRow}
//                 >
//                   <td style={styles.checkboxCell}>
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.includes(user._id)}
//                       onChange={() => toggleUserSelection(user._id)}
//                       style={styles.checkbox}
//                     />
//                   </td>
//                   <td style={styles.userCell}>
//                     <div style={styles.userInfo}>
//                       <div style={styles.avatarContainer}>
//                         <div style={styles.avatar}>
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                         <div style={styles.statusDot}></div>
//                       </div>
//                       <div>
//                         <p style={styles.userName}>{user.name}</p>
//                         {user.companyName && (
//                           <p style={styles.companyName}>{user.companyName}</p>
//                         )}
//                         <p style={styles.userId}>ID: {user._id?.substring(0, 8)}...</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td style={styles.emailCell}>
//                     <div style={styles.emailInfo}>
//                       <span style={styles.emailText}>{user.email}</span>
//                       <button
//                         onClick={() => window.location.href = `mailto:${user.email}`}
//                         style={styles.emailButton}
//                         title="Send email"
//                       >
//                         <span>✉️</span>
//                       </button>
//                     </div>
//                   </td>
//                   <td style={styles.roleCell}>
//                     {editingUserId === user._id ? (
//                       <select
//                         value={editingRole}
//                         onChange={(e) => setEditingRole(e.target.value)}
//                         style={styles.roleSelect}
//                         autoFocus
//                       >
//                         <option value="applicant">Applicant</option>
//                         <option value="company">Company</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     ) : (
//                       <span style={{
//                         ...styles.roleBadge,
//                         ...(user.role === 'admin' ? styles.adminBadge :
//                             user.role === 'company' ? styles.companyBadge :
//                             styles.applicantBadge)
//                       }}>
//                         {user.role === 'admin' ? '👑' : user.role === 'company' ? '🏢' : '👤'}
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                       </span>
//                     )}
//                   </td>
//                   <td style={styles.statusCell}>
//                     {user.role === "company" ? (
//                       <div style={styles.statusContainer}>
//                         <span style={{
//                           ...styles.statusBadge,
//                           ...(user.companyStatus === 'approved' ? styles.approvedBadge :
//                               user.companyStatus === 'rejected' ? styles.rejectedBadge :
//                               styles.pendingBadge)
//                         }}>
//                           {user.companyStatus === 'approved' ? '✅' : 
//                            user.companyStatus === 'rejected' ? '❌' : '⏳'}
//                           {user.companyStatus.charAt(0).toUpperCase() + user.companyStatus.slice(1)}
//                         </span>
//                         <select
//                           value={editingStatus}
//                           onChange={(e) => {
//                             setEditingStatus(e.target.value);
//                             if (e.target.value) {
//                               handleStatusChange(user._id, e.target.value);
//                             }
//                           }}
//                           style={styles.statusSelect}
//                         >
//                           <option value="">Change</option>
//                           <option value="pending">Pending</option>
//                           <option value="approved">Approve</option>
//                           <option value="rejected">Reject</option>
//                         </select>
//                       </div>
//                     ) : (
//                       <span style={styles.naText}>—</span>
//                     )}
//                   </td>
//                   <td style={styles.dateCell}>
//                     <div style={styles.dateContainer}>
//                       <span style={styles.date}>
//                         {new Date(user.createdAt).toLocaleDateString('en-US', { 
//                           month: 'short', 
//                           day: 'numeric', 
//                           year: 'numeric' 
//                         })}
//                       </span>
//                       <span style={styles.time}>
//                         {new Date(user.createdAt).toLocaleTimeString('en-US', { 
//                           hour: '2-digit', 
//                           minute: '2-digit' 
//                         })}
//                       </span>
//                     </div>
//                   </td>
//                   <td style={styles.actionsCell}>
//                     <div style={styles.actionButtons}>
//                       {editingUserId === user._id ? (
//                         <>
//                           <button
//                             onClick={() => handleRoleChange(user._id, editingRole)}
//                             style={styles.saveButton}
//                           >
//                             <span>💾</span>
//                             Save
//                           </button>
//                           <button
//                             onClick={() => setEditingUserId(null)}
//                             style={styles.cancelButton}
//                           >
//                             <span>✕</span>
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => {
//                               setEditingUserId(user._id);
//                               setEditingRole(user.role);
//                             }}
//                             style={styles.editButton}
//                           >
//                             <span>✏️</span>
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user._id, user.name)}
//                             disabled={isDeleting}
//                             style={styles.deleteButton}
//                           >
//                             <span>{isDeleting ? '⏳' : '🗑️'}</span>
//                           </button>
//                           <button
//                             onClick={() => router.push(`/admin/users/${user._id}`)}
//                             style={styles.viewButton}
//                           >
//                             <span>👁️</span>
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Empty State */}
//           {currentUsers.length === 0 && (
//             <div style={styles.emptyState}>
//               <div style={styles.emptyStateIcon}>
//                 <span>👥</span>
//               </div>
//               <h3 style={styles.emptyStateTitle}>No users found</h3>
//               <p style={styles.emptyStateText}>
//                 {searchTerm || roleFilter !== "all" || statusFilter !== "all"
//                   ? "Try adjusting your filters or search terms"
//                   : "No users in the system yet"}
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setRoleFilter("all");
//                   setStatusFilter("all");
//                 }}
//                 style={styles.emptyStateButton}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && filteredUsers.length > 0 && (
//           <div style={styles.pagination}>
//             <div style={styles.paginationInfo}>
//               <span style={styles.paginationText}>
//                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)}
//               </span>
//               <span style={styles.paginationSeparator}>•</span>
//               <span style={styles.paginationText}>Total: {filteredUsers.length} users</span>
//             </div>
            
//             <div style={styles.paginationControls}>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 style={styles.paginationButton}
//               >
//                 ←
//               </button>
              
//               <div style={styles.pageNumbers}>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }

//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => setCurrentPage(pageNum)}
//                       style={{
//                         ...styles.pageNumber,
//                         ...(currentPage === pageNum ? styles.activePageNumber : {})
//                       }}
//                     >
//                       {pageNum}
//                     </button>
//                   );
//                 })}
                
//                 {totalPages > 5 && currentPage < totalPages - 2 && (
//                   <>
//                     <span style={styles.ellipsis}>...</span>
//                     <button
//                       onClick={() => setCurrentPage(totalPages)}
//                       style={styles.pageNumber}
//                     >
//                       {totalPages}
//                     </button>
//                   </>
//                 )}
//               </div>
              
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//                 style={styles.paginationButton}
//               >
//                 →
//               </button>
//             </div>
            
//             <div style={styles.goToPage}>
//               <span style={styles.goToLabel}>Go to:</span>
//               <div style={styles.pageInputContainer}>
//                 <input
//                   type="number"
//                   min="1"
//                   max={totalPages}
//                   value={currentPage}
//                   onChange={(e) => {
//                     const page = Math.max(1, Math.min(totalPages, Number(e.target.value) || 1));
//                     setCurrentPage(page);
//                   }}
//                   style={styles.pageInput}
//                 />
//                 <div style={styles.pageInputSuffix}>
//                   <span style={styles.pageInputSlash}>/</span>
//                   <span style={styles.totalPages}>{totalPages}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     minHeight: "100vh",
//     backgroundColor: "#f8fafc",
//     padding: "1rem",
//   },
//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     minHeight: "100vh",
//   },
//   spinner: {
//     width: "50px",
//     height: "50px",
//     border: "5px solid #e2e8f0",
//     borderTopColor: "#3b82f6",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },
//   spinning: {
//     animation: "spin 1s linear infinite",
//   },
//   notificationsContainer: {
//     position: "fixed",
//     top: "1rem",
//     right: "1rem",
//     zIndex: 50,
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.75rem",
//     maxWidth: "24rem",
//   },
//   notification: {
//     padding: "0.75rem 1.25rem",
//     borderRadius: "0.75rem",
//     backdropFilter: "blur(8px)",
//     transform: "translateX(0)",
//     animation: "slideInRight 0.3s ease-out",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//   },
//   successNotification: {
//     background: "linear-gradient(to right, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))",
//     color: "white",
//   },
//   errorNotification: {
//     background: "linear-gradient(to right, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))",
//     color: "white",
//   },
//   notificationContent: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//   },
//   notificationIcon: {
//     fontSize: "1.125rem",
//   },
//   notificationText: {
//     fontWeight: "500",
//   },
//   header: {
//     marginBottom: "2rem",
//   },
//   headerTop: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//     marginBottom: "1.5rem",
//   },
//   title: {
//     fontSize: "2.25rem",
//     fontWeight: "bold",
//     background: "linear-gradient(to right, #111827, #374151)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     marginBottom: "0.5rem",
//   },
//   subtitle: {
//     color: "#4b5563",
//     fontSize: "1.125rem",
//   },
//   headerActions: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "0.75rem",
//   },
//   refreshButton: {
//     padding: "0.625rem 1.25rem",
//     backgroundColor: "white",
//     border: "1px solid #d1d5db",
//     borderRadius: "0.75rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
//   },
//   resetButton: {
//     padding: "0.625rem 1.25rem",
//     background: "linear-gradient(to right, #3b82f6, #2563eb)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.75rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
//   },
//   buttonIcon: {
//     fontSize: "1.125rem",
//   },
//   buttonText: {
//     fontWeight: "500",
//   },
//   statsContainer: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//     gap: "1rem",
//   },
//   statCard: {
//     backgroundColor: "white",
//     borderRadius: "1rem",
//     padding: "1.25rem",
//     boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
//     border: "1px solid #f3f4f6",
//     transition: "all 0.3s",
//   },
//   statContent: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   statNumber: {
//     fontSize: "1.75rem",
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: "0.25rem",
//   },
//   statLabel: {
//     fontSize: "0.875rem",
//     color: "#6b7280",
//   },
//   statIconContainer: {
//     width: "3rem",
//     height: "3rem",
//     borderRadius: "0.75rem",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1.5rem",
//     color: "white",
//     background: "linear-gradient(to right, #3b82f6, #6366f1)",
//     boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
//   },
//   mainCard: {
//     backgroundColor: "white",
//     borderRadius: "1rem",
//     boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
//     overflow: "hidden",
//     border: "1px solid #e5e7eb",
//   },
//   filtersSection: {
//     padding: "1.5rem",
//     borderBottom: "1px solid #e5e7eb",
//     background: "linear-gradient(to right, #f9fafb, white)",
//   },
//   filtersRow: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   searchContainer: {
//     flex: 1,
//     position: "relative",
//   },
//   searchIconWrapper: {
//     position: "absolute",
//     top: 0,
//     bottom: 0,
//     left: 0,
//     paddingLeft: "1rem",
//     display: "flex",
//     alignItems: "center",
//     pointerEvents: "none",
//   },
//   searchIcon: {
//     color: "#9ca3af",
//     fontSize: "1.125rem",
//   },
//   searchInput: {
//     width: "100%",
//     padding: "0.875rem 1rem 0.875rem 3rem",
//     border: "2px solid #d1d5db",
//     borderRadius: "0.75rem",
//     fontSize: "1rem",
//     color: "#374151",
//     transition: "all 0.3s",
//   },
//   clearSearchButton: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     bottom: 0,
//     paddingRight: "1rem",
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//   },
//   clearSearchIcon: {
//     color: "#9ca3af",
//     fontSize: "1.125rem",
//   },
//   filterActions: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "0.75rem",
//   },
//   filterToggleButton: {
//     padding: "0.875rem 1.25rem",
//     border: "2px solid #d1d5db",
//     borderRadius: "0.75rem",
//     backgroundColor: "white",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//   },
//   arrowIcon: {
//     transition: "transform 0.3s",
//   },
//   bulkDeleteButton: {
//     padding: "0.875rem 1.25rem",
//     background: "linear-gradient(to right, #ef4444, #dc2626)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.75rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 4px 6px rgba(239, 68, 68, 0.3)",
//   },
//   advancedFilters: {
//     overflow: "hidden",
//     transition: "all 0.3s",
//   },
//   filterGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//     gap: "1rem",
//   },
//   filterLabel: {
//     display: "block",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     color: "#374151",
//     marginBottom: "0.5rem",
//   },
//   filterSelect: {
//     width: "100%",
//     padding: "0.75rem",
//     border: "2px solid #d1d5db",
//     borderRadius: "0.75rem",
//     fontSize: "1rem",
//     color: "#374151",
//     backgroundColor: "white",
//     transition: "all 0.3s",
//   },
//   tableWrapper: {
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   tableHeader: {
//     background: "linear-gradient(to right, #f9fafb, #f3f4f6)",
//     borderBottom: "1px solid #e5e7eb",
//   },
//   checkboxHeaderCell: {
//     padding: "1rem 1.5rem",
//   },
//   tableHeaderCell: {
//     padding: "1rem",
//     textAlign: "left",
//     fontSize: "0.875rem",
//     fontWeight: "600",
//     color: "#111827",
//     cursor: "pointer",
//     transition: "background-color 0.2s",
//   },
//   sortHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//   },
//   sortIcon: {
//     color: "#9ca3af",
//   },
//   checkbox: {
//     width: "1.25rem",
//     height: "1.25rem",
//     borderRadius: "0.25rem",
//     border: "2px solid #d1d5db",
//     color: "#3b82f6",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   },
//   tableRow: {
//     borderBottom: "1px solid #f3f4f6",
//     transition: "all 0.2s",
//   },
//   checkboxCell: {
//     padding: "1rem 1.5rem",
//   },
//   userCell: {
//     padding: "1rem",
//   },
//   userInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//   },
//   avatarContainer: {
//     position: "relative",
//   },
//   avatar: {
//     width: "3rem",
//     height: "3rem",
//     borderRadius: "50%",
//     background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "white",
//     fontWeight: "bold",
//     fontSize: "1.125rem",
//     boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
//   },
//   statusDot: {
//     position: "absolute",
//     bottom: "-0.125rem",
//     right: "-0.125rem",
//     width: "1.25rem",
//     height: "1.25rem",
//     borderRadius: "50%",
//     border: "2px solid white",
//     background: "linear-gradient(to right, #10b981, #059669)",
//   },
//   userName: {
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: "0.25rem",
//   },
//   companyName: {
//     fontSize: "0.875rem",
//     color: "#6b7280",
//     marginBottom: "0.25rem",
//   },
//   userId: {
//     fontSize: "0.75rem",
//     color: "#9ca3af",
//   },
//   emailCell: {
//     padding: "1rem",
//   },
//   emailInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//   },
//   emailText: {
//     color: "#374151",
//     fontWeight: "500",
//   },
//   emailButton: {
//     color: "#9ca3af",
//     backgroundColor: "transparent",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "1.125rem",
//     transition: "all 0.2s",
//   },
//   roleCell: {
//     padding: "1rem",
//   },
//   roleSelect: {
//     padding: "0.5rem",
//     border: "2px solid #3b82f6",
//     borderRadius: "0.5rem",
//     fontSize: "0.875rem",
//     transition: "all 0.2s",
//   },
//   roleBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     padding: "0.5rem 1rem",
//     borderRadius: "9999px",
//     fontSize: "0.875rem",
//     fontWeight: "bold",
//     transition: "all 0.2s",
//     border: "1px solid",
//   },
//   adminBadge: {
//     background: "linear-gradient(to right, rgba(254, 226, 226, 0.5), rgba(254, 202, 202, 0.5))",
//     color: "#dc2626",
//     borderColor: "#fecaca",
//   },
//   companyBadge: {
//     background: "linear-gradient(to right, rgba(219, 234, 254, 0.5), rgba(191, 219, 254, 0.5))",
//     color: "#1d4ed8",
//     borderColor: "#93c5fd",
//   },
//   applicantBadge: {
//     background: "linear-gradient(to right, rgba(220, 252, 231, 0.5), rgba(187, 247, 208, 0.5))",
//     color: "#16a34a",
//     borderColor: "#86efac",
//   },
//   statusCell: {
//     padding: "1rem",
//   },
//   statusContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//   },
//   statusBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     padding: "0.5rem 1rem",
//     borderRadius: "9999px",
//     fontSize: "0.875rem",
//     fontWeight: "bold",
//     border: "1px solid",
//   },
//   pendingBadge: {
//     background: "linear-gradient(to right, rgba(254, 243, 199, 0.5), rgba(253, 230, 138, 0.5))",
//     color: "#d97706",
//     borderColor: "#fde68a",
//   },
//   approvedBadge: {
//     background: "linear-gradient(to right, rgba(220, 252, 231, 0.5), rgba(187, 247, 208, 0.5))",
//     color: "#16a34a",
//     borderColor: "#86efac",
//   },
//   rejectedBadge: {
//     background: "linear-gradient(to right, rgba(254, 226, 226, 0.5), rgba(254, 202, 202, 0.5))",
//     color: "#dc2626",
//     borderColor: "#fecaca",
//   },
//   statusSelect: {
//     padding: "0.375rem 0.75rem",
//     border: "1px solid #d1d5db",
//     borderRadius: "0.5rem",
//     fontSize: "0.875rem",
//     backgroundColor: "#f9fafb",
//   },
//   naText: {
//     color: "#9ca3af",
//     fontStyle: "italic",
//   },
//   dateCell: {
//     padding: "1rem",
//   },
//   dateContainer: {
//     display: "flex",
//     flexDirection: "column",
//   },
//   date: {
//     color: "#111827",
//     fontWeight: "500",
//   },
//   time: {
//     fontSize: "0.75rem",
//     color: "#9ca3af",
//   },
//   actionsCell: {
//     padding: "1rem",
//   },
//   actionButtons: {
//     display: "flex",
//     gap: "0.5rem",
//   },
//   editButton: {
//     padding: "0.5rem 1rem",
//     background: "linear-gradient(to right, #3b82f6, #2563eb)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.5rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
//   },
//   saveButton: {
//     padding: "0.5rem 1rem",
//     background: "linear-gradient(to right, #10b981, #059669)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.5rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 4px rgba(16, 185, 129, 0.3)",
//   },
//   cancelButton: {
//     padding: "0.5rem 1rem",
//     background: "linear-gradient(to right, #6b7280, #4b5563)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.5rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 4px rgba(107, 114, 128, 0.3)",
//   },
//   deleteButton: {
//     padding: "0.5rem 1rem",
//     background: "linear-gradient(to right, #ef4444, #dc2626)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.5rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
//   },
//   viewButton: {
//     padding: "0.5rem 1rem",
//     background: "linear-gradient(to right, #6b7280, #4b5563)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.5rem",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 2px 4px rgba(107, 114, 128, 0.3)",
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "4rem 1rem",
//   },
//   emptyStateIcon: {
//     width: "8rem",
//     height: "8rem",
//     margin: "0 auto 1.5rem",
//     borderRadius: "50%",
//     background: "linear-gradient(to right, #dbeafe, #e0e7ff)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "3rem",
//   },
//   emptyStateTitle: {
//     fontSize: "1.5rem",
//     fontWeight: "bold",
//     color: "#111827",
//     marginBottom: "0.75rem",
//   },
//   emptyStateText: {
//     color: "#6b7280",
//     marginBottom: "2rem",
//     maxWidth: "28rem",
//     margin: "0 auto 2rem",
//   },
//   emptyStateButton: {
//     padding: "0.75rem 2rem",
//     background: "linear-gradient(to right, #3b82f6, #2563eb)",
//     color: "white",
//     border: "none",
//     borderRadius: "0.75rem",
//     cursor: "pointer",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s",
//     boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
//   },
//   pagination: {
//     padding: "1.5rem",
//     borderTop: "1px solid #e5e7eb",
//     background: "linear-gradient(to right, #f9fafb, white)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "1.5rem",
//   },
//   paginationInfo: {
//     fontSize: "0.875rem",
//     color: "#6b7280",
//   },
//   paginationText: {
//     fontWeight: "500",
//   },
//   paginationSeparator: {
//     margin: "0 0.5rem",
//   },
//   paginationControls: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//   },
//   paginationButton: {
//     padding: "0.75rem",
//     borderRadius: "0.75rem",
//     border: "2px solid #d1d5db",
//     backgroundColor: "transparent",
//     cursor: "pointer",
//     transition: "all 0.2s",
//   },
//   pageNumbers: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.25rem",
//   },
//   pageNumber: {
//     width: "3rem",
//     height: "3rem",
//     borderRadius: "0.75rem",
//     border: "2px solid #d1d5db",
//     backgroundColor: "transparent",
//     cursor: "pointer",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "500",
//     transition: "all 0.2s",
//   },
//   activePageNumber: {
//     background: "linear-gradient(to right, #3b82f6, #2563eb)",
//     color: "white",
//     borderColor: "#3b82f6",
//     transform: "scale(1.05)",
//     boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
//   },
//   ellipsis: {
//     padding: "0 0.5rem",
//     color: "#9ca3af",
//   },
//   goToPage: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//   },
//   goToLabel: {
//     fontSize: "0.875rem",
//     fontWeight: "500",
//     color: "#6b7280",
//   },
//   pageInputContainer: {
//     position: "relative",
//   },
//   pageInput: {
//     width: "6rem",
//     padding: "0.625rem 3.5rem 0.625rem 1rem",
//     border: "2px solid #d1d5db",
//     borderRadius: "0.75rem",
//     fontSize: "1rem",
//     fontWeight: "500",
//     textAlign: "center",
//   },
//   pageInputSuffix: {
//     position: "absolute",
//     top: 0,
//     right: 0,
//     bottom: 0,
//     paddingRight: "1rem",
//     display: "flex",
//     alignItems: "center",
//     pointerEvents: "none",
//   },
//   pageInputSlash: {
//     color: "#9ca3af",
//     marginRight: "0.25rem",
//   },
//   totalPages: {
//     color: "#9ca3af",
//   },
// };

// // Add CSS animations
// if (typeof document !== "undefined") {
//   const style = document.createElement("style");
//   style.textContent = `
//     @keyframes spin {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }
    
//     @keyframes slideInRight {
//       from {
//         transform: translateX(100%);
//         opacity: 0;
//       }
//       to {
//         transform: translateX(0);
//         opacity: 1;
//       }
//     }
    
//     input:focus, select:focus, button:focus {
//       outline: none;
//     }
    
//     button:hover:not(:disabled) {
//       transform: translateY(-1px);
//     }
    
//     button:active:not(:disabled) {
//       transform: translateY(0);
//     }
    
//     tr:hover {
//       background-color: #f0f9ff !important;
//     }
    
//     button:disabled {
//       opacity: 0.5;
//       cursor: not-allowed;
//     }
//   `;
//   document.head.appendChild(style);
// }


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