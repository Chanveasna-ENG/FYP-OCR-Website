"use client";

import { useState } from "react";
import { X, Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { loginUser } from "@/lib/auth-service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string }) => void;
};

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });

      if (response.success && response.user) {
        onLoginSuccess(response.user);
        onClose(); // Close modal
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()} // Prevent click-through closing
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">
            Please sign in to access the full OCR tool features.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-700"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-700"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button className="text-blue-500 hover:text-blue-400 font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}