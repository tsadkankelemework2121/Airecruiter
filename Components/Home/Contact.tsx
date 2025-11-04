"use client"

import type React from "react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n/context"

export default function Contact() {
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    howDidYouFindUs: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="absolute right-0 top-0 w-[30%] min-h-full h-full bg-gradient-to-b from-[#FF9833] via-[#FF9833] to-[#FF8C1A]"></div>

      <div className="relative z-10 flex items-center min-h-screen py-12">
        {/* LEFT: Text + Form - responsive */}
        <div className="w-full md:w-[70%] lg:w-[60%] px-4 md:px-12 lg:px-24 xl:px-32 py-12 flex items-center">
          <div className="w-full max-w-md mx-auto md:mx-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {t.home.contact.title}
            </h1>

            <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
              {t.home.contact.description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <input
                type="text"
                name="name"
                placeholder={`${t.home.contact.name} *`}
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-1 focus:ring-[#FF9833] transition"
                required
              />

              <input
                type="email"
                name="email"
                placeholder={t.home.contact.email}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-1 focus:ring-[#FF9833] transition"
              />

              <input
                type="tel"
                name="phone"
                placeholder={`${t.home.contact.phoneNumber} *`}
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-1 focus:ring-[#FF9833] transition"
                required
              />

              <select
                name="howDidYouFindUs"
                value={formData.howDidYouFindUs}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:border-[#FF9833] focus:ring-1 focus:ring-[#FF9833] transition appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">{t.home.contact.howDidYouFindUs}</option>
                <option value="google">{t.home.contact.google}</option>
                <option value="social">{t.home.contact.socialMedia}</option>
                <option value="friend">{t.home.contact.friend}</option>
                <option value="other">{t.home.contact.other}</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 bg-[#FF9833] hover:bg-[#FF8C1A] active:bg-[#FF7A00] text-white font-bold text-base rounded-md transition duration-200 mt-6"
              >
                {t.home.contact.send}
              </button>
            </form>

            <div className="flex gap-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900 tracking-wide">{t.home.contact.phoneLabel}</p>
                  <p className="text-xs text-gray-700">09-6452-1234</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 16H6a2 2 0 01-2-2V9m0 0V7a2 2 0 012-2h12a2 2 0 012 2v2m0 0v2a2 2 0 01-2 2h-2.5l-4.793 4.793a1 1 0 01-1.414-1.414L12.586 12H10a2 2 0 01-2-2m0-5V7a2 2 0 012-2h6a2 2 0 012 2v2" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900 tracking-wide">{t.home.contact.faxLabel}</p>
                  <p className="text-xs text-[#FF9833] font-semibold">03-5432-1234</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-gray-900 tracking-wide">{t.home.contact.emailLabel}</p>
                  <p className="text-xs text-[#FF9833] font-semibold">info@slui.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <img
          src="/contact.png"
          alt="Orange and black robot in business suit with headphones"
          className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 h-full w-auto object-contain drop-shadow-lg z-20 mr-12"
        />
      </div>
    </section>
  )
}
