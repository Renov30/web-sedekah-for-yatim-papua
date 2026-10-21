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
  ShieldCheck,
  AlertCircle,
  Radio,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  defaultAccounts,
  saveSession,
  roleDisplayNames,
} from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@sfypapua.org");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Simulate verification
    setTimeout(() => {
      const matched = defaultAccounts.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matched) {
        setErrorMessage(
          "Email operator tidak terdaftar. Gunakan akun staf resmi SFY Papua."
        );
        setIsLoading(false);
        return;
      }

      if (password !== "password123" && password.length < 6) {
        setErrorMessage("Kata sandi salah. Silakan periksa kembali.");
        setIsLoading(false);
        return;
      }

      // Save session
      saveSession({
        user: matched.user,
        roleName: roleDisplayNames[matched.user.roleId] || "Operator Staf",
        token: `sfy_tok_${Date.now()}`,
      });

      // Redirect to admin dashboard
      router.push("/admin");
    }, 500);
  };

  const handleQuickFill = (accEmail: string) => {
    setEmail(accEmail);
    setPassword("password123");
    setErrorMessage("");
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
          Sistem Portal Terverifikasi
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
                Portal Masuk Staf & Relawan
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Sedekah for Yatim Papua — Memuliakan Anak Yatim di Bumi Cenderawasih
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-semibold mb-1.5">
                Alamat Email Operator
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="operator@sfypapua.org"
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
                  onClick={() =>
                    alert("Silakan hubungi Super Admin untuk bantuan reset kata sandi.")
                  }
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
                  placeholder="••••••••"
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
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#5E2276] text-white hover:bg-[#4A1860] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <span>{isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-stone-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Pilih Akun Demo / Uji Coba:
              </span>
              <span className="text-[10px] text-stone-400 font-mono">
                Password: password123
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {defaultAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc.email)}
                  className={`text-left p-2 rounded-xl text-xs border transition-colors flex items-center justify-between ${
                    email === acc.email
                      ? "bg-purple-50/80 border-[#823296]/30 text-[#5E2276] font-medium"
                      : "bg-stone-50 border-stone-200/70 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-stone-900 truncate">
                      {acc.label}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono truncate">
                      {acc.email}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 shrink-0">
                    Gunakan
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Notice Footer */}
        <p className="text-center text-[11px] text-stone-400 mt-4 leading-relaxed">
          Hak akses dibatasi secara ketat berdasarkan Role & Permission resmi Sedekah for Yatim Papua.
        </p>
      </div>

      {/* Bottom Footer Empty Div for balance */}
      <div className="text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Sedekah for Yatim Papua. Seluruh hak cipta dilindungi.
      </div>
    </div>
  );
}

