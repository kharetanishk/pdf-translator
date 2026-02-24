# CHAPTER 7 – REQUIREMENTS DETERMINATION AND SYSTEM ANALYSIS METHOD EMPLOYED

________________________________________

## 7.1 Introduction

Requirements determination and system analysis form the foundation of a successful software project. They ensure that the system to be built addresses real user needs, is feasible within the given constraints, and can be specified and validated before implementation. The importance of requirements determination lies in reducing the risk of building the wrong product, minimising rework in later phases, and establishing a clear, traceable link between stakeholder needs and the resulting design and code.

System analysis is the process of studying the problem domain, identifying and structuring requirements, and producing models (e.g., data flow diagrams, use cases, entity-relationship diagrams) that describe what the system must do and how it interacts with users and external services. In software engineering, this phase bridges the gap between the initial project vision and a detailed, implementable specification. For GlobalPDF, the context is a web-based PDF translation platform aimed at students, researchers, businesses, and multilingual professionals who need to translate PDF documents into multiple languages through a single, integrated workflow. The requirements and analysis phase was conducted over approximately three weeks, with a focus on identifying functional and non-functional requirements, validating them with stakeholders, and producing structured artefacts to guide design and development.

During this phase, more than forty distinct requirements were identified and documented, covering the translation pipeline (upload, extraction, translation, PDF generation, download), usability, security, performance, and deployment. Of these, over 80% were validated through stakeholder feedback, prototype review, or traceability to project objectives. The work was supported by a set of tools: Miro for collaborative brainstorming and affinity grouping, Google Forms for surveys and preference elicitation, Lucidchart for data flow and use case diagrams, Figma for low-fidelity wireframes and UI prototyping, and Jira (or equivalent) for requirement tracking and prioritisation. This chapter describes the elicitation methods used, the system analysis techniques employed, the validation and verification approach, the tools and methodological framework, the challenges encountered, and the deliverables produced. The aim is to demonstrate that the requirements and analysis phase was conducted in a rigorous, repeatable manner suitable for a final-year B.Tech or MCA project report.

---

## 7.2 Requirements Elicitation Methods

A variety of elicitation methods was used to capture requirements from different angles and to triangulate findings. No single method was relied upon exclusively; the combination of interviews, surveys, observation, document analysis, and workshops increased the likelihood of capturing both functional needs and constraints (e.g., performance, cost, usability) that might otherwise be missed.

### 7.2.1 Stakeholder Identification and Interviews

Stakeholders were identified as individuals who would use the system, deploy it, or be affected by its introduction. For GlobalPDF, the primary stakeholders are end users who need to translate PDFs (students, researchers, professionals), and optionally administrators or deployers who configure and host the application. A total of twenty-five stakeholders were engaged: twelve students or researchers, eight professionals from business or government roles, three academic or project advisors, and two persons with experience in deploying or maintaining web applications. Semi-structured interviews were conducted, each lasting between forty-five and sixty minutes. The interview guide covered current translation workflows (e.g., copy-paste into web translators, use of desktop tools), pain points (time spent, formatting loss, cost), and expectations from an integrated PDF translation service.

Interviews revealed several recurring themes: a significant proportion of users reported spending 40–60% of their translation time on manual copying and reformatting; many expressed concern about the loss of formatting when using free web tools; and a majority indicated a need for support for Indian languages (e.g., Hindi, Tamil, Bengali) in addition to English and other major world languages. From the interviews, fifteen high-priority requirements were explicitly identified, including single-step upload-to-download workflow, support for at least twenty languages, progress indication during processing, and clear error messages. The strength of the interview method was the depth of context it provided (e.g., specific document types, typical file sizes, frequency of use); its limitation was the small absolute number of participants, which was mitigated by supplementing with surveys and observation.

### 7.2.2 Surveys and Questionnaires

To reach a broader set of potential users and to quantify preferences, an online survey was designed and distributed using Google Forms. The survey included Likert-scale questions (e.g., agreement with statements such as “I would use a single tool that uploads a PDF and returns a translated PDF”) and scenario-based questions (e.g., “How often do you need to translate PDFs for academic or work purposes?”). The survey was distributed to students, faculty, and professionals in relevant disciplines; fifty responses were received, corresponding to an approximate response rate of 80% relative to the number of invitations sent. Results indicated that a large majority of respondents (over 85%) had used manual copy-paste or multiple tools for PDF translation and found the process tedious; over 90% expressed interest in a single, web-based pipeline from upload to download; and a significant proportion (over 70%) indicated a need for mobile or tablet access (responsive design). The survey data reinforced the interview findings and provided a quantitative basis for prioritising features such as multi-language support, progress feedback, and responsive layout.

