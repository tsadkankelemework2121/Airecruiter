// Translations for English and Amharic

export type Language = "en" | "am";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    services: string;
    contact: string;
    signup: string;
    signin: string;
    dashboard: string;
    profile: string;
    logout: string;
  };
  
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    update: string;
    close: string;
    search: string;
    filter: string;
    submit: string;
    back: string;
    next: string;
    previous: string;
    view: string;
    select: string;
    upload: string;
    download: string;
    confirm: string;
    yes: string;
    no: string;
    all: string;
  };

  // Auth
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    role: string;
    forgotPassword: string;
    rememberMe: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
      createAccount: string;
      loginSuccess: string;
      loginFailed: string;
      registerSuccess: string;
      registerFailed: string;
      welcomeBack: string;
      signInToContinue: string;
      joiningUs: string;
      passwordsDoNotMatch: string;
      passwordTooShort: string;
      accountExists: string;
      invalidCredentials: string;
      somethingWentWrong: string;
      creatingAccount: string;
      signingIn: string;
      accountType: string;
      individualUser: string;
      governmentUser: string;
    };

  // Roles
  roles: {
    user: string;
    company: string;
    government: string;
    jobSeeker: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    overview: string;
    statistics: string;
    recentActivity: string;
    postedJobs: string;
    applications: string;
    aiScreening: string;
    myApplications: string;
    availableJobs: string;
    jobPostings: string;
    recruiters: string;
    candidates: string;
  };

  // Jobs
  jobs: {
    title: string;
    description: string;
    location: string;
    city: string;
    region: string;
    country: string;
    salary: string;
    salaryType: string;
    type: string;
    requirements: string;
    education: string;
    experience: string;
    vacancies: string;
    category: string;
    deadline: string;
    status: string;
    postedDate: string;
    postNewJob: string;
    editJob: string;
    deleteJob: string;
    closeJob: string;
    activateJob: string;
    draft: string;
    active: string;
    closed: string;
    fullTime: string;
    partTime: string;
    contract: string;
    internship: string;
    monthly: string;
    annual: string;
    hourly: string;
  };

  // Applications
  applications: {
    title: string;
    applicant: string;
    applicantName: string;
    applicantEmail: string;
    appliedDate: string;
    status: string;
    pending: string;
    reviewing: string;
    accepted: string;
    rejected: string;
    viewCV: string;
    review: string;
    noApplications: string;
  };

  // AI Screening
  screening: {
    title: string;
    screenAll: string;
    ranking: string;
    score: string;
    matchPercentage: string;
    strengths: string;
    weaknesses: string;
    justification: string;
    selectJob: string;
    noCandidates: string;
    screeningCandidates: string;
    refreshRankings: string;
    totalCandidates: string;
    averageScore: string;
    topScore: string;
    lowestScore: string;
    highlyRecommended: string;
    strongMatch: string;
    goodMatch: string;
    moderateMatch: string;
    limitedMatch: string;
  };

  // Profile
  profile: {
    personalInfo: string;
    professionalInfo: string;
    documents: string;
    kycVerification: string;
    companyInfo: string;
    businessLicense: string;
    editProfile: string;
    updateProfile: string;
    saveChanges: string;
  };

  // Home Page
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      getStarted: string;
      learnMore: string;
      findDreamJob: string;
      activeJobs: string;
      companies: string;
      jobSeekers: string;
    };
    services: {
      title: string;
      subtitle: string;
      description: string;
      aiRecruitment: string;
      aiRecruitmentDesc: string;
      candidateIntelligence: string;
      candidateIntelligenceDesc: string;
      engagementHub: string;
      engagementHubDesc: string;
      keyFeatures: string;
      resumeScreening: string;
      resumeScreeningDesc: string;
      candidateMatching: string;
      candidateMatchingDesc: string;
      interviewScheduling: string;
      interviewSchedulingDesc: string;
    };
    about: {
      title: string;
      description: string;
      mission: string;
      missionDesc1: string;
      missionDesc2: string;
      values: string;
      innovation: string;
      innovationDesc: string;
      fairness: string;
      fairnessDesc: string;
      transparency: string;
      transparencyDesc: string;
      poweredBy: string;
      machineLearning: string;
      machineLearningDesc: string;
      nlp: string;
      nlpDesc: string;
      biasDetection: string;
      biasDetectionDesc: string;
      predictiveAnalytics: string;
      predictiveAnalyticsDesc: string;
    };
    contact: {
      title: string;
      description: string;
      name: string;
      email: string;
      phone: string;
      phoneNumber: string;
      howDidYouFindUs: string;
      send: string;
      google: string;
      socialMedia: string;
      friend: string;
      other: string;
      phoneLabel: string;
      faxLabel: string;
      emailLabel: string;
    };
  };

  // Messages
  messages: {
    success: string;
    error: string;
    warning: string;
    info: string;
    jobCreated: string;
    jobUpdated: string;
    jobDeleted: string;
    profileUpdated: string;
    applicationSubmitted: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      contact: "Contact",
      signup: "Signup",
      signin: "Signin",
      dashboard: "Dashboard",
      profile: "Profile",
      logout: "Logout",
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      update: "Update",
      close: "Close",
      search: "Search",
      filter: "Filter",
      submit: "Submit",
      back: "Back",
      next: "Next",
      previous: "Previous",
      view: "View",
      select: "Select",
      upload: "Upload",
      download: "Download",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      all: "All",
      and: "and",
      manage: "manage",
      available: "available",
      notAvailable: "not available",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      role: "Role",
      forgotPassword: "Forgot Password?",
      rememberMe: "Remember Me",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      createAccount: "Create Account",
      loginSuccess: "Login successful!",
      loginFailed: "Login failed. Please check your credentials.",
      registerSuccess: "Registration successful!",
      registerFailed: "Registration failed. Please try again.",
      welcomeBack: "Welcome Back",
      signInToContinue: "Sign in to your account to continue",
      joiningUs: "Join us today and get started in minutes",
      passwordsDoNotMatch: "Passwords do not match!",
      passwordTooShort: "Password must be at least 6 characters long!",
      accountExists: "An account with this email already exists. Please sign in instead.",
      invalidCredentials: "Invalid email or password. Please try again.",
      somethingWentWrong: "Something went wrong. Please try again.",
      creatingAccount: "Creating Account...",
      signingIn: "Signing in...",
      accountType: "Account Type",
      individualUser: "Individual User",
      governmentUser: "Government User",
    },
    roles: {
      user: "User",
      company: "Company",
      government: "Government",
      jobSeeker: "Job Seeker",
    },
    dashboard: {
      welcome: "Welcome",
      dashboard: "Dashboard",
      overview: "Overview",
      statistics: "Statistics",
      recentActivity: "Recent Activity",
      postedJobs: "Posted Jobs",
      applications: "Applications",
      aiScreening: "AI Screening",
      myApplications: "My Applications",
      availableJobs: "Available Jobs",
      jobPostings: "Job Postings",
      recruiters: "Recruiters",
      candidates: "Candidates",
    },
    jobs: {
      title: "Job Title",
      description: "Description",
      location: "Location",
      city: "City",
      region: "Region",
      country: "Country",
      salary: "Salary",
      salaryType: "Salary Type",
      type: "Job Type",
      requirements: "Requirements",
      education: "Education",
      experience: "Experience",
      vacancies: "Vacancies",
      category: "Category",
      deadline: "Deadline",
      status: "Status",
      postedDate: "Posted Date",
      postNewJob: "Post New Job",
      editJob: "Edit Job",
      deleteJob: "Delete Job",
      closeJob: "Close Job",
      activateJob: "Activate Job",
      draft: "Draft",
      active: "Active",
      closed: "Closed",
      fullTime: "Full Time",
      partTime: "Part Time",
      contract: "Contract",
      internship: "Internship",
      monthly: "Monthly",
      annual: "Annual",
      hourly: "Hourly",
    },
    applications: {
      title: "Applications",
      applicant: "Applicant",
      applicantName: "Applicant Name",
      applicantEmail: "Applicant Email",
      appliedDate: "Applied Date",
      status: "Status",
      pending: "Pending",
      reviewing: "Reviewing",
      accepted: "Accepted",
      rejected: "Rejected",
      viewCV: "View CV",
      review: "Review",
      noApplications: "No applications yet",
    },
    screening: {
      title: "AI Screening",
      screenAll: "Screen All Applications",
      ranking: "Ranking",
      score: "Score",
      matchPercentage: "Match Percentage",
      strengths: "Strengths",
      weaknesses: "Weaknesses",
      justification: "Justification",
      selectJob: "Select Job to Screen Candidates",
      noCandidates: "No candidates screened yet",
      screeningCandidates: "Screening candidates with AI...",
      refreshRankings: "Refresh Rankings",
      totalCandidates: "Total Candidates",
      averageScore: "Average Score",
      topScore: "Top Score",
      lowestScore: "Lowest Score",
      highlyRecommended: "Highly Recommended",
      strongMatch: "Strong Match",
      goodMatch: "Good Match",
      moderateMatch: "Moderate Match",
      limitedMatch: "Limited Match",
    },
    profile: {
      personalInfo: "Personal Information",
      professionalInfo: "Professional Information",
      documents: "Documents",
      kycVerification: "KYC Verification",
      companyInfo: "Company Information",
      businessLicense: "Business License",
      editProfile: "Edit Profile",
      updateProfile: "Update Profile",
      saveChanges: "Save Changes",
    },
    home: {
      hero: {
        title: "AI-Powered Recruitment",
        subtitle: "Revolutionizing Talent Acquisition",
        description: "Streamline your hiring process with our intelligent AI recruitment platform",
        getStarted: "Get Started",
        learnMore: "Learn More",
        findDreamJob: "Find Your Dream Job with",
        activeJobs: "Active Jobs",
        companies: "Companies",
        jobSeekers: "Job Seekers",
      },
      services: {
        title: "Our Service",
        subtitle: "Comprehensive recruitment solutions",
        description: "We revolutionize talent acquisition with intelligent solutions designed to transform how you find, evaluate, and engage top candidates in today's competitive market.",
        aiRecruitment: "AI-Powered Recruitment",
        aiRecruitmentDesc: "Leverage advanced artificial intelligence to streamline your hiring process, identify top talent faster, and make data-driven decisions that transform your recruitment strategy.",
        candidateIntelligence: "Candidate Intelligence",
        candidateIntelligenceDesc: "Gain deep insights into candidate profiles with intelligent matching algorithms that evaluate skills, experience, and cultural fit with precision.",
        engagementHub: "24/7 Engagement Hub",
        engagementHubDesc: "Keep candidates engaged throughout the entire hiring journey with real-time communication, automated updates, and personalized interactions.",
        keyFeatures: "Key Features",
        resumeScreening: "Resume Screening",
        resumeScreeningDesc: "Analyze and rank Candidates",
        candidateMatching: "Candidate Matching",
        candidateMatchingDesc: "Matches Skill and Preference",
        interviewScheduling: "Interview Scheduling",
        interviewSchedulingDesc: "Improve candidate Engagement",
      },
      about: {
        title: "About AI HIRE",
        description: "We are revolutionizing the recruitment industry by leveraging artificial intelligence to create seamless connections between talented professionals and innovative companies.",
        mission: "Our Mission",
        missionDesc1: "To eliminate bias in recruitment and make hiring faster, smarter, and more efficient. We believe every candidate deserves a fair chance and every company deserves to find the perfect match.",
        missionDesc2: "Through our AI-powered platform, we are bridging the gap between talent and opportunity, creating a future where recruitment is transparent, data-driven, and human-centered.",
        values: "Our Values",
        innovation: "Innovation",
        innovationDesc: "Constantly pushing boundaries with cutting-edge AI technology to solve real recruitment challenges.",
        fairness: "Fairness",
        fairnessDesc: "Committed to eliminating bias and ensuring equal opportunities for all candidates regardless of background.",
        transparency: "Transparency",
        transparencyDesc: "Building trust through clear processes, honest communication, and data-driven insights.",
        poweredBy: "Powered by Advanced AI",
        machineLearning: "Machine Learning",
        machineLearningDesc: "Our algorithms learn from thousands of successful placements to improve matching accuracy over time.",
        nlp: "Natural Language Processing",
        nlpDesc: "Advanced NLP capabilities analyze resumes, job descriptions, and candidate profiles with human-level understanding.",
        biasDetection: "Bias Detection",
        biasDetectionDesc: "Built-in systems identify and eliminate unconscious bias to ensure fair evaluation of all candidates.",
        predictiveAnalytics: "Predictive Analytics",
        predictiveAnalyticsDesc: "Data-driven insights help companies make informed hiring decisions and predict candidate success.",
      },
      contact: {
        title: "Get in Touch",
        description: "Email will be used to give you news and great deals",
        name: "Name",
        email: "Email",
        phone: "Phone",
        phoneNumber: "Phone number",
        howDidYouFindUs: "How did you find us?",
        send: "SEND",
        google: "Google",
        socialMedia: "Social Media",
        friend: "Friend",
        other: "Other",
        phoneLabel: "PHONE",
        faxLabel: "FAX",
        emailLabel: "EMAIL",
      },
    },
    messages: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      jobCreated: "Job created successfully!",
      jobUpdated: "Job updated successfully!",
      jobDeleted: "Job deleted successfully!",
      profileUpdated: "Profile updated successfully!",
      applicationSubmitted: "Application submitted successfully!",
    },
    dashboardStrings: {
      welcomeBack: "Welcome back!",
      recruitmentJourney: "Here's your recruitment journey.",
      completeProfile: "Complete Your Profile",
      completeProfileDesc: "Add your skills, experience, and documents to get better job matches",
      searchForJob: "Search for job",
      viewDetails: "View Details",
      applyNow: "Apply Now",
    },
  },
  am: {
    nav: {
      home: "መነሻ",
      about: "ስለእኛ",
      services: "አገልግሎቶች",
      contact: "እውቂያ",
      signup: "ተመዝግብ",
      signin: "ግባ",
      dashboard: "ዳሽቦርድ",
      profile: "መገለጫ",
      logout: "ውጣ",
    },
    common: {
      loading: "በመጫን ላይ...",
      save: "አስቀምጥ",
      cancel: "ይቅር",
      delete: "ሰርዝ",
      edit: "አርም",
      create: "ፍጠር",
      update: "አዘምን",
      close: "ዝጋ",
      search: "ፈልግ",
      filter: "አጣራ",
      submit: "ይላክ",
      back: "ተመለስ",
      next: "ቀጣይ",
      previous: "ያለፈ",
      view: "አየ",
      select: "ምረጥ",
      upload: "ስቀል",
      download: "አውርድ",
      confirm: "አረጋግጥ",
      yes: "አዎ",
      no: "አይ",
      all: "ሁሉም",
      and: "እና",
      manage: "አስተዳድር",
      available: "ይገኛል",
      notAvailable: "አይገኝም",
    },
    auth: {
      signIn: "ግባ",
      signUp: "ተመዝግብ",
      signOut: "ውጣ",
      email: "ኢሜይል",
      password: "የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል አረጋግጥ",
      fullName: "ሙሉ ስም",
      role: "ተውኔት",
      forgotPassword: "የይለፍ ቃልህን ረስተዋል?",
      rememberMe: "አስታውሰኝ",
      alreadyHaveAccount: "አስቀድሜ አካውንት አለህ?",
      dontHaveAccount: "አካውንት የሎትህም?",
      createAccount: "አካውንት ፍጠር",
      loginSuccess: "በተሳካ ሁኔታ ገብተዋል!",
      loginFailed: "መግቢያ አልተሳካም። ምስክር ሰነድህን አረጋግጥ።",
      registerSuccess: "ምዝገባ በተሳካ ሁኔታ ተጠናቋል!",
      registerFailed: "ምዝገባ አልተሳካም። እባክህ ዳግም ሞክር።",
      welcomeBack: "እንኳን ደህና መጣህ",
      signInToContinue: "ለመቀጠል ወደ አካውንትህ ግባ",
      joiningUs: "ዛሬ ይቀላቀሉን እና በደቂቃዎች ውስጥ ይጀምሩ",
      passwordsDoNotMatch: "የይለፍ ቃላት አይዛመዱም!",
      passwordTooShort: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት!",
      accountExists: "በዚህ ኢሜይል አካውንት አስቀድሞ አለ። እባክህ ይልቅ ግባ።",
      invalidCredentials: "የማያሻማ ኢሜይል ወይም የይለፍ ቃል። እባክህ ዳግም ሞክር።",
      somethingWentWrong: "ስህተት ተፈጥሯል። እባክህ ዳግም ሞክር።",
      creatingAccount: "አካውንት በመፍጠር ላይ...",
      signingIn: "በመግባት ላይ...",
      accountType: "የአካውንት አይነት",
      individualUser: "ግለሰብ ተጠቃሚ",
      governmentUser: "መንግስት ተጠቃሚ",
    },
    roles: {
      user: "ተጠቃሚ",
      company: "ኩባንያ",
      government: "መንግስት",
      jobSeeker: "ስራ ፈላጊ",
    },
    dashboard: {
      welcome: "እንኳን ደህና መጣህ",
      dashboard: "ዳሽቦርድ",
      overview: "አጠቃላይ እይታ",
      statistics: "ስታትስቲክስ",
      recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
      postedJobs: "የተለጠፉ ስራዎች",
      applications: "ምዝገባዎች",
      aiScreening: "አንግበር ማስረጃ AI",
      myApplications: "የእኔ ምዝገባዎች",
      availableJobs: "የሚገኙ ስራዎች",
      jobPostings: "የስራ ማስታወሻዎች",
      recruiters: "ሰራተኞች",
      candidates: "መመየጫዎች",
    },
    jobs: {
      title: "የስራ መለያ",
      description: "መግለጫ",
      location: "አካባቢ",
      city: "ከተማ",
      region: "ክልል",
      country: "አገር",
      salary: "ደመወዝ",
      salaryType: "የደመወዝ አይነት",
      type: "የስራ አይነት",
      requirements: "ምግብሮች",
      education: "ትምህርት",
      experience: "እውቀት",
      vacancies: "የሚያገለግሉ ቦታዎች",
      category: "መስመር",
      deadline: "መጨረሻ ቀን",
      status: "ሁኔታ",
      postedDate: "የተለጠፈበት ቀን",
      postNewJob: "አዲስ ስራ ለጥፍ",
      editJob: "ስራን አርም",
      deleteJob: "ስራን ሰርዝ",
      closeJob: "ስራን ዝጋ",
      activateJob: "ስራን አግብር",
      draft: "አስተናጋጅ",
      active: "ንቁ",
      closed: "ዝጋታ",
      fullTime: "ሙሉ ጊዜ",
      partTime: "ከፊል ጊዜ",
      contract: "ውል",
      internship: "መልሚያ",
      monthly: "ወራማዊ",
      annual: "ዓመታዊ",
      hourly: "በሰዓት",
    },
    applications: {
      title: "ምዝገባዎች",
      applicant: "መመየጫ",
      applicantName: "የመመየጫ ስም",
      applicantEmail: "የመመየጫ ኢሜይል",
      appliedDate: "የተመዘገበበት ቀን",
      status: "ሁኔታ",
      pending: "በመጠባበቅ ላይ",
      reviewing: "በመገምገም ላይ",
      accepted: "ተቀባይነት አግኝቷል",
      rejected: "ተቀባይነት አላገኘም",
      viewCV: "CV አየ",
      review: "ገምግም",
      noApplications: "እስካሁን ምዝገባዎች የሉም",
    },
    screening: {
      title: "አንግበር ማስረጃ AI",
      screenAll: "ሁሉንም ምዝገባዎች ደረጃ አድርግ",
      ranking: "ደረጃ",
      score: "ውጤት",
      matchPercentage: "የሚመሳሰል መቶኛ",
      strengths: "ጥንካሬዎች",
      weaknesses: "ድክመቶች",
      justification: "መግለጫ",
      selectJob: "መመየጫዎችን ለመመልከት ስራ ይምረጡ",
      noCandidates: "እስካሁን መመየጫዎች አልተመረመሩም",
      screeningCandidates: "መመየጫዎችን በAI መመልከት...",
      refreshRankings: "ደረጃዎችን አድስ",
      totalCandidates: "አጠቃላይ መመየጫዎች",
      averageScore: "አማካይ ውጤት",
      topScore: "ከፍተኛ ውጤት",
      lowestScore: "ዝቅተኛ ውጤት",
      highlyRecommended: "በብዛት ይመከራል",
      strongMatch: "ጠንካራ መዛመጃ",
      goodMatch: "ጥሩ መዛመጃ",
      moderateMatch: "መጠነኛ መዛመጃ",
      limitedMatch: "የተገደበ መዛመጃ",
    },
    profile: {
      personalInfo: "የግል መረጃ",
      professionalInfo: "የሙያ መረጃ",
      documents: "ሰነዶች",
      kycVerification: "KYC ማረጋገጥ",
      companyInfo: "የኩባንያ መረጃ",
      businessLicense: "የንግድ ፈቃድ",
      editProfile: "መገለጫ አርም",
      updateProfile: "መገለጫ አዘምን",
      saveChanges: "ለውጦችን አስቀምጥ",
    },
    home: {
      hero: {
        title: "AI-መሰረት የስራ መመየጥ",
        subtitle: "የችሎታ ማምራት አብዮት",
        description: "የእኛን አስተዋይ AI የስራ መመየጥ መድረክ በመጠቀም የቅጥር ሂደትዎን ቀለል አድርግ",
        getStarted: "ጀምር",
        learnMore: "ተጨማሪ ይመልከቱ",
        findDreamJob: "የእርስዎን ሕልም ስራ ያግኙ",
        activeJobs: "ንቁ ስራዎች",
        companies: "ኩባንያዎች",
        jobSeekers: "ስራ ፈላጊዎች",
      },
      services: {
        title: "አገልግሎቶቻችን",
        subtitle: "ሁሉም የስራ መመየጥ መፍትሄዎች",
        description: "አስተዋይ መፍትሄዎችን በመጠቀም የችሎታ ማምራትን እናሻሽላለን እና በዛሬው ውድድር የገበያ ላይ ከፍተኛ መመየጫዎችን እንዴት ማግኘት፣ መገምገም እና መሳተፍ እንደሚቀየር እናዘጋጃለን።",
        aiRecruitment: "AI-መሰረት የስራ መመየጥ",
        aiRecruitmentDesc: "የእርስዎን የቅጥር ሂደት ለማመቻቸት፣ ከፍተኛ ችሎታ ያላቸውን በፍጥነት ለመለየት እና የስራ መመየጥ ስትራቴጂዎን የሚቀይሩ በውሂብ የተመሰረቱ ውሳኔዎችን ለማድረግ የላቀ ሰው ሰራሽ አእምሮን ይጠቀሙ።",
        candidateIntelligence: "መመየጫ አእምሮ",
        candidateIntelligenceDesc: "ችሎታዎች፣ እውቀት እና የባህል ተመጣጣኝነትን በትክክል የሚገምግሙ አስተዋይ የመዛመጃ ስልተ-ቀመሮች በመጠቀም ስለ መመየጫዎች ጥልቅ ግንዛቤዎችን ያግኙ።",
        engagementHub: "24/7 መሳተፍ ማዕከል",
        engagementHubDesc: "በትዕዛዝ ኮምዩኒኬሽን፣ በራስ-ሰር ዝመናዎች እና በእንግዳዊ ግንኙነቶች በጠቅላላው የቅጥር ጉዞ ወቅት መመየጫዎችን ይቀላቀሉ።",
        keyFeatures: "ዋና ባህሪያት",
        resumeScreening: "CV ማጣራት",
        resumeScreeningDesc: "መመየጫዎችን ይገምግሙ እና ይዘርዝሩ",
        candidateMatching: "መመየጫ መዛመጃ",
        candidateMatchingDesc: "ችሎታ እና ምርጫ ይዛመዳል",
        interviewScheduling: "የቃለ-መጠይቅ ማስተካከያ",
        interviewSchedulingDesc: "የመመየጫ መሳተፍን ያሻሽሉ",
      },
      about: {
        title: "ስለ AI HIRE",
        description: "የችሎታ ያላቸውን ሙያዎች እና የፈጠራ ኩባንያዎችን መካከል ለማመቻቸት ሰው ሰራሽ አእምሮን በመጠቀም የስራ መመየጥ ኢንዱስትሪን እናሻሽላለን።",
        mission: "የእኛ ተልእኮ",
        missionDesc1: "በስራ መመየጥ ውስጥ አድሎዎን ለማስወገድ እና ቅጥርን ፈጣን፣ አስተዋይ እና ውጤታማ ለማድረግ። እያንዳንዱ መመየጫ ፍትሃዊ እድል ሊያገኝ ይገባል እና እያንዳንዱ ኩባንያ ፍጹም መዛመጃ ሊያገኝ ይገባል እናም እናምናለን።",
        missionDesc2: "በእኛ AI-መሰረት መድረክ በኩል፣ በችሎታ እና በእድል መካከል ያለውን ክፍተት እንዘግባለን፣ የስራ መመየጥ ግልጽ፣ በውሂብ የተመሰረተ እና የሰው ልጅ-ማዕከላዊ የሆነ ወደፊት እንፈጥራለን።",
        values: "የእኛ እሴቶች",
        innovation: "ፈጠራ",
        innovationDesc: "እውነተኛ የስራ መመየጥ ተግዳሮቶችን ለመፍታት የላቀ AI ቴክኖሎጂ በመጠቀም ሁልጊዜ ወሰኖችን በመጫን ላይ።",
        fairness: "አቀናበር",
        fairnessDesc: "አድሎዎን ለማስወገድ እና የመመየጫዎችን ሁሉ እኩልነት ለማረጋገጥ ቁርጠኛ ነን የዘመናቸውን አመጣጥ ምንም አይነት።",
        transparency: "ግልጽነት",
        transparencyDesc: "ግልጽ ሂደቶች፣ ሚጋራ የግንኙነት እና በውሂብ የተመሰረቱ ግንዛቤዎችን በመጠቀም እምነትን እንገነባለን።",
        poweredBy: "የላቀ AI ያቀሳቅሰው",
        machineLearning: "የማሽን ትምህርት",
        machineLearningDesc: "የእኛ ስልተ-ቀመሮች ከሺህ የተሳኩ አቀማመጦች ይማራሉ የጊዜ ሂደት የመዛመጃ ትክክለኛነትን ለማሻሻል።",
        nlp: "የተፈጥሮ ቋንቋ ሂደት",
        nlpDesc: "የላቀ NLP ችሎታዎች CVዎች፣ የስራ መግለጫዎች እና የመመየጫ መገለጫዎችን ከሰው የሚመዘገብ ግንዛቤ ጋር ይገምግማሉ።",
        biasDetection: "አድሎዎ ማግኘት",
        biasDetectionDesc: "የተገነቡ ስርዓቶች የማያውቁ አድሎዎችን ይለያሉ እና ያስወግዳሉ ሁሉንም መመየጫዎችን ፍትሃዊ ለመገምገም።",
        predictiveAnalytics: "የንግድ ትንቢት ትንታኔ",
        predictiveAnalyticsDesc: "በውሂብ የተመሰረቱ ግንዛቤዎች ኩባንያዎችን ማስተዋየት ውሳኔዎችን ለማድረግ እና የመመየጫ ስኬትን ለመተንበይ ይረዳሉ።",
      },
      contact: {
        title: "እውቂያ",
        description: "ኢሜይል ወሬዎችን እና ጥሩ ጥቅሞችን ለመስጠት ይጠቀማል",
        name: "ስም",
        email: "ኢሜይል",
        phone: "ስልክ",
        phoneNumber: "የስልክ ቁጥር",
        howDidYouFindUs: "እኛን እንዴት አገኙን?",
        send: "ላክ",
        google: "ጉግል",
        socialMedia: "ማህበራዊ ሚዲያ",
        friend: "ጓደኛ",
        other: "ሌላ",
        phoneLabel: "ስልክ",
        faxLabel: "ፋክስ",
        emailLabel: "ኢሜይል",
      },
    },
    messages: {
      success: "ተሳክቷል",
      error: "ስህተት",
      warning: "ማስጠንቀቂያ",
      info: "መረጃ",
      jobCreated: "ስራ በተሳካ ሁኔታ ተፈጥሯል!",
      jobUpdated: "ስራ በተሳካ ሁኔታ ተዘመነ!",
      jobDeleted: "ስራ በተሳካ ሁኔታ ተሰርዟል!",
      profileUpdated: "መገለጫ በተሳካ ሁኔታ ተዘመነ!",
      applicationSubmitted: "ምዝገባ በተሳካ ሁኔታ ቀርቧል!",
    },
    dashboardStrings: {
      welcomeBack: "እንኳን ደህና መጣህ!",
      recruitmentJourney: "የእርስዎ የስራ መመየጥ ጉዞ።",
      completeProfile: "መገለጫዎን ያጠናቅቁ",
      completeProfileDesc: "ችሎታዎችዎን፣ እውቀትዎን እና ሰነዶችዎን ያክሉ የተሻለ የስራ መዛመጃ ለማግኘት",
      searchForJob: "ስራ ፈልግ",
      viewDetails: "ዝርዝሮችን ይመልከቱ",
      applyNow: "አሁን ይመዘግቡ",
      allJobs: "ሁሉም ስራዎች",
      savedJobs: "የተቀመጡ ስራዎች",
      vacancy: "የሚያገለግል ቦታ",
      vacancies: "የሚያገለግሉ ቦታዎች",
    },
  },
};

