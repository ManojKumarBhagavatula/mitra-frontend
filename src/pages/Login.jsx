// src/pages/Login.jsx
import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [isSignup, setIsSignup]   = useState(false);
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(e.message.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2a2924_0%,_#0d0c0a_70%)]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ink-800 border border-ink-700 mb-4">
            <span className="text-sage-400 text-xl">◈</span>
          </div>
          <h1 className="font-display text-3xl text-ink-50 tracking-tight">Mitra</h1>
          <p className="text-ink-400 text-sm mt-1 font-sans">your adaptive companion</p>
        </div>

        {/* Card */}
        <div className="bg-ink-900 border border-ink-800 rounded-2xl p-6 shadow-2xl">
          <h2 className="font-sans font-semibold text-ink-100 text-base mb-5">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-ink-800 hover:bg-ink-700 border border-ink-700 hover:border-ink-600 text-ink-200 text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-150 mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-ink-800" />
            <span className="text-ink-600 text-xs">or</span>
            <div className="flex-1 h-px bg-ink-800" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-3">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-ink-800 border border-ink-700 focus:border-ink-500 text-ink-100 placeholder-ink-500 text-sm py-2.5 px-3.5 rounded-xl outline-none transition-colors"
            />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-ink-800 border border-ink-700 focus:border-ink-500 text-ink-100 placeholder-ink-500 text-sm py-2.5 px-3.5 rounded-xl outline-none transition-colors"
            />

            {error && (
              <p className="text-clay-400 text-xs bg-clay-500/10 border border-clay-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-colors"
            >
              {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-ink-500 text-xs mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-sage-400 hover:text-sage-300 transition-colors"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        <p className="text-center text-ink-600 text-xs mt-6">
          Your conversations are private and secure.
        </p>
      </div>
    </div>
  );
}
