"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";
  const isResetMode = searchParams.get("mode") === "reset" && !!tokenParam;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

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

  const handleForgotPassword = async () => {
    const promptEmail = window.prompt("Enter your account email");
    if (!promptEmail) return;

    setIsLoading(true);
    setLoginError("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "forgot-password",
          email: promptEmail,
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.message || "Unable to send reset link.");
      } else {
        setInfoMessage(data?.message || "If an account exists, a reset link has been sent.");
      }
    } catch {
      setLoginError("Unable to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    setInfoMessage("");

    if (newPassword.length < 8) {
      setLoginError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setLoginError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          email: resetEmail,
          token: tokenParam,
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.message || "Unable to reset password.");
      } else {
        setInfoMessage(data?.message || "Password reset successful. You can now sign in.");
      }
    } catch {
      setLoginError("Unable to reset password.");
    } finally {
      setIsLoading(false);
    }
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
              {isResetMode ? "Reset Password" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isResetMode
                ? "Set a new password for your account"
                : "Sign in to manage your dashboard"}
            </p>
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

          {infoMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm"
            >
              <p className="text-emerald-700 font-medium">{infoMessage}</p>
            </motion.div>
          )}

          {/* Google Button */}
          {!isResetMode && (
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
          )}

          {/* Divider */}
          {!isResetMode && (
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
          )}

          {/* Form */}
          {!isResetMode && (
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

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

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
          )}

          {isResetMode && (
            <motion.form
              variants={containerVariants}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-60"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full px-4 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-60"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full px-4 py-4 bg-gray-50/70 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 disabled:opacity-60"
                />
              </motion.div>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </motion.button>
            </motion.form>
          )}

          {/* Sign Up Links */}
          {!isResetMode && (
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
          )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" />}>
      <LoginPageContent />
    </Suspense>
  );
}
