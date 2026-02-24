# CHAPTER 6 – USER REQUIREMENTS

________________________________________

This chapter specifies the user requirements for the GlobalPDF system. User requirements describe what the system must do from the perspective of its users and stakeholders, and they form the basis for design, implementation, and acceptance testing. The chapter explains the methodology used to define and prioritise requirements, presents functional requirements in a role-based structure, lists non-functional requirements, illustrates requirements with user stories and scenarios, and concludes with assumptions, constraints, traceability to project objectives, and the validation approach.

---

## 6.1 Introduction and Methodology

### 6.1.1 Definition of User Requirements

User requirements are statements of the capabilities, behaviours, and constraints that the system must satisfy to meet the needs of its users and the goals of the project. They are expressed in user-facing or stakeholder-facing language and are independent of implementation details. For GlobalPDF, user requirements cover the translation workflow (upload, language selection, translation, download), the quality and usability of the interface, and the operational qualities of the system (performance, security, reliability).

### 6.1.2 Requirement Elicitation Methods

Requirements were elicited through a combination of the following methods:

- **Literature and market review:** Analysis of existing PDF translation tools, academic and business workflows, and pain points reported in surveys or articles (e.g., manual copy-paste effort, formatting loss, cost of commercial tools) to identify common needs.

- **Stakeholder interviews:** Informal interviews with potential users including students, researchers, and professionals who regularly work with multilingual documents, to understand their current workflows and expectations from an integrated translation service.

- **Observation:** Observation of typical manual translation workflows (copy from PDF, paste into web translator, paste into word processor, reformat) to quantify steps, time, and failure points.

- **Prototype feedback:** Early prototypes of the upload and language-selection interface were used to validate clarity of the workflow and terminology with a small group of users.

These methods ensured that requirements reflect real-world use cases and constraints rather than assumptions alone.

### 6.1.3 SMART Criteria and Prioritisation

Requirements were formulated and reviewed against the SMART criteria where applicable: **S**pecific (unambiguous), **M**easurable (testable), **A**chievable (within project scope), **R**elevant (aligned to project objectives), and **T**ime-bound (deliverable within the project timeline). Acceptance criteria were added to functional requirements to support measurability and testability.

Prioritisation follows the MoSCoW scheme:

- **Must-Have (M):** Essential for the minimum viable product; the system is not acceptable without these.
- **Should-Have (S):** Important for usability and completeness but the system can be delivered without them in a first release.
- **Could-Have (C):** Desirable for future versions or for enhanced user satisfaction but explicitly out of scope for the current deliverable.

### 6.1.4 Traceability to Objectives

Each functional requirement is traceable to at least one project objective (Chapter 5). A traceability matrix at the end of this chapter maps requirement identifiers to objective identifiers so that coverage can be verified and gaps identified.

### 6.1.5 Primary Users

GlobalPDF serves the following primary user categories:

| User Type | Description | Typical Needs |
|-----------|--------------|---------------|
| **End User (Translator)** | Any person who needs to translate a PDF (student, researcher, professional, business user). | Upload PDF, select source and target languages, receive translated PDF quickly and without switching tools. |
| **System Administrator / Deployer** | Person responsible for deploying and configuring the application (e.g., API keys, environment, hosting). | Reliable deployment, clear configuration documentation, secure handling of secrets. |

The primary focus of the user requirements in this chapter is the **End User (Translator)**, who interacts with the web interface to perform the full translation workflow. Administrative and deployment needs are captured in non-functional requirements and in the documentation and configuration requirements.

---

## 6.2 Functional Requirements (Role-Based)

Functional requirements are organised by the role that primarily benefits from or performs the function. All requirements in Sections 6.2.1 and 6.2.2 apply to the **End User (Translator)** role; Section 6.2.3 applies to the **System Administrator / Deployer** role.

### 6.2.1 Core Translation Workflow (End User)