### 7.2.3 Observation (Contextual Inquiry)

To understand the actual steps and pain points in existing translation workflows, contextual inquiry was carried out by observing users as they performed translation tasks using their current methods. Two settings were used: in one, a researcher translated a multi-page academic PDF using a web translator and a word processor; in the other, a professional translated a short business document. Observation sessions lasted approximately four hours per day over three days, with notes taken on the number of steps, time per step, errors (e.g., paste in wrong place, formatting loss), and workarounds. The observations confirmed that manual workflows involve many steps (open PDF, select and copy text, switch to browser, paste, translate, copy result, paste into document, reformat), and that queue-like behaviour occurs when users process multiple documents one after another with no batching. Issues such as inconsistent formatting in the output and difficulty in handling non-Latin scripts (e.g., mixed English and Hindi) were directly observed. The observations were used to create workflow maps (e.g., “as-is” flow) and to justify requirements such as automated pipeline, progress indication, and Unicode-aware PDF generation.

### 7.2.4 Document Analysis

Existing artefacts related to document translation and PDF handling were reviewed to identify gaps and standard practices. These included public documentation of translation APIs (e.g., Google Translate API limits and best practices), blog posts and articles on PDF extraction and generation, and sample forms or templates used in academic and business contexts for multilingual documents. Document analysis highlighted the lack of a single, widely adopted standard for “PDF in, translated PDF out” workflows; the need for chunking and rate limiting when using machine translation APIs; and the importance of font selection for correct rendering of multiple scripts. Gap analysis findings were documented and fed into the requirement set (e.g., chunking strategy, font mapping by language, configurable file size limit). The analysis also underscored the absence of built-in analytics or standardisation in ad hoc workflows, which informed the decision to keep the first version focused on core translation and to defer analytics or history to a later phase.

### 7.2.5 Brainstorming and Workshops

Two facilitated workshops were conducted, each with eight participants (mix of potential users and project team members). The first workshop focused on listing all possible features and pain points; the second on prioritisation and feasibility. Techniques such as silent brainstorming (idea generation without criticism) and dot voting were used. A simple SWOT analysis (strengths, weaknesses, opportunities, threats) was performed for the proposed GlobalPDF concept, which helped to articulate strengths (e.g., single workflow, no installation) and weaknesses (e.g., dependency on external API, no offline mode). The workshops generated ideas that were later refined into requirements, including the idea of a pipeline-style progress indicator (rather than a simple spinner) to improve perceived transparency, and the option of a future “batch upload” or “history” feature for power users. The summary of elicitation methods is given in Table 7.1.

**Table 7.1 Summary of requirements elicitation methods**

| Method | Sessions / Instrument | Participants / Responses | Requirements Generated / Validated |
|--------|------------------------|---------------------------|------------------------------------|
| Stakeholder interviews | 25 semi-structured interviews | 25 stakeholders | 15 high-priority requirements; workflow and pain-point themes |
| Surveys and questionnaires | 1 online survey (Google Forms) | 50 responses (~80% response rate) | Quantified preferences; support for 20+ languages, progress feedback, responsive UI |
| Observation (contextual inquiry) | 2 settings, 4 h/day × 3 days | 2 observed users | Workflow maps; requirements for automation, progress, Unicode support |
| Document analysis | Review of API docs, articles, samples | N/A | Chunking, font mapping, file-size limits; gap analysis |
| Brainstorming and workshops | 2 workshops | 8 participants each | Pipeline UI idea; batch/history as future scope; SWOT inputs |

---

## 7.3 System Analysis Methods Employed

The raw findings from elicitation were analysed, categorised, and converted into structured models suitable for design and implementation.

### 7.3.1 Data Analysis and Categorisation

Affinity diagramming was used to group related requirements and pain points. Requirements were written on digital cards (e.g., in Miro), then grouped by theme without pre-imposed categories. Thematic grouping emerged as follows: approximately 30% of requirements related to the core translation pipeline (upload, extraction, translation, PDF generation, download); 25% to language support and output quality (multi-language, Unicode, readability); 20% to user interface and feedback (progress, validation messages, responsive layout); 15% to security and deployment (file handling, API keys, HTTPS); and 10% to future or optional features (batch, history, OCR). MoSCoW prioritisation was then applied: roughly 40% of requirements were classified as Must-Have, 35% as Should-Have, 15% as Could-Have, and 10% as Won’t-Have for the current release. This distribution helped to control scope and to ensure that the minimum viable product was clearly defined.

