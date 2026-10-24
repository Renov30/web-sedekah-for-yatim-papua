"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { authenticateUser, saveSession } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(
          json.message || "Gagal masuk. Periksa email dan kata sandi Anda."
        );
        setIsLoading(false);
        return;
      }

      if (json.session) {
        saveSession(json.session);
      } else {
        authenticateUser(email, password);
      }

      setSuccessMessage("Verifikasi berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        router.push("/admin");
      }, 400);
    } catch {
      const result = authenticateUser(email, password);
      if (!result.success) {
        setErrorMessage(
          result.message || "Gagal masuk. Periksa email dan kata sandi Anda."
        );
        setIsLoading(false);
        return;
      }
      setSuccessMessage("Verifikasi berhasil! Mengalihkan ke dashboard...");
      setTimeout(() => {
        router.push("/admin");
      }, 400);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8FB] flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#5E2276] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Website Utama</span>
        </Link>
        <span className="text-[11px] font-mono text-stone-400">
          Portal Internal SFY Papua
        </span>
      </div>

      {/* Main Card Container */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5E2276] p-2 flex items-center justify-center shadow-md">
              <Image
                src="/images/logo.png"
                alt="Logo SFY Papua"
                width={40}
                height={40}
                className="object-contain brightness-105"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                Portal Masuk Administrator
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Sedekah for Yatim Papua — Sekretariat Merauke (Papua Selatan)
              </p>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1.5">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@sfypapua.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5E2276] focus:ring-1 focus:ring-[#5E2276] text-sm text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-stone-700 font-semibold">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[#5E2276] hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Masukkan kata sandi..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-[#5E2276] focus:ring-1 focus:ring-[#5E2276] text-sm text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#5E2276] text-white hover:bg-[#4A1860] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              <span>{isLoading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Security Notice Footer */}
        <p className="text-center text-[11px] text-stone-400 mt-4 leading-relaxed">
          Hak akses dibatasi secara ketat berdasarkan Role & Permission resmi Sedekah for Yatim Papua.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-stone-900">
              Reset Kata Sandi
            </h3>
            <p className="text-stone-600 leading-relaxed">
              Untuk keamanan operasional lembaga, reset kata sandi staf dan koordinator dilakukan langsung melalui akun <strong>Master Administrator</strong> di menu <em>Kelola User</em>.
            </p>
            <p className="text-stone-500">
              Silakan hubungi Super Admin di sekretariat pusat Merauke jika Anda kehilangan akses akun.
            </p>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-xl font-semibold bg-[#5E2276] text-white hover:bg-[#4A1860]"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Sedekah for Yatim Papua (Merauke). Seluruh hak cipta dilindungi.
      </div>
    </div>
  );
}
