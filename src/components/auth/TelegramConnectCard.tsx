"use client";

import { CheckCircle, AlertCircle, Loader2, Send, LogIn } from "lucide-react";

type Props = {
  status: "idle" | "processing" | "success" | "error";
  message: string;
  isUserLoggedIn: boolean;
  onLoginClick: () => void;
  onSignUpClick: () => void;
};

export default function TelegramConnectCard({ status, message, isUserLoggedIn, onLoginClick, onSignUpClick }: Props) {
  return (
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative p-8 flex flex-col items-center text-center space-y-6">
        {/* Icon based on Status */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ring-4 ring-opacity-20 ${
          status === "success" ? "bg-green-500/20 ring-green-500 text-green-500" :
          status === "error" ? "bg-red-500/20 ring-red-500 text-red-500" :
          status === "processing" ? "bg-blue-500/20 ring-blue-500 text-blue-500" :
          "bg-gray-800 ring-gray-700 text-gray-400"
        }`}>
          {status === "success" ? <CheckCircle className="w-8 h-8" /> :
           status === "error" ? <AlertCircle className="w-8 h-8" /> :
           status === "processing" ? <Loader2 className="w-8 h-8 animate-spin" /> :
           <Send className="w-8 h-8" />}
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Connect Telegram</h2>
          <p className="text-gray-400">{message}</p>
        </div>

        {/* Actions for Non-Logged In Users */}
        {!isUserLoggedIn && (
          <div className="w-full space-y-3 pt-4">
            <button 
              onClick={onLoginClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
            >
              <LogIn className="w-5 h-5" />
              Log in to Connect
            </button>
            <button 
              onClick={onSignUpClick}
              className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all border border-gray-700"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Indicator for Logged In Users */}
        {isUserLoggedIn && status === "processing" && (
          <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-4 py-2 rounded-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            Verifying token...
          </div>
        )}
      </div>
    </div>
  );
}