# CHAPTER 10 – SYSTEM FEATURES

________________________________________

## 10.1 Introduction

This chapter describes the system features of GlobalPDF, a web-based multilingual PDF translation system. It presents the system architecture, the core functional modules that implement the translation pipeline, advanced features that support reliability and usability, performance and scalability specifications, the interdependencies between modules, and the development priority and implementation phases. The description is aligned with the requirements set out in Chapter 6, the system design in Chapter 8, and the operating environment in Chapter 4. The purpose of this chapter is to provide a technical specification of what the system does and how its components interact, in a form suitable for implementation, testing, and maintenance.

---

## 10.2 Overview of System Architecture

GlobalPDF follows a three-tier architecture: a client-side web application, a server-side application programming interface (API), and an external machine translation service. The client tier is implemented as a single-page or multi-page web application built with Next.js and React. It provides the user interface for file upload, language selection, progress indication, and download of the translated document. The server tier is implemented with Node.js and Express and exposes a REST API. It receives the uploaded PDF and the chosen source and target languages, orchestrates the extraction, translation, and PDF generation steps, and returns the generated PDF as a binary response. The external tier consists of the Google Translate API (or an equivalent machine translation service), which is invoked by the server to translate the extracted text. Optionally, a database (e.g., MongoDB or PostgreSQL) may be introduced in a later phase for user accounts, session history, or audit logs; the current system is stateless and does not persist user data beyond the duration of a single request.

The backend is organised into a thin controller layer and a set of services: the extraction service, the translation service, and the PDF builder service. The controller validates the request, delegates to the services in sequence, and sends the response. This separation supports testability, maintainability, and the possibility of replacing or extending individual services without altering the overall flow. Table 10.1 summarises the main architectural components and their responsibilities.

Table 10.1 System architecture components

| Component | Layer | Responsibility |
|-----------|--------|-----------------|
| Next.js frontend | Client | Upload UI, language selection, progress display, download trigger, error display |
| Express API | Server | Request validation, orchestration of extraction, translation, PDF build; response delivery |
| Extraction service | Server | PDF parsing and text extraction using unpdf (or equivalent) |
| Translation service | Server | Chunking, API calls to Google Translate, assembly of translated text |
| PDF builder service | Server | Generation of a new PDF from translated text with Unicode fonts and layout |
| Google Translate API | External | Machine translation of text segments |

---

## 10.3 Core Functional Modules

The system is decomposed into eight core functional modules. Each module is described in terms of its purpose, functional specifications, and technical specifications.

### 10.3.1 File Upload and Validation Module

Purpose. The File Upload and Validation Module is responsible for accepting a PDF file from the user, verifying that it conforms to the system’s constraints (file type and size), and making the file content available to the downstream extraction step. It ensures that invalid or oversized uploads are rejected with clear feedback and that valid uploads are processed without exposing the system to unnecessary risk.

Functional specifications. The module accepts file input via multipart form data, with a designated field name (e.g., pdfFile) as defined in the API contract. It permits only files with MIME type application/pdf or with the .pdf extension. It enforces a configurable maximum file size (e.g., 10 MB); the limit is documented and may be adjusted via configuration. When validation fails, the module returns a structured error response (e.g., HTTP 400) with a message that indicates whether the failure was due to missing file, invalid type, or size exceeded. When validation succeeds, the file content is passed as a buffer to the extraction service. The module does not persist the file to disk unless required by the extraction library; in-memory storage is used where possible to reduce exposure and simplify cleanup.

Technical specifications. The backend uses the multer middleware for Express to handle multipart/form-data. Multer is configured with memory storage so that the uploaded file is held in a Buffer in memory. The validation logic runs after multer and before the controller invokes the extraction service. The maximum file size is read from configuration or environment variable where applicable. The frontend provides a drag-and-drop zone and a file picker, both constrained to accept PDF only via the accept attribute and client-side checks; server-side validation remains authoritative.

### 10.3.2 Language Selection and Configuration Module

Purpose. The Language Selection and Configuration Module provides the user with the ability to specify the source language and the target language for translation, and it supplies these values to the backend in a standardised form. It also supports system-level configuration of supported languages and default options where applicable.

