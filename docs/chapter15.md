# CHAPTER 15 – STRUCTURE CHARTS

________________________________________

## 15.1 Introduction

A structure chart is a diagrammatic representation of the hierarchical decomposition of a system into modules or components. It shows how the overall system is broken down into major subsystems, and how each subsystem is further decomposed into sub-modules or functions. Unlike a flowchart, which emphasises the sequence and branching of operations, a structure chart emphasises the static organisation of the system: what modules exist, what they call, and how they are nested. Structure charts are used in structured design and modular programming to document the architecture of a software system and to support top-down development and maintenance.

For Global PDF Services (GlobalPDF), a web-based application that allows users to upload PDF files, select a target language, translate content using an external translation API, and download the translated PDF, the structure chart represents the logical grouping of functionality into modules such as user authentication, dashboard, PDF upload and processing, translation, file management, admin panel, and reports and logs. Each module may be decomposed into smaller units (sub-modules or functions) with defined inputs, outputs, and purposes. This chapter presents the top-level structure of GlobalPDF, followed by a detailed breakdown of each major module, so that the hierarchical organisation of the system is clear and suitable for a final-year engineering project report.

________________________________________

## 15.2 Top-Level Module Structure

The top-level structure chart shows the root module (Global PDF Services) and its immediate children. Each child is a major subsystem that can be expanded in the next section. The tree diagram below represents the hierarchical decomposition at the highest level.

```
Global PDF Services (Main)
├── User Authentication
├── Dashboard
├── PDF Upload & Processing
├── Translation Module
├── File Management
├── Admin Panel
└── Reports & Logs
```

User Authentication handles login, registration, and session or token validation (e.g., JWT). Dashboard is the main user interface after access, from which the user can initiate translation or access file management. PDF Upload & Processing covers file validation, temporary or persistent storage, and metadata handling for the uploaded PDF. Translation Module encompasses text extraction, language selection, and the call to the external translation API. PDF Reconstruction (or generation) is the module that builds the translated PDF from the translated text; it may be shown as part of the Translation Module or as a sibling depending on the level of detail. File Management covers download of the translated PDF, deletion of stored files (if applicable), and viewing translation history. Admin Panel provides administrative functions such as user management, system configuration, and monitoring. Reports & Logs covers usage reports, translation statistics, and audit or error logs.

Table 15.1 summarises the top-level modules and their primary responsibility.

Table 15.1 Top-level modules and responsibilities

| Module | Primary responsibility |
|--------|-------------------------|
| User Authentication | Login, registration, JWT or session validation |
| Dashboard | Main user interface; entry point for translation and file management |
| PDF Upload & Processing | File validation, storage, metadata |
| Translation Module | Text extraction, language selection, API call for translation |
| File Management | Download translated PDF, delete files, view history |
| Admin Panel | User management, analytics, system configuration |
| Reports & Logs | Usage reports, translation statistics, logs |

________________________________________

## 15.3 Detailed Module Breakdown

This section describes each major module in terms of its sub-modules or functions, inputs, outputs or actions, and purpose. The decomposition aligns with the system features described in Chapter 10 and supports implementation and testing.

### 15.3.1 User Authentication Module

Purpose. The User Authentication module controls access to the application. It verifies the identity of users (login), allows new users to register, and validates tokens or sessions on protected requests. When authentication is not implemented, the module may be omitted or represented as a stub; when it is implemented, it typically uses JWT (JSON Web Tokens) or server-side sessions.

Sub-modules and functions.

Login. Accepts user credentials (email and password), validates them against stored data, and returns a session token (e.g., JWT) or sets a session cookie. Inputs: email, password. Outputs: token or session identifier; error message if invalid.

Register. Accepts user name, email, and password; validates format and uniqueness; hashes the password; stores the user record; and returns success or error. Inputs: user_name, user_email, user_password. Outputs: success confirmation or validation error.

JWT validation. On each protected request, reads the token from the header or cookie, verifies signature and expiry, and returns the user identity or an unauthorised error. Inputs: JWT token. Outputs: user_id or claim payload; or 401 Unauthorized.

Table 15.2 User Authentication module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Login | email, password | JWT or session ID; or error message |
| Register | user_name, user_email, user_password | Success or validation error; user record stored |
| JWT validation | JWT token (header/cookie) | user_id or claims; or 401 |

### 15.3.2 Dashboard Module

Purpose. The Dashboard module is the main user-facing screen after access. It presents the upload area, language selection controls, the translate action, and navigation to file management or other sections. It does not perform business logic itself; it orchestrates the display and delegates actions to PDF Upload, Translation, and File Management.

Sub-modules and functions.

Render main layout. Displays the upload zone, source and target language dropdowns, translate button, and progress indicator placeholders. Inputs: none (or user session). Outputs: rendered UI.

