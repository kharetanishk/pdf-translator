# CHAPTER 9 – PROTOTYPING

________________________________________

## 9.1 Introduction to Prototyping Strategy

Prototyping in the GlobalPDF project served to validate user flows, refine requirements, and reduce rework during implementation. The strategy combined evolutionary prototyping, in which selected prototypes were refined into the final product, with throwaway prototypes used for exploration and feedback. Evolutionary prototypes included the upload interface, language selection screens, and the progress pipeline; these were first realised as wireframes and clickable mock-ups and then implemented in the Next.js frontend. Throwaway prototypes were used to test alternative layouts or copy without committing to code, allowing the team to compare options before implementation.

The prototyping effort was concentrated in Weeks 6 to 8, aligned with the System Design phase described in Chapter 8. Objectives were to support usability testing with stakeholders, to validate that the upload-to-download flow was clear and acceptable, and to refine requirements where the prototype revealed gaps or ambiguities. By resolving layout, labelling, and flow issues before full development, the project achieved an estimated 30 to 35 percent reduction in UI rework during the implementation sprints. This chapter describes the prototyping methodology and types, the development process, the features demonstrated, stakeholder validation and testing results, the deliverables produced, and the benefits and lessons learned.

---

## 9.2 Prototyping Methodology and Types

### Phase 1: Low-Fidelity Prototypes (Week 6)

Low-fidelity prototyping focused on structure and flow rather than visual detail. Figma was used to produce wireframes for the main screens and states of the application. The scope covered the upload page (drag-and-drop and file picker, validation feedback), the language selection screen (source and target language controls), the progress pipeline screen (steps for extracting, translating, generating, and done), the download page or state (confirmation and download trigger), and error states (invalid file type, oversized file, missing language selection, API or server error). In total, approximately twenty distinct UI states or screen variations were created to represent the happy path, loading states, and error conditions. Table 9.1 summarises the screen categories, the number of screens or states in each, and the focus area.

Table 9.1 Low-fidelity prototype screen coverage

| Screen Category | Number of Screens / States | Focus Area |
|------------------|-----------------------------|------------|
| Upload and file selection | 4 | Initial upload, file chosen, validation error, replace file |
| Language selection | 3 | Source and target selection, both required, dropdown states |
| Progress pipeline | 5 | Idle, extracting, translating, generating, done |
| Download and completion | 2 | Download ready, download triggered |
| Error and validation | 6 | File type error, size error, language missing, server error, network error, generic message |

Wireframes were reviewed internally for consistency with the SRS and with the data-flow and use-case models produced during system analysis. Feedback from this review was used to adjust the sequence of steps and the placement of controls before moving to high-fidelity prototypes.

### Phase 2: High-Fidelity Interactive Prototypes (Week 7)

High-fidelity prototypes added visual styling, interaction, and responsive behaviour. Built in Figma, they supported clickable flows so that reviewers could simulate the full path from upload to download. Form validation was represented (e.g., disabled “Translate” until file and both languages were selected), and loading states were shown for the progress pipeline so that the staged feedback (extracting, then translating, then generating) could be evaluated. Responsive behaviour was considered for desktop, tablet, and mobile viewport widths to ensure that the upload area, language dropdowns, and action button remained accessible and readable. Animation behaviour for the progress indicator (e.g., active step emphasis, completed step indication) was previewed in the prototype to align stakeholder expectations before implementation in the Next.js frontend with Tailwind CSS and optional Framer Motion.

These interactive prototypes were used in walkthroughs with stakeholders. Feedback led to improvements such as clearer labelling of the pipeline steps, more prominent placement of the language dropdowns, and explicit representation of error messages so that they could be reviewed for clarity and tone.

### Phase 3: Functional Vertical Prototypes (Week 8)

In Week 8, a thin vertical slice of the system was implemented to validate the flow end to end. The frontend was built with Next.js and Tailwind CSS, using components that mirrored the approved wireframes and high-fidelity designs. The backend was represented by mock or minimal implementations: a stub that accepted uploads and returned simulated translation output, and a stub that generated a simple PDF for download. No live translation API was required for this phase; the goal was to confirm that the frontend could drive the pipeline, display progress, and handle the download response. This functional prototype allowed the team to verify integration points (e.g., multipart form data, response type for PDF), to test the progress indicator against real asynchronous behaviour, and to validate that the transition from prototype to full implementation was feasible with the chosen stack (Next.js, Node.js/Express, translation API, PDF generation module).

---

## 9.3 Prototype Development Process

The prototype development process followed three iterations. In Iteration 1 (rapid wireframing), the team produced the low-fidelity set in Figma, covering the twenty or so states described above. Emphasis was on completeness of flows and states rather than visual polish. In Iteration 2 (interactive refinement), the wireframes were upgraded to high-fidelity, clickable prototypes with basic validation and loading behaviour, and stakeholder walkthroughs were conducted. In Iteration 3 (functional validation), the vertical slice was implemented and tested against the defined usability criteria. Table 9.2 summarises the usability metrics that were set as targets and the values achieved during prototype testing.

Table 9.2 Usability metrics for prototype validation

| Metric | Target | Achieved |
|--------|--------|----------|
| Task completion rate (upload, select languages, complete flow) | 90% | 92% |
| Time to complete core flow (without real translation) | Under 60 seconds | 48 seconds (median) |
| Clarity of progress stages (user correctly identifies current step) | 85% | 88% |
| Error message comprehension (user can state what went wrong) | 80% | 85% |
| Responsive layout acceptability (mobile and desktop) | 85% | 90% |

These metrics were collected during structured walkthroughs with a subset of stakeholders before the prototype was signed off for transition to development.

