# CHAPTER 19 – SOFTWARE DEVELOPMENT LIFE CYCLE

________________________________________

## 19.1 Introduction to SDLC Model Used

Global PDF Services (GlobalPDF) is a full-stack web application that enables users to upload PDF files, select source and target languages from a set of twenty or more options, translate content using the Google Translation API, and download the translated PDF. The project follows a Modified Agile software development life cycle, combining iterative sprints with defined phase gates and deliverables. This chapter documents the SDLC as executed for the project, including planning, design, development, testing, deployment, and maintenance, and is written in a form suitable for a final-year B.Tech, BCA, or MCA project report.

Modified Agile was chosen for several reasons. First, the translation pipeline (upload, extraction, translation, PDF generation, download) benefits from a stable backend design and API contract before coding; Modified Agile accommodates an upfront design phase while still allowing short development sprints. Second, the frontend and user experience benefit from iterative feedback; sprint-based delivery allows the team to refine the upload interface, progress indicator, and error messages based on early testing. Third, a small team (two to three members) can work effectively with two-week sprints, daily or periodic standups, and a visible backlog without the overhead of a full Scrum framework. Fourth, academic timelines and deliverables (SRS, design documents, test reports) align with phase-based milestones while development proceeds in iterations.

In contrast, a pure Waterfall model would require all requirements and design to be frozen before any implementation, reducing the ability to incorporate user feedback on the interface or to adjust to API constraints discovered during development. A pure Agile model with minimal upfront design could lead to inconsistent backend interfaces or delayed integration. The Modified Agile approach used in this project therefore retains the discipline of phased planning and design (similar to Waterfall) while applying Agile practices during implementation and testing (sprints, continuous integration, and iterative refinement).

________________________________________

## 19.2 Phase 1: Planning and Requirements Analysis

Duration. Two weeks.

Team members involved. Two to three members: one responsible for backend and API integration, one for frontend and UI/UX, and optionally one for testing and documentation. Roles may overlap in a small team.

Project plan (features priority list). Features were prioritised using MoSCoW. Must-have: PDF upload with type and size validation; source and target language selection from supported list; translation via external API with chunking; PDF generation and download; basic error handling and user feedback. Should-have: progress indicator (pipeline-style); responsive layout; replace-file option; clear validation messages. Could-have: user authentication (JWT); translation history; admin panel; accessibility improvements. The priority list was frozen for the first release to control scope.

Tech stack selection. Frontend: Next.js (App Router) and React for the web interface; Tailwind CSS for styling; optional Framer Motion for animations. Backend: Node.js with Express and TypeScript; services for extraction (unpdf), translation (Google Translate API), and PDF building (PDFKit). Database: MongoDB or PostgreSQL for optional user accounts, translation history, and configuration; the first release may operate statelessly without a database. Deployment: Vercel for the frontend; Render or AWS for the backend. Version control: Git; CI/CD via GitHub Actions.

Timeline. Total project duration: twelve weeks from kick-off to production deployment, with a two-week buffer for UAT and fixes. Planning and requirements: weeks 1–2; design: weeks 3–4; development (sprints): weeks 5–10; testing: weeks 9–11; deployment and go-live: week 12.

Budget estimation (academic context). Development tools and hosting were kept within a minimal academic budget. Google Translation API: free tier or student credits where applicable. Vercel: free tier for frontend. Backend hosting (Render or similar): free or low-cost tier (approximately 0–500 INR per month). Domain (optional): approximately 500–800 INR per year. Total estimated out-of-pocket for a typical semester: under 2,000 INR, excluding personal hardware and internet.

Risks identified. Dependency on external translation API (availability, quota, cost); scope creep if additional features are added mid-sprint; Unicode and multi-script support requiring correct font deployment; file size and concurrency potentially affecting server resources. Mitigation: API key and quota monitoring; strict backlog prioritisation; font documentation and automated checks; configurable limits and load testing.

Success criteria. SRS approved by project guide; tech stack and environment documented; project plan and risk register baselined; team and roles assigned.

________________________________________

## 19.3 Phase 2: System Design and Architecture

High-level architecture. The system is structured in three tiers: client (browser), server (API), and external service (translation API). The following text diagram illustrates the high-level architecture.

```
+------------------+     HTTPS      +------------------+     HTTPS      +------------------+
|                  |  ----------->  |                  |  ----------->  |                  |
|  Browser (User)  |   PDF, langs   |  Node.js/Express |  text, langs  |  Google Translate |
|  Next.js/React   |  <-----------  |  Backend API     |  <-----------  |  API             |
|                  |  PDF download  |  Extraction /    |  translated   |                  |
|                  |                |  Translation /   |  text         |                  |
+------------------+                |  PDF Builder     |                +------------------+
                                   +--------+---------+
                                            |
                                   +--------v---------+
                                   |  MongoDB /       |
                                   |  PostgreSQL     |
                                   |  (optional)     |
                                   +------------------+
```