| ID | Requirement | Priority | Description and Acceptance Criteria |
|----|-------------|----------|-------------------------------------|
| FR-01 | PDF upload and validation | Must-Have | The user shall be able to upload a PDF file via drag-and-drop or file picker. The system shall accept only PDF files and enforce a configurable maximum file size (e.g., 10 MB). **Acceptance:** Invalid file type or oversized file results in a clear error message within 2 seconds; valid upload is accepted and the next step (language selection) is enabled. |
| FR-02 | Source and target language selection | Must-Have | The user shall be able to select source language and target language from a list of at least twenty languages (e.g., English, Hindi, Bengali, Arabic, Japanese, Korean, Mandarin Chinese, Tamil, Telugu, French, German, Spanish, and others). **Acceptance:** Both selections are required before translation can start; the list is visible and searchable or scrollable on small screens. |
| FR-03 | Initiate translation and progress feedback | Must-Have | The user shall be able to start the translation process after uploading a file and selecting languages. The system shall display the current stage of processing (e.g., extracting text, translating, generating PDF) so that the user understands that the process is ongoing. **Acceptance:** A progress indicator (e.g., pipeline or step-based) reflects the current stage; the user cannot submit a second file until the current request completes or fails. |
| FR-04 | Download translated PDF | Must-Have | Upon successful completion, the user shall receive the translated PDF as a downloadable file with a standard filename (e.g., translated.pdf). The file shall open correctly in common PDF viewers and display the translated text with readable layout (margins, line wrapping, page breaks). **Acceptance:** Browser triggers download; the downloaded file is a valid PDF containing the translated content in the selected target language. |
| FR-05 | Error handling and messages | Must-Have | The system shall validate input (file type, size, language selection) and shall handle API or server errors gracefully. The user shall see a clear, non-technical error message when validation fails or when translation cannot be completed. **Acceptance:** No unhandled exceptions visible to the user; each error type has a distinct, actionable message. |

### 6.2.2 Usability and Accessibility (End User)

| ID | Requirement | Priority | Description and Acceptance Criteria |
|----|-------------|----------|-------------------------------------|
| FR-06 | Responsive layout | Should-Have | The interface shall be usable on viewport widths from 320 px (mobile) to 1920 px (desktop) without horizontal scrolling or overlapping critical controls. **Acceptance:** Upload area, language dropdowns, and action button are accessible and readable at 320 px and 1920 px. |
| FR-07 | Replace or change file | Should-Have | The user shall be able to remove the currently selected file and choose another file without reloading the page. **Acceptance:** A control (e.g., "Replace") clears the current file and returns the user to the upload state. |
| FR-08 | Accessibility (basic) | Could-Have | The interface shall follow basic accessibility practices: semantic structure (e.g., headings, landmarks), keyboard-operable controls, and sufficient colour contrast. **Acceptance:** Core workflow can be completed with keyboard only; focus order is logical. |

### 6.2.3 Administration and Configuration (System Administrator / Deployer)

| ID | Requirement | Priority | Description and Acceptance Criteria |
|----|-------------|----------|-------------------------------------|
| FR-09 | Configuration via environment | Must-Have | API keys, server port, and other sensitive or environment-specific settings shall be configurable via environment variables (e.g., .env or deployment panel), not hard-coded. **Acceptance:** Application runs correctly when variables are set in the deployment environment; documentation lists required variables. |
| FR-10 | Deployment documentation | Should-Have | The project shall provide a deployment guide describing how to build and run the frontend and backend, set environment variables, and deploy to at least one recommended platform. **Acceptance:** A deployer can follow the guide to achieve a working deployment without prior knowledge of the codebase. |

---

## 6.3 Non-Functional Requirements

Non-functional requirements define the quality attributes and constraints of the system. They are summarised in the following table.

