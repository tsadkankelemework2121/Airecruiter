"use client"

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Grid: 1 column on mobile, 3 columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left Section - Logo + Description */}
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div>
              <span className="text-lg font-bold">
                <span className="text-orange-500">AI</span>
                <span className="text-white"> HIRE</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm max-w-md leading-relaxed">
              {t.home.hero.description}
            </p>
          </div>

          {/* Center Section - Quick Links (vertically centered) */}
          <div className="flex flex-col gap-2 items-center justify-center">
            <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/services" className="text-gray-300 hover:text-orange-500 transition-colors">
              {t.nav.services}
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
              {t.nav.contact}
            </Link>
          </div>

          {/* Right Section - Robot Character */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-[150px]">
              <Image
                src="/herorob.png"
                alt="AI Robot Character"
                width={120}
                height={160}
                className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-400 text-xs">© 2025 AI HIRE. {t.common.all} {t.common.view} {t.common.all}</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              {t.profile.personalInfo} {t.profile.personalInfo}
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              {t.jobs.requirements}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
