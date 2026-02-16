// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function CompanySignup() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validate password strength
//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           role: "company",
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // Show success message before redirect
//         setError("success");
//         setTimeout(() => {
//           router.push("/login");
//         }, 1500);
//       } else {
//         setError(data.message || "Signup failed. Please try again.");
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 10, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.3 }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
//           {/* Header */}
//           <motion.div variants={itemVariants} className="text-center mb-8">
//             <div className="flex items-center justify-center mb-6">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
//                 <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
//                   <span className="text-2xl text-white">🏢</span>
//                 </div>
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Registration</h1>
//             <p className="text-gray-600">Create your company account to start hiring talent</p>
//           </motion.div>

//           {/* Success Message */}
//           {error === "success" && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-green-600 text-xl">🎉</span>
//                 <div>
//                   <p className="text-green-700 font-semibold">Registration successful!</p>
//                   <p className="text-green-600 text-sm mt-1">Redirecting to login...</p>
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Error Message */}
//           {error && error !== "success" && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-red-600">⚠</span>
//                 <p className="text-red-700 text-sm font-medium">{error}</p>
//               </div>
//             </motion.div>
//           )}

//           {/* Signup Form */}
//           <motion.form 
//             variants={containerVariants}
//             onSubmit={handleSubmit} 
//             className="space-y-5"
//           >
//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Name *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-400"></span>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Enter your company name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                   disabled={loading || error === "success"}
//                 />
//               </div>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Company Email *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-400"></span>
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="contact@company.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                   disabled={loading || error === "success"}
//                 />
//               </div>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password *
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-400"></span>
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="At least 8 characters"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
//                   disabled={loading || error === "success"}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   <span className="text-gray-400 hover:text-gray-600 transition-colors">
//                     {showPassword ? "👁️" : "👁️‍🗨️"}
//                   </span>
//                 </button>
//               </div>
//               <p className="mt-2 text-xs text-gray-500">
//                 Password must be at least 8 characters long
//               </p>
//             </motion.div>

//             {/* Terms and Conditions */}
//             <motion.div variants={itemVariants} className="flex items-start">
//               <div className="flex items-center h-5">
//                 <input
//                   id="terms"
//                   type="checkbox"
//                   required
//                   className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   disabled={loading || error === "success"}
//                 />
//               </div>
//               <div className="ml-3 text-sm">
//                 <label htmlFor="terms" className="text-gray-600">
//                   I agree to the{" "}
//                   <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
//                     Terms of Service
//                   </a>{" "}
//                   and{" "}
//                   <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
//                     Privacy Policy
//                   </a>
//                 </label>
//               </div>
//             </motion.div>

//             {/* Submit Button */}
//             <motion.button
//               variants={itemVariants}
//               whileHover={!loading && error !== "success" ? { scale: 1.02 } : {}}
//               whileTap={!loading && error !== "success" ? { scale: 0.98 } : {}}
//               type="submit"
//               disabled={loading || error === "success"}
//               className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Creating Account...</span>
//                 </div>
//               ) : error === "success" ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <span>✅</span>
//                   <span>Account Created!</span>
//                 </div>
//               ) : (
//                 "Create Company Account"
//               )}
//             </motion.button>
//           </motion.form>

//           {/* Login Link */}
//           <motion.div
//             variants={itemVariants}
//             className="mt-8 text-center"
//           >
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <a 
//                 href="/login" 
//                 className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                 Sign in
//               </a>
//             </p>
//           </motion.div>

//           {/* Benefits Section */}
//           <motion.div
//             variants={itemVariants}
//             className="mt-8 grid grid-cols-2 gap-4"
//           >
//             <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="text-xl mb-2">👥</div>
//               <p className="text-xs font-medium text-gray-700">Access Talent Pool</p>
//             </div>
//             <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="text-xl mb-2">⚡</div>
//               <p className="text-xs font-medium text-gray-700">Fast Hiring</p>
//             </div>
//             <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="text-xl mb-2">🎯</div>
//               <p className="text-xs font-medium text-gray-700">AI Matching</p>
//             </div>
//             <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="text-xl mb-2">📊</div>
//               <p className="text-xs font-medium text-gray-700">Analytics</p>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           variants={itemVariants}
//           className="mt-6 text-center"
//         >
//           <p className="text-sm text-gray-500">
//             By signing up, you agree to our{" "}
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



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";

export default function CompanySignup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "company" }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("success");
        setTimeout(() => router.push("/login"), 1800);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const shake = {
    shake: { x: [0, -8, 8, -8, 8, 0], transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 flex items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-100/70 p-9 md:p-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-9">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
              <Building2 size={36} strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Company Registration
            </h1>
            <p className="mt-2 text-slate-600">
              Create your company profile and start hiring top talent
            </p>
          </motion.div>

          {error === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 flex items-center gap-3 rounded-2xl bg-green-50 p-5 text-green-800 border border-green-200"
            >
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Registration successful!</p>
                <p className="text-sm text-green-700 mt-0.5">Redirecting to login…</p>
              </div>
            </motion.div>
          )}

          {error && error !== "success" && (
            <motion.div
              variants={shake}
              animate="shake"
              className="mb-7 flex items-center gap-3 rounded-2xl bg-red-50 p-5 text-red-800 border border-red-200"
            >
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Acme Corporation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Company Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 py-3.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Minimum 8 characters</p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                required
                disabled={loading || error === "success"}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="font-medium text-indigo-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-indigo-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={
                !loading && error !== "success"
                  ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79,70,229,0.4)" }
                  : {}
              }
              whileTap={!loading && error !== "success" ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading || error === "success"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : error === "success" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <span>Create Company Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>

      

        <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-slate-500">
          By signing up, you agree to our{" "}
          <a href="#" className="text-slate-600 hover:text-slate-800">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="text-slate-600 hover:text-slate-800">
            Privacy Policy
          </a>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(40px, -60px) scale(1.1); }
          66%  { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-6000 { animation-delay: 6s; }
      `}</style>
    </div>
  );
}