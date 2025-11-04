"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";

export default function SignupForm() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "company" | "government",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.passwordsDoNotMatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    setIsLoading(true);
    try {
      const success = await signup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.role
      );

      if (success) {
        // Redirect based on role
        if (formData.role === "user") {
          router.push("/dashboard/user");
        } else if (formData.role === "company") {
          router.push("/dashboard/company");
        } else if (formData.role === "government") {
          router.push("/dashboard/government");
        } else {
          router.push("/dashboard/user");
        }
      } else {
        setError(t.auth.accountExists);
      }
    } catch (err) {
      setError(t.auth.somethingWentWrong);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      {/* Form container with visible border and stronger shadow */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 md:p-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t.auth.createAccount}
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            {t.auth.joiningUs}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.fullName}
            </label>
            <input
              type="text"
              name="fullName"
              placeholder={t.auth.fullName}
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/20 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.email}
            </label>
            <input
              type="email"
              name="email"
              placeholder={t.auth.email}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/20 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.password}
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/20 transition"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.confirmPassword}
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/20 transition"
              required
            />
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t.auth.accountType}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-2 focus:ring-[#FF9833]/20 transition appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FF9833' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="user">{t.auth.individualUser}</option>
              <option value="company">{t.roles.company}</option>
              {/* Government option removed - only accessible through login with credentials */}
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#FF9833] hover:bg-[#FF8C1A] active:bg-[#FF7A00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-lg transition duration-200 mt-6"
          >
            {isLoading ? t.auth.creatingAccount : t.auth.signUp}
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
          {t.auth.alreadyHaveAccount}{" "}
          <Link
            href="/signin"
            className="text-[#FF9833] hover:text-[#FF8C1A] font-semibold"
          >
            {t.auth.signIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