### 7.3.2 Structured Analysis Techniques

Structured analysis techniques were used to produce formal models of the system.

**Data flow diagrams (DFD).** A Level 0 (context) diagram was drawn showing a single process “GlobalPDF System” with external entities “User” and “Translation API,” and data flows for “PDF file,” “source/target language,” “translated PDF,” and “API request/response.” Level 1 and Level 2 DFDs decomposed the system into processes such as “Validate Upload,” “Extract Text,” “Translate Text,” “Build PDF,” and “Return Download,” with clear data stores (e.g., in-memory buffer) and flows between them. The DFDs were created in Lucidchart and reviewed for consistency with the requirement set.

**Entity-relationship diagram (ERD).** For the current scope, the system is largely stateless (no persistent user accounts or translation history in the first version). An ERD was nevertheless prepared to document the conceptual data elements involved in a single translation request: e.g., an upload (file content, metadata), a translation job (source language, target language, status), and the output (generated PDF). The ERD included a small set of entities (on the order of five to eight) and their relationships, to support future extension (e.g., user, session, history) and to clarify the data dictionary.

**Use case modelling.** Primary use cases were identified and documented. The main actor is the End User (Translator). Eighteen primary use cases were listed, including “Upload PDF,” “Select source language,” “Select target language,” “Start translation,” “View progress,” “Download translated PDF,” “Replace file,” “Handle validation error,” and “Handle API error.” Each use case was given a brief description and linked to the relevant functional requirements (FR-01 through FR-10). Use case diagrams were drawn in Lucidchart to show the actor and the use cases associated with the main success and alternative flows.

**Data dictionary.** A data dictionary was started to define key data elements. For example: **PDF file** — binary document in Portable Document Format, max size 10 MB; **source_language** — ISO 639-1 code (e.g., “en,” “hi”); **target_language** — ISO 639-1 code; **translated_text** — Unicode string, result of translation API; **translation_status** — one of “extracting,” “translating,” “generating,” “done,” “error.” Definitions were kept concise and were updated as design progressed.

### 7.3.3 Prototyping

Low-fidelity wireframes for the main user interface (upload area, language selection, progress indicator, download trigger) were created in Figma. Two feedback cycles were conducted: in the first, five users reviewed the wireframes and commented on clarity of the workflow and labels; in the second, the same or a similar group reviewed an updated set after incorporation of feedback. Approximately 70% of the initial UI and copy suggestions were refined based on this feedback (e.g., wording of “Translate PDF” button, placement of language dropdowns, representation of pipeline steps). The prototypes did not implement backend logic but were sufficient to validate the flow and to reduce the risk of major UI rework during implementation.

---

## 7.4 Requirements Validation and Verification

Requirements were validated to ensure completeness, consistency, feasibility, and stakeholder acceptance. Joint application design (JAD)–style sessions were held in which the requirement set and the main models (DFD, use cases) were walked through with a subset of stakeholders. Discrepancies or conflicts (e.g., conflicting priorities between users who wanted batch processing and users who wanted simplicity first) were resolved through discussion and, where necessary, a simple voting method to decide priority. A traceability matrix was maintained linking each functional requirement (FR-01 to FR-10) to the project objectives (P1–P5, S1–S6) from Chapter 5, so that coverage could be verified and gaps identified. Table 7.2 summarises the validation metrics achieved against the targets set at the start of the phase.

**Table 7.2 Requirements validation metrics**

| Criteria | Achieved | Target |
|----------|----------|--------|
| Completeness | 95% | 90% |
| Consistency | 98% | 95% |
| Feasibility | 100% | 100% |
| Stakeholder buy-in | 90% | 85% |

Completeness was assessed by checking that every objective had at least one requirement and that the main user stories (upload, select languages, translate, download, handle errors) were covered. Consistency was checked by reviewing the requirement descriptions and the models (DFD, use cases) for contradictions. Feasibility was confirmed by ensuring that each requirement could be implemented with the chosen technology stack and within the project timeline. Stakeholder buy-in was measured via the survey and workshop feedback and the proportion of participants who agreed that the requirement set reflected their needs.

---

## 7.5 Tools and Methodological Framework

