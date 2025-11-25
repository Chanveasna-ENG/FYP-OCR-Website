"use client";

import Link from "next/link";
import { Loader2, CheckCircle, XCircle, Send } from "lucide-react";

type TelegramConnectStatus = "idle" | "processing" | "success" | "error";

interface TelegramConnectCardProps {
  status: TelegramConnectStatus;
  message: string;
  isUserLoggedIn: boolean;
  onLoginClick: () => void;
}

export default function TelegramConnectCard({
  status,
  message,
  isUserLoggedIn,
  onLoginClick,
}: TelegramConnectCardProps) {
  return (
    <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 text-center">
      {/* Icon State */}
      <div className="flex justify-center mb-6">
        {status === "processing" || (status === "idle" && isUserLoggedIn) ? (
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle className="w-16 h-16 text-green-500 animate-in zoom-in" />
        ) : status === "error" ? (
          <XCircle className="w-16 h-16 text-red-500 animate-in zoom-in" />
        ) : (
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Send className="w-8 h-8 text-blue-400" />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold text-white mb-2">Telegram Connection</h1>

      <p
        className={`text-lg mb-8 ${
          status === "error" ? "text-red-400" : "text-gray-400"
        }`}
      >
        {message}
      </p>

      {/* Action Buttons */}
      <div className="space-y-3">
        {status === "success" && (
          <Link
            href="/ocr"
            className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            Go to OCR Dashboard
          </Link>
        )}

        {status === "error" && !isUserLoggedIn && (
          <button
            onClick={onLoginClick}
            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
          >
            Open Login
          </button>
        )}

        {status === "error" && isUserLoggedIn && (
          <Link
            href="/"
            className="block w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Back to Home
          </Link>
        )}
      </div>
    </div>
  );
}