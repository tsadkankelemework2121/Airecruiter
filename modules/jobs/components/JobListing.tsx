"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Job } from "@/lib/services/jobService";
import { MapPin, DollarSign, Briefcase, Calendar, Users, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface JobListingProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  onToggleStatus?: (jobId: string, status: string) => void;
  showActions?: boolean;
}

export default function JobListing({
  jobs,
  onEdit,
  onDelete,
  onToggleStatus,
  showActions = true,
}: JobListingProps) {
  const { t } = useI18n();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive || status === "closed") {
      return (
        <Badge className="bg-gray-100 text-gray-700">
          {t.jobs.closed}
        </Badge>
      );
    }
    if (status === "draft") {
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          {t.jobs.draft}
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-700">
        {t.jobs.active}
      </Badge>
    );
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{t.jobs.title} {t.common.notAvailable}</p>
        <p className="text-gray-500 text-sm mt-2">{t.jobs.postNewJob}!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-all">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-black">{job.title}</h3>
                  {getStatusBadge(job.status, job.isActive)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{job.companyName}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary} {job.salaryType || ""}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {job.vacancies} {job.vacancies > 1 ? t.dashboardStrings.vacancies : t.dashboardStrings.vacancy}
                  </span>
                  {job.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {job.category}
                    </span>
                  )}
                </div>
                {job.description && (
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                    {job.description.substring(0, 150)}...
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t.jobs.postedDate} {formatDate(job.postedDate)}
                  </span>
                  {job.deadline && (
                    <span>
                      {t.jobs.deadline}: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              {showActions && (
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(job)}
                    className="text-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {onToggleStatus && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onToggleStatus(
                          job.id,
                          job.status === "active" && job.isActive ? "closed" : "active"
                        )
                      }
                      className={`text-sm ${
                        job.status === "active" && job.isActive
                          ? "text-orange-600 border-orange-300"
                          : ""
                      }`}
                    >
                      {job.status === "active" && job.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm(t.common.confirm + " " + t.jobs.deleteJob + "?")) {
                        onDelete(job.id);
                      }
                    }}
                    className="text-sm border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

