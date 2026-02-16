// "use client";

// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";

// export default function Navbar() {
//   const { data: session } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const pathname = usePathname();

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Check if link is active
//   const isActive = (path) => {
//     if (path === "/") {
//       return pathname === path;
//     }
//     return pathname.startsWith(path);
//   };

//   // Navigation items configuration
//   const navItems = [
//     { href: "/", label: "Home" },
//     { href: "/jobs", label: "Jobs" },
//   ];

//   const applicantNavItems = [
//     { href: "/userdashboard", label: "Dashboard", role: "applicant" },
//     { href: "/userprofile", label: "Profile", role: "applicant" },
//   ];

//   const companyNavItems = [
//     { href: "/company/dashboard", label: "Dashboard", role: "company" },
//     { href: "/company/profile", label: "Profile", role: "company" },
//   ];

//   const adminNavItems = [
//     { href: "/admin", label: "Dashboard", role: "admin" },
//     { href: "/admin/companies", label: "Companies", role: "admin" },
//     { href: "/users", label: "Users", role: "admin" },
//   ];

//   const authNavItems = !session
//     ? [
//       { href: "/login", label: "Login" },
//       { href: "/signup/user", label: "User Signup" },
//       { href: "/signup/company", label: "Company Signup" },
//     ]
//     : [];

