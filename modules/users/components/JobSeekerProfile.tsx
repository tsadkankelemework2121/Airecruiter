"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  Upload,
  FileText,
  User,
  MapPin,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Plus,
  Edit,
  Save,
  X,
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  IdCard,
  CreditCard,
} from "lucide-react";

interface JobSeekerProfileData {
  id: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  skills: string[];
  education?: string;
  cvUrl?: string;
  graduationCertificateUrl?: string;
  nationalId?: string;
  passportNumber?: string;
  idType?: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  kycStatus?: string;
  kycVerifiedAt?: string;
}

export default function JobSeekerProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingGradCert, setUploadingGradCert] = useState(false);
  const [uploadingIdFront, setUploadingIdFront] = useState(false);
  const [uploadingIdBack, setUploadingIdBack] = useState(false);

  const [profile, setProfile] = useState<JobSeekerProfileData | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    bio: "",
    currentPosition: "",
    currentCompany: "",
    yearsOfExperience: 0,
    skills: [] as string[],
    education: "",
    nationalId: "",
    passportNumber: "",
    idType: "national_id" as "national_id" | "passport",
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/users/profile", {
        headers: {
          "x-user-id": user?.id || "",
        },
      });
      const data = await response.json();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          fullName: user?.fullName || "",
          phone: data.profile.phone || "",
          dateOfBirth: data.profile.dateOfBirth
            ? new Date(data.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          address: data.profile.address || "",
          city: data.profile.city || "",
          country: data.profile.country || "",
          bio: data.profile.bio || "",
          currentPosition: data.profile.currentPosition || "",
          currentCompany: data.profile.currentCompany || "",
          yearsOfExperience: data.profile.yearsOfExperience || 0,
          skills: data.profile.skills || [],
          education: data.profile.education || "",
          nationalId: data.profile.nationalId || "",
          passportNumber: data.profile.passportNumber || "",
          idType: (data.profile.idType || "national_id") as
            | "national_id"
            | "passport",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsOfExperience" ? parseInt(value) || 0 : value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user fullName
      if (formData.fullName !== user?.fullName) {
        const userResponse = await fetch("/api/users/update-name", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({ fullName: formData.fullName }),
        });
        if (!userResponse.ok) {
          alert("Failed to update name");
          setIsSaving(false);
          return;
        }
      }

      // Update profile
      const response = await fetch("/api/users/profile", {
        method: profile ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          ...formData,
          fullName: undefined, // Don't send fullName to profile endpoint
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setIsEditing(false);
        await fetchProfile();
        alert("Profile updated successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/upload", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
          "x-file-type": "cv",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updateResponse = await fetch("/api/users/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({ cvUrl: data.url }),
        });

        if (updateResponse.ok) {
          await fetchProfile();
          alert("CV uploaded successfully!");
        }
      } else {
        alert("Failed to upload CV");
      }
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV");
    } finally {
      setUploadingCV(false);
    }
  };

  const handleGraduationCertUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGradCert(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/users/upload", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
          "x-file-type": "certificate",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const updateResponse = await fetch("/api/users/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({ graduationCertificateUrl: data.url }),
        });

        if (updateResponse.ok) {
          await fetchProfile();
          alert("Graduation certificate (Tempo) uploaded successfully!");
        }
      } else {
        alert("Failed to upload graduation certificate");
      }
    } catch (error) {
      console.error("Error uploading graduation certificate:", error);
      alert("Failed to upload graduation certificate");
    } finally {
      setUploadingGradCert(false);
    }
  };

  const handleIdUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (side === "front") {
      setUploadingIdFront(true);
    } else {
      setUploadingIdBack(true);
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/users/upload", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
          "x-file-type": "kyc-doc",
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        const updateField = side === "front" ? "idFrontUrl" : "idBackUrl";

        const updateResponse = await fetch("/api/users/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({
            [updateField]: data.url,
            idType: formData.idType,
            nationalId:
              formData.idType === "national_id"
                ? formData.nationalId
                : undefined,
            passportNumber:
              formData.idType === "passport"
                ? formData.passportNumber
                : undefined,
          }),
        });

        if (updateResponse.ok) {
          await fetchProfile();
          alert(
            `ID ${side === "front" ? "front" : "back"} uploaded successfully!`
          );
        }
      } else {
        alert(`Failed to upload ID ${side}`);
      }
    } catch (error) {
      console.error(`Error uploading ID ${side}:`, error);
      alert(`Failed to upload ID ${side}`);
    } finally {
      if (side === "front") {
        setUploadingIdFront(false);
      } else {
        setUploadingIdBack(false);
      }
    }
  };

  const getKYCStatusBadge = () => {
    if (!profile?.kycStatus) return null;

    switch (profile.kycStatus) {
      case "VERIFIED":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Link href="/dashboard/user">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Bachelor's Degree in Computer Science"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <Button
                      onClick={handleAddSkill}
                      type="button"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Curriculum Vitae (CV)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.cvUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="font-semibold">CV Uploaded</p>
                      <a
                        href={profile.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-500 hover:underline"
                      >
                        View CV
                      </a>
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={uploadingCV}
                    />
                    <Button variant="outline" disabled={uploadingCV} asChild>
                      <span>{uploadingCV ? "Uploading..." : "Replace CV"}</span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No CV uploaded yet</p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                      disabled={uploadingCV}
                    />
                    <Button
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={uploadingCV}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2 inline" />
                        {uploadingCV ? "Uploading..." : "Upload CV"}
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Graduation Certificate (Tempo) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                University Graduation Certificate (Tempo)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.graduationCertificateUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="font-semibold">
                        Graduation Certificate Uploaded
                      </p>
                      <a
                        href={profile.graduationCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-500 hover:underline"
                      >
                        View Certificate
                      </a>
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleGraduationCertUpload}
                      className="hidden"
                      disabled={uploadingGradCert}
                    />
                    <Button
                      variant="outline"
                      disabled={uploadingGradCert}
                      asChild
                    >
                      <span>
                        {uploadingGradCert ? "Uploading..." : "Replace"}
                      </span>
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    No graduation certificate uploaded
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleGraduationCertUpload}
                      className="hidden"
                      disabled={uploadingGradCert}
                    />
                    <Button
                      className="bg-orange-500 hover:bg-orange-600"
                      disabled={uploadingGradCert}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2 inline" />
                        {uploadingGradCert ? "Uploading..." : "Upload Tempo"}
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* KYC Verification */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Identity Verification (KYC)
                </CardTitle>
                {getKYCStatusBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Type
                </label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  disabled={
                    !isEditing ||
                    (!!profile?.kycStatus && profile.kycStatus !== "REJECTED")
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="national_id">Ethiopian National ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              {formData.idType === "national_id" ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ethiopian National ID Number *
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    disabled={
                      !isEditing ||
                      (!!profile?.kycStatus && profile.kycStatus !== "REJECTED")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your Ethiopian National ID"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 10 digits (e.g., 1234567890)
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Passport Number *
                  </label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    disabled={
                      !isEditing ||
                      (!!profile?.kycStatus && profile.kycStatus !== "REJECTED")
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter your passport number"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Front Side */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.idType === "national_id"
                      ? "National ID Front"
                      : "Passport Front"}{" "}
                    *
                  </label>
                  {profile?.idFrontUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IdCard className="w-6 h-6 text-orange-500" />
                        <a
                          href={profile.idFrontUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-500 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleIdUpload(e, "front")}
                          className="hidden"
                          disabled={
                            uploadingIdFront ||
                            (!!profile?.kycStatus &&
                              profile.kycStatus !== "REJECTED")
                          }
                        />
                        <Button
                          variant="outline"
                          disabled={
                            uploadingIdFront ||
                            (!!profile?.kycStatus &&
                              profile.kycStatus !== "REJECTED")
                          }
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <span>
                            {uploadingIdFront ? "Uploading..." : "Replace"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleIdUpload(e, "front")}
                        className="hidden"
                        disabled={uploadingIdFront || !isEditing}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                        <IdCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload Front Side
                        </p>
                        <Button
                          variant="outline"
                          disabled={uploadingIdFront || !isEditing}
                          size="sm"
                          asChild
                        >
                          <span>
                            <Upload className="w-4 h-4 mr-2 inline" />
                            {uploadingIdFront ? "Uploading..." : "Choose File"}
                          </span>
                        </Button>
                      </div>
                    </label>
                  )}
                </div>

                {/* Back Side */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.idType === "national_id"
                      ? "National ID Back"
                      : "Passport Page"}{" "}
                    *
                  </label>
                  {profile?.idBackUrl ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <IdCard className="w-6 h-6 text-orange-500" />
                        <a
                          href={profile.idBackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-500 hover:underline"
                        >
                          View Document
                        </a>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleIdUpload(e, "back")}
                          className="hidden"
                          disabled={
                            uploadingIdBack ||
                            (!!profile?.kycStatus &&
                              profile.kycStatus !== "REJECTED")
                          }
                        />
                        <Button
                          variant="outline"
                          disabled={
                            uploadingIdBack ||
                            (!!profile?.kycStatus &&
                              profile.kycStatus !== "REJECTED")
                          }
                          className="w-full"
                          size="sm"
                          asChild
                        >
                          <span>
                            {uploadingIdBack ? "Uploading..." : "Replace"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleIdUpload(e, "back")}
                        className="hidden"
                        disabled={uploadingIdBack || !isEditing}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                        <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload Back Side
                        </p>
                        <Button
                          variant="outline"
                          disabled={uploadingIdBack || !isEditing}
                          size="sm"
                          asChild
                        >
                          <span>
                            <Upload className="w-4 h-4 mr-2 inline" />
                            {uploadingIdBack ? "Uploading..." : "Choose File"}
                          </span>
                        </Button>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {profile?.kycStatus === "VERIFIED" && profile.kycVerifiedAt && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Verified on{" "}
                    {new Date(profile.kycVerifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {profile?.kycStatus === "REJECTED" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Your verification was rejected. Please update your documents
                    and resubmit.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold">Job Seeker</p>
                </div>
              </div>
              {formData.yearsOfExperience > 0 && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">
                      {formData.yearsOfExperience} years
                    </p>
                  </div>
                </div>
              )}
              {formData.skills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Skills Count</p>
                  <p className="font-semibold">
                    {formData.skills.length} skills
                  </p>
                </div>
              )}
              {profile?.cvUrl && (
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">CV Status</p>
                    <p className="font-semibold text-green-600">Uploaded</p>
                  </div>
                </div>
              )}
              {profile?.graduationCertificateUrl && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tempo Status</p>
                    <p className="font-semibold text-green-600">Uploaded</p>
                  </div>
                </div>
              )}
              {profile?.kycStatus && (
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">KYC Status</p>
                    <div className="mt-1">{getKYCStatusBadge()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
