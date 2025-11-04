"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/Components/ui/language-switcher";
import {
  SearchIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  DollarSign,
  Briefcase,
  Share2,
  Bookmark,
  ArrowLeft,
  LogOut,
  User,
  FileText,
  Award,
  Settings,
} from "lucide-react";

// ============================================================
// DATA TYPES & INTERFACES
// ============================================================
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  posted: string;
  type: "Full Time" | "Part Time" | "Contract";
  badge?: string;
}

interface JobDetails {
  id: string;
  title: string;
  company: string;
  companyVerified: boolean;
  jobsPosted: number;
  location: string;
  postedDate: string;
  badge?: string;
  type: string;
  deadline: string;
  vacancies: number;
  education: string;
  salary: string;
  salaryType: "Monthly" | "Annual";
  experience: string;
  description: string;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
}

// ============================================================
// SAMPLE DATA
// ============================================================
const JOBS: Job[] = [
  {
    id: "1",
    title: "Operation manager for furniture company",
    company: "NAVE FURNITURE AND METAL MANUFACTURING PLC",
    location: "Addis Ababa, Ethiopia",
    salary: "Amount Not Specified",
    posted: "2 days ago",
    type: "Full Time",
    badge: "BOT",
  },
  {
    id: "2",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    posted: "1 week ago",
    type: "Full Time",
  },
  {
    id: "3",
    title: "Full Stack Engineer",
    company: "StartUp Inc",
    location: "Remote",
    salary: "$100k - $140k",
    posted: "3 days ago",
    type: "Full Time",
  },
  {
    id: "4",
    title: "Product Manager",
    company: "Innovation Labs",
    location: "New York, NY",
    salary: "$110k - $150k",
    posted: "1 week ago",
    type: "Full Time",
  },
];

const JOB_DETAILS: { [key: string]: JobDetails } = {
  "1": {
    id: "1",
    title: "Operation manager for furniture company",
    company: "NAVE FURNITURE AND METAL MANUFACTURING PLC",
    companyVerified: true,
    jobsPosted: 8,
    location: "Addis Ababa, Ethiopia",
    postedDate: "November 1, 2025",
    badge: "BOT",
    type: "Onsite - Full Time",
    deadline: "November 29, 2025",
    vacancies: 1,
    education: "Bachelors Degree",
    salary: "Amount Not Specified",
    salaryType: "Monthly",
    experience: "SENIOR",
    description: `At Nave furniture and metal manufacturing plc, we specialize in crafting high-quality furniture with a commitment to design, durability, and customer satisfaction. We are growing and looking for an experienced Operations Manager to lead our production and logistics teams.

Key Responsibilities:
- Plan and oversee daily production operations to meet quality and delivery targets.
- Supervise factory staff and ensure workflow efficiency.
- Manage procurement and inventory of raw materials.
- Maintain quality control standards and ensure workplace safety.
- Coordinate between departments to optimize processes.
- Report on operational metrics and identify improvement opportunities.

Requirements:
- Bachelor's degree in Business, Operations, or related field
- 5+ years of operations management experience
- Strong leadership and problem-solving skills
- Knowledge of production management systems`,
  },
  "2": {
    id: "2",
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    companyVerified: true,
    jobsPosted: 5,
    location: "San Francisco, CA",
    postedDate: "October 25, 2025",
    badge: "TECH",
    type: "Onsite - Full Time",
    deadline: "November 10, 2025",
    vacancies: 2,
    education: "Bachelors Degree",
    salary: "$120k - $160k",
    salaryType: "Annual",
    experience: "SENIOR",
    description:
      "We're looking for an experienced Senior Frontend Developer to join our team and help build amazing user experiences.",
  },
};

