"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";

export default function SigninForm() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        // Get user from localStorage to determine role
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Redirect based on role
          if (user.role === "user") {
            router.push("/dashboard/user");
          } else if (user.role === "company") {
            router.push("/dashboard/company");
          } else if (user.role === "government") {
            router.push("/dashboard/government");
          } else {
            router.push("/dashboard/user");
          }
        } else {
          setError(t.auth.somethingWentWrong);
        }
      } else {
        setError(t.auth.invalidCredentials);
      }
    } catch (err) {
      setError(t.auth.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {t.auth.welcomeBack}
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            {t.auth.signInToContinue}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.email}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t.auth.email}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/30 transition shadow-sm"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                {t.auth.password}
              </label>
              <a
                href="#"
                className="text-xs text-[#FF9833] hover:text-[#FF8C1A] font-medium"
              >
                {t.auth.forgotPassword}
              </a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/30 transition shadow-sm"
              required
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#FF9833] hover:bg-[#FF8C1A] active:bg-[#FF7A00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? t.auth.signingIn : t.auth.signIn}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          {t.auth.dontHaveAccount}{" "}
          <Link
            href="/signup"
            className="text-[#FF9833] hover:text-[#FF8C1A] font-semibold"
          >
            {t.auth.signUp}
          </Link>
        </p>
      </div>
    </div>
  );
}
