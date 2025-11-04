"use client"

import Link from "next/link"
import { Button } from "@/Components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import VideoPlayer from "./VideoPlayer"
import Image from "next/image"

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Video Player - Between navbar and hero text */}
        <div className="mb-12">
          <VideoPlayer />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {t.home.hero.findDreamJob}{" "}
                <span className="text-orange-500">AI HIRE</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {t.home.hero.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  {t.home.hero.getStarted}
                </Button>
              </Link>
              <Link href="/services">
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 rounded-full px-8 py-6 text-lg font-semibold bg-white"
                >
                  {t.home.hero.learnMore}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">{t.home.hero.activeJobs}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">5K+</p>
                <p className="text-sm text-gray-600">{t.home.hero.companies}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-gray-600">{t.home.hero.jobSeekers}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Robot Image */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl transform rotate-6 opacity-20 blur-2xl"></div>
              <div className="relative">
                <Image
                  src="/Aiimage.png"
                  alt="AI Robot helping with recruitment"
                  width={600}
                  height={700}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave/Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white"></div>
    </section>
  )
}

