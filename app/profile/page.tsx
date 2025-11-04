"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import JobSeekerProfile from "@/modules/users/components/JobSeekerProfile";
import CompanyProfile from "@/modules/users/components/CompanyProfile";
import GovernmentProfile from "@/modules/users/components/GovernmentProfile";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Render appropriate profile based on user role
  const role = user?.role?.toLowerCase();
  if (role === "user") {
    return <JobSeekerProfile />;
  } else if (role === "company") {
    return <CompanyProfile />;
  } else if (role === "government") {
    return <GovernmentProfile />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Invalid user role</p>
      </div>
    </div>
  );
}
