// Comprehensive translation interface for the entire application
export interface AppTranslations {
  common: {
    loading: string;
    search: string;
    location: string;
    comingSoon: string;
    featured: string;
  };
  header: {
    buildCV: string;
    jobs: string;
  };
  languages: {
    english: string;
    arabic: string;
  };
  footer: {
    copyright: string;
    description: string;
  };
  home: {
    hero: {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      primaryButton: string;
      secondaryButton: string;
      trustIndicator: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: Array<{
        title: string;
        description: string;
      }>;
      badges: {
        free: string;
        atsCompliant: string;
        aiPowered: string;
        instantPdf: string;
      };
    };
    benefits: {
      title: string;
      subtitle: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
    cta: {
      title: string;
      description: string;
      button: string;
      disclaimer: string;
    };
    footer: {
      description: string;
      copyright: string;
    };
  };
  jobs: {
    header: {
      title: string;
      description: string;
    };
    hero: {
      comingSoonBadge: string;
      title: string;
      subtitle: string;
      description: string;
      searchPlaceholder: {
        jobTitle: string;
        location: string;
        searchButton: string;
      };
      featureComingSoon: string;
    };
    features: {
      aiSearch: {
        title: string;
        description: string;
      };
      topCompanies: {
        title: string;
        description: string;
      };
      jobAlerts: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      description: string;
      button: string;
    };
    preview: {
      title: string;
      description: string;
      featured: string;
    };
  };
}

// Helper function to get translations for current language
export function getTranslations(language: string): AppTranslations {
  const translations: Record<string, AppTranslations> = {
    ar: {
      common: {
        loading: "جاري التحميل...",
        search: "بحث",
        location: "الموقع",
        comingSoon: "قريباً",
        featured: "مميزة",
      },
      header: {
        buildCV: "بناء السيرة الذاتية",
        jobs: "الوظائف",
      },
      languages: {
        english: "English",
        arabic: "العربية",
      },
      footer: {
        copyright:
          "© 2025 CVIFI. صُنع بـ ❤️ للباحثين عن العمل في جميع أنحاء العالم.",
        description:
          "منشئ السيرة الذاتية المدعوم بالذكاء الاصطناعي الذي يساعدك في الحصول على وظيفة أحلامك.",
      },
      home: {
        hero: {
          badge: "منشئ سير ذاتية بالذكاء الاصطناعي",
          title: "اصنع سيرة ذاتية",
          subtitle: "تفتح لك أبواب المقابلات",
          description:
            "منصة CVIFI المجانية تساعدك على إنشاء سيرتك الذاتية بالعربية والإنجليزية: قوالب متوافقة مع أنظمة التتبع، واقتراحات ذكية بالذكاء الاصطناعي، وتصدير فوري بصيغة PDF — بدون تسجيل أو رسوم.",
          primaryButton: "أنشئ سيرتي مجاناً",
          secondaryButton: "شاهد المعاينة",
          trustIndicator: "يثق بنا أكثر من 10,000 باحث عن عمل في المنطقة",
        },
        features: {
          title: "كل ما تحتاجه لتتميّز",
          subtitle: "سِيَر ذاتية احترافية مصمّمة لطريقة التوظيف الحديثة",
          items: [
            {
              title: "تجاوز أنظمة التتبع",
              description:
                "تنسيق واضح وقابل للقراءة الآلية حتى تصل كل كلمة إلى المسؤول عن التوظيف.",
            },
            {
              title: "اكتبها بالذكاء الاصطناعي",
              description:
                "حوّل ملاحظاتك المبدئية إلى إنجازات مصاغة باحتراف خلال ثوانٍ.",
            },
            {
              title: "PDF بدقة عالية",
              description:
                "حمّل ملف PDF جاهزاً للطباعة يطابق المعاينة تماماً — بالعربية أو الإنجليزية.",
            },
          ],
          badges: {
            free: "مجاني",
            atsCompliant: "متوافق مع أنظمة التتبع",
            aiPowered: "مدعوم بالذكاء الاصطناعي",
            instantPdf: "PDF فوري",
          },
        },
        benefits: {
          title: "لماذا تختار منشئ السيرة الذاتية الخاص بنا؟",
          subtitle: "نحن نجعل عملية إنشاء السيرة الذاتية سهلة ومؤثرة",
          items: [
            {
              title: "واجهة سهلة الاستخدام",
              description:
                "واجهة بسيطة وبديهية تجعل إنشاء السيرة الذاتية أمراً ممتعاً",
            },
            {
              title: "قوالب احترافية",
              description:
                "قوالب مصممة من قبل خبراء التوظيف لضمان التأثير الأقصى",
            },
            {
              title: "معاينة في الوقت الفعلي",
              description: "شاهد تغييراتك فوراً أثناء الكتابة",
            },
          ],
        },
        cta: {
          title: "وظيفة أحلامك تبدأ بسيرة ذاتية واحدة",
          description:
            "انضم لآلاف الباحثين الذين أنشأوا سِيَرهم المميزة مع CVIFI — مجاناً، وبلغتين، وخلال دقائق.",
          button: "ابدأ الآن مجاناً",
          disclaimer: "مجاني بالكامل. لا حاجة لبطاقة ائتمانية.",
        },
        footer: {
          description:
            "منشئ السيرة الذاتية المدعوم بالذكاء الاصطناعي الذي يساعدك في الحصول على وظيفة أحلامك.",
          copyright: "© 2024 منشئ السيرة الذاتية. جميع الحقوق محفوظة.",
        },
      },
      jobs: {
        header: {
          title: "البحث عن الوظائف",
          description:
            "اعثر على وظيفة أحلامك باستخدام منصة البحث المدعومة بالذكاء الاصطناعي",
        },
        hero: {
          comingSoonBadge: "قريباً",
          title: "باحث الوظائف",
          subtitle: "مدعوم بالذكاء الاصطناعي",
          description:
            "منصة البحث عن الوظائف التالية التي تربطك بأفضل الشركات باستخدام الذكاء الاصطناعي المتقدم",
          searchPlaceholder: {
            jobTitle: "المسمى الوظيفي، الكلمات المفتاحية...",
            location: "الموقع، المدينة...",
            searchButton: "بحث عن الوظائف",
          },
          featureComingSoon: "ميزة قريباً",
        },
        features: {
          aiSearch: {
            title: "بحث مدعوم بالذكاء الاصطناعي",
            description: "خوارزميات ذكية تطابق مهاراتك مع أفضل الفرص الوظيفية",
          },
          topCompanies: {
            title: "أفضل الشركات",
            description:
              "وصول حصري للوظائف في الشركات الرائدة والناشئة المبتكرة",
          },
          jobAlerts: {
            title: "تنبيهات الوظائف الذكية",
            description:
              "احصل على إشعارات فورية عندما تكون هناك وظائف مثالية متاحة",
          },
        },
        cta: {
          title: "جاهز للعثور على وظيفة أحلامك؟",
          description: "انضم لآلاف المهنيين الذين وجدوا وظائفهم المثالية معنا",
          button: "ابدأ البحث عن الوظائف",
        },
        preview: {
          title: "معاينة الوظائف",
          description: "استكشف عينة من أفضل الفرص الوظيفية المتاحة قريباً",
          featured: "مميزة",
        },
      },
    },
    en: {
      common: {
        loading: "Loading...",
        search: "Search",
        location: "Location",
        comingSoon: "Coming Soon",
        featured: "Featured",
      },
      header: {
        buildCV: "Build CV",
        jobs: "Jobs",
      },
      languages: {
        english: "English",
        arabic: "العربية",
      },
      footer: {
        copyright: "© 2025 CVIFI. Built with ❤️ for job seekers worldwide.",
        description:
          "The AI-powered CV builder that helps you land your dream job.",
      },
      home: {
        hero: {
          badge: "AI-powered resume builder",
          title: "Build a resume that",
          subtitle: "gets you interviews",
          description:
            "CVIFI is the free resume builder for job seekers in English and Arabic. ATS-ready templates, AI-powered writing help, and instant PDF export — no sign-up, no cost.",
          primaryButton: "Build my resume — free",
          secondaryButton: "View Preview",
          trustIndicator: "Trusted by 10,000+ job seekers across the region",
        },
        features: {
          title: "Everything you need to stand out",
          subtitle: "Professional resumes, built for how hiring actually works today",
          items: [
            {
              title: "Beat the ATS",
              description:
                "Clean, parseable formatting so applicant tracking systems read every word — and recruiters do too.",
            },
            {
              title: "Write it with AI",
              description:
                "Turn rough notes into sharp, achievement-focused bullet points in seconds.",
            },
            {
              title: "Pixel-perfect PDF",
              description:
                "Download a crisp, print-ready PDF that matches your preview exactly — in English or Arabic.",
            },
          ],
          badges: {
            free: "Free",
            atsCompliant: "ATS Compliant",
            aiPowered: "AI Powered",
            instantPdf: "Instant PDF",
          },
        },
        benefits: {
          title: "Why Choose Our CV Builder?",
          subtitle: "We make CV creation simple and effective",
          items: [
            {
              title: "Easy to Use",
              description:
                "Simple and intuitive interface that makes CV building a breeze",
            },
            {
              title: "Professional Templates",
              description:
                "Templates designed by hiring experts to maximize impact",
            },
            {
              title: "Real-time Preview",
              description: "See your changes instantly as you type",
            },
          ],
        },
        cta: {
          title: "Your dream job is one resume away",
          description:
            "Join thousands who built standout resumes with CVIFI — free, bilingual, and ready in minutes.",
          button: "Start building — it's free",
          disclaimer: "Completely free. No credit card required.",
        },
        footer: {
          description:
            "The AI-powered CV builder that helps you land your dream job.",
          copyright: "© 2024 CV Builder. All rights reserved.",
        },
      },
      jobs: {
        header: {
          title: "Job Search",
          description:
            "Find your dream job with our AI-powered search platform",
        },
        hero: {
          comingSoonBadge: "Coming Soon",
          title: "Job Finder",
          subtitle: "AI-Powered",
          description:
            "The next-generation job search platform that connects you with top companies using advanced AI",
          searchPlaceholder: {
            jobTitle: "Job title, keywords...",
            location: "Location, city...",
            searchButton: "Search Jobs",
          },
          featureComingSoon: "Feature coming soon",
        },
        features: {
          aiSearch: {
            title: "AI-Powered Search",
            description:
              "Smart algorithms that match your skills with the best job opportunities",
          },
          topCompanies: {
            title: "Top Companies",
            description:
              "Exclusive access to jobs at leading companies and innovative startups",
          },
          jobAlerts: {
            title: "Smart Job Alerts",
            description:
              "Get instant notifications when perfect job matches become available",
          },
        },
        cta: {
          title: "Ready to find your dream job?",
          description:
            "Join thousands of professionals who found their perfect positions with us",
          button: "Start Job Search",
        },
        preview: {
          title: "Job Preview",
          description:
            "Explore a sample of the best job opportunities coming soon",
          featured: "Featured",
        },
      },
    },
  };

  return translations[language] || translations.en;
}
