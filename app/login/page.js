// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setLoginError("");

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (!res.error) {
//       router.push("/");
//     } else {
//       setLoginError("Invalid email or password. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setIsLoading(true);
//     setLoginError("");
//     await signIn("google", { callbackUrl: "/" });
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.3 }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8"
//         >
//           {/* Logo and Header */}
//           <motion.div variants={itemVariants} className="text-center mb-8">
//             <div className="flex items-center justify-center mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
//                 <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
//                   <span className="text-2xl text-white">🏢</span>
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
//             <p className="text-gray-600">Sign in to access your dashboard</p>
//           </motion.div>

//           {/* Error Message */}
//           {loginError && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-red-600">⚠</span>
//                 <p className="text-red-700 text-sm font-medium">{loginError}</p>
//               </div>
//             </motion.div>
//           )}

//           {/* Google Login Button */}
//           <motion.button
//             variants={itemVariants}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleGoogleLogin}
//             disabled={isLoading}
//             className="w-full mb-6 flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
//             ) : (
//               <>
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span>Continue with Google</span>
//               </>
//             )}
//           </motion.button>

//           {/* Divider */}
//           <motion.div variants={itemVariants} className="relative mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-white text-gray-500">Or continue with email</span>
//             </div>
//           </motion.div>

//           {/* Email Login Form */}
//           <motion.form variants={containerVariants} onSubmit={handleLogin} className="space-y-5">
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-400"></span>
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="you@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                   disabled={isLoading}
//                 />
//               </div>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-400"></span>
//                 </div>
//                 <input
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                   disabled={isLoading}
//                 />
//               </div>
//             </motion.div>

       

//             <motion.button
//               variants={itemVariants}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={isLoading}
//               className="w-full mt-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Signing in...</span>
//                 </div>
//               ) : (
//                 "Sign In"
//               )}
//             </motion.button>
//           </motion.form>

//           {/* Sign Up Link */}
//           <motion.div
//             variants={itemVariants}
//             className="mt-8 text-center"
//           >
//             <p className="text-gray-600">
//               Don't have an account?{" "} <br/>
//               <a 
//                 href="/signup/user" 
//                 className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                  User Sign up 
//               </a> <br/>
//               <a 
//                 href="/signup/company" 
//                 className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                Company Sign up
//               </a>
//             </p>
//           </motion.div>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-6 text-center"
//         >
//           <p className="text-sm text-gray-500">
//             By continuing, you agree to our{" "}
//             <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
//               Terms
//             </a>{" "}
//             and{" "}
//             <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
//               Privacy Policy
//             </a>
//           </p>
//         </motion.div>
//       </motion.div>

//       <style jsx>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }



// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Mail, Lock, Eye, EyeOff, LogIn, Chrome } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setLoginError("");

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (!res?.error) {
//       router.push("/");
//     } else {
//       setLoginError("Invalid email or password. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setIsLoading(true);
//     setLoginError("");
//     await signIn("google", { callbackUrl: "/" });
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         when: "beforeChildren",
//         staggerChildren: 0.12,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 24, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.4, ease: "easeOut" },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-5 relative overflow-hidden">
//       {/* Background blobs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="relative z-10 w-full max-w-md"
//       >
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-9"
//         >
//           {/* Logo & Header */}
//           <motion.div variants={itemVariants} className="text-center mb-10">
//             <div className="flex items-center justify-center mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse-slow"></div>
//                 <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
//                   <span className="text-3xl text-white">🏢</span>
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
//             <p className="mt-2 text-gray-600">Sign in to manage your dashboard</p>
//           </motion.div>

//           {/* Error */}
//           {loginError && (
//             <motion.div
//               initial={{ opacity: 0, y: -12 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-2xl text-sm"
//             >
//               <div className="flex items-center gap-2.5">
//                 <span className="text-red-600 text-lg">⚠</span>
//                 <p className="text-red-700 font-medium">{loginError}</p>
//               </div>
//             </motion.div>
//           )}

//           {/* Google Button */}
//           <motion.button
//             variants={itemVariants}
//             whileHover={{ scale: 1.02, y: -1 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleGoogleLogin}
//             disabled={isLoading}
//             className="w-full mb-8 flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 text-gray-800 font-semibold rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
//           >
//             {isLoading ? (
//               <div className="w-6 h-6 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
//             ) : (
//               <>
//                 <Chrome className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
//                 <span>Continue with Google</span>
//               </>
//             )}
//           </motion.button>

//           {/* Divider */}
//           <motion.div variants={itemVariants} className="relative mb-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-5 bg-white text-gray-500 font-medium">or continue with email</span>
//             </div>
//           </motion.div>

//           {/* Form */}
//           <motion.form variants={containerVariants} onSubmit={handleLogin} className="space-y-6">
//             {/* Email */}
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="you@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={isLoading}
//                   className="w-full pl-11 pr-5 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 disabled:opacity-60"
//                 />
//               </div>
//             </motion.div>

//             {/* Password */}
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={isLoading}
//                   className="w-full pl-11 pr-12 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 disabled:opacity-60"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </motion.div>

//             {/* Submit */}
//             <motion.button
//               variants={itemVariants}
//               whileHover={{ scale: 1.03, y: -1 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               disabled={isLoading}
//               className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
//                   <span>Signing in...</span>
//                 </>
//               ) : (
//                 <>
//                   <LogIn className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </motion.button>
//           </motion.form>

//           {/* Sign Up Links */}
//           <motion.div variants={itemVariants} className="mt-10 text-center text-sm">
//             <p className="text-gray-600">
//               Don't have an account?{" "}
//             </p>
//             <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
//               <a
//                 href="/signup/user"
//                 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
//               >
//                 Sign up as User
//               </a>
//               <span className="text-gray-400 hidden sm:inline">|</span>
//               <a
//                 href="/signup/company"
//                 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
//               >
//                 Sign up as Company
//               </a>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-8 text-center text-sm text-gray-500"
//         >
//           By continuing, you agree to our{" "}
//           <a href="#" className="text-gray-600 hover:text-gray-800 underline underline-offset-2">
//             Terms
//           </a>{" "}
//           and{" "}
//           <a href="#" className="text-gray-600 hover:text-gray-800 underline underline-offset-2">
//             Privacy Policy
//           </a>
//         </motion.div>
//       </motion.div>

//       <style jsx global>{`
//         @keyframes blob {
//           0%   { transform: translate(0px, 0px) scale(1); }
//           33%  { transform: translate(60px, -80px) scale(1.15); }
//           66%  { transform: translate(-40px, 40px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob {
//           animation: blob 14s infinite ease-in-out;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.4; }
//           50%      { opacity: 0.6; }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 8s infinite ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// }


"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Chrome,
  Building2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      setLoginError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setLoginError("");
    await signIn("google", { callbackUrl: "/" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-5 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 p-9"
        >
          {/* Logo & Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-40 animate-pulse-slow"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Building2 className="w-10 h-10 text-white" strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-gray-600">Sign in to manage your dashboard</p>
          </motion.div>

          {/* Error message */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50/80 border border-red-200 rounded-2xl text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-red-600 text-lg">⚠</span>
                <p className="text-red-700 font-medium">{loginError}</p>
              </div>
            </motion.div>
          )}

          {/* Google Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mb-8 flex items-center justify-center gap-3 py-4 px-6 bg-white border border-gray-200 text-gray-800 font-semibold rounded-2xl hover:bg-gray-50 hover:shadow-md transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
            ) : (
              <>
                <Chrome className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-5 bg-white text-gray-500 font-medium">
                or continue with email
              </span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={containerVariants}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-5 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 disabled:opacity-60"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Sign Up Links */}
          <motion.div variants={itemVariants} className="mt-10 text-center text-sm">
            <p className="text-gray-600">Don't have an account?</p>
            <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/signup/user"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                Sign up as User
              </a>
              <span className="text-gray-400 hidden sm:inline"> | </span>
              <a
                href="/signup/company"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                Sign up as Company
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-500"
        >
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 underline underline-offset-2"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-gray-600 hover:text-gray-800 underline underline-offset-2"
          >
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(60px, -80px) scale(1.15);
          }
          66% {
            transform: translate(-40px, 40px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 14s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}