# CHAPTER 5 – OBJECTIVES OF THE PROJECT

________________________________________

This chapter states the objectives of the GlobalPDF project in a structured manner. Clear objectives guide design and implementation decisions, provide a basis for acceptance criteria and testing, and allow the project to be evaluated against defined goals. The objectives are classified into three levels: primary (core functional goals), secondary (operational and usability goals), and tertiary (strategic and long-term goals). Measurable targets are summarised in a key performance indicator (KPI) table, and the planned approach to achieving these objectives is outlined in an implementation roadmap.

---

## 5.1 Primary Objectives (Core Functional Goals)

Primary objectives define the essential functionality that the system must deliver. They correspond to the main purpose of the project: to automate multilingual PDF translation and deliver a usable translated document to the user.

| Objective ID | Primary Objective | Description |
|--------------|-------------------|-------------|
| P1 | End-to-end PDF translation pipeline | Implement a single, integrated workflow from PDF upload through text extraction, translation, and PDF generation to downloadable output, without requiring the user to switch between multiple tools. |
| P2 | Reliable text extraction | Extract textual content from uploaded PDFs accurately, with support for Unicode and multi-script content, and preserve paragraph and segment structure for coherent translation and layout. |
| P3 | Multi-language translation | Integrate with a machine translation API (e.g., Google Translate API) to support translation between twenty or more languages, including major world languages and languages used in the Indian context (e.g., Hindi, Bengali, Tamil, Telugu). |
| P4 | Readable translated PDF output | Generate a new PDF from the translated text with appropriate typography (including Unicode-compatible fonts), margins, line wrapping, and automatic page breaks, so that the output is suitable for reading and sharing. |
| P5 | Secure and reliable file handling | Accept user-uploaded PDFs within defined size and type limits, process them in a secure manner (e.g., in-memory or short-lived storage), and ensure that temporary data is not retained after the response is sent. |

Achievement of these primary objectives ensures that the system fulfils its core promise: a user can upload a PDF, select source and target languages, and receive a translated, readable PDF through a single web-based interface.

---

## 5.2 Secondary Objectives (Operational and Usability Goals)

Secondary objectives focus on how the system operates and how users interact with it. They support usability, maintainability, and deployment without being strictly necessary for the minimal end-to-end flow.

| Objective ID | Secondary Objective | Description |
|--------------|---------------------|-------------|
| S1 | Responsive and accessible user interface | Provide a web interface that works across common screen sizes and devices, with clear feedback for upload, validation errors, progress, and download, and with attention to accessibility (e.g., semantic structure, keyboard support). |
| S2 | Progress feedback and transparency | Display the current stage of processing (e.g., extraction, translation, PDF generation) so that users understand that the system is working and can anticipate completion time for longer documents. |
| S3 | Robust error handling and validation | Validate file type and size at upload; handle API failures, timeouts, and invalid responses gracefully; and present clear, user-friendly error messages so that users can correct input or retry as appropriate. |
| S4 | Modular and maintainable architecture | Structure the backend as a pipeline of distinct services (extraction, translation, PDF building) with clear interfaces, so that components can be tested, replaced, or extended with minimal impact on the rest of the system. |
| S5 | Deployable and configurable deployment | Support deployment of the frontend and backend on standard cloud or PaaS offerings (e.g., Vercel, Render, AWS), with configuration via environment variables for API keys, ports, and feature flags, and with documentation for deployment steps. |
| S6 | Documentation for users and developers | Provide a user guide for uploading and translating documents, and technical documentation (e.g., architecture overview, API description, deployment guide) to support maintenance and future enhancement. |

These secondary objectives improve the reliability, usability, and long-term sustainability of the system beyond the minimum viable functionality.

---

## 5.3 Tertiary Objectives (Strategic and Long-Term Goals)

Tertiary objectives represent desirable extensions and strategic directions that may be partially addressed during the project or explicitly deferred to a later phase. They inform future roadmap and prioritisation.

