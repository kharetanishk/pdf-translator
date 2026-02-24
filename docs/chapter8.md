# CHAPTER 8 – SYSTEM DEVELOPMENT LIFE CYCLE (SDLC)

________________________________________

## 8.1 Introduction to SDLC Approach

The System Development Life Cycle (SDLC) is a structured framework that defines the phases, activities, and deliverables involved in the conception, development, deployment, and maintenance of a software system. It provides a repeatable process for translating user requirements into a working product while managing scope, quality, and risk. For the GlobalPDF project—a web-based multilingual PDF translation system—the choice of lifecycle model directly influences the ability to deliver a reliable, maintainable application within the planned timeline and resource constraints.

GlobalPDF adopts a hybrid Waterfall-Agile model. The Waterfall component provides a clear sequence of phases (planning, requirements analysis, system design, implementation, testing, deployment, maintenance) with defined milestones and deliverables at each stage. This structure is well suited to the backend architecture: the translation pipeline (upload, extraction, translation, PDF generation) is relatively stable and benefits from upfront design, API contracts, and security considerations before coding begins. The Agile component is applied during implementation and testing, with short iterations (sprints), frequent feedback, and incremental delivery of features. This supports iterative refinement of the user interface, responsiveness to change in UI/UX preferences, and early validation of the end-to-end workflow. The hybrid approach thus combines the discipline of phased analysis and design with the flexibility of iterative development.

The project lifecycle spans twenty weeks from project kick-off to deployment and handover, with an additional maintenance phase thereafter. Measurable benefits of this approach include risk reduction through early feasibility and requirement validation; reduced rework through clear design artefacts before implementation; and iterative improvement of the user experience through sprint-based feedback. The following sections describe each phase in detail, the activities and deliverables within them, and how risk management and the hybrid model support the successful delivery of GlobalPDF.

---

## 8.2 SDLC Phases and Activities

### Phase 1: Planning (Weeks 1–2)

The planning phase establishes the project scope, feasibility, and resource baseline. Problem identification focused on the inefficiencies of manual PDF translation: users copying text between PDF viewers, web translators, and word processors; loss of formatting; and the absence of a single, integrated tool for multilingual PDF output. These pain points were documented and linked to the project objectives (automation, readability, multi-language support) described in earlier chapters.

Feasibility analysis was conducted across three dimensions. Technical feasibility confirmed that PDF text extraction (e.g., via libraries such as unpdf), machine translation (Google Translate API or equivalent), and PDF generation (e.g., PDFKit) are mature and compatible with a Node.js/Express backend. Economic feasibility considered the cost of API usage, hosting, and development effort against the target of an affordable or free-tier-capable service. Operational feasibility assessed the ability of a small team (three to five members) to deliver the system within twenty weeks using the chosen tools and methodologies. Resource allocation defined roles (e.g., backend, frontend, testing) and the team size of three to five members. Risks identified during planning included dependency on the external translation API, scope creep from feature requests, and the need for Unicode and multi-script support in generated PDFs. The phase concluded with a project plan, risk register, and a milestone sign-off for proceeding to requirements analysis.

### Phase 2: Requirements Analysis (Weeks 3–5)

Requirements analysis built on the planning phase by eliciting, documenting, and validating functional and non-functional requirements. Methods employed included stakeholder interviews, surveys, observation of manual translation workflows, document analysis (API documentation, existing tools), and workshops, as described in Chapter 7. More than fifty requirements were identified and categorised using MoSCoW prioritisation and thematic grouping (translation pipeline, language support, usability, security, deployment). The Software Requirements Specification (SRS) was produced and reviewed with stakeholders. The key milestone for this phase was SRS approval, indicating that the requirement set was complete enough, consistent, and agreed upon to proceed to system design.

### Phase 3: System Design (Weeks 6–8)

The system design phase produced the high-level architecture and detailed design artefacts. The high-level architecture defines the main components: a Next.js frontend for upload, language selection, progress display, and download; an Express-based backend exposing a REST API (e.g., POST for upload with multipart form data); and integration with the Google Translate API. The backend is structured into services (extraction, translation, PDF builder) with a thin controller layer, as outlined in earlier chapters.