const APPLICATIONS: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "Tech Corp",
    appliedDate: "2025-01-15",
    status: "reviewing",
  },
  {
    id: "2",
    jobTitle: "Full Stack Engineer",
    company: "StartUp Inc",
    appliedDate: "2025-01-10",
    status: "pending",
  },
  {
    id: "3",
    jobTitle: "UI/UX Designer",
    company: "Design Studio",
    appliedDate: "2024-12-28",
    status: "accepted",
  },
  {
    id: "4",
    jobTitle: "Backend Developer",
    company: "Old Company",
    appliedDate: "2024-12-15",
    status: "rejected",
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [selectedJobId, setSelectedJobId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const userInitials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="w-4 h-4" />;
      case "reviewing":
        return <ClockIcon className="w-4 h-4" />;
      case "accepted":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "rejected":
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredJobs = JOBS.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedJob = JOB_DETAILS[selectedJobId];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ======== DASHBOARD HEADER ======== */}
      <div className="bg-white border-b border-gray-200 px-6 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-black">{t.dashboard.welcome} - {t.roles.jobSeeker} {t.dashboard.dashboard}</h1>
              <LanguageSwitcher />
            </div>
            <p className="text-gray-600 mt-1">
              {t.dashboardStrings.welcomeBack} {t.dashboardStrings.recruitmentJourney}
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
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="text-right">
                <p className="text-sm font-semibold text-black">
                  {user?.fullName || t.roles.user}
                </p>
                <p className="text-xs text-gray-600">{t.roles.jobSeeker}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ======== LEFT SIDEBAR - JOBS & APPLICATIONS ======== */}
          <div className="lg:col-span-2 space-y-8">
            {/* ======== PROFILE QUICK ACCESS CARD ======== */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                      <User className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {t.dashboardStrings.completeProfile}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t.dashboardStrings.completeProfileDesc}
                      </p>
                    </div>
                  </div>
                  <Link href="/profile">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 font-semibold shadow-lg">
                      <Settings className="w-4 h-4 mr-2" />
                      {t.profile.editProfile}
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-orange-200">
                  <div className="text-center">
                    <FileText className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">CV</p>
                    <p className="text-xs text-gray-600">Upload your CV</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">
                      Certificates
                    </p>
                    <p className="text-xs text-gray-600">Add credentials</p>
                  </div>
                  <div className="text-center">
                    <Briefcase className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-900">
                      Skills
                    </p>
                    <p className="text-xs text-gray-600">Showcase talents</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* ======== JOBS SECTION ======== */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-orange-500" />
                  Jobs you might like
                </h2>
              </div>

              {/* SEARCH BAR */}
              <div className="mb-6 relative">
                <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.dashboardStrings.searchForJob}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* TABS - All Jobs / Saved Jobs */}
              <div className="flex gap-6 mb-6 border-b border-gray-200 pb-4">
                <button className="text-sm font-medium text-gray-600 border-b-2 border-orange-500 pb-2 text-orange-500">
                  {t.dashboardStrings.allJobs}
                </button>
                <button className="text-sm font-medium text-gray-600 hover:text-black">
                  {t.dashboardStrings.savedJobs}
                </button>
              </div>

              {/* JOB CARDS LIST */}
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                      selectedJobId === job.id
                        ? "border-l-orange-500 bg-orange-50"
                        : "border-l-gray-200 hover:border-l-orange-400"
                    }`}
                  >
                    <CardContent className="pt-6">
                      {/* JOB TITLE & APPLY BUTTON */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-black">
                              {job.title}
                            </h3>
                            {job.badge && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                {job.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 text-sm font-medium">
                          Apply
                        </Button>
                      </div>

                      {/* JOB META INFO */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          📍 {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          💼 {job.type}
                        </span>
                      </div>

                      {/* POSTED TIME */}
                      <p className="text-xs text-gray-500">
                        Posted {job.posted}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* ======== APPLICATION STATUS SECTION (MOBILE) ======== */}
            <div className="lg:hidden">
              <h2 className="text-xl font-bold text-black mb-4">
                Your Applications
              </h2>
              <div className="space-y-3">
                {APPLICATIONS.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-black">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-gray-600">{app.company}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                      <Badge
                        className={`flex items-center gap-1 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ======== RIGHT SIDEBAR - JOB DETAILS & APPLICATIONS ======== */}
          <div className="space-y-6">
            {/* ======== JOB DETAILS PANEL ======== */}
            {selectedJob && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                {/* BACK BUTTON */}
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4">
                  <ArrowLeft className="w-4 h-4" />
                  {t.common.back}
                </button>

                {/* JOB HEADER */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-2xl font-bold text-black">
                        {selectedJob.title}
                      </h1>
                      <p className="text-gray-600 text-sm mt-1">
                        {selectedJob.type}
                      </p>
                    </div>
                    {selectedJob.badge && (
                      <Badge className="bg-blue-100 text-blue-700 font-semibold px-3 py-1">
                        {selectedJob.badge}
                      </Badge>
                    )}
                  </div>

                  {/* COMPANY INFO */}
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-semibold text-black">
                      {selectedJob.company}
                    </span>
                    {selectedJob.companyVerified && (
                      <CheckCircleIcon className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Verified company</p>
                </div>

                {/* JOB QUICK INFO */}
                <div className="grid grid-cols-2 gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Posted Date</p>
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.postedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-sm font-semibold text-black flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </p>
                  </div>
                </div>

                {/* JOB DETAILS GRID */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* JOB TYPE */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Job Type</p>
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.type}
                    </p>
                  </div>

                  {/* DEADLINE */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Deadline
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.deadline}
                    </p>
                  </div>

                  {/* VACANCIES */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Vacancies
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.vacancies}
                    </p>
                  </div>

                  {/* EDUCATION */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Education
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.education}
                    </p>
                  </div>
                </div>

                {/* SALARY & EXPERIENCE */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Salary
                    </p>
                    <p className="text-sm font-bold text-black">
                      {selectedJob.salary}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedJob.salaryType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      Experience
                    </p>
                    <p className="text-sm font-bold text-black">
                      {selectedJob.experience}
                    </p>
                    <p className="text-xs text-gray-500">Experience Level</p>
                  </div>
                </div>
                {/* ACTION BUTTONS */}
                <div className="space-y-3 mb-6">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold">
                    {t.dashboardStrings.applyNow}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-500 hover:bg-red-50 rounded-full bg-transparent"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      {t.common.save} {t.jobs.title}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-500 hover:bg-red-50 rounded-full bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Job
                    </Button>
                  </div>
                </div>

                {/* JOB DESCRIPTION */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-black mb-3">
                    Job Description
                  </h3>
                  <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                    {selectedJob.description.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>

                {/* COMPANY PROFILE SECTION */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {selectedJob.company}
                      </p>
                      <p className="text-xs text-gray-600">
                        Jobs Posted: {selectedJob.jobsPosted} jobs
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-500 hover:bg-red-50 rounded-full text-sm bg-transparent"
                    >
                      See Company profile
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ======== APPLICATION STATUS SECTION (DESKTOP) ======== */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-orange-500" />
                Your Applications
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {APPLICATIONS.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="mb-2">
                      <h3 className="text-sm font-bold text-black">
                        {app.jobTitle}
                      </h3>
                      <p className="text-xs text-gray-600">{app.company}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                      <Badge
                        className={`flex items-center gap-1 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="capitalize text-xs">{app.status}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">4</p>
                  <p className="text-xs text-gray-600">Total Apps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-500">1</p>
                  <p className="text-xs text-gray-600">Accepted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-500">1</p>
                  <p className="text-xs text-gray-600">Reviewing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
