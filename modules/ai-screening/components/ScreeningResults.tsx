"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import type { CandidateScore } from "@/lib/ai/types";
import { useI18n } from "@/lib/i18n/context";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ScreeningResultsProps {
  jobId?: string;
  onRefresh?: () => void;
  preloadedRankings?: CandidateScore[];
  preloadedStats?: {
    totalCandidates: number;
    averageScore: number;
    topScore: number;
    lowestScore: number;
  };
}

export default function ScreeningResults({ 
  jobId, 
  onRefresh,
  preloadedRankings,
  preloadedStats
}: ScreeningResultsProps) {
  const { t } = useI18n();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobId || "");
  const [rankings, setRankings] = useState<CandidateScore[]>(preloadedRankings || []);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{
    totalCandidates: number;
    averageScore: number;
    topScore: number;
    lowestScore: number;
  } | null>(preloadedStats || null);

  useEffect(() => {
    if (preloadedRankings && preloadedRankings.length > 0) {
      setRankings(preloadedRankings);
    }
    if (preloadedStats) {
      setStats(preloadedStats);
    }
  }, [preloadedRankings, preloadedStats]);

  useEffect(() => {
    if (selectedJobId && !preloadedRankings) {
      screenAllApplications();
    }
  }, [selectedJobId]);

  const screenAllApplications = async () => {
    if (!selectedJobId) {
      alert("Please select a job first");
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!).id
        : null;

      if (!userId) {
        alert("Please log in to screen applications");
        return;
      }

      const response = await fetch("/api/ai/screen", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ jobId: selectedJobId }),
      });

      if (response.ok) {
        const data = await response.json();
        setRankings(data.rankings || []);
        setStats(data.statistics || null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to screen applications"}`);
      }
    } catch (error) {
      console.error("Error screening applications:", error);
      alert("Failed to screen applications");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRecommendation = (score: number) => {
    if (score >= 90) return { text: t.screening.highlyRecommended, icon: Award };
    if (score >= 75) return { text: t.screening.strongMatch, icon: CheckCircle };
    if (score >= 60) return { text: t.screening.goodMatch, icon: AlertCircle };
    if (score >= 40) return { text: t.screening.moderateMatch, icon: AlertCircle };
    return { text: t.screening.limitedMatch, icon: XCircle };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Screening candidates...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (rankings.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">{t.screening.noCandidates}</p>
                <p className="text-gray-500 text-sm mb-6">
                  {selectedJobId 
                    ? t.screening.selectJob
                    : t.screening.selectJob}
                </p>
                {selectedJobId && (
                  <Button
                    onClick={screenAllApplications}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {t.screening.screenAll}
                  </Button>
                )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.screening.totalCandidates}</p>
                  <p className="text-2xl font-bold text-black">
                    {stats.totalCandidates}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.screening.averageScore}</p>
                  <p className="text-2xl font-bold text-black">
                    {stats.averageScore}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.screening.topScore}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.topScore}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.screening.lowestScore}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.lowestScore}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rankings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              {t.screening.ranking}
            </CardTitle>
            <Button
              onClick={screenAllApplications}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.common.update}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rankings.map((candidate) => {
              const recommendation = getRecommendation(candidate.overallScore);
              const RecommendationIcon = recommendation.icon;

              return (
                <Card
                  key={candidate.applicationId}
                  className={`border-l-4 ${
                    candidate.overallScore >= 80
                      ? "border-l-green-500"
                      : candidate.overallScore >= 60
                      ? "border-l-blue-500"
                      : candidate.overallScore >= 40
                      ? "border-l-yellow-500"
                      : "border-l-red-500"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                            <span className="text-orange-600 font-bold">
                              #{candidate.rank}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-black">
                                {t.dashboard.candidates} #{candidate.candidateId.slice(0, 8)}
                              </h3>
                              <Badge className={getScoreBadgeColor(candidate.overallScore)}>
                                {candidate.overallScore}% {t.screening.matchPercentage}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <RecommendationIcon className="w-3 h-3" />
                                {recommendation.text}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {candidate.justification}
                            </p>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">{t.screening.score}</p>
                            <p className={`text-lg font-bold ${getScoreColor(candidate.skillMatchScore)}`}>
                              {candidate.skillMatchScore}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {candidate.skillMatch.matchedSkills.length} skills matched
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">{t.jobs.experience}</p>
                            <p className={`text-lg font-bold ${getScoreColor(candidate.experienceScore)}`}>
                              {candidate.experienceScore}%
                            </p>
                            <p className="text-xs text-gray-500">Relevant work history</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-600 mb-1">{t.jobs.education}</p>
                            <p className={`text-lg font-bold ${getScoreColor(candidate.educationScore)}`}>
                              {candidate.educationScore}%
                            </p>
                            <p className="text-xs text-gray-500">Qualification match</p>
                          </div>
                        </div>

                        {/* Strengths and Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {candidate.strengths.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {t.screening.strengths}
                              </p>
                              <ul className="space-y-1">
                                {candidate.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-xs text-gray-700">
                                    • {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {candidate.weaknesses.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {t.screening.weaknesses}
                              </p>
                              <ul className="space-y-1">
                                {candidate.weaknesses.map((weakness, idx) => (
                                  <li key={idx} className="text-xs text-gray-700">
                                    • {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

