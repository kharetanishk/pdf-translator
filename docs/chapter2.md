# CHAPTER 2 – SCOPE OF WORK

________________________________________

## 2.1 Project Overview and Objectives

The GlobalPDF project is defined as a web-based Software-as-a-Service (SaaS) platform for multilingual PDF translation. Its scope of work spans the full software development lifecycle: requirement gathering and analysis, system and detailed design, implementation and development, testing and quality assurance, and deployment and maintenance. The primary objective is to automate the process of translating PDF documents into more than twenty global languages while preserving readability and basic formatting, thereby improving accessibility to information and user productivity.

The project aims to reduce the manual effort and time typically associated with document translation—targeting a reduction of approximately 60–70% in the time users spend on copy-paste workflows and manual reformatting—by providing a single, integrated pipeline from upload to translated PDF download. The intended users include students, researchers, businesses, government offices, and multilingual professionals who require quick, reliable, and affordable translation of academic papers, reports, and other PDF-based documents.

The development approach follows an Agile methodology with two-week sprints, enabling iterative delivery of features and regular feedback. The planned timeline for the project is three to six months, with a team size of one to four members. Success is measured by the delivery of a functional, deployable system that meets the stated objectives and adheres to the inclusions, technical specifications, and quality processes described in this chapter.

---

## 2.2 Inclusions: Core Deliverables and Modules

The following modules and deliverables are explicitly within the scope of the GlobalPDF project:

**• File Upload and Validation Module**
- Acceptance of PDF files through a web interface (drag-and-drop and file picker).
- Validation of file type (PDF only) and size (e.g., configurable limit such as 10 MB).
- Clear error handling and user feedback for invalid or oversized files.
- Secure, temporary handling of uploaded files in memory or short-lived storage.

**• Text Extraction Module**
- Parsing of uploaded PDFs to extract textual content using a suitable library (e.g., unpdf or equivalent).
- Support for Unicode and multi-script content to accommodate diverse languages.
- Paragraph and segment-level extraction to support structured translation and readability in the output.

**• Translation Module**
- Integration with a machine translation API (e.g., Google Translate API or similar).
- Chunking strategy for large documents to respect API limits and ensure reliable processing.
- Support for multi-language selection (source and target) across twenty or more languages.
- Preservation of paragraph structure in the translated output for coherent reading.

**• PDF Reconstruction Module**
- Generation of a new PDF from the translated text (approach: readable layout without strict preservation of original design).
- Embedding or selection of Unicode-compatible fonts (e.g., Noto family) for correct rendering of non-Latin scripts.
- Application of consistent margins, line wrapping, and automatic page breaks.
- Delivery of the generated PDF as a downloadable file with appropriate headers (e.g., Content-Disposition: attachment).

**• User Interface Module**
- Responsive, accessible frontend built with Next.js, React, Tailwind CSS, and Framer Motion (or equivalent).
- Progress indicators (e.g., pipeline-style loader) showing extraction, translation, and PDF generation stages.
- Language selection via dropdown or similar control for source and target languages.
- Consistent styling, error messages, and loading states for a user-friendly experience.

**• Security Module**
- Temporary or in-memory file storage with no long-term retention of user documents unless explicitly designed.
- Secure handling and deletion of temporary files and buffers after processing.
- Protection of API keys and secrets via environment variables and secure configuration.
- Use of HTTPS for all client–server communication.

**• Reporting and Logs Module**
- Server-side error logging for debugging and operational monitoring.
- Scope for future enhancement such as download history or basic usage analytics; such features are noted as optional within the current scope.

---

## 2.3 Technical Specifications and Architecture

The technical scope of GlobalPDF is defined as follows:

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS for styling, and Framer Motion (or similar) for animations. The frontend is responsible for file upload, language selection, progress display, and triggering the download of the translated PDF.

- **Backend:** Node.js with Express (or alternatively Python with FastAPI/Django), structured in a service-based architecture with distinct modules for extraction, translation, and PDF building. The backend exposes a REST API (e.g., POST endpoint for upload with multipart form data) and returns the generated PDF as a binary response.

- **External APIs:** Integration with Google Translate API (or a similar machine translation service) for text translation. API keys are managed via environment variables.

- **Database:** Optional for the current phase; future enhancements may introduce a database (e.g., MongoDB or PostgreSQL) for user accounts, session management, or download history.

