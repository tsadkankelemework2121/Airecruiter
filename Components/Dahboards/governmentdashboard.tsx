"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/Components/ui/language-switcher";
import {
  User,
  LogOut,
  Building2,
  TrendingUp,
  BarChart3,
  PieChart,
  MapPin,
  FileText,
  Download,
  ArrowUp,
} from "lucide-react";

// Mock data for Ethiopian regions with companies
const ETHIOPIAN_REGIONS = [
  {
    region: "Addis Ababa",
    companies: [
      {
        name: "TechCorp Solutions",
        totalJobs: 45,
        activeJobs: 32,
        employees: 250,
        jobsByType: {
          "Software Engineer": 12,
          "Manager": 8,
          "Data Analyst": 6,
          "Marketing Specialist": 4,
          "HR Coordinator": 2,
        },
      },
      {
        name: "Digital Innovations PLC",
        totalJobs: 38,
        activeJobs: 28,
        employees: 180,
        jobsByType: {
          "Software Engineer": 10,
          "Manager": 7,
          "UI/UX Designer": 5,
          "Product Manager": 4,
          "Sales Representative": 2,
        },
      },
      {
        name: "AfroTech Systems",
        totalJobs: 52,
        activeJobs: 40,
        employees: 320,
        jobsByType: {
          "Software Engineer": 18,
          "Manager": 10,
          "DevOps Engineer": 8,
          "QA Engineer": 4,
        },
      },
    ],
  },
  {
    region: "Oromia",
    companies: [
      {
        name: "Agricultural Solutions Ltd",
        totalJobs: 28,
        activeJobs: 20,
        employees: 150,
        jobsByType: {
          "Manager": 8,
          "Agricultural Specialist": 6,
          "Sales Representative": 4,
          "Accountant": 2,
        },
      },
      {
        name: "Manufacturing Hub",
        totalJobs: 35,
        activeJobs: 25,
        employees: 200,
        jobsByType: {
          "Manager": 12,
          "Engineer": 8,
          "Supervisor": 5,
        },
      },
    ],
  },
  {
    region: "Amhara",
    companies: [
      {
        name: "Tourism & Hospitality Group",
        totalJobs: 22,
        activeJobs: 18,
        employees: 120,
        jobsByType: {
          "Manager": 8,
          "Tour Guide": 6,
          "Customer Service": 4,
        },
      },
      {
        name: "Educational Services Inc",
        totalJobs: 30,
        activeJobs: 24,
        employees: 180,
        jobsByType: {
          "Manager": 10,
          "Teacher": 8,
          "Administrator": 6,
        },
      },
    ],
  },
  {
    region: "Tigray",
    companies: [
      {
        name: "Construction Partners",
        totalJobs: 40,
        activeJobs: 30,
        employees: 220,
        jobsByType: {
          "Manager": 12,
          "Engineer": 10,
          "Project Coordinator": 8,
        },
      },
    ],
  },
  {
    region: "SNNPR",
    companies: [
      {
        name: "Coffee Export Co",
        totalJobs: 25,
        activeJobs: 20,
        employees: 140,
        jobsByType: {
          "Manager": 8,
          "Export Specialist": 6,
          "Quality Control": 4,
          "Marketing": 2,
        },
      },
    ],
  },
];

// Mock data for companies through time (for visual representation)
const generateCompanyTimeData = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months.map((month, index) => ({
    month,
    companies: 15 + Math.floor(Math.random() * 20) + (index * 2),
  }));
};