Low-level design details. Frontend: Next.js 16 (App Router), React 19, Tailwind CSS; components for upload zone, language selectors, progress pipeline, and download trigger; client-side validation and error display. Backend: Express 5, TypeScript; thin controller; services for extraction, translation, and PDF building; multer for multipart upload; environment-based configuration. Database: when used, five main tables (User, Translation_Request, Translation_Log, Supported_Language, System_Config) as per Chapter 14; schema normalised to 3NF. API: one primary REST endpoint (POST upload with multipart form data); optional health and config endpoints. Major modules: File Upload and Validation, Language Selection, Text Extraction, Translation (with chunking), PDF Reconstruction, Reporting and Logs, Administration and Security (Chapter 10).

Deliverables. System Design Document (SDD); high-level and component architecture diagrams; database schema (SQL or migration scripts when DB is used); API documentation (endpoints, request/response, error codes); wireframes or UI mockups for main flows; updated risk register.

________________________________________

## 19.4 Phase 3: Development and Implementation

Sprint breakdown. Development was organised into three two-week sprints, with a fourth sprint used for hardening and documentation where the timeline allowed. Table 19.1 summarises the sprint focus, deliverables, and approximate lines of code added per sprint.

Table 19.1 Sprint breakdown

| Sprint | Focus | Deliverables | LOC added (approx.) |
|--------|--------|----------------|----------------------|
| 1 | Backend pipeline: upload validation, extraction service, translation service, PDF builder; API contract | Working POST endpoint; extraction, translation, PDF generation; unit tests | 1,200–1,500 |
| 2 | Frontend: upload UI, language selection, API integration, progress indicator, download handling | End-to-end flow in browser; progress pipeline component; error states | 1,400–1,800 |
| 3 | Refinement: error messages, responsive layout, font handling, documentation; optional auth stub | Polished UI; deployment guide; optional login/register screens | 800–1,200 |
| 4 (optional) | Hardening: accessibility, edge cases, performance tuning, UAT fixes | Accessibility improvements; bug fixes; test report | 400–600 |

Development practices. Version control: Git with a remote repository (e.g., GitHub). Branching strategy: main branch for production-ready code; develop for integration; feature branches (e.g., feature/upload-validation) merged via pull requests. CI/CD: GitHub Actions runs lint and unit tests on push; optional automated deploy to staging on merge to develop. Code quality: ESLint and Prettier for JavaScript/TypeScript; consistent naming and error handling; code review where team size permits.

Total lines of code. For the scope described (upload, translate, download, progress UI, validation, optional DB and auth), total project size is in the range of 3,800–5,100 lines of code (backend and frontend combined), which is realistic for a final-year full-stack project delivered in twelve weeks by a small team.

________________________________________

## 19.5 Phase 4: Testing and Quality Assurance

Test coverage. Testing was conducted at multiple levels as described in Chapter 18. Table 19.2 summarises the test categories, tools, and coverage or scope.

Table 19.2 Test coverage summary

| Test Type | Scope | Tools | Coverage / Result |
|-----------|--------|--------|-------------------|
| Unit testing | Extraction, chunking, PDF builder utilities; validation logic | Jest | Target 85% coverage on critical paths |
| Integration testing | API endpoints with extraction, translation, PDF build; DB when used | Postman, Jest | All defined scenarios pass |
| End-to-end testing | Full flow: upload, select languages, translate, download | Cypress | Core workflow and main error paths |
| Load testing | Concurrent translation requests; API rate limits | JMeter | 100 users; graceful degradation at limit |
| Security testing | JWT, RBAC, input validation, API key exposure | OWASP ZAP, manual tests | Zero critical vulnerabilities |
| Accessibility testing | Keyboard, focus, contrast, screen reader | Manual, Lighthouse | WCAG 2.1 AA where feasible |

Usability testing results. Usability testing was conducted with eight to twelve participants (students and professionals). Tasks included uploading a PDF, selecting languages, and downloading the translated PDF. Metrics: task completion rate target above 90 percent; System Usability Scale (SUS) score target at least 80. Results were used to refine button labels, progress indicator clarity, and mobile layout; post-iteration SUS scores and task completion rates were recorded in the test report (Chapter 18).

________________________________________

## 19.6 Phase 5: Deployment and Go-Live

Deployment strategy. A blue-green or equivalent low-downtime strategy was used where supported by the hosting platform. The frontend was deployed to Vercel with automatic builds from the main or production branch. The backend was deployed to Render (or AWS) with environment variables for API key and configuration. Database backups were taken before deployment when a database was in use. Rollback procedure: revert to the previous deployment or switch traffic back to the previous instance.

