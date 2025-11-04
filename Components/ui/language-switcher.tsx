"use client";

import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/Components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-700 hover:text-orange-500"
      title={language === "en" ? "አማርኛ ቀይር" : "Switch to English"}
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === "en" ? "EN" : "AM"}</span>
    </Button>
  );
}



