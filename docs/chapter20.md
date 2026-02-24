# CHAPTER 20 – PROBLEMS ENCOUNTERED, DRAWBACKS AND LIMITATIONS

________________________________________

## 20.1 Introduction

This chapter documents the problems encountered during the development of Global PDF Services (GlobalPDF), the key drawbacks of the project approach, and the major limitations of the system as delivered. The project is a full-stack web application that allows users to upload PDF files, select source and target languages, translate content using the Google Translation API, and download the translated PDF. It is built with Next.js and React on the frontend, Node.js and Express on the backend, optional MongoDB or PostgreSQL for persistence, and is deployed on Vercel (frontend) and Render or equivalent (backend). The team size was two to three members, and the project duration was approximately twelve weeks. The purpose of this chapter is to provide an honest, reflective account of technical and practical difficulties, structural drawbacks, and system limitations, and to summarise lessons for future improvement. The content is presented in a form suitable for a final-year B.Tech, BCA, or MCA project report.

________________________________________

## 20.2 Common Problems Encountered During Development

### 20.2.1 UI/UX Design Challenges

Problem. The upload area and language dropdowns did not behave consistently across mobile viewport widths. On narrow screens (320 px), the translate button was partially obscured, and the progress pipeline steps wrapped in a way that reduced clarity. Some users reported that they were unsure whether the translation had started after clicking the button.

Why it happened. The initial layout was designed primarily for desktop. Responsive breakpoints and touch targets were not fully tested on real devices until late in the second sprint. The progress indicator did not advance visibly until the first backend response, creating a perception of no feedback.

How it was fixed. Tailwind breakpoints were adjusted so that the main controls remain above the fold on 320 px width. Minimum touch target sizes were increased for the button and dropdowns. The progress pipeline was updated to show an immediate transition to "extracting" when the request is sent, with a short delay before "translating" so that the user sees instant feedback even before the server responds. Responsive testing was added to the pre-release checklist.

Time/effort cost. Approximately three to four days across two sprints, including layout changes, testing on multiple devices, and one round of user feedback.

### 20.2.2 Backend and JavaScript Bugs

Problem. In the translation service, array access inside a loop (e.g., when iterating over paragraph chunks) triggered TypeScript errors: "possibly undefined" for indexed elements. In the PDF builder, an undefined or null target language option sometimes caused the font path resolver to throw, resulting in an unhandled exception and a 500 response.

Why it happened. The project uses strict TypeScript options (e.g., noUncheckedIndexedAccess). Array indexing in a loop was not guarded, so the type checker correctly flagged potential undefined access. The PDF builder did not validate the optional target language parameter before calling the font resolver.

How it was fixed. Explicit checks were added in the translation service (e.g., "if (paragraph === undefined) continue") so that the type of the loop variable was narrowed. The PDF builder was updated to treat a missing or invalid target language as a fallback to script detection or default font, and to avoid throwing when the font path was null by logging a warning and using the default font when available.

Time/effort cost. About one day for the translation service type fixes and half a day for the PDF builder defensive checks.

### 20.2.3 API Integration Problems

Problem. The Google Translation API returned errors for long text when the request exceeded the documented character limit. In some cases, the API responded with a rate-limit or quota error, and the application returned a generic "Internal server error" to the user without distinguishing between network failure, invalid language, and quota exhaustion.

Why it happened. Chunking was implemented only after the first integration tests with multi-page PDFs. Error handling in the translation service did not parse the API response body to map specific error codes to user-facing messages.

How it was fixed. A chunking function was implemented to split text at paragraph boundaries and to respect a maximum character limit per request (e.g., 4000 characters). Chunks were sent sequentially and results concatenated. The translation service was updated to inspect the API response status and body, and to throw or return structured errors (e.g., "Translation API quota exceeded", "Invalid language code") that the controller could map to HTTP status and a clear message.

Time/effort cost. Approximately two days for chunking logic and tests, and one day for error mapping and user messages.

### 20.2.4 Database and Schema Issues

Problem. When the optional database was introduced for translation history, initial migration scripts did not enforce foreign key constraints consistently. In one environment, a translation log entry was inserted with a non-existent request_id, leading to orphaned records and failed joins in reporting queries.

Why it happened. The schema was designed on paper and in the data dictionary, but the first migration was applied without enabling foreign key checks in the test database. Manual testing had not covered the case where a log was written after a failed request that was never committed.

How it was fixed. Foreign key constraints were added to the migration scripts and enabled in the database. The application logic was reviewed so that log entries are only written when the request_id exists (e.g., after the request row is committed). A simple referential-integrity test was added to the test suite.