- **Security:** Use of HTTPS in production, secure storage of credentials, and consideration of rate limiting and input validation. Future enhancements may include authentication (e.g., JWT-based login).

- **Deployment:** Containerization with Docker where applicable; frontend deployment on platforms such as Vercel; backend on Render, AWS, or equivalent. The system is designed for stateless processing to support concurrency and horizontal scaling.

---

## 2.4 Development and Quality Processes

The project adheres to structured development and quality assurance processes:

- **Phases:** Requirements analysis and specification; system and detailed design; development (coding and unit integration); testing (functional, integration, and user acceptance); deployment and handover. These phases align with the lifecycle described in the project overview.

- **Version control:** Git is used for source code management, with a clear branching strategy and commit practices suitable for a small team.

- **API testing:** Tools such as Postman (or equivalent) are used to verify backend endpoints, request/response formats, and error handling.

- **Testing approach:** Manual testing of end-to-end workflows (upload → translate → download) and functional testing of individual modules (e.g., validation, extraction, translation, PDF generation). Validation of error handling for invalid input, oversized files, and API failures is included.

- **Quality focus:** Code reviews where team size permits, consistent error handling and logging, and documentation of known limitations and future improvements.

---

## 2.5 Documentation and Training

The following documentation and training deliverables are within scope:

- **Software Requirements Specification (SRS):** A formal document capturing functional and non-functional requirements, user roles, and acceptance criteria for GlobalPDF.

- **System architecture diagrams:** High-level and component-level diagrams illustrating the frontend, backend, external APIs, and data flow (upload → extraction → translation → PDF generation → download).

- **API documentation:** Description of endpoints, request/response formats, and error codes for the backend API, suitable for developers and future maintainers.

- **User guide:** Instructions for end-users on how to upload a PDF, select languages, initiate translation, and download the translated document, including notes on supported languages and file limits.

- **Deployment guide:** Steps for building, configuring, and deploying the frontend and backend (including environment variables, API keys, and platform-specific notes).

---

## 2.6 Exclusions (Out of Scope)

The following are explicitly excluded from the current scope of the GlobalPDF project:

- **Real-time collaborative editing:** Multiple users editing or annotating the same document simultaneously is not in scope.

- **Native mobile applications:** The project delivers a web-based interface only; dedicated iOS or Android apps are out of scope.

- **Advanced AI rewriting or summarization:** Beyond machine translation, features such as style transfer, summarization, or content rewriting are reserved for future enhancement.

- **Enterprise compliance certifications:** Formal certifications (e.g., SOC 2, ISO 27001) are not part of the current deliverable.

- **Offline desktop version:** A standalone desktop or offline application is not included; the system is designed for online, browser-based use.

---

## 2.7 Assumptions, Constraints, and Risks

**Assumptions**
- Users and the deployment environment have stable internet connectivity for uploading files and receiving the translated PDF.
- The chosen translation API (e.g., Google Translate API) remains available and accessible within the terms of use and quotas applicable to the project.
- Users provide PDFs that are primarily text-based; heavily image-based or scanned PDFs may require future OCR support and are not fully addressed in the current scope.
- Browsers used by the target audience support modern web standards (e.g., HTML5, JavaScript) required by the frontend.

**Constraints**
- The project operates within the limits of a typical academic or small-team setting, including possible reliance on free or low-cost tiers of external APIs and hosting services.
- Timeline and team size (e.g., 3–6 months, 1–4 members) impose practical limits on the number of features and the depth of testing and documentation.
- Translation quality is dependent on the underlying API; the project does not guarantee professional or human-level translation accuracy.

**Risks and Mitigation**
- **API cost or quota overrun:** Mitigation through monitoring of usage, setting reasonable file-size and rate limits, and documenting upgrade paths or alternative providers.
- **Translation inaccuracies or inappropriate output:** Mitigation by clear user communication that the system uses automated translation, and by selecting a widely used, well-documented API.
- **Failures on very large or complex PDFs:** Mitigation through defined file-size limits, chunking strategies, and graceful error messages with guidance for the user.
- **Security or privacy incidents:** Mitigation through secure handling of files (temporary storage, no unnecessary retention), protection of API keys, use of HTTPS, and adherence to the security measures outlined in the inclusions.

---

*This chapter has defined the scope of work for the GlobalPDF project, including its objectives, inclusions, technical specifications, development and quality processes, documentation, exclusions, and assumptions, constraints, and risks. Subsequent chapters will detail the literature survey, system design, implementation, and testing.*
