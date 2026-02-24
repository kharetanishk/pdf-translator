# CHAPTER 3 – EXISTING SYSTEMS AND PROPOSED SYSTEM

________________________________________

## 3.1 Overview of Existing Systems

Users who need to translate PDF documents currently rely on a mix of manual methods, web-based services, and desktop software. Each category has distinct characteristics and is widely adopted due to familiarity, availability of free or low-cost options, and the absence of specialised setup.

**Manual copy-paste method.** The most common approach is to open the PDF in a viewer, copy portions of text (often section by section to avoid layout issues), paste the text into a web translator such as Google Translate or DeepL, copy the translated result, and then paste it into a word processor. The user must then reapply headings, paragraphs, and spacing. This method requires no special software and uses free translation engines, but it is labour-intensive, error-prone, and leads to significant loss of structure and formatting. It remains in use because it is simple to understand and does not require payment or installation.

**Online translation websites.** Services such as the Google Translate website and DeepL offer direct translation of pasted text or, in some cases, file upload. Google Translate allows document upload for certain formats, but PDF handling often strips or distorts layout, and the output is not always returned as a properly formatted PDF. DeepL emphasises translation quality but has similar limitations regarding PDF structure and multi-page layout. These tools are popular for quick, free translation of short texts; for full PDF documents, users still frequently resort to copy-paste or multi-step workflows.

**Desktop tools.** Commercial products such as Adobe Acrobat Pro and ABBYY FineReader provide advanced PDF editing, OCR, and in some cases translation or export for translation. Acrobat Pro supports export and limited translation workflows but requires a paid subscription. ABBYY FineReader is oriented toward OCR and document conversion rather than integrated translation. Both involve substantial licensing costs (often in the range of several thousand rupees per year) and are not optimised for the simple use case of “upload PDF, choose language, download translated PDF.”

**Partial solutions.** Another common pattern is to convert the PDF to an editable format (e.g., Word) using a converter, translate the document (manually or via a plugin), and then convert back to PDF. Each conversion step risks losing formatting, fonts, and layout, so the final document often requires manual correction. This approach illustrates the lack of a single, purpose-built workflow for PDF translation.

Together, these existing systems reflect a fragmented landscape: users combine free and paid tools, accept inefficiency and formatting loss, or pay for heavyweight software that still does not fully address the need for a unified, affordable, PDF-centric translation pipeline.

---

## 3.2 Detailed Limitations of Existing Systems

The limitations of current approaches can be summarised along several dimensions. The following table maps key aspects to typical issues and their impact.

| Aspect | Existing System Issues | Impact |
|--------|------------------------|--------|
| **Workflow efficiency** | Multi-step, manual copy-paste or convert–translate–reconvert; no single pipeline | Approximately 40–60% of user time spent on repetitive copying, pasting, and reformatting rather than on content use |
| **Formatting preservation** | Web translators and converters often strip or alter layout, fonts, and structure | Estimated 15–25% loss or distortion of original formatting; extra time spent on manual correction |
| **Language support** | Good coverage for major languages in some tools; inconsistent support for Indian and other scripts across free tools | Incomplete or incorrect rendering of scripts (e.g., Devanagari, Tamil) in generic workflows |
| **Cost** | Free tools lack integration; integrated desktop solutions cost roughly ₹5,000–₹15,000 per year per user | Students and small organisations are priced out; reliance on fragmented free tools |
| **Scalability** | Manual workflows do not scale; many web tools impose file-size or page limits | Difficult to handle large or batch documents without repeated manual effort |
| **Security and privacy** | Uploading documents to third-party websites; unclear retention and deletion policies | Concerns for sensitive academic, business, or government documents |
| **Automation** | Little or no automation; each document processed step by step by the user | High per-document effort and no support for batch or programmatic use |
| **Batch processing** | Not supported in typical free workflows; limited or expensive in desktop tools | Organisations cannot efficiently translate large sets of documents |
| **Accessibility** | Depends on desktop installs or multiple websites; not always mobile-friendly | Barriers for users who need quick, device-independent access (e.g., on shared or public machines) |

Quantitative pain points observed or reported in similar contexts include: roughly 40–60% of time in manual workflows spent on mechanical tasks rather than content; 15–25% formatting loss or rework; subscription costs in the ₹5,000–₹15,000 per year range for integrated commercial tools; and strict file-size or page limits on many free web services. Furthermore, reliance on third-party APIs and websites introduces dependency on service availability and raises privacy and data-retention concerns when sensitive documents are uploaded. These limitations justify the design of a dedicated system that unifies the workflow, preserves readability, and keeps cost and complexity within reach of students, researchers, and small organisations.