Handle navigation. Responds to user clicks or route changes to show the translation view, file history, or settings. Inputs: user action (click, route). Outputs: updated view.

Display progress. Updates the progress indicator (e.g., extracting, translating, generating) during an active translation request. Inputs: current step from parent or API. Outputs: updated progress UI.

Table 15.3 Dashboard module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Render main layout | (optional) session | Upload UI, language selectors, translate button |
| Handle navigation | user action, route | Switch to translation / file history / settings |
| Display progress | current step | Progress indicator (extracting, translating, generating) |

### 15.3.3 PDF Upload & Processing Module

Purpose. The PDF Upload & Processing module accepts the PDF file from the user, validates it (type and size), and either holds it in memory for immediate processing or stores it temporarily and records metadata. It ensures that only valid PDFs within the configured size limit are passed to the Translation Module.

Sub-modules and functions.

File validation. Checks that a file is present, has MIME type application/pdf or .pdf extension, and does not exceed the maximum file size (e.g., 10 MB). Inputs: file object or buffer, config (max size). Outputs: valid flag; error message if invalid.

Storage (optional). If the system persists uploads, writes the file to temporary or designated storage and returns a reference (path or ID). Inputs: file buffer, request_id or user_id. Outputs: stored_path or file_ref.

Metadata saving. Records original file name, size, upload timestamp, and optionally user_id or request_id in the database (when persistence is implemented). Inputs: file_name, file_size, user_id, request_id. Outputs: record stored; metadata available for logs or history.

Table 15.4 PDF Upload & Processing module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| File validation | file, max_size config | valid / invalid; error message |
| Storage (optional) | file buffer, request_id | stored_path or file_ref |
| Metadata saving | file_name, file_size, user_id, request_id | Record in database; available for logs |

### 15.3.4 Translation Module (Translation Engine)

Purpose. The Translation Module orchestrates text extraction, language selection validation, and the call to the external translation API. It receives the PDF buffer (or reference) and language codes, extracts text, sends it to the API in chunks if needed, and returns the translated text for PDF reconstruction.

Sub-modules and functions.

Text extraction. Invokes the extraction service to parse the PDF and return plain text. Inputs: PDF buffer. Outputs: extracted text (string), optional page count.

Language selection. Validates that source and target language codes are present and belong to the supported list. Inputs: source_lang_code, target_lang_code. Outputs: validated codes or error.

API call. Chunks the extracted text if necessary, sends each chunk to the translation API with source and target language, and assembles the translated segments. Inputs: extracted text, source_lang, target_lang, API key. Outputs: translated text; or API error.

Table 15.5 Translation Module (Translation Engine)

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Text extraction | PDF buffer | extracted text, page count (optional) |
| Language selection | source_lang_code, target_lang_code | validated codes or validation error |
| API call | extracted text, source_lang, target_lang, API key | translated text; or API error |

### 15.3.5 PDF Reconstruction Module

Purpose. The PDF Reconstruction module (also referred to as PDF Generation or PDF Builder in earlier chapters) generates a new PDF document from the translated text. It selects the appropriate font for the target language or script, applies layout (margins, line wrapping, page breaks), and produces a PDF buffer for download.

Sub-modules and functions.

Font selection. Resolves the target language code (or script detection from text) to a font file path (e.g., Noto family). Inputs: target_lang, translated text (for script detection). Outputs: font path or default.

Layout and render. Creates a PDF document with the chosen font, writes the translated text with wrapping and paragraph spacing, and applies automatic page breaks. Inputs: translated text, font path, page size (e.g., A4). Outputs: PDF buffer.

Buffer output. Returns the in-memory PDF buffer to the controller for attachment in the HTTP response. Inputs: PDF buffer from layout. Outputs: buffer passed to response layer.

Table 15.6 PDF Reconstruction module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Font selection | target_lang, translated text | font path (e.g., Noto) |
| Layout and render | translated text, font path, page size | PDF buffer |
| Buffer output | PDF buffer | Buffer to controller for download response |

### 15.3.6 File Management Module

Purpose. The File Management module handles the delivery of the translated PDF to the user (download), the deletion of stored files when applicable, and the display of translation history. In a stateless implementation, only download may be present; when persistence is added, delete and history use the database.

Sub-modules and functions.

Download. Receives the PDF buffer from the controller, sets response headers (Content-Type, Content-Disposition: attachment), and triggers the browser download with a filename (e.g., translated.pdf). Inputs: PDF buffer, optional file name. Outputs: HTTP response with PDF body; user receives file.

Delete (optional). Removes a stored file or translation record when the user requests deletion (e.g., from history). Inputs: file_id or request_id, user_id (for authorisation). Outputs: record removed; confirmation or error.

