import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import AboutSection from "../components/about/AboutSection";
import InfoBlock from "../components/about/InfoBlock";
import ArchitectureBox from "../components/about/ArchitectureBox";
import PipelineBlock from "../components/about/PipelineBlock";

export const metadata: Metadata = {
  title: "About | Global PDF Services",
  description:
    "Learn about the Global PDF Translation System — architecture, workflow, and design principles.",
};

function getHeroTitle(): string {
  const candidates = [
    path.join(process.cwd(), "docs", "about-content.md"),
    path.join(process.cwd(), "apps", "frontend", "docs", "about-content.md"),
  ];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const firstLine = content.split("\n")[0]?.trim();
        return firstLine || "About — Global PDF Translation System";
      }
    } catch {
      continue;
    }
  }
  return "About — Global PDF Translation System";
}

export default function AboutPage() {
  const heroTitle = getHeroTitle();

  const workflowSteps = [
    "Upload PDF",
    "Text Extraction",
    "Language Translation",
    "PDF Generation",
    "Download Translated Document",
  ];

  const backendPipeline = [
    "Controller",
    "Extraction Service",
    "Translation Service",
    "PDF Builder Service",
  ];

  const folderStructure = [
    "apps/",
    "  backend/",
    "    controllers/",
    "    services/",
    "    routes/",
    "    middleware/",
    "    fonts/",
    "  frontend/",
    "    app/",
    "    components/",
    "packages/",
    "  shared configurations",
  ].join("\n");

  const languages = [
    "English",
    "Arabic",
    "Bengali",
    "Hindi",
    "Marathi",
    "Japanese",
    "Korean",
    "Mandarin Chinese",
    "Tamil",
    "Telugu",
    "French",
    "German",
    "Indonesian",
    "Portuguese",
    "Russian",
    "Spanish",
    "Swahili",
    "Turkish",
  ];

  const uiFeatures = [
    "Drag-and-drop PDF upload",
    "File validation and error handling",
    "Language selection controls",
    "Pipeline progress visualization",
  ];

  const designPrinciples = [
    "Modular service-based architecture",
    "Clear separation of responsibilities",
    "Stateless backend processing",
    "Minimal dependency complexity",
    "Reliable error handling",
    "Language-safe Unicode rendering",
    "Scalable workflow design",
  ];

  const challengesSolved = [
    "Handling large translation requests through chunking",
    "Generating readable PDFs without preserving complex layouts",
    "Supporting multiple international writing systems",
    "Managing file upload and binary download workflows",
    "Creating smooth user experience for long-running processes",
  ];

  const futureEnhancements = [
    "Layout-preserving PDF reconstruction",
    "OCR support for scanned documents",
    "Real-time processing progress from backend",
    "Batch document translation",
    "User history and document management",
    "Advanced typography and script-specific layout improvements",
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070A10]">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <header className="mb-16">
            <h1 className="text-3xl font-semibold tracking-tight text-[#EDEDED] sm:text-4xl">
              {heroTitle}
            </h1>
          </header>

          <AboutSection title="Project Overview">
            <p>
              The Global PDF Translation System is an AI-powered document
              processing application designed to provide seamless multilingual
              PDF translation through a single unified workflow.
            </p>
            <p>
              The system enables users to upload a PDF document, automatically
              extract its textual content, translate the content into a selected
              target language, and generate a new readable translated PDF. The
              entire workflow is automated and optimized for clarity, stability,
              and international language support.
            </p>
            <p>
              The primary objective of this project is to simplify document
              translation while preserving readability and usability, especially
              for academic, professional, and informational documents.
            </p>
          </AboutSection>

          <AboutSection title="Vision and Motivation">
            <p>
              Document translation typically involves multiple disconnected
              steps: manual copying of text, translation through external tools,
              and reconstruction of content into a usable format. This workflow
              is inefficient, error-prone, and time-consuming.
            </p>
            <p>
              This project was created to solve that problem by building a
              structured processing pipeline that transforms document translation
              into a single automated process.
            </p>
            <p className="font-medium text-[#EDEDED]">
              The system focuses on:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Removing manual effort from translation workflows</li>
              <li>Providing clean and readable translated outputs</li>
              <li>Supporting multiple global languages reliably</li>
              <li>
                Demonstrating strong architectural and engineering design
                principles
              </li>
            </ul>
          </AboutSection>

          <AboutSection title="Core Workflow">
            <p>
              The application follows a structured pipeline architecture. Each
              stage is isolated into dedicated modules to maintain clarity,
              scalability, and maintainability.
            </p>
            <PipelineBlock title="Pipeline" steps={workflowSteps} />
          </AboutSection>

          <AboutSection title="System Architecture">
            <p>
              The project is built using a modern client–server architecture.
            </p>

            <div className="mt-6 space-y-6">
              <InfoBlock title="Frontend Layer">
                <ul className="space-y-2">
                  <li>• Built with Next.js and React</li>
                  <li>• Handles file upload, language selection, and user interaction</li>
                  <li>• Provides validation and progress visualization</li>
                  <li>• Automatically downloads the generated translated PDF</li>
                </ul>
              </InfoBlock>

              <InfoBlock title="Backend Layer">
                <ul className="space-y-2">
                  <li>• Built with Express and TypeScript</li>
                  <li>• Responsible for document processing and orchestration</li>
                  <li>• Structured using service-based architecture</li>
                </ul>
              </InfoBlock>

              <PipelineBlock
                title="Backend Processing Pipeline"
                steps={backendPipeline}
              />
            </div>
          </AboutSection>

          <AboutSection title="Processing Pipeline Design">
            <p>
              The backend follows a modular pipeline design where each service
              has a single responsibility.
            </p>

            <ArchitectureBox
              title="Extraction Service"
              items={[
                "Accepts uploaded PDF files",
                "Extracts text content from document pages",
                "Returns structured text ready for processing",
              ]}
            />
            <ArchitectureBox
              title="Translation Service"
              items={[
                "Integrates with Google Translate API",
                "Uses chunking strategy to safely process large documents",
                "Preserves paragraph structure for readability",
              ]}
            />
            <ArchitectureBox
              title="PDF Builder Service"
              items={[
                "Generates a new PDF (Approach A)",
                "Applies proper margins and line wrapping",
                "Supports automatic page breaks",
                "Ensures consistent layout and readability",
              ]}
            />
          </AboutSection>

          <AboutSection title="Multi-Language Support">
            <p>
              A major focus of the project is reliable multilingual rendering.
              The system supports a wide range of languages including:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-[#D6D6D6]/90"
                >
                  {lang}
                </span>
              ))}
            </div>
            <p className="pt-4">
              To ensure accurate rendering across scripts, the system uses a
              dynamic font mapping strategy based on Unicode-compatible Noto
              fonts. Fonts are selected automatically depending on the target
              language, enabling proper display of complex writing systems.
            </p>
          </AboutSection>

          <AboutSection title="Frontend User Experience">
            <p>
              The interface emphasizes clarity and transparency of processing.
            </p>
            <InfoBlock title="Key UI Features">
              <ul className="space-y-2">
                {uiFeatures.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </InfoBlock>
            <p>
              A chained progress loader visually represents system stages such as
              extraction, translation, and PDF generation, improving user
              understanding of backend processing.
            </p>
          </AboutSection>

          <AboutSection title="Technical Design Principles">
            <p>
              The system was designed with the following engineering goals.
              These principles make the system easier to maintain and extend in
              future iterations.
            </p>
            <ArchitectureBox items={designPrinciples} />
          </AboutSection>

          <AboutSection title="Folder Structure Overview">
            <p>High-level project structure:</p>
            <InfoBlock>
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {folderStructure}
              </pre>
            </InfoBlock>
            <p>
              This monorepo structure separates frontend and backend
              responsibilities while maintaining unified development workflows.
            </p>
          </AboutSection>

          <AboutSection title="Key Engineering Challenges Solved">
            <p>
              During development, several real-world challenges were addressed:
            </p>
            <ArchitectureBox items={challengesSolved} />
          </AboutSection>

          <AboutSection title="Final Outcome">
            <p>
              The Global PDF Translation System demonstrates a complete
              end-to-end document processing pipeline that combines modern
              frontend development, backend service architecture, AI-based
              translation, and multilingual PDF generation.
            </p>
            <p>
              The final result is a reliable and scalable system capable of
              transforming documents across languages while maintaining
              readability and usability.
            </p>
          </AboutSection>

          <AboutSection title="Future Enhancements">
            <p>
              Potential improvements for future versions include:
            </p>
            <ArchitectureBox items={futureEnhancements} />
          </AboutSection>
        </article>
      </main>
    </>
  );
}