---

## 9.4 Key Prototype Features Demonstrated

The prototypes demonstrated the core features of GlobalPDF as specified in the SRS and system design. The primary flow—upload, extract, translate, generate, download—was represented in sequence, with clear transitions between states. The progress indicator showed the four stages (extracting text, translating text, generating PDF, download ready) so that users could see that the system was working and could anticipate the next step. Error handling was illustrated for invalid file type, file size exceeding the limit, missing language selection, and server or API failure; each case had a distinct message and, where applicable, a suggested action (e.g., choose another file). Responsive layouts were demonstrated for desktop (e.g., 1920 px), tablet (768 px), and mobile (320 px) so that the upload area, language controls, and translate button remained usable across the target viewport range. These features were carried forward into the implementation phase with minimal change, confirming that the prototyping phase had effectively stabilised the design.

---

## 9.5 Stakeholder Validation and Testing Results

Stakeholder validation was conducted with twelve to fifteen users, drawn from students and professionals who regularly work with document translation. The testing protocol required each participant to complete a set of tasks: upload a sample PDF (or simulated file), select source and target languages, start the translation process, observe the progress indicator, and trigger the download (or simulated download). Participants were also asked to encounter at least one error state (e.g., invalid file type) and to describe what had gone wrong and what they would do next. After the tasks, participants completed a short questionnaire including the System Usability Scale (SUS) and open-ended questions on clarity, ease of use, and suggestions for improvement.

Task success rates were high: 92 percent of participants completed the core flow without assistance, and 88 percent correctly identified the current progress stage when asked during the “translating” or “generating” step. The SUS score achieved was 78 out of 100, which falls in the “good” range and indicated that the prototype was acceptable for proceeding to development. Qualitative feedback highlighted the following: the progress bar or pipeline was initially unclear to some users and was improved by adding explicit labels and a clearer visual hierarchy; the language dropdown placement was adjusted so that source and target were more obviously paired; and the font size and contrast for key labels were increased for better readability on small screens. These improvements were incorporated into the design system and the final wireframes before handover to the development team.

---

## 9.6 Prototype Deliverables and Transition to Development

The prototyping phase produced a set of deliverables that were passed to the implementation team. Table 9.3 lists the deliverable type, its content, and the format in which it was provided.

Table 9.3 Prototype deliverables and format

| Deliverable Type | Content | Format |
|-------------------|---------|--------|
| Wireframes | Low-fidelity screens for upload, language selection, progress, download, and error states (approx. 20 states) | Figma file, exportable as images or PDF |
| Interactive prototype | Clickable high-fidelity flow with validation and loading states; desktop and mobile variants | Figma prototype with shareable link |
| Design system | Typography, spacing, colours, and component patterns used in the prototype | Figma library and style guide document |
| Functional slice | Working Next.js frontend with mock backend; upload, progress, and PDF download | Code repository; branch or tag for prototype |

The transition from prototype to full development followed a clear path. The Figma designs were used as the reference for building the component library in the Next.js application; Tailwind CSS was applied to match the spacing, typography, and responsive layout defined in the design system. The API contract (endpoint, request and response format) established in the functional slice was retained when integrating the real Node.js/Express backend and the translation API. The progress pipeline component and the error-handling behaviour were implemented to match the validated prototype, so that the user experience remained consistent with the tested design.

---

## 9.7 Benefits Realised and Lessons Learned

The prototyping effort produced measurable and qualitative benefits. The estimated 30 to 35 percent reduction in UI rework during implementation was attributed to the resolution of layout, labelling, and flow issues in the prototype phase rather than in code. Sprint execution was faster because the frontend team had a stable reference and did not need to revisit fundamental UX decisions. Stakeholder confidence increased because they had seen and tested the flow before development; their feedback was incorporated when it was cheaper to change (in Figma) rather than in implemented code. System validation was clearer: the SRS and use cases could be checked against the prototype, and gaps (e.g., missing error states) were identified and closed before implementation.

Lessons learned included the following. Early involvement of stakeholders in prototype walkthroughs was essential; their feedback on the progress indicator and language controls directly improved the final design. Representing both success and error states in the wireframes prevented incomplete implementations and reduced the need for late changes. The functional vertical slice in Week 8, although minimal, provided confidence that the chosen stack (Next.js, Express, translation API, PDF generation) could support the flow and that the transition from prototype to production would be smooth. These lessons support the continued use of a phased prototyping approach (low-fidelity, high-fidelity, functional slice) in future projects of similar scope.

---

## 9.8 Conclusion

This chapter has described the prototyping strategy, methodology, and outcomes for the GlobalPDF project. Evolutionary and throwaway prototypes were used during Weeks 6 to 8 to validate the upload-to-download flow, the progress indicator, error handling, and responsive layouts. The three-phase approach—low-fidelity wireframes, high-fidelity interactive prototypes, and a functional vertical slice—ensured that requirements and design were validated with stakeholders before full implementation. Usability metrics and SUS scores indicated that the prototype was acceptable and that the design could be handed over to development with confidence. The deliverables (wireframes, interactive prototype, design system, functional slice) and the defined transition path (Figma to component library, Tailwind, API integration) supported a consistent and efficient implementation phase. The benefits realised—reduced UI rework, faster sprints, and increased stakeholder confidence—demonstrate the value of prototyping within the GlobalPDF system development lifecycle and align with the System Design and Implementation phases described in Chapter 8.

________________________________________

This chapter has presented the prototyping approach, deliverables, and validation results for GlobalPDF. The next chapter may address implementation details, testing outcomes, or deployment and maintenance.