| Category | ID | Requirement | Specification |
|----------|-----|-------------|----------------|
| **Performance** | NFR-01 | Response time | Typical end-to-end translation (upload to download) for a document of up to 10 MB and moderate length shall complete within 60 seconds under normal load; individual API responses (e.g., health check) shall respond within 2 seconds. |
| **Performance** | NFR-02 | Concurrency | The system shall support at least 10 concurrent translation requests without degradation; design shall allow scaling to higher concurrency subject to translation API quotas. |
| **Usability** | NFR-03 | Responsive design | The user interface shall be responsive across viewport widths from 320 px to 1920 px as specified in FR-06. |
| **Usability** | NFR-04 | Language of interface | The interface labels and messages shall be in English; future versions may support localised UI (e.g., Hindi). |
| **Usability** | NFR-05 | Accessibility | The application shall aim for WCAG 2.1 Level AA where feasible (e.g., contrast, focus indicators, semantic structure); FR-08 captures minimum accessibility expectations. |
| **Reliability** | NFR-06 | Uptime | The deployed system shall target 98% availability during operational hours, excluding planned maintenance and dependent on hosting provider SLA. |
| **Reliability** | NFR-07 | Graceful degradation | If the translation API is unavailable or returns an error, the system shall inform the user and shall not leave the application in an inconsistent state. |
| **Security** | NFR-08 | Secure communication | All client–server communication in production shall use HTTPS. |
| **Security** | NFR-09 | API key protection | Translation API keys shall not be exposed to the client; they shall be stored and used only on the server (e.g., environment variables). |
| **Security** | NFR-10 | File handling | Uploaded files shall be processed in memory or in short-lived temporary storage and shall not be retained after the response is sent unless explicitly designed for a future feature. |
| **Maintainability** | NFR-11 | Code quality | The codebase shall be structured in modular components (e.g., services for extraction, translation, PDF building) with clear interfaces; critical paths shall have error handling and logging. |
| **Maintainability** | NFR-12 | Test coverage | The project shall aim for test coverage of critical workflows (e.g., validation, extraction, translation integration) to support regression testing; specific coverage targets may be set in the project plan. |
| **Portability** | NFR-13 | Browser compatibility | The frontend shall function on current versions of major browsers (Chrome, Firefox, Edge, Safari) that support the required web APIs (e.g., fetch, FormData, Blob). |
| **Portability** | NFR-14 | Deployment portability | The backend shall run on any environment that supports Node.js 18+; deployment via Docker or PaaS (e.g., Render, AWS) shall be supported as documented. |

---

## 6.4 User Stories and Scenarios (Agile Format)

User stories and scenarios illustrate requirements in a format suitable for Agile development and acceptance discussions.

### 6.4.1 Epic: PDF Translation Workflow

**Epic:** As an end user, I want to translate a PDF document into another language and download the result, so that I can read or share the content without manually copying text into separate translation tools.

### 6.4.2 User Stories

| Story ID | User Story | Acceptance Notes |
|----------|-------------|------------------|
| US-01 | As an end user, I want to upload a PDF by dragging it onto the page or by selecting it from my device, so that I can start the translation process quickly. | Upload accepts PDF only; max size enforced; clear error if invalid. |
| US-02 | As an end user, I want to choose the source and target languages from a clear list, so that I get a translation in the correct direction and language. | At least twenty languages; both choices required before "Translate" is enabled. |
| US-03 | As an end user, I want to see which stage of processing is currently running (extraction, translation, PDF generation), so that I know the system is working and can wait for completion. | Pipeline or step indicator updates during the request; button disabled while processing. |
| US-04 | As an end user, I want to download the translated PDF with one click when it is ready, so that I can save it to my device and open it in my preferred viewer. | Download starts automatically or via clear button; filename is sensible (e.g., translated.pdf). |

### 6.4.3 Detailed Scenario Flow: Successful Translation

**Scenario:** Successful translation from English to Hindi.

**Precondition:** User has a PDF file (e.g., 2 MB, 5 pages) in English on their device. The GlobalPDF application is loaded in the browser and the backend is available.

**Flow:**

1. User opens the GlobalPDF application (e.g., home page).
2. User drags the PDF file onto the upload area (or clicks and selects the file). The system validates the file and displays the file name and size; the "Replace" option is visible.
3. User selects "English" as source language and "Hindi" as target language from the dropdowns. The "Translate PDF" button becomes enabled.
4. User clicks "Translate PDF". The button shows a loading state (e.g., "Translating…"); the pipeline indicator shows "Extracting text", then "Translating text", then "Generating PDF", then "Download ready".
5. The browser triggers a download of a file named "translated.pdf". The user opens the file and sees the content in Hindi with readable layout (paragraphs, margins, page breaks).
6. User may upload another file or change language selections for a new translation.

**Postcondition:** The user has a translated PDF on their device. No copy of the file is retained on the server after the response.