History (optional). Retrieves the list of past translation requests for the user (e.g., request_id, date, source/target language, status) from the database and presents it in the UI. Inputs: user_id, optional filters. Outputs: list of records; rendered history view.

Table 15.7 File Management module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Download | PDF buffer, file name | HTTP response; user downloads file |
| Delete (optional) | file_id or request_id, user_id | Record removed; confirmation or error |
| History (optional) | user_id, filters | List of past requests; history UI |

### 15.3.7 Admin Panel Module

Purpose. The Admin Panel module provides administrative functions: user management (view, add, edit, delete users), system configuration, viewing analytics or usage data, and accessing logs. Access is restricted to users with an admin role.

Sub-modules and functions.

User management. List users, create new user, edit user details, deactivate or delete user. Inputs: user list from DB; form data for create/edit. Outputs: updated user list; success or error.

Analytics view. Displays aggregated metrics (e.g., number of translations per day, top languages, active users). Inputs: date range, optional filters. Outputs: aggregated data; charts or tables.

Logs view. Retrieves and displays error logs, request logs, or audit logs from the database or log store. Inputs: date range, severity, optional search. Outputs: log entries; paginated list.

System configuration. Allows the admin to update config key-value pairs (e.g., max file size, feature flags) stored in System_Config or environment. Inputs: config_key, config_value. Outputs: updated config; confirmation.

Table 15.8 Admin Panel module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| User management | user list, form data | CRUD on users; list updated |
| Analytics view | date range, filters | Aggregated usage data; charts/tables |
| Logs view | date range, severity, search | Log entries; paginated list |
| System configuration | config_key, config_value | Config updated; confirmation |

### 15.3.8 Reports & Logs Module

Purpose. The Reports & Logs module generates usage reports and translation statistics, and persists or retrieves operational logs. It supports both real-time logging (during request processing) and report generation (on demand or scheduled).

Sub-modules and functions.

Usage reports. Aggregates translation requests by date, user, source/target language, or status and produces summary reports (e.g., count per day, top languages). Inputs: date range, group-by dimensions. Outputs: report data; export (e.g., CSV, PDF) if implemented.

Translation statistics. Computes metrics such as total requests, success rate, average processing time, and stores or displays them. Inputs: raw request and log data. Outputs: statistics; dashboard or report view.

Log persistence. Writes log entries (request_id, error_message, processing_time, timestamp) to the Translation_Log table or to a log file. Inputs: log fields from controller or services. Outputs: log record stored.

Table 15.9 Reports & Logs module

| Sub-module / Function | Inputs | Outputs / Actions |
|------------------------|--------|---------------------|
| Usage reports | date range, dimensions | Report data; optional export |
| Translation statistics | request/log data | Metrics (count, success rate, avg time) |
| Log persistence | request_id, error_message, processing_time, timestamp | Log record in DB or file |

________________________________________

## 15.4 Module Dependencies Summary

The following table summarises the dependency of each top-level module on others. The Translation Module depends on PDF Upload & Processing (for the PDF buffer) and on PDF Reconstruction (for consuming translated text). File Management depends on PDF Reconstruction or the controller for the PDF buffer at download time. Admin Panel and Reports & Logs may depend on the database and on User Authentication (for role check).

Table 15.10 Module dependencies

| Module | Depends on |
|--------|------------|
| User Authentication | (none at top level; may use User table / DB) |
| Dashboard | User Authentication (if protected); PDF Upload, Translation, File Management (for UI) |
| PDF Upload & Processing | (none; provides output to Translation) |
| Translation Module | PDF Upload & Processing (buffer); external Translation API |
| PDF Reconstruction | Translation Module (translated text) |
| File Management | PDF Reconstruction / controller (buffer for download); optional DB for history/delete |
| Admin Panel | User Authentication (admin role); database (users, config, logs) |
| Reports & Logs | Database (Translation_Request, Translation_Log); optional Admin Panel (for display) |

________________________________________

## 15.5 Conclusion

This chapter has presented the structure chart for Global PDF Services (GlobalPDF). The top-level decomposition into seven modules (User Authentication, Dashboard, PDF Upload & Processing, Translation Module, File Management, Admin Panel, Reports & Logs) provides a clear hierarchy that can be expanded into sub-modules and functions. For each major module, the breakdown has specified sub-modules or functions, inputs, outputs or actions, and purpose, and has summarised the information in tables. The structure chart complements the data flow diagrams (Chapter 11), the entity-relationship diagram (Chapter 12), and the system features (Chapter 10) by emphasising the modular organisation of the system and the responsibilities of each component. This organisation supports implementation, testing, and maintenance and is suitable for inclusion in a final-year engineering project report.

________________________________________

End of Chapter 15.