Database design, for current or future use, considered conceptual entities such as Upload (file metadata, size, timestamp), TranslationJob (source language, target language, status), Language (supported language codes and display names), and OutputDocument (reference to generated PDF or its storage). The first release of GlobalPDF may operate without a persistent database (stateless processing); the schema supports future extension for user accounts, session history, or audit logs. UI/UX design produced prototypes and wireframes for the main flows: upload area, language selectors, progress pipeline (extracting, translating, generating, done), and download trigger. Over twenty screen states or variations were documented to cover success, loading, and error scenarios. Security design addressed role-based access control (RBAC) for any future admin or user roles, secure handling of API keys via environment variables, validation and sanitisation of input (file type, size, language codes), and use of HTTPS in production. Deliverables for this phase included the System Design Document (SDD) and the database schema (where applicable).

### Phase 4: Implementation (Weeks 9–14)

Implementation was organised into three Agile sprints of two weeks each. The technology stack comprised: Frontend—React with Next.js (App Router), Tailwind CSS for styling, and optional Framer Motion for animations; Backend—Node.js with Express, TypeScript, and service-based modules for extraction, translation, and PDF building; Database—optional MongoDB or MySQL (or equivalent) for future user or history features; and Translation API integration via the Google Translate API with chunking and error handling as specified in the SRS. Practices adopted included Git branching (e.g., main, develop, feature branches), daily or periodic standups, and code review where team size permitted. Table 8.1 summarises the focus areas for each sprint.

Table 8.1 Sprint focus areas

| Sprint | Weeks | Focus Areas |
|--------|--------|-------------|
| Sprint 1 | 9–10 | Core pipeline: upload endpoint, extraction service, translation service, PDF builder service; basic API contract and error handling |
| Sprint 2 | 11–12 | Frontend integration: upload UI, language selection, API call, PDF download; progress indicator; validation and error messages |
| Sprint 3 | 13–14 | UI refinement, responsiveness, accessibility improvements; optimisation (chunking, font handling); documentation and deployment preparation |

The milestone at the end of Phase 4 was a feature-complete build: the full flow from upload to translated PDF download was functional, with tests passing and documentation updated.

### Phase 5: Testing (Weeks 15–17)

Testing was conducted at multiple levels to ensure quality and readiness for deployment. Table 8.2 summarises the test types, scope, tools, and exit criteria.

Table 8.2 Testing scope and exit criteria

| Test Type | Scope | Tools | Exit Criteria |
|-----------|--------|--------|----------------|
| Unit | Service and utility functions (extraction, chunking, translation client, PDF generation) | Jest | 85% code coverage; all critical paths covered |
| Integration | API endpoints with extraction, translation, and PDF builder; request/response and error paths | Postman, automated scripts | 100% of defined scenarios pass |
| System | End-to-end workflow: upload PDF, select languages, receive translated PDF; error cases | Manual testing, optionally Selenium or Playwright | 95% of test cases pass |
| User Acceptance (UAT) | Real users performing typical tasks; feedback on usability and correctness | Manual execution, feedback forms | 90% approval or satisfaction |
| Security | Vulnerability scan; input validation; API key handling; HTTPS | OWASP ZAP, manual review | Zero critical vulnerabilities; no exposed secrets |

Defects found during testing were logged, prioritised, and resolved before the deployment phase. Test results and coverage reports were retained as evidence of quality.

### Phase 6: Deployment (Week 18)

Deployment established the live production system. The frontend was deployed to a cloud platform such as Vercel, and the backend to Render, AWS, or an equivalent service, in line with Chapter 4. Environment variables (e.g., GOOGLE_TRANSLATE_API_KEY, NEXT_PUBLIC_API_URL) were configured securely on the deployment platform. A CI/CD pipeline (e.g., GitHub Actions or GitLab CI) was used to run tests and deploy on successful build where applicable. A rollback strategy was defined: previous image or revision could be redeployed if a critical issue was discovered post-release. The deliverable for this phase was a live, accessible production system with monitoring in place.

### Phase 7: Maintenance (Week 19 and Beyond)