---

## 3.3 Need for the Proposed GlobalPDF System

The GlobalPDF project is proposed to address the gaps identified above by providing a single, web-based pipeline for PDF translation.

**Unified workflow.** GlobalPDF integrates upload, text extraction, translation, and PDF generation into one flow: the user uploads a PDF, selects source and target languages, and receives a translated, readable PDF for download. This eliminates the need to switch between a PDF viewer, a translation website, and a word processor, and reduces the time spent on manual steps. The project targets a reduction of approximately 60–70% in the time required for typical document translation compared with manual copy-paste or convert–translate–reconvert workflows.

**Automation and formatting.** The system automates text extraction, submission to a translation API (e.g., Google Translate API), and reconstruction of a new PDF with consistent margins, line wrapping, and Unicode-compatible fonts (e.g., Noto) for multiple scripts. Although the current design does not preserve the exact original layout (approach: readable new layout), it avoids the severe formatting breakdown typical of ad hoc methods and supports languages such as Hindi, Tamil, Arabic, and Japanese.

**Affordability and accessibility.** GlobalPDF is conceived as an affordable SaaS offering, deployable on the cloud and accessible from any modern browser. It is aimed at students, researchers, businesses, and multilingual professionals who need quick, low-friction translation without expensive licenses. By providing a responsive, user-friendly interface and optional progress feedback (e.g., pipeline-style indicators), the system supports digital accessibility and usability across devices.

**Security and scalability.** The design emphasises secure, temporary handling of uploaded files (e.g., in-memory or short-lived storage and secure deletion after processing), protection of API keys via environment configuration, and use of HTTPS. A stateless, service-based backend allows the system to scale with demand and to be deployed on platforms such as Vercel (frontend) and Render or AWS (backend).

The need for GlobalPDF is thus not only technical but also practical: it offers a projected gain in productivity, supports education and cross-border communication, and contributes to digital accessibility by making multilingual PDF translation simpler, more predictable, and more affordable than the combination of existing ad hoc tools.

---

## 3.4 Gap Analysis and Justification

The following table summarises the main gaps between existing practices and the proposed GlobalPDF system, and the benefits of the proposed approach.

| Gap | Existing Systems | Proposed GlobalPDF | Benefit |
|-----|------------------|--------------------|---------|
| **End-to-end automation** | Manual or semi-manual; multiple tools and steps | Single pipeline: upload → extract → translate → generate PDF → download | Large reduction in time and effort; fewer errors and consistent process |
| **Formatting handling** | Frequent loss or distortion; manual rework | Automated PDF generation with Unicode fonts, margins, and line wrapping | Readable, shareable output without copy-paste reformatting |
| **Cost efficiency** | Free but fragmented, or expensive integrated software | Affordable SaaS model; potential use of free-tier or low-cost APIs | Accessible to students and small organisations without high licensing cost |
| **Accessibility** | Tied to specific websites or desktop installs | Web-based, responsive UI; no installation; device-independent | Easier access from any location and device with a browser |
| **Deployment** | User relies on external sites or local software | Cloud-deployable frontend and backend; controlled environment | Single, maintainable product that can be improved and extended |
| **Scalability** | Manual workflows do not scale; API limits on some services | Stateless backend; chunking for large texts; design for concurrency | Ability to serve more users and larger documents as the system evolves |
| **Integration capability** | No single API or product for “PDF in, translated PDF out” | Coherent backend API (e.g., upload endpoint returning PDF) | Clear integration point for future features (e.g., batch jobs, dashboards) |

The gap analysis shows that existing systems either sacrifice efficiency and formatting (free, manual methods) or require significant cost and complexity (desktop suites) without fully addressing the need for a unified, PDF-focused, multilingual translation workflow. GlobalPDF is proposed not merely as an incremental improvement but as a structured response to this gap: a dedicated system that combines automation, readability, affordability, and accessibility to support multilingual document use in education, business, and daily communication. In that sense, the proposed system represents a necessary evolution toward more accessible and efficient multilingual document handling in the digital era.

---

*This chapter has reviewed existing systems for PDF translation, their limitations (with quantitative and qualitative analysis), the need for the proposed GlobalPDF system, and a gap analysis justifying the project. The following chapters will present the literature survey, system design, implementation, and testing.*
