"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { linkTelegramAccount } from "@/lib/auth-service";
import TelegramConnectCard from "@/components/auth/TelegramConnectCard";
import Header from "@/components/structure/Header";
import Footer from "@/components/structure/Footer";

type TelegramConnectStatus = "idle" | "processing" | "success" | "error";

function ConnectTelegramLogic() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const { user, loading, openLoginModal, openSignUpModal } = useAuth();
  
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
      setMessage("Please log in or sign up to connect your Telegram account.");
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
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <TelegramConnectCard 
          status={status}
          message={message}
          isUserLoggedIn={!!user}
          onLoginClick={openLoginModal}
          onSignUpClick={openSignUpModal}
        />
      </main>

      <Footer />
    </div>
  );
}

// Main Page Component wrapped in Suspense
export default function ConnectTelegramPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ConnectTelegramLogic />
    </Suspense>
  );
}