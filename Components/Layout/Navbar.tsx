"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/Components/ui/button"
import { Menu, X } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import { LanguageSwitcher } from "@/Components/ui/language-switcher"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useI18n()

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold">
            <span className="text-orange-500">AI</span>
            <span className="text-black"> HIRE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
            {t.nav.home}
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
            {t.nav.about}
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
            {t.nav.services}
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
            {t.nav.contact}
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="/signup">
            <Button
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full px-6 py-2 font-medium bg-transparent"
            >
              {t.nav.signup}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav.about}
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav.services}
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.nav.contact}
            </Link>
            <div className="flex items-center justify-between py-2">
              <LanguageSwitcher />
            </div>
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full py-2 font-medium bg-transparent"
              >
                {t.nav.signup}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
