"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface SaveStatusProps {
  status: "saving" | "saved" | "unsaved"
  language?: "en" | "ar"
}

const translations = {
  en: {
    saving: "Saving...",
    saved: "", // Removed "All changes saved"
    unsaved: "Unsaved changes",
  },
  ar: {
    saving: "جاري الحفظ...",
    saved: "", // Removed Arabic saved text
    unsaved: "تغييرات غير محفوظة",
  },
}

export function SaveStatus({ status, language = "en" }: SaveStatusProps) {
  const t = translations[language]

  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          text: t.saving,
          icon: <Clock className="w-3 h-3" />,
          variant: "secondary" as const,
          className: "text-blue-700 bg-blue-100",
        }
      case "saved":
        return {
          text: t.saved,
          icon: <CheckCircle className="w-3 h-3" />,
          variant: "secondary" as const,
          className: "text-green-700 bg-green-100",
        }
      case "unsaved":
        return {
          text: t.unsaved,
          icon: <AlertCircle className="w-3 h-3" />,
          variant: "secondary" as const,
          className: "text-orange-700 bg-orange-100",
        }
      default:
        return {
          text: t.saved,
          icon: <CheckCircle className="w-3 h-3" />,
          variant: "secondary" as const,
          className: "text-green-700 bg-green-100",
        }
    }
  }

  const config = getStatusConfig()

  // Don't render anything if the text is empty (saved state)
  if (!config.text) {
    return null
  }

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {status === "saving" ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
      ) : (
        config.icon
      )}
      <span className="text-xs">{config.text}</span>
    </Badge>
  )
}