Functional specifications. The module presents two selection controls: one for source language and one for target language. The list of languages includes at least twenty options covering major world languages (e.g., English, Hindi, Bengali, Tamil, Telugu, Arabic, Japanese, Korean, Chinese, French, German, Spanish, and others), using standard codes (e.g., ISO 639-1) for API compatibility. Both selections are required before the user can initiate translation; the frontend disables or hides the translate action until both are set. The selected values are sent to the backend as part of the same request that carries the file (e.g., form fields sourceLang and targetLang). The backend validates that both parameters are present and non-empty and rejects the request otherwise. The module does not persist user language preferences in the current version; each request is independent.

Technical specifications. The frontend implements the language controls as dropdown or combobox components, with options loaded from a static list or a small configuration object. The list is structured for accessibility (e.g., labels, keyboard navigation) and for responsive layout (readable on viewport widths from 320 px to 1920 px). The backend reads sourceLang and targetLang from the request body, trims and validates them, and passes them to the translation service and, where needed, to the PDF builder service for font selection. Language codes are passed through to the translation API as specified in the API documentation (e.g., source and target parameters).

### 10.3.3 Text Extraction Module

Purpose. The Text Extraction Module parses the uploaded PDF and extracts its textual content in a form suitable for translation. It handles multi-page documents and aims to preserve paragraph or segment boundaries so that the translated output remains readable and structurally coherent.

Functional specifications. The module accepts a PDF buffer as input and returns a structured result containing the full extracted text as a single string, an array of page-wise text (where applicable), and the total page count. The extraction library (e.g., unpdf) is invoked with the buffer; the module suppresses or handles any non-critical warnings that do not affect the result. The output text uses newline characters to separate paragraphs or lines where the library provides such structure. Empty or near-empty PDFs result in an empty or minimal text string; the downstream translation and PDF generation modules handle this case without failure. The module does not perform OCR; it extracts only embedded text. Scanned PDFs without embedded text are outside the scope of the current extraction module.

Technical specifications. The module is implemented as a separate service (e.g., extraction.service.ts) in the backend. It uses the unpdf library (getDocumentProxy, extractText) with the PDF buffer converted to Uint8Array as required by the library. The return type is an interface such as { text: string; pages: string[]; totalPages: number }. The service is stateless and does not retain the buffer after extraction. Performance considerations include the time taken for large or complex PDFs; the module is synchronous or asynchronous as per the library API, and the controller awaits the result before proceeding to translation.

### 10.3.4 Translation Module

Purpose. The Translation Module sends the extracted text to an external machine translation API and returns the translated text. It implements chunking to respect API character limits, preserves paragraph structure where possible, and handles errors and rate limits in a predictable manner.

Functional specifications. The module accepts the extracted text string, the source language code, and the target language code. It splits the text into chunks that do not exceed the API’s maximum character limit (e.g., 4000 characters per request). Chunking is performed at paragraph boundaries where possible; long paragraphs may be split at word boundaries to avoid mid-word breaks. The module sends each chunk to the translation API in sequence, collects the translated segments, and concatenates them with appropriate separators (e.g., double newline between paragraphs). If the API returns an error (e.g., quota exceeded, invalid language, network failure), the module throws or returns an error that the controller can map to an HTTP response and user message. The module does not cache translations; each request is independent. Optional source language detection may be supported by passing an empty or auto value to the API where supported.

Technical specifications. The module is implemented as a translation service (e.g., translation.service.ts). It uses the Google Translate API v2 (or equivalent) over HTTPS, with the API key supplied via environment variable (e.g., GOOGLE_TRANSLATE_API_KEY). The request body is formatted as required by the API (e.g., application/x-www-form-urlencoded with parameters q, target, source, format, key). Responses are parsed to extract the translated text; error responses are checked for status and message. Chunking logic is implemented in a dedicated function (e.g., chunkByParagraphs) with a configurable maximum chunk size. The service exports a function such as translate(text, sourceLang, targetLang) returning a Promise of { translatedText: string }.

### 10.3.5 PDF Generation and Output Module