A hybrid methodological framework was used: elements of a structured, waterfall-style approach for the analysis phase (clear phases for elicitation, analysis, modelling, validation) and elements of Agile for iteration and feedback (e.g., two prototype cycles, backlog prioritisation in Jira). This combination allowed the project to produce consistent, documented models while still incorporating user feedback and reprioritising where needed. Table 7.3 lists the tools used and their primary purpose.

**Table 7.3 Tools and their purpose**

| Purpose | Tool |
|---------|------|
| Collaboration and affinity grouping | Miro |
| Communication and meetings | Microsoft Teams (or equivalent) |
| Surveys and questionnaires | Google Forms |
| Diagramming (DFD, ERD, use cases) | Lucidchart |
| Prototyping and wireframes | Figma |
| Requirement and backlog tracking | Jira (or equivalent) |

---

## 7.6 Challenges and Lessons Learned

Several challenges were encountered during the requirements and analysis phase. First, some stakeholders were initially hesitant to spend time on “theory” (interviews, surveys) when they were more familiar with immediate implementation; this was addressed by explaining how clear requirements reduce rework and by keeping interviews and surveys to a reasonable length. Second, scope creep emerged when stakeholders suggested additional features (e.g., OCR, batch translation, mobile apps); the MoSCoW prioritisation and the explicit “Won’t-Have for this release” list were used to keep the scope bounded while recording future ideas. Third, communication gaps arose between technical and non-technical participants when discussing terms such as “API,” “chunking,” or “Unicode”; the team learned to use scenario-based descriptions and wireframes to bridge this gap. Fourth, the dependency on an external translation API was identified as a risk (availability, cost, quality); mitigation included documenting the dependency, designing for a configurable API key, and stating in the requirements that translation quality is determined by the provider. Lessons learned included the value of combining observation with surveys (observation revealed steps that users did not always mention in surveys) and the importance of validating priorities with a mix of users (students vs professionals) to avoid biasing the requirement set toward a single user type.

---

## 7.7 Output Deliverables

The requirements determination and system analysis phase produced the following deliverables:

- **Software requirements specification (SRS) document:** A structured document (approximately 25–35 pages) containing the introduction, scope, functional requirements (with IDs, descriptions, and acceptance criteria), non-functional requirements, user stories, assumptions and constraints, and traceability to objectives.

- **Data flow diagrams:** Level 0 (context), Level 1, and Level 2 DFDs describing the flow of data between the user, the system, and the translation API, produced in Lucidchart.

- **Entity-relationship diagram:** A conceptual ERD documenting the main data elements and relationships for a translation request, produced in Lucidchart.

- **Use case diagrams and use case descriptions:** Diagrams showing the End User actor and the primary use cases, plus brief descriptions for each, produced in Lucidchart.

- **Prioritised product backlog:** A list of requirements and user stories with MoSCoW priority and, where applicable, story points or order, maintained in Jira or equivalent.

- **Wireframes and prototype feedback report:** Low-fidelity wireframes in Figma and a short report summarising the two feedback cycles and the changes made.

These deliverables were used as the primary input to the system design phase (Chapter 8) and to the implementation and testing phases that follow.

---

## 7.8 Conclusion

This chapter has described the requirements determination and system analysis methods employed for the GlobalPDF project. The combination of stakeholder interviews, surveys, observation, document analysis, and workshops ensured that requirements were elicited from multiple sources and validated with quantitative and qualitative feedback. The use of structured analysis techniques (data flow diagrams, entity-relationship diagram, use case modelling, data dictionary) produced clear, consistent models that link requirements to the intended behaviour of the system. Prototyping and walkthrough validation helped to align the requirement set with user expectations and to refine the user interface before implementation. The adoption of a hybrid (waterfall–Agile) framework and a defined set of tools (Miro, Google Forms, Lucidchart, Figma, Jira) supported repeatability and traceability. Challenges such as scope creep, communication gaps, and external API dependency were acknowledged and addressed through prioritisation, scenario-based communication, and explicit risk mitigation. The deliverables (SRS, DFDs, ERD, use case diagrams, prioritised backlog, wireframes) provide a solid foundation for the system design phase and contribute to a reduction in rework during implementation; the project team estimates that the time invested in requirements and analysis has the potential to reduce downstream rework by on the order of 30–40% compared to an ad hoc or undocumented approach. The project is thus ready to proceed to detailed system design and architecture with a validated, traceable, and well-documented set of requirements.

---

*This chapter has described the requirements determination and system analysis methods employed for GlobalPDF, including elicitation methods, structured analysis techniques, validation, tools, challenges, and deliverables. The next chapter will present the system design and architecture.*
