"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { linkTelegramAccount } from "@/lib/auth-service";
import TelegramConnectCard from "@/components/auth/TelegramConnectCard";

type TelegramConnectStatus = "idle" | "processing" | "success" | "error";

function ConnectTelegramLogic() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { user, loading, openLoginModal } = useAuth();
  
  const [status, setStatus] = useState<TelegramConnectStatus>("idle");
  const [message, setMessage] = useState("Waiting for authentication...");

  useEffect(() => {
    // 1. Validation: Ensure token exists
    if (!token) {
      setStatus("error");
      setMessage("Invalid link. No token provided.");
      return;
    }

    // 2. Wait for AuthContext to finish loading session
    if (loading) return;

    // 3. User Not Logged In: Prompt login
    if (!user) {
      setMessage("Please log in to connect your Telegram account.");
      // We don't automatically open modal here to avoid popup blocking/UX issues, 
      // instead we let the user click the button in the UI component.
      return;
    }

    // 4. User Logged In: Attempt Linking (only if we haven't tried yet)
    if (user && status === "idle") {
      handleLinking(token);
    }
  }, [user, loading, token, status]);

  const handleLinking = async (telegramToken: string) => {
    setStatus("processing");
    setMessage("Linking your Telegram account...");

    const result = await linkTelegramAccount(telegramToken);

    if (result.success) {
      setStatus("success");
      setMessage("Success! You can now close this page and return to Telegram.");
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-black p-4">
      <TelegramConnectCard 
        status={status}
        message={message}
        isUserLoggedIn={!!user}
        onLoginClick={openLoginModal}
      />
    </div>
  );
}

// Main Page Component wrapped in Suspense
export default function ConnectTelegramPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <ConnectTelegramLogic />
    </Suspense>
  );
}