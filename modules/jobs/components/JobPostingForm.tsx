"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { jobService } from "@/lib/services/jobService";
import { Job } from "@/lib/services/jobService";
import { X, Save, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface JobPostingFormProps {
  job?: Job | null;
  onClose: () => void;
  onSuccess: (newJobId?: string) => void;
}

export default function JobPostingForm({ job, onClose, onSuccess }: JobPostingFormProps) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    region: "",
    country: "",
    salary: "",
    salaryType: "Monthly" as "Monthly" | "Annual" | "Hourly",
    type: "Full Time" as "Full Time" | "Part Time" | "Contract" | "Internship",
    requirements: "",
    education: "",
    experience: "",
    vacancies: 1,
    category: "",
    deadline: "",
    status: "draft" as "active" | "closed" | "draft",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    setCategories(jobService.getCategories());
    setRegions(jobService.getRegions());
    
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        city: job.city || "",
        region: job.region || "",
        country: job.country || "",
        salary: job.salary || "",
        salaryType: job.salaryType || "Monthly",
        type: job.type || "Full Time",
        requirements: job.requirements || "",
        education: job.education || "",
        experience: job.experience || "",
        vacancies: job.vacancies || 1,
        category: job.category || "",
        deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
        status: job.status || "draft",
      });
    }
  }, [job]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "vacancies" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestBody = {
        ...formData,
        companyName: user?.fullName || "Company",
        deadline: formData.deadline || undefined,
      };

      const url = job
        ? `/api/jobs?id=${job.id}`
        : "/api/jobs";

      const response = await fetch(url, {
        method: job ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify(job ? { id: job.id, ...requestBody } : requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        const savedJob = result.job;
        
        // Save job to localStorage on client side (API runs server-side)
        if (savedJob && typeof window !== "undefined") {
          try {
            const allJobs = jobService.getAllJobs();
            // Check if job already exists (for updates)
            const existingIndex = allJobs.findIndex(j => j.id === savedJob.id);
            if (existingIndex >= 0) {
              allJobs[existingIndex] = savedJob;
            } else {
              allJobs.push(savedJob);
            }
            jobService.saveJobs(allJobs);
          } catch (error) {
            console.error("Error saving job to localStorage:", error);
          }
        }
        
        onSuccess(savedJob?.id);
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save job"}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {job ? t.jobs.editJob : t.jobs.postNewJob}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.profile.personalInfo}</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.jobs.title} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.jobs.description} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe the job position, responsibilities, and requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.type} *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Full Time">{t.jobs.fullTime}</option>
                    <option value="Part Time">{t.jobs.partTime}</option>
                    <option value="Contract">{t.jobs.contract}</option>
                    <option value="Internship">{t.jobs.internship}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.category}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">{t.common.select} {t.jobs.category}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.jobs.location} {t.profile.personalInfo}</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.jobs.location} *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Addis Ababa, Ethiopia"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.city}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.region}
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">{t.common.select} {t.jobs.region}</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.country}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ethiopia"
                  />
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.jobs.salary} {t.common.and} {t.common.view}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.salary}
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 50,000 - 80,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.salaryType}
                  </label>
                  <select
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Monthly">{t.jobs.monthly}</option>
                    <option value="Annual">{t.jobs.annual}</option>
                    <option value="Hourly">{t.jobs.hourly}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{t.jobs.requirements}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.education}
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Bachelor's Degree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.experience}
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 3+ years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.jobs.requirements} {t.common.view}
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="List any additional requirements, skills, or qualifications..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.vacancies} *
                  </label>
                  <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleInputChange}
                    required
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.jobs.deadline}
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.jobs.status} *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="draft">{t.jobs.draft}</option>
                <option value="active">{t.jobs.active}</option>
                <option value="closed">{t.jobs.closed}</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {t.common.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? t.common.save + "..." : job ? t.jobs.editJob : t.jobs.postNewJob}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