Time/effort cost. About one day to correct the schema, update migrations, and fix the application flow; additional time for data cleanup in the affected environment.

### 20.2.5 Performance and Loading Delays

Problem. Users reported that the application felt slow when translating documents of several pages. The browser appeared to freeze briefly after clicking translate, and there was no indication of progress until the PDF was ready or an error occurred.

Why it happened. The entire translation (extract, translate in chunks, build PDF) is a single synchronous HTTP request from the client's perspective. No streaming or intermediate status was implemented. The frontend did not show a step-based progress indicator initially.

How it was fixed. A pipeline-style progress component was added on the frontend that shows stages (extracting, translating, generating, done). The frontend sets the current stage optimistically when the request is sent and updates it when the response is received (or on error). Backend processing time was not reduced, but perceived performance improved. For very large documents, a note was added in the UI that translation may take longer.

Time/effort cost. Approximately two days to design and implement the progress component and to wire it to the request lifecycle.

### 20.2.6 Browser Compatibility Issues

Problem. In one browser (Safari), the download of the translated PDF did not trigger correctly when the response was received as a blob and an anchor element was used with a programmatically created object URL. The file was not saved with the expected filename in some scenarios.

Why it happened. Browser support for triggering download via JavaScript (createObjectURL, click on anchor with download attribute) varies slightly. Safari and some mobile browsers handle the Content-Disposition header and the download attribute differently. The frontend had been tested mainly on Chrome.

How it was fixed. The download logic was updated to set the anchor's download attribute to the desired filename (e.g., "translated.pdf"), to use a short delay before revoking the object URL so that the click could complete, and to fall back to opening the blob in a new tab with a user message to "Save as" if direct download was not supported. Cross-browser testing was added to the checklist.

Time/effort cost. Approximately one day for investigation, code change, and verification on Safari and Edge.

### 20.2.7 User Testing Feedback

Problem. During usability testing, several participants reported that they were not sure whether they had to select both source and target language, and that the error message for "missing language" was too technical. Some users tried to upload a Word document or an image and were confused when the system rejected the file without explaining that only PDFs are supported.

Why it happened. The language selection labels and the validation messages were written from a developer perspective. The list of supported file types was not prominent on the upload area.

How it was fixed. Labels were changed to "Source language" and "Target language" with a short hint that both are required. The validation message for missing language was reworded to "Please select both source and target language." The upload zone was updated to state "PDF only (max 10 MB)" and the file-type error message was changed to "Please upload a PDF file. Other formats are not supported."

Time/effort cost. Approximately half a day for copy changes and one round of re-testing with users.

### 20.2.8 Deployment and Hosting Errors

Problem. After deploying the backend to Render, the frontend (on Vercel) could not reach the API. Requests failed with CORS errors or connection refused. In a separate incident, the backend failed to start because a required environment variable (e.g., GOOGLE_TRANSLATE_API_KEY) was not set in the production environment.

Why it happened. CORS was configured for localhost origins during development and was not updated with the production frontend URL. The deployment checklist did not include verification of all required environment variables on the hosting platform.

