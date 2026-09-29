import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
  const {
    user,
    isAuthModalOpen,
    setIsAuthModalOpen,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-close modal when user signs in successfully
  React.useEffect(() => {
    if (user && isAuthModalOpen) {
      setIsAuthModalOpen(false);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [user, isAuthModalOpen, setIsAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (mode === "signin") {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
      } else if (data?.user) {
        setIsAuthModalOpen(false);
      }
    } else {
      const { data, error } = await signUpWithEmail(email, password);
      if (error) {
        setErrorMsg(error.message || "Failed to create account.");
      } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
        setErrorMsg("An account with this email already exists. Please switch to Sign In.");
      } else if (data?.session) {
        // Direct login without confirmation required
        setIsAuthModalOpen(false);
      } else {
        setSuccessMsg("Account created! Please check your email inbox to confirm your address before signing in.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsAuthModalOpen(false)}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#61dca3]/15 text-[#61dca3] border border-[#61dca3]/30 rounded">
              SHIELD Authentication
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none cursor-pointer"
            aria-label="Close authentication modal"
          >
            ×
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            {successMsg}
          </div>
        )}

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/25 transition-all cursor-pointer shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-white/10"></div>
            <span className="absolute bg-[#0a0a0a] px-3 text-xs text-gray-500 uppercase tracking-widest font-mono">
              Or with Email
            </span>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none transition-colors focus:border-[#61dca3]/70 focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#61dca3] text-black font-bold text-sm rounded-xl hover:bg-[#4fbe8b] transition-all cursor-pointer shadow-lg shadow-[#61dca3]/15"
            >
              {loading
                ? "Processing..."
                : mode === "signin"
                  ? "Sign In"
                  : "Sign Up"}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            {mode === "signin" ? (
              <span>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[#61dca3] hover:underline font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-[#61dca3] hover:underline font-semibold cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
