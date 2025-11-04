"use client"

import { useI18n } from "@/lib/i18n/context"

export default function Service() {
  const { t } = useI18n()
  
  const services = [
    {
      title: t.home.services.aiRecruitment,
      description: t.home.services.aiRecruitmentDesc,
      icon: "⚡",
    },
    {
      title: t.home.services.candidateIntelligence,
      description: t.home.services.candidateIntelligenceDesc,
      icon: "🧠",
    },
    {
      title: t.home.services.engagementHub,
      description: t.home.services.engagementHubDesc,
      icon: "💬",
    },
  ]

  const keyFeatures = [
    {
      title: t.home.services.resumeScreening,
      description: t.home.services.resumeScreeningDesc,
      icon: "📄",
    },
    {
      title: t.home.services.candidateMatching,
      description: t.home.services.candidateMatchingDesc,
      icon: "🤝",
    },
    {
      title: t.home.services.interviewScheduling,
      description: t.home.services.interviewSchedulingDesc,
      icon: "📅",
    },
  ]

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* OUR SERVICE SECTION - NEW CREATIVE DESIGN */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t.home.services.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              {t.home.services.description}
            </p>
          </div>

          {/* Service Cards - Professional Grid with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-[#FF9833] hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Orange accent bar on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9833] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF9833] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FF9833] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

          {/* Key Features Grid - Exact Figma Design with Orange Borders */}
     {/* KEY FEATURES SECTION - CREATIVE NEW LAYOUT */}
<div className="border-t-2 border-gray-100 pt-20">
  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
    {t.home.services.keyFeatures}
  </h2>

  <div className="flex flex-col md:flex-row md:justify-between gap-10 max-w-6xl mx-auto">
    {keyFeatures.map((feature, index) => (
      <div
        key={index}
        className={`relative flex flex-col items-start p-8 rounded-3xl bg-white border-l-8 border-[#FF9833] hover:shadow-2xl transition-all duration-300 ${
          index === 1 ? "md:mt-12" : index === 2 ? "md:mt-24" : ""
        }`}
      >
        {/* Number Badge */}
        <div className="absolute -top-5 left-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#FF9833] text-white font-bold text-lg">
          {index + 1}
        </div>

        {/* Icon */}
        <div className="text-5xl mb-4 text-[#FF9833]">{feature.icon}</div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

        {/* Decorative Accent */}
        <div className="mt-4 w-12 h-1 bg-[#FF9833] rounded-full opacity-80"></div>
      </div>
    ))}
  </div>
</div>

      </div>
    </section>
  )
}
