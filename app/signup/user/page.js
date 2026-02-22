"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function UserSignup() {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "applicant" }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("success");
        setTimeout(() => router.push("/login"), 1800);
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.sessionStorage.setItem("pendingRole", "applicant");
    signIn("google", { callbackUrl: "/auth/callback" });
  };

  // Animation variants
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 flex items-center justify-center p-5">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-200 rounded-full blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
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
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-9">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 text-white shadow-lg">
              <UserPlus size={36} strokeWidth={2.2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Join Our Talent Network
            </h1>
            <p className="mt-2 text-slate-600">
              Create your account and kickstart your career journey
            </p>
          </motion.div>

          {/* Success message */}
          {error === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 flex items-center gap-3 rounded-2xl bg-green-50 p-5 text-green-800 border border-green-200"
            >
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">Account created successfully!</p>
                <p className="text-sm text-green-700 mt-0.5">Redirecting to login…</p>
              </div>
            </motion.div>
          )}

          {/* Error message */}
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

          {/* Google Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignup}
            disabled={loading}
            className="mb-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:shadow-md transition-all disabled:opacity-60 disabled:pointer-events-none"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign up with Google</span>
          </motion.button>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-5 text-slate-500">or continue with email</span>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form variants={containerVariants} onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || error === "success"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-12 py-3.5 text-slate-800 placeholder-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Minimum 6 characters</p>
            </motion.div>

            {/* Terms */}
            <motion.div variants={itemVariants} className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                required
                disabled={loading || error === "success"}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{" "}
                <a href="#" className="font-medium text-green-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-green-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={itemVariants}
              whileHover={
                !loading && error !== "success"
                  ? { scale: 1.02, boxShadow: "0 10px 25px -5px rgba(22,163,74,0.4)" }
                  : {}
              }
              whileTap={!loading && error !== "success" ? { scale: 0.98 } : {}}
              type="submit"
              disabled={loading || error === "success"}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 font-semibold text-white shadow-lg hover:from-green-700 hover:to-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all disabled:opacity-60 disabled:pointer-events-none"
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
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Login link */}
          <motion.div variants={itemVariants} className="mt-10 text-center">
            <p className="text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-green-600 hover:text-green-500 transition-colors"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>

     
      </motion.div>

      {/* Keep this or move to globals.css */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob {
          animation: blob 12s infinite;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}