Purpose. The PDF Generation and Output Module produces a new PDF document from the translated text and returns it as a downloadable file. It does not preserve the original PDF’s layout; it generates a new, readable layout with consistent margins, line wrapping, and page breaks, and it supports multiple scripts via appropriate font selection.

Functional specifications. The module accepts the translated text and optional parameters (e.g., target language for font selection). It creates a new PDF document with a standard page size (e.g., A4) and margins. The text is rendered with a font that supports the required script (e.g., Noto Sans for Latin, Noto Sans Devanagari for Hindi, Noto Sans Arabic for Arabic). Font selection is based on the target language code or on script detection in the text when the language is not specified. The module applies line wrapping within the content width, a consistent line gap and paragraph gap, and automatic page breaks when content overflows. The output is generated as a buffer in memory. The module returns the buffer to the controller, which sets the response headers (Content-Type: application/pdf, Content-Disposition: attachment; filename="translated.pdf") and sends the buffer. Empty input results in a minimal PDF (e.g., a single page with a placeholder message) or an error, as defined by the project’s requirements.

Technical specifications. The module is implemented as a PDF builder service (e.g., pdfBuilder.service.ts) using the PDFKit library. A font map (language code or script to font filename) is maintained; font files (e.g., Noto family) are stored in a designated directory (e.g., fonts/) and loaded by path. Script detection may use Unicode range checks (e.g., Devanagari, Arabic, CJK) when the target language is not provided. The document is built in a single pass; the buffer is collected via the library’s data events and concatenated. The service exports a function such as buildPdf(translatedText, options?: { targetLang?: string }) returning a Promise of Buffer.

### 10.3.6 Reporting, Logging, and Progress Feedback Module

Purpose. The Reporting, Logging, and Progress Feedback Module provides the user with visible feedback during the translation pipeline (progress indicator) and supports operational monitoring through server-side logging. It does not implement persistent analytics or reporting in the current scope; it focuses on real-time feedback and error logging.

Functional specifications. On the client, the module displays a pipeline-style progress indicator with distinct stages: idle, extracting text, translating text, generating PDF, and done. The current stage is updated as the request progresses; the frontend may infer stages from the response timing or, in a future enhancement, from a streaming or status API. The indicator is visible only when a translation is in progress and is hidden or reset when the flow completes or fails. On the server, the module supports logging of errors (e.g., extraction failure, API failure, PDF build failure) and optionally of request metadata (e.g., timestamp, file size) for debugging. Logs are written to the standard output or to a configured destination; they are not persisted to a database in the current version. Future enhancements may include download history or usage analytics; such features are out of scope for the current module specification.

Technical specifications. The frontend implements the progress indicator as a reusable component (e.g., ProgressPipeline) that receives the current step as a prop. The step is set by the parent (e.g., PdfTranslateSection) based on local state and on the completion of the fetch request. The component uses Tailwind CSS for styling and optional animation (e.g., pulse for the active step). The backend uses console.error or a logging utility for errors; the controller catches exceptions and logs them before returning a JSON error response. No dedicated logging framework is required for the minimum implementation; the use of a structured logger (e.g., Winston) may be specified in the project’s development standards.

### 10.3.7 Administration and Security Module

Purpose. The Administration and Security Module addresses the secure configuration of the system, the protection of sensitive data (e.g., API keys), and the enforcement of security-related constraints. It does not implement user authentication or role-based access in the current scope; it focuses on deployment-time configuration and secure handling of requests and files.

Functional specifications. API keys and other secrets are stored in environment variables and are never exposed to the client or included in the repository. The backend reads the translation API key from the environment and fails fast (e.g., at startup or on first use) with a clear message if the key is missing. Uploaded files are processed in memory or in short-lived temporary storage and are not retained after the response is sent. Temporary files, if any, are deleted in a finally block or equivalent. Input validation is applied to file type, file size, and language parameters; invalid input is rejected with HTTP 400 and a clear message. In production, all client–server communication uses HTTPS. CORS is configured to allow only the frontend origin(s) designated in the deployment configuration. Future enhancements may include authentication (e.g., JWT), rate limiting per user or IP, and audit logging; these are not part of the current module specification.

