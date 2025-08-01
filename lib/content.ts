export interface HomePageContent {
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
}

export const homePageContent: Record<string, HomePageContent> = {
  en: {
    hero: {
      badge: "AI-Powered Resume Builder",
      title: "Build Your Perfect",
      subtitle: "Professional CV",
      description:
        "Create ATS-compliant resumes that get you hired. Our AI-powered builder helps you craft the perfect CV with professional templates, smart suggestions, and instant PDF export.",
      primaryButton: "Start Building Your CV",
      secondaryButton: "Get Started for Free",
      trustIndicator:
        "Join thousands of job seekers who have successfully landed interviews",
    },
    features: {
      title: "Everything You Need",
      subtitle:
        "Build professional resumes with powerful features designed to help you land your dream job",
      badges: {
        free: "100% Free",
        atsCompliant: "ATS-Compliant",
        aiPowered: "AI-Powered",
        instantPdf: "Instant PDF",
      },
      items: [
        {
          title: "ATS-Compliant Templates",
          description:
            "Professional templates designed to pass Applicant Tracking Systems and impress recruiters.",
        },
        {
          title: "AI-Powered Suggestions",
          description:
            "Get intelligent content recommendations and optimization tips to make your CV stand out.",
        },
        {
          title: "Real-time Preview",
          description:
            "See exactly how your CV will look as you build it, with instant updates and professional formatting.",
        },
        {
          title: "One-Click PDF Export",
          description:
            "Download your polished CV as a high-quality PDF ready for job applications.",
        },
        {
          title: "Drag & Drop Sections",
          description:
            "Easily reorder and customize sections to highlight your strengths and experience.",
        },
        {
          title: "Multiple Themes",
          description:
            "Choose from various color themes to match your personal style and industry standards.",
        },
      ],
    },
    benefits: {
      title: "Why Choose Our CV Builder?",
      subtitle:
        "Join thousands of professionals who have successfully landed their dream jobs",
      items: [
        {
          title: "100% Free",
          description:
            "No hidden fees, no premium upsells. Build and download your professional CV completely free.",
        },
        {
          title: "ATS-Optimized",
          description:
            "All templates are designed to pass Applicant Tracking Systems used by 99% of companies.",
        },
        {
          title: "Professional Quality",
          description:
            "Industry-standard formatting and design that impresses hiring managers and recruiters.",
        },
        {
          title: "Fast & Easy",
          description:
            "Build your complete CV in under 10 minutes with our intuitive drag-and-drop interface.",
        },
      ],
    },
    cta: {
      title: "Ready to Land Your Dream Job?",
      description:
        "Join thousands of professionals who have successfully built their careers with our CV builder.",
      button: "Create Your CV Now",
      disclaimer:
        "No registration required • Free forever • Professional results",
    },
    footer: {
      description:
        "Build professional, ATS-compliant resumes that get results. Start your career journey today.",
      copyright: "© 2025 CVIFI. Built with ❤️ for job seekers worldwide.",
    },
  },
  ar: {
    hero: {
      badge: "منشئ السيرة الذاتية بالذكاء الاصطناعي",
      title: "اصنع سيرتك الذاتية",
      subtitle: "المثالية والمهنية",
      description:
        "أنشئ سيرة ذاتية متوافقة مع أنظمة التتبع تضمن حصولك على الوظيفة. منشئنا المدعوم بالذكاء الاصطناعي يساعدك في إنشاء السيرة الذاتية المثالية بقوالب مهنية واقتراحات ذكية وتصدير فوري بصيغة PDF.",
      primaryButton: "ابدأ إنشاء سيرتك الذاتية",
      secondaryButton: "ابدأ مجاناً",
      trustIndicator:
        "انضم إلى آلاف الباحثين عن العمل الذين نجحوا في الحصول على مقابلات",
    },
    features: {
      title: "كل ما تحتاجه",
      subtitle:
        "اصنع سيرة ذاتية مهنية بميزات قوية مصممة لمساعدتك في الحصول على وظيفة أحلامك",
      badges: {
        free: "مجاني 100%",
        atsCompliant: "متوافق مع أنظمة التتبع",
        aiPowered: "مدعوم بالذكاء الاصطناعي",
        instantPdf: "PDF فوري",
      },
      items: [
        {
          title: "قوالب متوافقة مع أنظمة التتبع",
          description:
            "قوالب مهنية مصممة لاجتياز أنظمة تتبع المتقدمين وإعجاب المختصين في التوظيف.",
        },
        {
          title: "اقتراحات مدعومة بالذكاء الاصطناعي",
          description:
            "احصل على توصيات محتوى ذكية ونصائح تحسين لتجعل سيرتك الذاتية مميزة.",
        },
        {
          title: "معاينة فورية",
          description:
            "شاهد بالضبط كيف ستبدو سيرتك الذاتية أثناء إنشائها، مع تحديثات فورية وتنسيق مهني.",
        },
        {
          title: "تصدير PDF بنقرة واحدة",
          description:
            "حمّل سيرتك الذاتية المصقولة كملف PDF عالي الجودة جاهز لطلبات العمل.",
        },
        {
          title: "أقسام قابلة للسحب والإفلات",
          description:
            "أعد ترتيب الأقسام وخصصها بسهولة لإبراز نقاط قوتك وخبرتك.",
        },
        {
          title: "سمات متعددة",
          description:
            "اختر من بين سمات ألوان مختلفة لتتناسب مع أسلوبك الشخصي ومعايير الصناعة.",
        },
      ],
    },
    benefits: {
      title: "لماذا تختار منشئ السيرة الذاتية الخاص بنا؟",
      subtitle:
        "انضم إلى آلاف المهنيين الذين نجحوا في الحصول على وظائف أحلامهم",
      items: [
        {
          title: "مجاني 100%",
          description:
            "لا توجد رسوم خفية، لا توجد ترقيات مدفوعة. اصنع وحمّل سيرتك الذاتية المهنية مجاناً تماماً.",
        },
        {
          title: "محسّن لأنظمة التتبع",
          description:
            "جميع القوالب مصممة لاجتياز أنظمة تتبع المتقدمين المستخدمة من قبل 99% من الشركات.",
        },
        {
          title: "جودة مهنية",
          description:
            "تنسيق وتصميم بمعايير الصناعة يُعجب مديري التوظيف والمختصين.",
        },
        {
          title: "سريع وسهل",
          description:
            "اصنع سيرتك الذاتية الكاملة في أقل من 10 دقائق بواجهتنا البديهية للسحب والإفلات.",
        },
      ],
    },
    cta: {
      title: "مستعد للحصول على وظيفة أحلامك؟",
      description:
        "انضم إلى آلاف المهنيين الذين بنوا حياتهم المهنية بنجاح باستخدام منشئ السيرة الذاتية الخاص بنا.",
      button: "أنشئ سيرتك الذاتية الآن",
      disclaimer: "لا حاجة للتسجيل • مجاني إلى الأبد • نتائج مهنية",
    },
    footer: {
      description:
        "اصنع سيرة ذاتية مهنية ومتوافقة مع أنظمة التتبع تحقق النتائج. ابدأ رحلتك المهنية اليوم.",
      copyright:
        "© 2024 CVIFI. مصنوع بـ ❤️ للباحثين عن العمل في جميع أنحاء العالم.",
    },
  },
};