The maintenance phase ensures ongoing reliability and evolution of the system. Bug fixes were handled with a defined response time (e.g., critical issues within 48 hours where feasible). Monitoring targeted uptime of at least 98% and response time under two seconds for the translation request under normal load. Feature upgrades (e.g., additional languages, batch translation, OCR) were planned as separate iterations or releases, with requirements and design updates as needed. A backup strategy for configuration and, if applicable, database or logs was documented to support recovery in case of failure. The maintenance phase continues for the operational life of the system and supports long-term sustainability.

---

## 8.3 Hybrid Waterfall-Agile Benefits for GlobalPDF

The hybrid model brings together the strengths of Waterfall and Agile in a way that fits the GlobalPDF context. Table 8.3 summarises how each Waterfall aspect is complemented by an Agile addition and the resulting benefit.

Table 8.3 Hybrid Waterfall-Agile benefits for GlobalPDF

| Waterfall Aspect | Agile Addition | Benefit to GlobalPDF |
|------------------|-----------------|------------------------|
| Sequential phases with clear milestones | Short sprints and frequent demos within implementation and testing | Backend and API design stay stable; UI and UX can evolve based on feedback without undermining the pipeline |
| Upfront requirements and design | Backlog refinement and reprioritisation during sprints | Scope is controlled; new ideas (e.g., progress UI) can be incorporated without abandoning the SRS |
| Documented architecture and API contract | Iterative integration and end-to-end validation each sprint | Integration issues are found early; translation and PDF generation are validated incrementally |
| Defined test and deployment criteria | Continuous testing and optional CI/CD | Quality is maintained; deployment is repeatable and auditable |
| Risk identification in planning | Risk review and adaptation in sprint retrospectives | API dependency, performance, and security are revisited and mitigated as the project progresses |

---

## 8.4 Risk Management Across SDLC

Risks were identified and mitigated across the lifecycle. Table 8.4 maps each phase to representative risks and mitigation strategies.

Table 8.4 Phase-wise risk and mitigation

| Phase | Representative Risks | Mitigation |
|-------|----------------------|------------|
| Planning | Unclear scope; unrealistic timeline | Feasibility study; defined scope and exclusions; sign-off on plan |
| Requirements Analysis | Incomplete or conflicting requirements | Multiple elicitation methods; prioritisation (MoSCoW); traceability matrix; stakeholder approval |
| System Design | Over- or under-design; security gaps | Review of SDD; security checklist; alignment with SRS and architecture |
| Implementation | Scope creep; integration failures; API instability | Sprint discipline; early integration; fallback or error handling for API; code review |
| Testing | Insufficient coverage; late defect discovery | Test plan with exit criteria; automated tests; UAT with real users |
| Deployment | Configuration errors; downtime | Environment checklist; rollback procedure; staged or canary rollout if needed |
| Maintenance | Unmonitored failures; technical debt | Monitoring and alerting; documented backup; planned refactoring or upgrade cycles |

---

## 8.5 Conclusion

This chapter has described the System Development Life Cycle adopted for GlobalPDF. The twenty-week lifecycle, organised into seven phases from planning through maintenance, provides a structured yet flexible path from problem identification to a deployed, maintainable system. The hybrid Waterfall-Agile model supports upfront analysis and design for the backend and API while allowing iterative refinement of the frontend and user experience. Measurable outcomes include risk reduction through phased validation, reduced rework through clear requirements and design artefacts, and iterative improvement through sprint-based delivery and testing. The combination of unit, integration, system, UAT, and security testing ensures that the system meets quality and security targets before and after deployment. With a defined deployment approach (e.g., Vercel and Render or AWS), environment configuration, and rollback strategy, and with maintenance focused on uptime, response time, and incremental feature upgrades, GlobalPDF is positioned for sustained operation and long-term maintenance. The SDLC as applied here is consistent with the requirements and system analysis described in earlier chapters and provides a repeatable, academically sound framework for the development of the web-based multilingual PDF translation system.

________________________________________

This chapter has presented the SDLC phases, activities, and deliverables for GlobalPDF. The next chapter may address system design in greater detail, implementation highlights, or testing and deployment results.