Technical specifications. Environment variables are loaded using dotenv or the deployment platform’s mechanism. The backend does not log or echo API keys. Multer is configured with a size limit consistent with the validation rule. CORS middleware is applied with an allowlist of origins. The frontend uses HTTPS when deployed; the API base URL (NEXT_PUBLIC_API_URL) is set to the backend’s HTTPS endpoint in production. No session or cookie-based authentication is implemented; the current system is anonymous and stateless.

### 10.3.8 External API and Integration Module

Purpose. The External API and Integration Module encapsulates the integration with the Google Translate API (or equivalent) and defines the contract for how the backend communicates with external services. It isolates the rest of the system from API-specific details and allows for replacement or extension of the translation provider with minimal change to other modules.

Functional specifications. The module is responsible for constructing the HTTP request to the translation API (URL, method, headers, body), sending the request, parsing the response, and mapping errors to a form that the translation service and controller can handle. The API endpoint, authentication method (e.g., key in query or header), and request/response format follow the provider’s documentation. The module does not implement retry logic or circuit breakers in the minimum specification; these may be added as part of reliability improvements. The module is invoked only by the translation service; the extraction and PDF builder services do not call external APIs. If the project introduces additional external services (e.g., OCR, alternative translation provider), they may be abstracted behind similar integration modules.