Infrastructure breakdown. Frontend: Vercel (serverless or static export); CDN for assets. Backend: single instance on Render or equivalent (e.g., 512 MB RAM, 0.5 vCPU); Node.js runtime; environment variables for PORT, GOOGLE_TRANSLATE_API_KEY, and optional DB URL. Database: MongoDB Atlas or PostgreSQL (e.g., Neon, Supabase) on free or low-cost tier when persistence is enabled. External: Google Translation API over HTTPS.

Hosting costs (student-level). Vercel: free tier. Render: free tier or minimal paid tier (approximately 0–500 INR/month). Database: free tier (MongoDB Atlas or Neon). Domain: optional, approximately 500–800 INR/year. Total: under 2,000 INR for a typical project duration.

Monitoring tools. Application and error monitoring: Sentry or similar for frontend and backend exceptions. Uptime and response time: platform-provided metrics or a simple health-check endpoint. Logs: server stdout or file-based logs; optional log aggregation for staging. Post-launch: dashboards for error rate, response time, and optional usage metrics.

________________________________________

## 19.7 Phase 6: Maintenance and Monitoring

Post-launch metrics. Table 19.3 summarises the metrics targeted for the first month after go-live.

Table 19.3 Post-launch metrics (targets)

| Metric | Target | Notes |
|--------|--------|--------|
| Uptime | 98% (operational hours) | Excluding planned maintenance |
| Response time (lightweight API) | Under 2 s median | Health check, config |
| Translation request completion | Under 60 s for typical document | Depends on API and document size |
| Error rate | Under 2% of requests | Excluding user validation errors |
| Active users (optional) | Tracked if analytics enabled | For capacity and usage reports |

Ongoing support plan. Week 1: daily review of errors and performance; hotfix process for critical defects. Month 1: regression test cycle; address high-priority bugs and usability issues. Quarterly: dependency updates; security review; optional feature releases (e.g., history, batch). Documentation is kept updated (deployment guide, environment variables, API docs).

________________________________________

## 19.8 SDLC Timeline Summary

Table 19.4 provides a week-wise breakdown of the SDLC phases.

Table 19.4 Week-wise SDLC timeline

| Week | Phase | Activities |
|------|--------|------------|
| 1–2 | Planning and requirements | Project plan; SRS; tech stack; risk register; success criteria |
| 3–4 | System design | Architecture; DB schema; API spec; wireframes; SDD |
| 5–6 | Development sprint 1 | Backend pipeline; unit tests; API tests |
| 7–8 | Development sprint 2 | Frontend integration; progress UI; E2E tests |
| 9–10 | Development sprint 3 | Refinement; accessibility; documentation; optional sprint 4 |
| 9–11 | Testing and QA | Integration, E2E, load, security, accessibility; UAT |
| 12 | Deployment and go-live | Staging verification; production deploy; smoke tests; monitoring |

________________________________________

## 19.9 Lessons Learned and Retrospective

What went well. Upfront design of the translation pipeline (extraction, translation, PDF build) reduced rework; the service-based backend allowed unit testing of each step in isolation. Short sprints and a visible backlog kept the team aligned. Use of standard tools (Next.js, Express, Postman, Jest) shortened the learning curve and improved maintainability. Early integration of the frontend with the backend (sprint 2) allowed end-to-end validation before the final sprint.

Challenges faced. External API dependency (quota and latency) required chunking and clear error handling; occasional API slowness affected perceived performance. Balancing scope with the twelve-week timeline led to deferral of some features (e.g., full auth, history) to a future release. Unicode and font support for multiple scripts required careful font packaging and testing. Coordinating frontend and backend changes across a small team required clear API contracts and communication.

Improvements for future. Introduce contract or API tests earlier to catch interface drift. Automate more of the regression suite (e.g., scheduled E2E runs). Consider feature flags for optional modules (auth, history) to simplify rollout. Document runbooks for common operational tasks (restart, rollback, DB backup). Allocate explicit time for technical debt and dependency updates in later sprints.

________________________________________

## 19.10 Conclusion

This chapter has presented the Software Development Life Cycle for Global PDF Services as a Modified Agile process over twelve weeks, with phases for planning and requirements, system design, development (in iterative sprints), testing and quality assurance, deployment and go-live, and maintenance and monitoring. The project uses a full-stack tech stack (Next.js/React, Node.js/Express, optional MongoDB or PostgreSQL) and is deployed on Vercel for the frontend and Render or equivalent for the backend. The sprint breakdown, test coverage, deployment strategy, and post-launch metrics are documented in tables and aligned with the testing and implementation details in Chapter 18. The lessons learned and retrospective summarise what worked well, what challenges were encountered, and what improvements are planned for future iterations. The SDLC as documented is suitable for inclusion in a final-year B.Tech, BCA, or MCA project report.

________________________________________

End of Chapter 19.