**Alternative flow (validation failure):** If the user uploads a non-PDF file or a file larger than 10 MB, the system displays an error message (e.g., "Only PDF files are allowed" or "File is larger than 10 MB") and does not enable the Translate button. The user can correct the input and retry.

---

## 6.5 Assumptions, Constraints, and Traceability

### 6.5.1 Assumptions

- Users have a stable internet connection for the duration of the upload and translation process.
- The translation API (e.g., Google Translate API) is available and the project has valid credentials and quota within the terms of use.
- Uploaded PDFs are primarily text-based; scanned or image-heavy PDFs may not extract correctly unless OCR is added in a future phase.
- Users understand that the output is machine-translated and may contain errors; the system does not guarantee human-quality or certified translation.
- The deployment environment (e.g., PaaS or cloud) provides HTTPS and supports Node.js and the required environment variables.

### 6.5.2 Constraints

- File size limit (e.g., 10 MB) is imposed to balance usability with server memory and API usage; larger documents may be supported in future with chunking or streaming.
- The set of supported languages is determined by the translation API and the availability of Unicode fonts for PDF generation.
- The project timeline and team size limit the scope to a single, anonymous (no-login) workflow; user accounts and history are deferred to tertiary objectives.
- Translation quality and speed depend on the external API; the project does not control the underlying translation engine.

### 6.5.3 Requirement Traceability Matrix

The following table maps functional requirements to the project objectives defined in Chapter 5. Primary objectives are labelled P1–P5; secondary objectives S1–S6.

| Requirement ID | Primary Objective(s) | Secondary Objective(s) |
|----------------|----------------------|-------------------------|
| FR-01 | P5 | S3 |
| FR-02 | P3 | S1 |
| FR-03 | P1 | S2 |
| FR-04 | P1, P4 | S1 |
| FR-05 | P5 | S3 |
| FR-06 | — | S1 |
| FR-07 | — | S1 |
| FR-08 | — | S1 |
| FR-09 | — | S5 |
| FR-10 | — | S6 |

This matrix ensures that each functional requirement supports at least one project objective and that the objectives from Chapter 5 are covered by the requirements specified here.

---

## 6.6 Validation Approach

Requirements are validated through the following activities:

- **Wireframe and prototype validation:** Early wireframes or clickable prototypes of the upload and language-selection flow were reviewed to confirm that the workflow is understandable and that labels and controls match user expectations. Feedback was incorporated before implementation.

- **User acceptance testing (UAT):** A small group of representative users (e.g., students, researchers) performed the end-to-end workflow (upload, select languages, translate, download) on the deployed or staging system. Test cases covered valid uploads, invalid file types, oversized files, and API failure simulation. Issues found were logged and addressed where within scope.

- **Feedback mechanism:** During UAT, users were asked to rate clarity of the workflow, usefulness of error messages, and satisfaction with the result (e.g., download success, readability of the PDF) on a simple scale. The project targets at least 90% of participants reporting satisfaction with the core workflow (upload, translate, download).

- **Traceability review:** The requirement traceability matrix was reviewed to ensure that every primary and secondary objective is addressed by at least one functional or non-functional requirement, and that no high-priority requirement is missing an objective mapping.

These steps ensure that the documented requirements align with user needs and project objectives and that the delivered system can be validated against them.

---

## 6.7 Conclusion

This chapter has defined the user requirements for GlobalPDF in a structured form. The methodology for elicitation, SMART criteria, and MoSCoW prioritisation provide a clear basis for what the system must do (Must-Have), should do (Should-Have), and could do (Could-Have). Functional requirements are specified role-by-role with acceptance criteria; non-functional requirements cover performance, usability, reliability, security, maintainability, and portability. User stories and a detailed scenario illustrate the main translation workflow in Agile terms. Assumptions and constraints bound the scope, and the traceability matrix links requirements to the project objectives of Chapter 5. The validation approach (wireframes, UAT, feedback, traceability review) supports confidence that the system meets the stated user requirements. The next chapter will present the system design and architecture that realise these requirements.

---

*This chapter has specified the user requirements for the GlobalPDF project, including functional and non-functional requirements, user stories, traceability to objectives, and the validation approach. The following chapter will describe the system design and architecture.*