Technical specifications. The integration is implemented within the translation service or in a dedicated client module. The Google Translate API v2 endpoint (e.g., https://translation.googleapis.com/language/translate/v2) is called with fetch or a compatible HTTP client. The request body is URL-encoded; the response is JSON. The module reads the API key from process.env and does not expose it. Timeouts and error handling (e.g., network errors, 4xx/5xx responses) are implemented so that the translation service can throw or return an error with a meaningful message for the user.

---

## 10.4 Advanced System Features

Beyond the core pipeline, the system incorporates features that improve reliability, usability, and maintainability.

Multi-script and Unicode support. The PDF builder selects fonts based on the target language or on script detection in the translated text. A mapping of language codes (and optionally script ranges) to font files (e.g., Noto Sans, Noto Sans Devanagari, Noto Sans Arabic) ensures that Latin, Devanagari, Arabic, CJK, and other scripts render correctly in the generated PDF. When a suitable font is not found, the system may fall back to a default font and log a warning so that operators can add the required font files.

Chunking and large-document handling. The translation module splits long texts into chunks that comply with the translation API’s limits. Splitting at paragraph boundaries preserves readability and avoids unnecessary fragmentation. The approach allows documents of moderate length (e.g., tens of pages) to be translated in a single user request without manual intervention.

Responsive and accessible user interface. The frontend is built to work across viewport widths from 320 px (mobile) to 1920 px (desktop). The upload area, language controls, progress indicator, and action button are accessible and readable at all target sizes. Basic accessibility considerations (e.g., semantic structure, focus order, contrast) are applied so that the core workflow can be used with keyboard and screen readers where feasible.

Error handling and user messaging. Validation and server errors are mapped to non-technical messages (e.g., "Please select both source and target language") so that the user can correct the input or understand that the service is temporarily unavailable. The frontend disables the translate action during processing to prevent duplicate submissions and displays the progress indicator so that the user understands that the system is working.

---

## 10.5 Performance and Scalability Specifications

The system is designed to meet the performance and scalability targets defined in the non-functional requirements (Chapter 6).

Response time. End-to-end translation (upload to download) for a document of up to 10 MB and moderate text length is expected to complete within 60 seconds under normal load. Individual API responses (e.g., health check) are expected to respond within 2 seconds. These targets depend on the performance of the extraction library, the translation API, and the PDF builder, as well as on network latency and server resources.

Concurrency. The system is designed to support at least 10 concurrent translation requests without degradation. The backend is stateless; horizontal scaling can be achieved by running multiple instances behind a load balancer. The effective limit may be determined by the translation API’s quota and rate limits rather than by the application itself.

Resource usage. File processing uses in-memory buffers; large files increase memory consumption on the server. The configurable file size limit (e.g., 10 MB) helps to bound resource use. Temporary files, if used, are short-lived and cleaned up after the request.

Table 10.2 summarises the performance and scalability specifications.

Table 10.2 Performance and scalability specifications

| Specification | Target | Notes |
|----------------|--------|--------|
| End-to-end translation time | Within 60 seconds | For documents up to 10 MB, moderate length; under normal load |
| API response time (e.g., health) | Within 2 seconds | For simple endpoints |
| Concurrent requests | At least 10 | Without degradation; scaling subject to translation API quota |
| File size limit | Configurable (e.g., 10 MB) | Enforced at upload validation |
| Uptime | 98% (operational hours) | Subject to hosting provider SLA |

---

## 10.6 Module Interdependencies

The modules depend on one another in a defined sequence for the core translation flow. Table 10.3 describes the dependencies and data flow.

Table 10.3 Module interdependencies

| Module | Depends On | Provides To |
|--------|------------|--------------|
| File Upload and Validation | (user input) | Text Extraction |
| Language Selection and Configuration | (user input) | Translation, PDF Generation |
| Text Extraction | File Upload and Validation | Translation |
| Translation | Text Extraction, Language Selection, External API and Integration | PDF Generation and Output |
| PDF Generation and Output | Translation, Language Selection | (response to user) |
| Reporting, Logging, and Progress Feedback | All modules (for logging); frontend state (for progress) | Operator; user |
| Administration and Security | (configuration) | All modules (constraints, secrets) |
| External API and Integration | Administration and Security (API key) | Translation |

The controller orchestrates the flow: it calls the extraction service with the validated file buffer, then the translation service with the extracted text and language codes, then the PDF builder with the translated text and target language, and finally sends the PDF buffer in the response. The Reporting, Logging, and Progress Feedback Module is used throughout for logging and for user-visible progress; Administration and Security applies to all requests via validation and configuration.

---

## 10.7 Development Priority and Implementation Phases

The modules were implemented in an order that allowed early validation of the pipeline and incremental delivery of value.

Phase 1 (backend pipeline). The extraction service, translation service, and PDF builder service were implemented first, along with the controller and the file upload and validation logic. This established the core pipeline and allowed API-level testing (e.g., via Postman) without a full frontend.

Phase 2 (frontend integration). The frontend was implemented with the upload UI, language selection, API integration, progress indicator, and download handling. This delivered an end-to-end flow that users could exercise in a browser.

Phase 3 (refinement and hardening). Error handling, validation messages, responsive layout, and accessibility improvements were completed. Logging, configuration documentation, and deployment instructions were finalised. Optional enhancements (e.g., replace file, keyboard accessibility) were addressed as time permitted.

Table 10.4 maps the modules to the implementation phases.

Table 10.4 Development priority by phase

| Phase | Modules / Focus |
|--------|-------------------|
| Phase 1 | File Upload and Validation (backend), Text Extraction, Translation, PDF Generation and Output, Administration and Security (validation, API key), External API and Integration |
| Phase 2 | Language Selection and Configuration (frontend), Reporting and Progress Feedback (frontend), File Upload (frontend UI), API call and download |
| Phase 3 | Reporting and Logging (server), Administration and Security (CORS, HTTPS), responsive and accessibility improvements, documentation |

---

## 10.8 Conclusion

This chapter has presented the system features of GlobalPDF in the form of an overview of the architecture, eight core functional modules, advanced features, performance and scalability specifications, module interdependencies, and development priority and implementation phases. Each core module has been specified in terms of its purpose, functional behaviour, and technical implementation, using the technology stack (Next.js, React, Tailwind CSS, Node.js, Express, unpdf, pdfkit, multer, Google Translate API) described in earlier chapters. The module set supports the complete flow from file upload and language selection through text extraction, translation, and PDF generation to download, with appropriate validation, error handling, and progress feedback. The specifications provided here are intended to serve as a stable reference for implementation, testing, and maintenance and to ensure consistency with the requirements and design documented in the preceding chapters.

________________________________________

This chapter has described the system features of GlobalPDF. The next chapter may address implementation details, test results, or deployment and future work.
