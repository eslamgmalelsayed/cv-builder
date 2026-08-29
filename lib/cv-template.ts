// Single source of truth for CV rendering.
// Produces a fully self-contained HTML document (inline <style>, no Tailwind,
// no runtime CSS variables) so the on-screen preview and the generated PDF are
// byte-for-byte the same. Used by the PDF pipeline and by the live preview.

export interface CVTemplateData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
    github: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  customSections: Array<{
    id: string;
    title: string;
    type: "text" | "list" | "timeline";
    content: string;
    items?: Array<{
      id: string;
      title: string;
      subtitle?: string;
      description: string;
      date?: string;
    }>;
  }>;
}

export interface CVTemplateOptions {
  sectionOrder?: string[];
  visibleSections?: Record<string, boolean>;
  sectionNames?: Record<string, string>;
  language?: "en" | "ar";
  direction?: "ltr" | "rtl";
  themeColor?: string;
  /** When true, wraps the CV in a full <html> document ready for Puppeteer. */
  document?: boolean;
}

// Theme presets mirror app/globals.css (HSL triplets).
const THEME_HSL: Record<string, string> = {
  "theme-blue": "221 83% 53%",
  "theme-green": "142 76% 36%",
  "theme-purple": "262 83% 58%",
  "theme-red": "0 84% 60%",
  "theme-orange": "25 95% 53%",
  "theme-pink": "330 81% 60%",
  "theme-indigo": "239 84% 67%",
  "theme-teal": "173 80% 40%",
  "theme-gray": "215 28% 17%",
  "theme-black": "222 47% 11%",
};

const LABELS = {
  en: {
    yourName: "Your Name",
    present: "Present",
    professionalSummary: "Professional Summary",
    experience: "Work Experience",
    education: "Education",
    technicalSkills: "Technical Skills",
    coreCompetencies: "Core Competencies",
    languages: "Languages",
    certifications: "Certifications",
    gpa: "GPA: ",
  },
  ar: {
    yourName: "اسمك",
    present: "حتى الآن",
    professionalSummary: "الملخص المهني",
    experience: "الخبرة العملية",
    education: "التعليم",
    technicalSkills: "المهارات التقنية",
    coreCompetencies: "الكفاءات الأساسية",
    languages: "اللغات",
    certifications: "الشهادات",
    gpa: "المعدل: ",
  },
};

