"use client";

import { useEffect, useState } from "react";

type Platform = "apple" | "google" | "both";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(ua);
  const isAndroid = /Android/.test(ua);
  if (isApple) return "apple";
  if (isAndroid) return "google";
  return "both";
}

export function WalletButtons({
  appleEnabled,
  googleEnabled,
}: {
  appleEnabled: boolean;
  googleEnabled: boolean;
}) {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  if (!platform) return null;
  if (!appleEnabled && !googleEnabled) return null;

  const showApple = appleEnabled && (platform === "apple" || platform === "both");
  const showGoogle = googleEnabled && (platform === "google" || platform === "both");

  async function handleApple() {
    setLoadingApple(true);
    try {
      const res = await fetch("/api/wallet/apple");
      if (!res.ok) throw new Error("Error generando pase");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sonrisaplus.pkpass";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo generar el pase de Apple Wallet.");
    } finally {
      setLoadingApple(false);
    }
  }

  async function handleGoogle() {
    setLoadingGoogle(true);
    try {
      const res = await fetch("/api/wallet/google");
      if (!res.ok) throw new Error("Error generando pase");
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      alert("No se pudo generar el pase de Google Wallet.");
    } finally {
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="flex gap-3">
      {showApple && (
        <button
          onClick={handleApple}
          disabled={loadingApple}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black py-3 text-sm font-semibold text-white transition active:scale-95 disabled:opacity-60"
        >
          {loadingApple ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <AppleIcon />
          )}
          Agregar a Apple Wallet
        </button>
      )}
      {showGoogle && (
        <button
          onClick={handleGoogle}
          disabled={loadingGoogle}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-surface-2 bg-surface py-3 text-sm font-semibold text-foreground transition active:scale-95 disabled:opacity-60"
        >
          {loadingGoogle ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          ) : (
            <GoogleIcon />
          )}
          Google Wallet
        </button>
      )}
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.7 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.2 190.5-49.2zm-118.5-194c-45.4 53.8-120.2 96.2-187.2 96.2-9 0-17.9-1.3-25.4-2.6-1.3-7.1-1.3-14.8-1.3-22.5 0-54.4 23.3-111.7 65.4-150.2 23.3-21.2 87.5-57.9 143.2-73.5 2.6 9 3.2 17.9 3.2 26.2 0 55.7-23.2 113.1-97.9 126.4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