//   return (
//     <nav
//       style={{
//         ...styles.navbar,
//         backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : "#ffffff",
//         backdropFilter: scrolled ? "blur(10px)" : "none",
//         boxShadow: scrolled
//           ? "0 4px 20px rgba(0, 0, 0, 0.08)"
//           : "0 2px 4px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div style={styles.container}>
//         <div style={styles.navContent}>
//           {/* Logo/Brand */}
//           <div style={styles.logoContainer}>
//             <Link href="/" style={styles.brand}>
//               <div style={styles.logo}>
//                 <span style={styles.logoPrimary}>Career</span>
//                 <span style={styles.logoAccent}>Hub</span>
//                 <div style={styles.logoDot}></div>
//               </div>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div style={styles.desktopNav}>
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 style={{
//                   ...styles.navLink,
//                   ...(isActive(item.href) && styles.activeNavLink),
//                 }}
//               >
//                 {item.label}
//                 {isActive(item.href) && <div style={styles.activeIndicator} />}
//               </Link>
//             ))}

//             {/* Role-based navigation */}
//             {session?.user?.role === "applicant" &&
//               applicantNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.navLink,
//                     ...(isActive(item.href) && styles.activeNavLink),
//                   }}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.activeIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {session?.user?.role === "company" &&
//               companyNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.navLink,
//                     ...(isActive(item.href) && styles.activeNavLink),
//                   }}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.activeIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {session?.user?.role === "admin" &&
//               adminNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.navLink,
//                     ...(isActive(item.href) && styles.activeNavLink),
//                   }}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.activeIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {/* Auth navigation */}
//             {authNavItems.map((item, index) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 style={{
//                   ...styles.navLink,
//                   ...(index === 0
//                     ? styles.loginLink
//                     : index === 1
//                       ? styles.userSignupLink
//                       : styles.companySignupLink),
//                   ...(isActive(item.href) && styles.activeNavLink),
//                 }}
//               >
//                 {item.label}
//                 {isActive(item.href) && <div style={styles.activeIndicator} />}
//               </Link>
//             ))}

//             {/* User session */}
//             {session && (
//               <div style={styles.sessionContainer}>
//                 <div style={styles.userInfo}>
//                   <div style={styles.avatar}>
//                     {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                   <div style={styles.userDetails}>
//                     <span style={styles.userName}>{session.user?.name}</span>
//                     <div style={styles.roleBadge}>
//                       {session.user?.role?.toLowerCase()}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => signOut()}
//                   style={styles.logoutButton}
//                   className="logout-btn"
//                 >
//                   <svg
//                     style={styles.logoutIcon}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                     />
//                   </svg>
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <button
//             style={styles.mobileMenuButton}
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="mobile-menu-btn"
//             aria-label="Toggle menu"
//           >
//             <div
//               style={{
//                 ...styles.menuIcon,
//                 transform: isMenuOpen ? "rotate(45deg)" : "none",
//               }}
//             >
//               <span
//                 style={{
//                   ...styles.menuLine,
//                   transform: isMenuOpen
//                     ? "rotate(90deg) translateX(0)"
//                     : "translateY(-3px)",
//                 }}
//               />
//               <span
//                 style={{
//                   ...styles.menuLine,
//                   opacity: isMenuOpen ? 0 : 1,
//                 }}
//               />
//               <span
//                 style={{
//                   ...styles.menuLine,
//                   transform: isMenuOpen
//                     ? "rotate(90deg) translateX(0)"
//                     : "translateY(3px)",
//                 }}
//               />
//             </div>
//           </button>
//         </div>

//         {/* Mobile Navigation */}
//         <div
//           style={{
//             ...styles.mobileMenu,
//             maxHeight: isMenuOpen ? "1000px" : "0",
//             opacity: isMenuOpen ? 1 : 0,
//           }}
//         >
//           <div style={styles.mobileMenuContent}>
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 style={{
//                   ...styles.mobileNavLink,
//                   ...(isActive(item.href) && styles.mobileActiveNavLink),
//                 }}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.label}
//                 {isActive(item.href) && (
//                   <div style={styles.mobileActiveIndicator} />
//                 )}
//               </Link>
//             ))}

//             {session?.user?.role === "applicant" &&
//               applicantNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.mobileNavLink,
//                     ...(isActive(item.href) && styles.mobileActiveNavLink),
//                   }}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.mobileActiveIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {session?.user?.role === "company" &&
//               companyNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.mobileNavLink,
//                     ...(isActive(item.href) && styles.mobileActiveNavLink),
//                   }}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.mobileActiveIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {session?.user?.role === "admin" &&
//               adminNavItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   style={{
//                     ...styles.mobileNavLink,
//                     ...(isActive(item.href) && styles.mobileActiveNavLink),
//                   }}
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                   {isActive(item.href) && (
//                     <div style={styles.mobileActiveIndicator} />
//                   )}
//                 </Link>
//               ))}

//             {!session ? (
//               <>
//                 {authNavItems.map((item, index) => (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     style={{
//                       ...styles.mobileNavLink,
//                       ...(index === 0
//                         ? styles.mobileLoginLink
//                         : index === 1
//                           ? styles.mobileUserSignupLink
//                           : styles.mobileCompanySignupLink),
//                       ...(isActive(item.href) && styles.mobileActiveNavLink),
//                     }}
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {item.label}
//                     {isActive(item.href) && (
//                       <div style={styles.mobileActiveIndicator} />
//                     )}
//                   </Link>
//                 ))}
//               </>
//             ) : (
//               <>
//                 <div style={styles.mobileUserInfo}>
//                   <div style={styles.mobileAvatar}>
//                     {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
//                   </div>
//                   <div style={styles.mobileUserDetails}>
//                     <span style={styles.mobileUserName}>
//                       {session.user?.name}
//                     </span>
//                     <div style={styles.mobileRoleBadge}>
//                       {session.user?.role?.toLowerCase()}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => {
//                     signOut();
//                     setIsMenuOpen(false);
//                   }}
//                   style={styles.mobileLogoutButton}
//                 >
//                   <svg
//                     style={styles.mobileLogoutIcon}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                     />
//                   </svg>
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// // Modern styles with gradients and animations
// const styles = {
//   navbar: {
//     position: "sticky",
//     top: 0,
//     zIndex: 1000,
//     padding: "1rem 0",
//     transition: "all 0.3s ease",
//   },
//   container: {
//     maxWidth: "1400px",
//     margin: "0 auto",
//     padding: "0 2rem",
//   },
//   navContent: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logoContainer: {
//     flexShrink: 0,
//   },
//   logo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//     position: "relative",
//   },
//   logoPrimary: {
//     fontSize: "1.8rem",
//     fontWeight: "800",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     letterSpacing: "-0.5px",
//   },
//   logoAccent: {
//     fontSize: "1.8rem",
//     fontWeight: "800",
//     color: "#4f46e5",
//     letterSpacing: "-0.5px",
//   },
//   logoDot: {
//     width: "8px",
//     height: "8px",
//     backgroundColor: "#10b981",
//     borderRadius: "50%",
//     marginLeft: "2px",
//   },
//   brand: {
//     textDecoration: "none",
//   },
//   desktopNav: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//   },
//   navLink: {
//     padding: "0.75rem 1.25rem",
//     color: "#4b5563",
//     textDecoration: "none",
//     borderRadius: "12px",
//     fontSize: "0.95rem",
//     fontWeight: "500",
//     transition: "all 0.2s ease",
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   activeNavLink: {
//     color: "#4f46e5",
//     backgroundColor: "rgba(79, 70, 229, 0.08)",
//   },
//   activeIndicator: {
//     position: "absolute",
//     bottom: "-2px",
//     width: "20px",
//     height: "3px",
//     backgroundColor: "#4f46e5",
//     borderRadius: "2px",
//     animation: "slideIn 0.3s ease",
//   },
//   loginLink: {
//     color: "#4b5563",
//     fontWeight: "600",
//   },
//   userSignupLink: {
//     backgroundColor: "rgba(79, 70, 229, 0.1)",
//     color: "#4f46e5",
//     fontWeight: "600",
//   },
//   companySignupLink: {
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "white",
//     fontWeight: "600",
//   },
//   sessionContainer: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1.5rem",
//     marginLeft: "1rem",
//     paddingLeft: "1.5rem",
//     borderLeft: "2px solid #e5e7eb",
//   },
//   userInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.75rem",
//   },
//   avatar: {
//     width: "42px",
//     height: "42px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "white",
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "bold",
//     fontSize: "1.1rem",
//     boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
//   },
//   userDetails: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2px",
//   },
//   userName: {
//     fontWeight: "600",
//     color: "#1f2937",
//     fontSize: "0.95rem",
//   },
//   roleBadge: {
//     fontSize: "0.7rem",
//     color: "#10b981",
//     backgroundColor: "rgba(16, 185, 129, 0.1)",
//     padding: "2px 8px",
//     borderRadius: "10px",
//     fontWeight: "600",
//     letterSpacing: "0.5px",
//   },
//   logoutButton: {
//     padding: "0.75rem 1.5rem",
//     background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//     color: "white",
//     border: "none",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "0.9rem",
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     transition: "all 0.2s ease",
//     boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
//   },
//   logoutIcon: {
//     width: "18px",
//     height: "18px",
//   },
//   mobileMenuButton: {
//     display: "none",
//     background: "none",
//     border: "none",
//     padding: "0.5rem",
//     cursor: "pointer",
//     zIndex: 1001,
//   },
//   menuIcon: {
//     width: "24px",
//     height: "24px",
//     position: "relative",
//     transition: "transform 0.3s ease",
//   },
//   menuLine: {
//     position: "absolute",
//     width: "100%",
//     height: "2px",
//     backgroundColor: "#4f46e5",
//     borderRadius: "2px",
//     left: 0,
//     transition: "all 0.3s ease",
//   },
//   mobileMenu: {
//     position: "absolute",
//     top: "100%",
//     left: 0,
//     right: 0,
//     backgroundColor: "white",
//     boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
//     overflow: "hidden",
//     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//     borderTop: "1px solid #e5e7eb",
//   },
//   mobileMenuContent: {
//     padding: "1.5rem 2rem",
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//   },
//   mobileNavLink: {
//     padding: "1rem 1.5rem",
//     color: "#4b5563",
//     textDecoration: "none",
//     borderRadius: "10px",
//     fontSize: "1rem",
//     fontWeight: "500",
//     transition: "all 0.2s ease",
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   mobileActiveNavLink: {
//     color: "#4f46e5",
//     backgroundColor: "rgba(79, 70, 229, 0.08)",
//   },
//   mobileActiveIndicator: {
//     width: "8px",
//     height: "8px",
//     backgroundColor: "#4f46e5",
//     borderRadius: "50%",
//   },
//   mobileLoginLink: {
//     color: "#4b5563",
//   },
//   mobileUserSignupLink: {
//     color: "#4f46e5",
//   },
//   mobileCompanySignupLink: {
//     color: "#764ba2",
//   },
//   mobileUserInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: "1rem",
//     padding: "1.5rem",
//     backgroundColor: "#f8fafc",
//     borderRadius: "12px",
//     margin: "0.5rem 0",
//   },
//   mobileAvatar: {
//     width: "48px",
//     height: "48px",
//     background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//     color: "white",
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontWeight: "bold",
//     fontSize: "1.2rem",
//   },
//   mobileUserDetails: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "4px",
//   },
//   mobileUserName: {
//     fontWeight: "600",
//     color: "#1f2937",
//     fontSize: "1rem",
//   },
//   mobileRoleBadge: {
//     fontSize: "0.75rem",
//     color: "#10b981",
//     backgroundColor: "rgba(16, 185, 129, 0.1)",
//     padding: "4px 10px",
//     borderRadius: "10px",
//     fontWeight: "600",
//     width: "fit-content",
//   },
//   mobileLogoutButton: {
//     padding: "1rem 1.5rem",
//     background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//     color: "white",
//     border: "none",
//     borderRadius: "12px",
//     cursor: "pointer",
//     fontWeight: "600",
//     fontSize: "1rem",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//     marginTop: "0.5rem",
//     transition: "all 0.2s ease",
//   },
//   mobileLogoutIcon: {
//     width: "20px",
//     height: "20px",
//   },
// };

// // Add global styles with animations
// if (typeof window !== "undefined") {
//   const style = document.createElement("style");
//   style.textContent = `
//     @media (max-width: 1024px) {
//       .desktop-nav {
//         display: none !important;
//       }
//       .mobile-menu-btn {
//         display: block !important;
//       }
//     }
    
//     @media (min-width: 1025px) {
//       .mobile-menu {
//         display: none !important;
//       }
//     }
    
//     .logout-btn:hover {
//       transform: translateY(-2px);
//       box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3) !important;
//     }
    
//     .nav-link:hover {
//       background-color: rgba(79, 70, 229, 0.05);
//       transform: translateY(-1px);
//     }
    
//     .mobile-menu-btn:hover .menu-icon span {
//       background-color: #6366f1;
//     }
    
//     @keyframes slideIn {
//       from {
//         transform: scaleX(0);
//         opacity: 0;
//       }
//       to {
//         transform: scaleX(1);
//         opacity: 1;
//       }
//     }
    
//     @keyframes fadeIn {
//       from {
//         opacity: 0;
//         transform: translateY(-10px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
    
//     .mobile-menu {
//       animation: fadeIn 0.3s ease;
//     }
//   `;
//   document.head.appendChild(style);
// }


"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  console.log("navbar Console=>", session)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Navigation items configuration
  const navItems = [
    { href: "/", label: "Home", icon: "" },
    { href: "/jobs", label: "Jobs", icon: "" },
  ];

  const applicantNavItems = [
    { href: "/userdashboard", label: "Dashboard", role: "applicant", icon: "" },
    { href: "/userprofile", label: "Profile", role: "applicant", icon: "" },
  ];

  const companyNavItems = [
    { href: "/company/dashboard", label: "Dashboard", role: "company", icon: "" },
    { href: "/company/profile", label: "Profile", role: "company", icon: "" },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", role: "admin", icon: "" },
    { href: "/admin/companies", label: "Companies", role: "admin", icon: "" },
    { href: "/users", label: "Users", role: "admin", icon: "" },
  ];

  const authNavItems = !session
    ? [
      { href: "/login", label: "Login", icon: "" },
      { href: "/signup/user", label: "User Signup", icon: "" },
      { href: "/signup/company", label: "Company Signup", icon: "" },
    ]
    : [];

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <nav className={`navbar-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white text-lg font-bold">C</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareerHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  )}
                </Link>
              ))}

              {/* Role-based navigation */}
              {session?.user?.role === "applicant" &&
                applicantNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}

              {session?.user?.role === "company" &&
                companyNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}

              {session?.user?.role === "admin" &&
                adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    )}
                  </Link>
                ))}
            </div>
          </div>

          {/* Right side - Auth buttons / User info */}
          <div className="hidden md:flex items-center space-x-3">
            {!session ? (
              <div className="flex items-center space-x-3">
                {authNavItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center
                      ${index === 0 
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50' 
                        : index === 1
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-600'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:from-blue-600 hover:to-purple-600'
                      }
                    `}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{session.user?.name}</span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
                      {session.user?.role}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <span></span>
                  <span>Logout</span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-1 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-5 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <motion.div key={item.href} variants={menuItemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item.href) && (
                      <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Role-based mobile navigation */}
              {session?.user?.role === "applicant" &&
                applicantNavItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive(item.href) && (
                        <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      )}
                    </Link>
                  </motion.div>
                ))}

              {session?.user?.role === "company" &&
                companyNavItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive(item.href) && (
                        <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      )}
                    </Link>
                  </motion.div>
                ))}

              {session?.user?.role === "admin" &&
                adminNavItems.map((item) => (
                  <motion.div key={item.href} variants={menuItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive(item.href) && (
                        <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      )}
                    </Link>
                  </motion.div>
                ))}

              {/* Mobile Auth Buttons */}
              {!session ? (
                <>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
                    >
                      <span className="text-lg"></span>
                      <span>Login</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      href="/signup/user"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg transition-all duration-200"
                    >
                      <span className="text-lg"></span>
                      <span>User Signup</span>
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      href="/signup/company"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200"
                    >
                      <span className="text-lg"></span>
                      <span>Company Signup</span>
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={menuItemVariants} className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{session.user?.name}</p>
                        <p className="text-sm text-gray-600">{session.user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
                          {session.user?.role}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      <span></span>
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add global styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .gradient-border {
          position: relative;
        }
        
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </nav>
  );
}