export default function GovernmentDashboard() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const userInitials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "GV";

  const companyTimeData = useMemo(() => generateCompanyTimeData(), []);
  
  // Calculate total companies across all regions
  const totalCompanies = useMemo(() => {
    return ETHIOPIAN_REGIONS.reduce((sum, region) => sum + region.companies.length, 0);
  }, []);

  // Get selected company data for visualization
  const selectedCompanyData = useMemo(() => {
    if (!selectedCompany) {
      const firstCompany = ETHIOPIAN_REGIONS[0]?.companies[0];
      if (firstCompany) {
        return Object.entries(firstCompany.jobsByType).map(([name, value]) => ({
          name,
          value,
          percentage: Math.round((value / firstCompany.totalJobs) * 100),
        }));
      }
      return [];
    }

    for (const region of ETHIOPIAN_REGIONS) {
      const company = region.companies.find(c => `${region.region}-${c.name}` === selectedCompany);
      if (company) {
        return Object.entries(company.jobsByType).map(([name, value]) => ({
          name,
          value,
          percentage: Math.round((value / company.totalJobs) * 100),
        }));
      }
    }
    return [];
  }, [selectedCompany]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalJobs = 0;
    let activeJobs = 0;
    let totalEmployees = 0;

    ETHIOPIAN_REGIONS.forEach(region => {
      region.companies.forEach(company => {
        totalJobs += company.totalJobs;
        activeJobs += company.activeJobs;
        totalEmployees += company.employees;
      });
    });

    return { totalJobs, activeJobs, totalEmployees, totalCompanies };
  }, []);

  // Get max companies for bar chart scaling
  const maxCompanies = Math.max(...companyTimeData.map(d => d.companies));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* ======== DASHBOARD HEADER ======== */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Government Analytics Dashboard
              </h1>
              <LanguageSwitcher />
            </div>
            <p className="text-gray-600 mt-1">
              Employment Statistics & Regional Company Overview
            </p>
          </div>

          {/* PROFILE SECTION - TOP RIGHT */}
          <div className="flex items-center gap-3">
            <Link href="/profile">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-2 font-medium">
                <User className="w-4 h-4 mr-2" />
                {t.nav.profile}
              </Button>
            </Link>
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.fullName || "Government User"}
                </p>
                <p className="text-xs text-gray-600">Government Account</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {userInitials}
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t.nav.logout}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* ======== STATS CARDS ======== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</p>
                </div>
                <Building2 className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <FileText className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees.toLocaleString()}</p>
                </div>
                <User className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ======== VISUALIZATIONS SECTION ======== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart Representation - Companies Through Time */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Total Companies Through Time
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full h-80 space-y-3">
                {companyTimeData.map((item, index) => {
                  const heightPercent = (item.companies / maxCompanies) * 100;
                  return (
                    <div key={index} className="flex items-end gap-2">
                      <div className="w-12 text-xs text-gray-600 font-medium">{item.month}</div>
                      <div className="flex-1 relative">
                        <div
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${Math.max(heightPercent, 5)}%` }}
                        >
                          <div className="absolute -top-6 left-0 text-xs font-semibold text-gray-700">
                            {item.companies}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart Representation - Job Distribution by Company */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <PieChart className="w-6 h-6" />
                  Job Distribution by Type
                </CardTitle>
                <select
                  value={selectedCompany || `${ETHIOPIAN_REGIONS[0]?.region}-${ETHIOPIAN_REGIONS[0]?.companies[0]?.name}`}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="bg-white/20 border-white/30 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {ETHIOPIAN_REGIONS.map((region) =>
                    region.companies.map((company) => (
                      <option key={`${region.region}-${company.name}`} value={`${region.region}-${company.name}`}>
                        {company.name} ({region.region})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="w-full space-y-3">
                {selectedCompanyData.map((item, index) => {
                  const colors = [
                    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
                    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#95A5A6",
                  ];
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium text-gray-700">{item.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="h-full rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: colors[index % colors.length],
                          }}
                        >
                          {item.percentage}% ({item.value})
                        </div>
                      </div>
                    </div>
                  );
                })}
                {selectedCompanyData.length === 0 && (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ======== REGIONAL COMPANIES TABLE ======== */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Regional Company Classification - Ethiopia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Region</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Company Name</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Total Jobs</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Active Jobs</th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-gray-700">Employees</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Job Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {ETHIOPIAN_REGIONS.map((region, regionIndex) =>
                    region.companies.map((company, companyIndex) => (
                      <tr
                        key={`${region.region}-${company.name}`}
                        className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                          companyIndex === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        {companyIndex === 0 && (
                          <td
                            rowSpan={region.companies.length}
                            className="px-4 py-4 text-sm font-semibold text-gray-900 align-top border-r-2 border-gray-300"
                          >
                            {region.region}
                          </td>
                        )}
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {company.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-700 font-semibold">
                          {company.totalJobs}
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {company.activeJobs}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-center text-gray-700 font-semibold">
                          {company.employees.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(company.jobsByType).map(([jobType, count]) => {
                              const percentage = Math.round((count / company.totalJobs) * 100);
                              return (
                                <span
                                  key={jobType}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {jobType}: {count} ({percentage}%)
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
