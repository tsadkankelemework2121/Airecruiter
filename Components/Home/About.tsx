"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n/context"

export default function About() {
  const { t } = useI18n()
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.home.about.title}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            {t.home.about.description}
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">{t.home.about.mission}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t.home.about.missionDesc1}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {t.home.about.missionDesc2}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-gray-100 rounded-2xl p-8">
              <div className="text-6xl text-center">🚀</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t.home.about.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t.home.about.innovation,
                description: t.home.about.innovationDesc,
                icon: "💡",
              },
              {
                title: t.home.about.fairness,
                description: t.home.about.fairnessDesc,
                icon: "⚖️",
              },
              {
                title: t.home.about.transparency,
                description: t.home.about.transparencyDesc,
                icon: "🔍",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border-2 border-gray-100 hover:border-[#FF9833] transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">{t.home.about.poweredBy}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.about.machineLearning}</h3>
              <p className="text-gray-600">
                {t.home.about.machineLearningDesc}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.about.nlp}</h3>
              <p className="text-gray-600">
                {t.home.about.nlpDesc}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.about.biasDetection}</h3>
              <p className="text-gray-600">
                {t.home.about.biasDetectionDesc}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{t.home.about.predictiveAnalytics}</h3>
              <p className="text-gray-600">
                {t.home.about.predictiveAnalyticsDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