function esc(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function formatDate(dateString: string, language: "en" | "ar"): string {
  if (!dateString) return "";
  let date: Date;
  const parts = dateString.split("-");
  if (dateString.includes("-") && parts.length === 3) {
    date = new Date(dateString);
  } else if (dateString.includes("-") && parts.length === 2) {
    date = new Date(dateString + "-01");
  } else {
    return dateString;
  }
  if (isNaN(date.getTime())) return dateString;
  const locale = language === "ar" ? "ar-SA" : "en-US";
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
}

function bullets(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return "";
  return `<ul class="cv-bullets">${lines
    .map((l) => `<li>${esc(l)}</li>`)
    .join("")}</ul>`;
}

function href(raw: string, kind: "linkedin" | "website" | "github"): string {
  if (raw.startsWith("http")) return raw;
  if (kind === "linkedin") return `https://linkedin.com/in/${raw}`;
  return `https://${raw}`;
}

function icon(name: string): string {
  const paths: Record<string, string> = {
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>',
    linkedin:
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    github:
      '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>',
  };
  return `<svg class="cv-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${
    paths[name] || ""
  }</svg>`;
}

function sectionLabel(
  key: string,
  data: CVTemplateData,
  names: Record<string, string>,
  language: "en" | "ar"
): string {
  if (key.startsWith("custom-")) {
    const id = key.replace("custom-", "");
    const found = data.customSections.find((s) => s.id === id);
    return found?.title || key;
  }
  const l = LABELS[language];
  const fallback: Record<string, string> = {
    experience: l.experience,
    education: l.education,
    skills: "",
  };
  return names[key] || fallback[key] || key;
}

function renderExperience(data: CVTemplateData, label: string): string {
  if (!data.experience.length) return "";
  const lang = "en";
  const items = data.experience
    .map(
      (exp) => `
    <div class="cv-item">
      <div class="cv-item-head">
        <div>
          <div class="cv-item-title">${esc(exp.jobTitle)}</div>
          <div class="cv-item-sub">${esc(exp.company)}</div>
        </div>
        <div class="cv-item-meta">
          <div class="cv-item-date">${esc(
            formatDate(exp.startDate, lang as "en")
          )} – ${
            exp.current
              ? "Present"
              : esc(formatDate(exp.endDate, lang as "en"))
          }</div>
          ${exp.location ? `<div>${esc(exp.location)}</div>` : ""}
        </div>
      </div>
      ${exp.description ? bullets(exp.description) : ""}
    </div>`
    )
    .join("");
  return `<section class="cv-section"><h2 class="cv-h2">${esc(
    label
  )}</h2><div class="cv-stack">${items}</div></section>`;
}

function renderEducation(
  data: CVTemplateData,
  label: string,
  l: (typeof LABELS)["en"]
): string {
  if (!data.education.length) return "";
  const items = data.education
    .map(
      (edu) => `
    <div class="cv-item cv-item-row">
      <div>
        <div class="cv-item-title">${esc(edu.degree)}</div>
        <div class="cv-item-sub">${esc(edu.institution)}</div>
        ${edu.location ? `<div class="cv-item-loc">${esc(edu.location)}</div>` : ""}
      </div>
      <div class="cv-item-meta">
        ${
          edu.graduationDate
            ? `<div class="cv-item-date">${esc(
                formatDate(edu.graduationDate, "en")
              )}</div>`
            : ""
        }
        ${edu.gpa ? `<div>${l.gpa}${esc(edu.gpa)}</div>` : ""}
      </div>
    </div>`
    )
    .join("");
  return `<section class="cv-section"><h2 class="cv-h2">${esc(
    label
  )}</h2><div class="cv-stack">${items}</div></section>`;
}

function renderSkills(
  data: CVTemplateData,
  l: (typeof LABELS)["en"]
): string {
  const tech = toArray(data.skills?.technical);
  const soft = toArray(data.skills?.soft);
  const langs = toArray(data.skills?.languages);
  const certs = toArray(data.skills?.certifications);
  if (!tech.length && !soft.length && !langs.length && !certs.length) return "";

  const block = (title: string, body: string) =>
    `<div class="cv-skill-block"><h3 class="cv-h3">${esc(
      title
    )}</h3>${body}</div>`;

  let out = "";
  if (tech.length)
    out += block(
      l.technicalSkills,
      `<p class="cv-inline">${esc(tech.join(", "))}</p>`
    );
  if (soft.length)
    out += block(
      l.coreCompetencies,
      `<ul class="cv-bullets cv-bullets-cols">${soft
        .map((s) => `<li>${esc(s)}</li>`)
        .join("")}</ul>`
    );
  if (langs.length)
    out += block(
      l.languages,
      `<p class="cv-inline">${esc(langs.join(", "))}</p>`
    );
  if (certs.length)
    out += block(
      l.certifications,
      `<p class="cv-inline">${esc(certs.join(", "))}</p>`
    );
  return `<section class="cv-section cv-skills">${out}</section>`;
}

function renderCustom(section: CVTemplateData["customSections"][number]): string {
  const heading = `<h2 class="cv-h2">${esc(section.title)}</h2>`;
  if (section.type === "text") {
    return `<section class="cv-section">${heading}${bullets(
      section.content
    )}</section>`;
  }
  const items = (section.items || [])
    .map(
      (item) => `
      <div class="cv-item">
        <div class="cv-item-head">
          <div>
            <div class="cv-item-title">${esc(item.title)}</div>
            ${item.subtitle ? `<div class="cv-item-sub">${esc(item.subtitle)}</div>` : ""}
          </div>
          ${item.date ? `<div class="cv-item-meta"><div class="cv-item-date">${esc(item.date)}</div></div>` : ""}
        </div>
        ${item.description ? bullets(item.description) : ""}
      </div>`
    )
    .join("");
  return `<section class="cv-section">${heading}<div class="cv-stack">${items}</div></section>`;
}

export function buildCVStyles(themeColor = "theme-black"): string {
  const hsl = THEME_HSL[themeColor] || THEME_HSL["theme-black"];
  return `
  .cv-root{--cv-primary:hsl(${hsl});--cv-primary-soft:hsl(${hsl} / 0.28);
    color:#1f2937;background:#fff;font-size:10.5pt;line-height:1.5;
    font-family:"IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;}
  .cv-root[dir="rtl"]{font-family:"IBM Plex Sans Arabic","IBM Plex Sans","Segoe UI",Arial,sans-serif;text-align:right;}
  .cv-root *{box-sizing:border-box;}
  .cv-page{padding:14mm 15mm;max-width:210mm;margin:0 auto;}
  .cv-header{border-bottom:2px solid var(--cv-primary);padding-bottom:12px;margin-bottom:16px;}
  .cv-name{font-size:23pt;font-weight:700;color:var(--cv-primary);margin:0 0 2px;letter-spacing:-0.01em;line-height:1.1;}
  .cv-title{font-size:12.5pt;font-weight:500;color:#4b5563;margin:0 0 8px;}
  .cv-contact{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:9.5pt;color:#4b5563;}
  .cv-contact a{color:#4b5563;text-decoration:none;}
  .cv-contact-item{display:inline-flex;align-items:center;gap:5px;}
  .cv-links{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:6px;font-size:9.5pt;color:#4b5563;}
  .cv-links a{color:#4b5563;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}
  .cv-ic{width:13px;height:13px;flex:none;color:var(--cv-primary);}
  .cv-ltr{direction:ltr;display:inline-block;unicode-bidi:embed;}
  .cv-section{margin-bottom:15px;page-break-inside:auto;break-inside:auto;}
  .cv-h2{font-size:11.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
    color:var(--cv-primary);border-bottom:1px solid var(--cv-primary-soft);
    padding-bottom:3px;margin:0 0 8px;page-break-after:avoid;break-after:avoid;}
  .cv-h3{font-size:10.5pt;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;
    color:var(--cv-primary);border-bottom:1px solid var(--cv-primary-soft);
    padding-bottom:2px;margin:0 0 5px;page-break-after:avoid;break-after:avoid;}
  .cv-summary{color:#374151;margin:0;}
  .cv-stack>*+*{margin-top:10px;}
  .cv-item{page-break-inside:avoid;break-inside:avoid;}
  .cv-item-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:3px;}
  .cv-item-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
  .cv-item-title{font-weight:700;color:var(--cv-primary);font-size:10.5pt;}
  .cv-item-sub{color:#374151;font-weight:500;}
  .cv-item-loc{color:#6b7280;font-size:9.5pt;}
  .cv-item-meta{text-align:right;color:#6b7280;font-size:9.5pt;white-space:nowrap;flex:none;}
  .cv-root[dir="rtl"] .cv-item-meta{text-align:left;}
  .cv-item-date{font-weight:600;color:#4b5563;}
  .cv-bullets{margin:4px 0 0;padding:0;list-style:none;}
  .cv-bullets li{position:relative;padding-left:14px;margin-bottom:3px;color:#374151;}
  .cv-bullets li::before{content:"";position:absolute;left:2px;top:8px;width:4px;height:4px;
    border-radius:50%;background:var(--cv-primary);}
  .cv-root[dir="rtl"] .cv-bullets li{padding-left:0;padding-right:14px;}
  .cv-root[dir="rtl"] .cv-bullets li::before{left:auto;right:2px;}
  .cv-bullets-cols{columns:2;column-gap:24px;}
  .cv-inline{color:#374151;margin:0;}
  .cv-skills>*+*{margin-top:12px;}
  .cv-skill-block{page-break-inside:avoid;break-inside:avoid;}
  @media print{
    .cv-page{padding:0;}
    body{margin:0;}
  }`;
}

export function buildCVBody(
  data: CVTemplateData,
  options: CVTemplateOptions = {}
): string {
  const {
    sectionOrder = ["personalInfo", "experience", "education", "skills"],
    visibleSections = {
      personalInfo: true,
      experience: true,
      education: true,
      skills: true,
    },
    sectionNames = {},
    language = "en",
    direction = "ltr",
  } = options;

  const l = LABELS[language];
  const p = data.personalInfo;

  // Header
  const contactItems: string[] = [];
  if (p.email)
    contactItems.push(
      `<a href="mailto:${esc(p.email)}" class="cv-contact-item">${icon(
        "mail"
      )}<span class="cv-ltr">${esc(p.email)}</span></a>`
    );
  if (p.phone)
    contactItems.push(
      `<a href="tel:${esc(p.phone)}" class="cv-contact-item">${icon(
        "phone"
      )}<span class="cv-ltr">${esc(p.phone)}</span></a>`
    );
  if (p.location)
    contactItems.push(
      `<span class="cv-contact-item">${icon("pin")}<span>${esc(
        p.location
      )}</span></span>`
    );

  const linkItems: string[] = [];
  if (p.linkedIn)
    linkItems.push(
      `<a href="${esc(href(p.linkedIn, "linkedin"))}">${icon(
        "linkedin"
      )}<span class="cv-ltr">${esc(p.linkedIn)}</span></a>`
    );
  if (p.website)
    linkItems.push(
      `<a href="${esc(href(p.website, "website"))}">${icon(
        "globe"
      )}<span class="cv-ltr">${esc(p.website)}</span></a>`
    );
  if (p.github)
    linkItems.push(
      `<a href="${esc(href(p.github, "github"))}">${icon(
        "github"
      )}<span class="cv-ltr">${esc(p.github)}</span></a>`
    );

  const header = `<header class="cv-header">
    <h1 class="cv-name">${esc(p.fullName || l.yourName)}</h1>
    ${p.title && p.title.trim() ? `<div class="cv-title">${esc(p.title)}</div>` : ""}
    ${contactItems.length ? `<div class="cv-contact">${contactItems.join("")}</div>` : ""}
    ${linkItems.length ? `<div class="cv-links">${linkItems.join("")}</div>` : ""}
  </header>`;

  const summary = p.summary
    ? `<section class="cv-section"><h2 class="cv-h2">${esc(
        l.professionalSummary
      )}</h2><p class="cv-summary">${esc(p.summary)}</p></section>`
    : "";

  const dynamic = sectionOrder
    .filter((key) => visibleSections[key])
    .map((key) => {
      if (key.startsWith("custom-")) {
        const id = key.replace("custom-", "");
        const found = data.customSections.find((s) => s.id === id);
        return found ? renderCustom(found) : "";
      }
      switch (key) {
        case "experience":
          return renderExperience(
            data,
            sectionLabel("experience", data, sectionNames, language)
          );
        case "education":
          return renderEducation(
            data,
            sectionLabel("education", data, sectionNames, language),
            l
          );
        case "skills":
          return renderSkills(data, l);
        default:
          return "";
      }
    })
    .join("");

  return `<div class="cv-root" dir="${direction}" lang="${language}"><div class="cv-page">${header}${summary}${dynamic}</div></div>`;
}

/**
 * Full self-contained HTML document for Puppeteer / PDF generation.
 */
export function buildCVDocument(
  data: CVTemplateData,
  options: CVTemplateOptions = {}
): string {
  const styles = buildCVStyles(options.themeColor);
  const body = buildCVBody(data, options);
  const dir = options.direction || "ltr";
  const lang = options.language || "en";
  const fontLink =
    lang === "ar"
      ? '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'
      : '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">';
  return `<!DOCTYPE html><html dir="${dir}" lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${fontLink}
<style>@page{size:A4;margin:12mm 0;}*{margin:0;padding:0;}html,body{background:#fff;}${styles}</style>
</head><body>${body}</body></html>`;
}
