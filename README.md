# CV Builder - Professional ATS-Compliant Resume Builder

<div align="center">
  <h3>🚀 Create professional, ATS-optimized resumes with AI-powered suggestions</h3>
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#documentation">Documentation</a> •
    <a href="#api-reference">API</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

## 📋 Overview

CV Builder is a modern, free web application that helps you create professional, ATS-compliant resumes with AI-powered suggestions. Built with Next.js 14, TypeScript, and integrated with Groq AI for intelligent resume optimization.

## 🎯 Demo https://cvifi.netlify.app/

### ✨ Key Highlights

- **100% Free Forever** - No hidden costs or premium tiers
- **ATS-Compliant** - Optimized for Applicant Tracking Systems
- **AI-Powered** - Get intelligent suggestions and scoring
- **Bilingual Support** - English and Arabic with RTL text direction
- **Real-time Preview** - See changes instantly as you type
- **PDF Export** - Download professional PDFs
- **Auto-save** - Never lose your progress

## 🎯 Features

### Core Features

- ✅ **Personal Information Management** - Contact details and professional summary
- ✅ **Work Experience** - Dynamic job entries with rich descriptions
- ✅ **Education History** - Academic qualifications and achievements
- ✅ **Skills & Certifications** - Technical skills, soft skills, languages
- ✅ **Custom Sections** - Projects, awards, volunteer work, publications
- ✅ **Drag & Drop Reordering** - Customize section order
- ✅ **10 Color Themes** - Professional color schemes
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### AI-Powered Features

- 🤖 **ATS Score Analysis** - Get a 0-100 compatibility score
- 🤖 **Keyword Optimization** - AI suggests relevant keywords
- 🤖 **Content Improvement** - Get suggestions for better descriptions
- 🤖 **Format Recommendations** - Optimize layout for ATS systems

### Technical Features

- ⚡ **Auto-save** - Automatic data persistence every second
- 📱 **Progressive Web App** - Install as a desktop/mobile app
- 🌐 **Internationalization** - Full English/Arabic support
- 🎨 **Theme Customization** - Multiple professional color schemes
- 📄 **PDF Generation** - High-quality PDF export
- 💾 **Local Storage** - Data persists across browser sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cv-builder.git
   cd cv-builder
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Groq API key:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
pnpm build
pnpm start
```

## 📚 Documentation

### Project Structure

```
cv-builder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── cv-builder.tsx    # Main CV builder
│   ├── *-form.tsx        # Form components
│   └── cv-preview.tsx    # CV preview
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── docs/                 # Documentation
```

### Core Components

#### CVBuilder Component

The main orchestrator component that manages the entire CV building experience.

**Location**: `components/cv-builder.tsx`

**Key Features**:

- State management for CV data
- Tab navigation between sections
- Real-time preview toggle
- AI assistant integration
- Theme and language switching

#### Form Components

Individual form components for each CV section:

- **PersonalInfoForm** - Contact information and summary
- **ExperienceForm** - Work history with rich text descriptions
- **EducationForm** - Academic background
- **SkillsForm** - Technical skills, soft skills, languages, certifications
- **CustomSectionForm** - User-defined sections with multiple types

#### Data Management

**Hook**: `hooks/use-cv-data.ts`

Provides centralized state management with:

- Auto-save functionality
- Data persistence
- Section reordering
- Theme management
- Multi-language support

### AI Integration

The AI assistant uses Groq AI to provide intelligent suggestions:

**Endpoint**: `/api/ai-suggestions`

**Features**:

- ATS compatibility scoring
- Keyword suggestions based on job descriptions
- Content improvement recommendations
- Format optimization advice

**Usage**:

```typescript
const response = await fetch("/api/ai-suggestions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cvData: currentCVData,
    jobDescription: targetJobDescription,
    language: "en", // or 'ar'
  }),
});
```

## 🎨 Customization

### Themes

10 professional color themes available:

- Blue, Green, Purple, Red, Orange
- Pink, Indigo, Teal, Gray, Black

Themes are CSS-based and can be easily extended in `tailwind.config.ts`.

### Languages

Full internationalization support:

- English (LTR)
- Arabic (RTL)

Add new languages by extending translation objects in components.

### Custom Sections

Three types of custom sections:

- **Text**: Simple paragraph content
- **List**: Bulleted list items
- **Timeline**: Date-based entries with descriptions

## 🔧 Development

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **AI**: Groq AI SDK
- **PDF**: jsPDF
- **Drag & Drop**: @hello-pangea/dnd

### Code Quality

- ESLint configuration
- TypeScript strict mode
- Component-based architecture
- Custom hooks for state management
- Responsive design patterns

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build command: `pnpm build`
2. Publish directory: `out` (if using static export)
3. Add environment variables in Netlify dashboard

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Bug Reports

Please use the [GitHub Issues](https://github.com/your-username/cv-builder/issues) page to report bugs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Groq](https://groq.com/) - Fast AI inference
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- 📧 Email: support@cvbuilder.example.com
- 💬 Discord: [Join our community](https://discord.gg/cvbuilder)
- 📖 Documentation: [docs.cvbuilder.example.com](https://docs.cvbuilder.example.com)

---

<div align="center">
  <p>Made with ❤️ for job seekers worldwide</p>
  <p>
    <a href="https://github.com/your-username/cv-builder">⭐ Star on GitHub</a> •
    <a href="https://twitter.com/cvbuilder">🐦 Follow on Twitter</a>
  </p>
</div>