How it was fixed. The backend CORS configuration was updated to allow the production frontend origin (e.g., https://globalpdf.vercel.app) in addition to localhost. A list of required environment variables was documented in the deployment guide, and a startup check was added so that the server logs a clear error and exits if the translation API key is missing, rather than failing later on the first request.

Time/effort cost. Approximately half a day for CORS and env fixes and for updating the deployment documentation.

### 20.2.9 Environment and Configuration Mistakes

Problem. In one developer's local setup, the frontend was calling the wrong backend URL (a stale value in .env.local), so all translation requests failed. In another case, the backend was reading the API key from a different env file than the one used in the deployment panel, leading to "invalid API key" in production.

Why it happened. Multiple .env files (e.g., .env, .env.local, .env.development) and inconsistent naming (e.g., NEXT_PUBLIC_API_URL vs API_URL) caused confusion. The deployment platform used a different mechanism (e.g., dashboard key-value) that was not aligned with the variable names in the code.

How it was fixed. A single source of truth for variable names was documented (e.g., NEXT_PUBLIC_API_URL for the frontend, GOOGLE_TRANSLATE_API_KEY for the backend). The deployment guide was updated to list each variable and where to set it (local .env vs Vercel/Render dashboard). A short "smoke test" section was added to verify that the frontend can reach the backend and that the backend can call the translation API.

Time/effort cost. Approximately half a day to resolve the immediate issues and to document the configuration.

### 20.2.10 Version Control and Merge Conflicts

Problem. Parallel work on the frontend (upload component) and the backend (upload endpoint) led to merge conflicts when integrating the branch that added the progress pipeline with the branch that changed the API response format. In one case, a conflict was resolved incorrectly and the download logic was reverted, causing a regression.

Why it happened. The team did not always pull the latest changes before starting a new feature, and the API contract (request/response shape) was not written down in a shared document until after the first integration. Conflict resolution was done without re-running the full test suite.

How it was fixed. The team adopted a rule to pull and rebase (or merge) from the main integration branch before starting work. A short API contract (field names, response type for success and error) was added to the repository (e.g., in docs or in a README). After resolving any merge conflict, the person who resolved ran the full test suite and a quick manual smoke test before pushing.

Time/effort cost. Approximately one day to fix the regression and to establish the pull-and-test discipline; ongoing effort to maintain the API doc.

________________________________________

## 20.3 Key Drawbacks of the Project Approach

Framework choice. The use of Next.js and Express provided structure and a large ecosystem, but it also introduced a learning curve for team members who were new to the App Router or to TypeScript. In hindsight, a simpler stack might have reduced initial setup time, but the chosen stack improved long-term maintainability and alignment with industry practice. The drawback was the upfront time spent on configuration and conventions rather than on business logic.

Small team size. With two or three members, there was little redundancy. When one person was unavailable, progress on their area (e.g., backend or frontend) slowed. Code review was sometimes skipped under time pressure, which increased the risk of defects. The drawback could be mitigated in future by clearer ownership of modules and by reserving time for review in the sprint plan.

Free-tier hosting. Free tiers on Vercel and Render impose limits on request duration, bandwidth, and cold starts. Long-running translation requests (e.g., large PDFs) could hit timeout limits on the free tier. The system was designed to complete within typical limits, but under load or with large files, the free tier proved a constraint. The drawback is accepted for an academic project; a production system would require a paid plan or alternative hosting.

Limited test coverage. Although unit tests were written for critical backend logic and E2E tests covered the happy path, coverage of edge cases (e.g., malformed PDFs, partial API failure) remained limited. Regression tests were not fully automated for every deployment. The drawback is that some defects may surface only in production or during manual testing. Future work would allocate more time for test design and automation.

Academic time pressure. The twelve-week timeline aligned with a semester or final-year schedule. This left little buffer for unexpected issues (e.g., API changes, dependency vulnerabilities) or for refactoring. Some technical debt was deferred. The drawback is inherent to academic deadlines; the mitigation was strict scope control and prioritisation of the minimum viable product.

Budget constraints. The project relied on free tiers for hosting and on free or student credits for the translation API. This limited the ability to run sustained load tests, to use paid monitoring services, or to scale beyond free-tier limits. The drawback is acceptable for a student project but would need to be revisited for a commercial deployment.

________________________________________

## 20.4 Major Limitations of the System

Scalability. The backend is designed as a single-instance, stateless service. Horizontal scaling (multiple instances behind a load balancer) is feasible in principle, but the translation API quota and rate limits become the bottleneck before the application server. There is no built-in queue for translation jobs; under high concurrency, users may experience delays or quota-related errors. The system is suitable for small to medium traffic (e.g., tens of concurrent users) rather than for large-scale deployment without architectural changes.

Performance. End-to-end translation time depends on the size of the document, the number of API calls (chunking), and the latency of the translation API. There is no caching of translation results, so repeated translation of the same text incurs full API cost and latency. Large PDFs (e.g., hundreds of pages) may approach or exceed timeout limits on free-tier hosting. Performance is acceptable for typical academic or light business use but not optimised for high throughput.

Security. The system uses HTTPS, validates input, and keeps the API key server-side. However, there is no rate limiting per user or IP in the initial release, so the application could be abused to exhaust the translation API quota. User authentication (JWT) and role-based access were optional; if not implemented, there is no protection against unauthorised use. Security hardening (rate limiting, auth, audit logging) would be required for a production or multi-tenant deployment.

Dependency on third-party API. The translation quality, availability, and cost are determined by the Google Translation API (or the chosen provider). An API outage or a change in terms or pricing directly affects the system. There is no fallback provider or offline translation. The limitation is inherent to the design and is documented so that stakeholders understand the operational dependency.

No offline functionality. The application requires an internet connection for upload, translation, and download. There is no service worker or offline mode. Users in low-connectivity environments cannot use the system. This limitation is accepted for the current web-based scope.

Limited concurrency. The application does not implement a job queue or connection pooling for the translation API. Under a burst of concurrent requests, the API may throttle or reject requests, and the application may return errors to users. Concurrency is limited by the API quota and by the single-instance design. Improving concurrency would require queueing, retry logic, or multiple API keys and load distribution.

No enterprise-level features. The system does not include single sign-on (SSO), audit logs for compliance, SLAs, or dedicated support. It is not designed for enterprise deployment without significant extension. This limitation is explicit in the project scope.

Maintenance. The codebase depends on a number of external packages (Next.js, Express, unpdf, pdfkit, translation API client). Security and compatibility updates to these dependencies require ongoing maintenance. Without a dedicated maintenance plan, the system may become vulnerable or incompatible with newer runtimes. This is a common limitation of small or academic projects.

Cost at scale. At low volume, the cost of the translation API and hosting remains within free or low-cost tiers. At scale, API costs would grow with the number of characters translated, and hosting would require paid plans. The system does not implement usage-based billing or cost controls; cost at scale is a known limitation that would need to be addressed for commercial use.

________________________________________

## 20.5 Summary Table of Problems and Fixes

Table 20.1 summarises the problem types, example issues, fixes applied, and approximate time cost. The table is intended for quick reference and aligns with the detailed descriptions in Section 20.2.

Table 20.1 Summary of problems and fixes

| Problem Type | Example Issue | Simple Fix Applied | Time Cost |
|--------------|----------------|--------------------|-----------|
| Design | Mobile layout; progress not visible on click | Responsive breakpoints; immediate "extracting" state on submit | 3–4 days |
| Backend | TypeScript "possibly undefined" in translation loop; PDF builder throw on null font | Guard clauses; fallback font and validation | ~1.5 days |
| API integration | Long text over limit; generic API errors | Chunking; structured error mapping and user messages | ~3 days |
| Database | Orphaned log rows; missing FK enforcement | FK in migrations; log only after request commit | ~1 day |
| Performance | Perceived slowness; no progress feedback | Pipeline progress component; optimistic UI update | ~2 days |
| Browser compat | Safari download not triggering; filename lost | download attribute; delay before revoke; fallback message | ~1 day |
| User testing | Unclear labels; technical error messages | Reworded labels and validation messages; "PDF only" on upload | ~0.5 day |
| Deployment | CORS; backend unreachable; missing env in prod | CORS allowlist; env checklist; startup validation | ~0.5 day |
| Configuration | Wrong API URL; env file vs dashboard mismatch | Documented variable names; deployment guide update | ~0.5 day |
| Version control | Merge conflicts; regression after bad resolve | Pull before feature work; API contract doc; test after resolve | ~1 day |

________________________________________

## 20.6 Lessons for Future Improvement

Start testing early. Many issues (browser compatibility, mobile layout, API error handling) could have been caught earlier if testing had been integrated from the first sprint. Allocating time for unit tests, API tests, and at least one E2E scenario per sprint would reduce late-phase defects and rework.

Allocate buffer time. The twelve-week plan had little slack. Including a buffer (e.g., one week) for integration, bug fixing, and deployment issues would reduce pressure and allow for unexpected API or dependency problems. Buffer time should be explicit in the project plan rather than assumed.

Use frameworks wisely. Frameworks (Next.js, Express) accelerated development but required time to learn and configure. For future projects, investing in a short spike or proof-of-concept with the chosen stack before committing to the full design can reduce mid-project surprises. Consistency in framework versions and conventions across the team also reduces integration issues.

Prioritise backend architecture. A stable API contract and clear separation between controller, services, and external calls made it easier to fix bugs and add tests. Defining the request/response shape and error codes early, and documenting them, would have avoided some frontend-backend integration and merge conflicts. Future projects should treat the API contract as a first-class deliverable.

Consider scalability from the start. Even if the initial goal is a small user base, designing for stateless processing, configurable limits, and a clear place to add a queue or cache makes it easier to scale later. Documenting known limits (concurrency, file size, API quota) in the design phase helps set realistic expectations and guides testing.

________________________________________

## 20.7 Conclusion

This chapter has documented the problems encountered during the development of Global PDF Services, the drawbacks of the project approach, and the major limitations of the system. The problems ranged from UI/UX and responsive design to backend and TypeScript bugs, API integration and chunking, database schema and foreign keys, performance perception, browser compatibility, user testing feedback, deployment and CORS, environment configuration, and version control conflicts. Each was described with the problem, cause, fix, and approximate time cost. The key drawbacks included the trade-offs of using a full framework, the constraints of a small team, free-tier hosting, limited test coverage, academic time pressure, and budget limits. The major limitations of the system include scalability, performance bounds, security gaps, dependency on a third-party translation API, no offline support, limited concurrency, absence of enterprise features, maintenance burden, and cost implications at scale. The summary table and the lessons for future improvement provide a concise reference for similar projects. The chapter is written in a reflective, analytical tone suitable for a final-year B.Tech, BCA, or MCA project report.

________________________________________

End of Chapter 20.