| Objective ID | Tertiary Objective | Description |
|--------------|--------------------|-------------|
| T1 | Scalability for concurrent users | Design the backend to be stateless and suitable for horizontal scaling, so that the system can handle increased load (e.g., multiple concurrent uploads) as usage grows, within the constraints of the translation API. |
| T2 | Support for scanned and image-based PDFs | Extend the pipeline to support OCR (optical character recognition) for scanned PDFs or image-heavy documents, so that users can translate content that is not already in text form. |
| T3 | Batch and bulk translation | Allow users to submit multiple PDFs or a batch of documents for translation, with optional queueing and notification, to support organisational or high-volume use cases. |
| T4 | Optional user accounts and history | Introduce optional authentication (e.g., JWT-based) and persistent storage (e.g., database) so that users can create accounts and, in a future phase, view history of translated documents or manage preferences. |
| T5 | Enterprise-oriented features | Consider future enhancements such as stricter data retention policies, audit logging, or compliance-oriented controls, to make the system suitable for enterprise or institutional deployment. |

Tertiary objectives are documented so that the current scope remains bounded while leaving a clear path for evolution of the product.

---

## 5.4 Measurable Targets and Key Performance Indicators

The following table defines measurable targets that can be used to assess whether the primary and secondary objectives have been met. These KPIs are realistic for an academic or small-scale deployment context.

| KPI ID | Indicator | Target | Measurement Method |
|--------|-----------|--------|--------------------|
| K1 | End-to-end pipeline completion | User can upload a PDF, select languages, and download a translated PDF without leaving the application | Functional test: complete flow for at least three language pairs |
| K2 | Supported languages | At least twenty languages available for source and target selection | Count of languages exposed in the UI and supported by the backend/API |
| K3 | Time reduction vs manual workflow | Estimated 60–70% reduction in time compared to manual copy-paste translation for a typical 5–10 page document | Comparative task timing (manual baseline vs system-assisted) |
| K4 | File size limit | Upload and process PDFs up to 10 MB without failure (within API and resource limits) | Test with sample PDFs of varying sizes up to the limit |
| K5 | Error handling | Invalid or oversized uploads and API failures result in clear user-facing messages; no unhandled exceptions in normal use | Test cases for validation and failure scenarios; code review |
| K6 | Responsiveness | Core UI (upload, language selection, download) usable on viewport widths from 320 px to 1920 px | Manual or automated responsive testing |
| K7 | Deployment | Frontend and backend deployable on at least one PaaS or cloud platform with documented steps | Successful deployment and availability of deployment guide |

These KPIs provide a basis for acceptance testing and for demonstrating that the project has achieved its stated objectives.

---

## 5.5 Implementation Roadmap and Timeline

The following table outlines a typical sequence of activities for achieving the objectives within a three- to six-month project timeline. Phases and durations are indicative and can be adjusted to match institutional or team constraints.

| Phase | Activities | Approximate Duration | Key Deliverables |
|-------|------------|----------------------|------------------|
| Requirements and design | Requirement gathering, SRS preparation, architecture and module design, technology selection | 2–3 weeks | SRS document, architecture diagrams, module specifications |
| Core development (primary objectives) | Backend: extraction, translation, PDF builder services; API design and implementation; Frontend: upload, language selection, API integration, download | 6–8 weeks | Working end-to-end pipeline; basic UI |
| Usability and robustness (secondary objectives) | Progress indicators, error handling, validation, responsive layout, documentation (user guide, API docs, deployment guide) | 2–3 weeks | Enhanced UI, error handling, documentation set |
| Testing and refinement | Functional testing, integration testing, error-case testing, performance checks, bug fixes | 2–3 weeks | Test report, stable build |
| Deployment and handover | Deployment to chosen platform(s), environment configuration, final verification, project report and presentation | 1–2 weeks | Deployed application, project report, presentation |

Tertiary objectives (e.g., OCR, batch processing, user accounts) may be partially explored in the design or documentation as future work; full implementation is outside the typical scope of a single academic project cycle unless explicitly included in the project plan.

---

## 5.6 Summary and Conclusion

The objectives of the GlobalPDF project are structured in three tiers: primary objectives define the core translation pipeline and output quality; secondary objectives address usability, robustness, architecture, and documentation; tertiary objectives capture strategic and long-term improvements for scalability, OCR, batch processing, and enterprise readiness. Measurable KPIs and a phased implementation roadmap provide a clear basis for planning, execution, and evaluation. Defining objectives in this way ensures that the project remains focused on delivering a functional, deployable, and maintainable system while leaving room for future enhancement. The next chapters will detail the system design, implementation, and testing carried out to meet these objectives.

---

*This chapter has set out the primary, secondary, and tertiary objectives of the GlobalPDF project, along with measurable targets and an implementation roadmap. The following chapter will present the system design and architecture.*
