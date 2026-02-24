# CHAPTER 11 – DATA FLOW DIAGRAM (DFD)

---

## 11.1 Introduction

A Data Flow Diagram (DFD) is a graphical representation of the flow of data through a system. It shows how data enters the system, how it is processed, where it is stored (if at all), and how it leaves the system. DFDs are used in structured systems analysis and design to model the logical flow of information independently of the physical implementation. For the GlobalPDF project, the DFD describes the flow of the PDF file, language parameters, extracted text, translated text, and the final PDF output through the translation pipeline.

This chapter presents the Data Flow Diagrams for GlobalPDF at three levels: the Context Diagram (Level 0), which shows the system as a single process and its interfaces with external entities; the Level 1 DFD, which decomposes the system into the major processes (validate and receive upload, extract text, translate text, build PDF, and return response); and the Level 2 DFD, which decomposes selected processes into more detailed sub-processes. The notation used follows the standard DFD conventions: processes (rounded rectangles or circles), external entities (rectangles or source/sink symbols), data stores (open rectangles or parallel lines), and directed arrows for data flows. A brief data dictionary of the principal data flows is included so that the diagrams can be interpreted and redrawn in a tool such as Lucidchart or Draw.io. The DFDs in this chapter are consistent with the architecture and module descriptions given in Chapters 7 and 10.

---

## 11.2 Notation and Conventions

The following notation is used in the Data Flow Diagrams described in this chapter.

Process. A process transforms input data into output data. It is represented as a rounded rectangle or a circle and is labelled with a short name (e.g., "1.0 Validate Upload") or a number (e.g., 1.0, 2.0). Each process has at least one incoming and one outgoing data flow.

External entity. An external entity is a source or destination of data outside the system boundary. It is represented as a rectangle or a square and is labelled (e.g., "User," "Translation API"). Data flows only between external entities and processes; external entities do not communicate directly with each other.

Data store. A data store holds data at rest. In standard DFD notation it is shown as an open rectangle or two parallel lines and is labelled (e.g., "D1 In-Memory Buffer"). In GlobalPDF, persistent data stores are minimal; temporary in-memory buffers may be shown where they clarify the flow between processes.

Data flow. A data flow is a movement of data from one element to another. It is represented as a directed arrow and is labelled with the name of the data (e.g., "PDF file," "extracted text"). Each flow connects a process to another process, to an external entity, or to a data store. Flows are named with noun phrases; process names are verb phrases.

Numbering. Processes at Level 1 are numbered 1.0, 2.0, 3.0, and so on. When a process is decomposed at Level 2, its sub-processes are numbered with the parent number and a decimal (e.g., 3.1, 3.2, 3.3 for sub-processes of process 3.0). This convention supports traceability between levels.

Table 11.1 summarises the symbols and their meaning for reference when drawing or reading the diagrams.

Table 11.1 DFD notation summary

| Symbol                          | Name            | Description                                 |
| ------------------------------- | --------------- | ------------------------------------------- |
| Rounded rectangle / Circle      | Process         | Transforms or processes data                |
| Rectangle                       | External entity | Source or destination outside the system    |
| Open rectangle / Parallel lines | Data store      | Holds data at rest (optional at this level) |
| Directed arrow                  | Data flow       | Movement of data; labelled with data name   |

---

## 11.3 Context Diagram (Level 0 DFD)

The Context Diagram represents the entire GlobalPDF system as a single process and shows its interaction with external entities. The system boundary encloses one process; all flows cross the boundary to or from external entities. There are no data stores at this level.

External entities.

User. The user is the person who uploads a PDF, selects source and target languages, and receives the translated PDF or an error message. The user interacts with the system through the web browser (frontend); from the perspective of the backend system, the "User" may be represented as the client application sending the request and receiving the response.

Translation API. The Translation API (e.g., Google Translate API) is an external service that accepts text and language parameters and returns translated text. The system sends requests to this entity and receives responses from it.

Single process.

GlobalPDF System (Process 0.0). This process represents the whole system: receipt of the upload and language parameters, extraction of text, translation, PDF generation, and delivery of the result or error.

Data flows.

From User to GlobalPDF System: PDF file (the uploaded document); source language (language code for the source language); target language (language code for the target language).

From GlobalPDF System to User: translated PDF (the generated PDF document when successful); error message (when validation or processing fails).

From GlobalPDF System to Translation API: translation request (extracted text or text chunks, source language, target language, and API key or authentication data as per the API contract).

From Translation API to GlobalPDF System: translated text (the translation result for the requested segments).

Table 11.2 lists the context-level data flows for reference.

Table 11.2 Context diagram (Level 0) data flows

| From             | To               | Data flow name      | Description                                  |
| ---------------- | ---------------- | ------------------- | -------------------------------------------- |
| User             | GlobalPDF System | PDF file            | Uploaded PDF document (binary)               |
| User             | GlobalPDF System | source language     | ISO 639-1 code (e.g., en, hi)                |
| User             | GlobalPDF System | target language     | ISO 639-1 code for desired output language   |
| GlobalPDF System | User             | translated PDF      | Generated PDF containing translated text     |
| GlobalPDF System | User             | error message       | Validation or processing error message       |
| GlobalPDF System | Translation API  | translation request | Text to translate, source/target codes, auth |
| Translation API  | GlobalPDF System | translated text     | Translated text returned by the API          |

---

## 11.4 Level 1 DFD

The Level 1 DFD decomposes the single process of the context diagram into the major processes that make up the GlobalPDF pipeline. External entities (User, Translation API) remain as in the context diagram. Data stores may be shown if they aid clarity; in the current design, data between processes is passed in memory, so optional stores such as "D1 PDF Buffer" or "D2 Extracted Text" can be shown to indicate where data is held momentarily between processes.

Processes.

1.0 Validate and Receive Upload. This process accepts the PDF file and the language parameters from the User. It validates file type (PDF only), file size (within configured limit), and presence of source and target language. If validation fails, it sends an error message to the User and does not invoke downstream processes. If validation succeeds, it passes the PDF buffer and the language parameters to process 2.0.

2.0 Extract Text. This process receives the PDF buffer from process 1.0 and uses the extraction library (e.g., unpdf) to parse the document and extract textual content. It outputs the extracted text (and optionally page count or page-wise text) to process 3.0. Empty or unreadable content is still passed as empty or minimal text; the downstream processes handle this case.

3.0 Translate Text. This process receives the extracted text and the source and target language codes from process 2.0 (and 1.0). It chunks the text if necessary, sends translation requests to the Translation API, receives translated text, and assembles the full translated text. It outputs the translated text and the target language to process 4.0. If the Translation API returns an error, this process may output an error condition to process 5.0 or back to the User via a dedicated error path.

4.0 Build PDF. This process receives the translated text and the target language from process 3.0. It selects the appropriate font (based on target language or script), generates a new PDF with margins, line wrapping, and page breaks, and produces a PDF buffer. It outputs the PDF buffer to process 5.0.

5.0 Return Response. This process receives the PDF buffer from process 4.0 (or an error from 1.0, 3.0, or 4.0). It sets the response headers (Content-Type, Content-Disposition) and sends the translated PDF to the User, or sends an error response (e.g., JSON with message) to the User.

Data flows at Level 1.

From User to 1.0: PDF file; source language; target language.

From 1.0 to 2.0: PDF buffer; source language; target language. (Alternatively, language parameters may flow from 1.0 to 3.0 directly if they are not needed by 2.0.)

From 1.0 to User: error message (validation failure).

From 2.0 to 3.0: extracted text. (Source and target language may also flow from 1.0 to 3.0.)

From 3.0 to Translation API: translation request. From Translation API to 3.0: translated text.

From 3.0 to 4.0: translated text; target language.

From 4.0 to 5.0: PDF buffer.

From 5.0 to User: translated PDF; or error message (when an error is passed from 1.0, 3.0, or 4.0 to 5.0).

Table 11.3 summarises the Level 1 processes and their inputs and outputs.

Table 11.3 Level 1 DFD processes and flows

| Process | Name                        | Main inputs                                                            | Main outputs                                                                                                        |
| ------- | --------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1.0     | Validate and Receive Upload | PDF file, source language, target language (from User)                 | PDF buffer, source language, target language (to 2.0, 3.0); error message (to User on failure)                      |
| 2.0     | Extract Text                | PDF buffer (from 1.0)                                                  | extracted text (to 3.0)                                                                                             |
| 3.0     | Translate Text              | extracted text (from 2.0), source language, target language (from 1.0) | translated text (to 4.0); translation request (to Translation API); receives translated text (from Translation API) |
| 4.0     | Build PDF                   | translated text, target language (from 3.0)                            | PDF buffer (to 5.0)                                                                                                 |
| 5.0     | Return Response             | PDF buffer (from 4.0) or error                                         | translated PDF or error message (to User)                                                                           |

---

## 11.5 Level 2 DFD

Level 2 DFDs provide a more detailed view of selected processes. Two processes are decomposed below: Validate and Receive Upload (1.0) and Translate Text (3.0). The others (Extract Text, Build PDF, Return Response) can be decomposed similarly in a full documentation set; only 1.0 and 3.0 are expanded here for illustration.

### 11.5.1 Decomposition of Process 1.0 (Validate and Receive Upload)

Process 1.0 is decomposed into the following sub-processes.

1.1 Receive Request. Accepts the multipart request from the User containing the PDF file and the form fields for source and target language. Outputs the raw file content and the raw language parameters to 1.2.

1.2 Validate File. Checks that the file is present, has the correct MIME type or extension (PDF), and does not exceed the maximum file size. Outputs a validation result (valid or invalid) and, if valid, the PDF buffer to 1.3.

1.3 Validate Language Parameters. Checks that source language and target language are present and non-empty. Outputs a validation result and, if valid, the language parameters. If either 1.2 or 1.3 fails, an error message is sent to the User (or to process 5.0 for consistent error response). If both succeed, the PDF buffer and language parameters are passed to process 2.0 and 3.0 as in the Level 1 diagram.

Data flows: From User to 1.1: PDF file, source language, target language. From 1.1 to 1.2: raw file, raw language params. From 1.2 to 1.3: PDF buffer (if valid), validation result. From 1.3 to 2.0 / 3.0: PDF buffer, source language, target language (when valid). From 1.2 or 1.3 to User (or 5.0): error message (when invalid).

### 11.5.2 Decomposition of Process 3.0 (Translate Text)

Process 3.0 is decomposed into the following sub-processes.

3.1 Chunk Text. Receives the full extracted text from process 2.0. Splits the text into segments that do not exceed the translation API character limit, preferring paragraph boundaries. Outputs a list of text chunks to 3.2.

3.2 Send Translation Request. For each chunk (or in sequence), constructs the API request with the chunk, source language, and target language, and sends it to the Translation API. Receives the translated segment from the Translation API. Outputs the translated segments to 3.3.

3.3 Assemble Translated Text. Receives the translated segments from 3.2. Concatenates them with appropriate separators (e.g., double newline) to form the full translated text. Outputs the translated text and the target language to process 4.0.

Data flows: From 2.0 to 3.1: extracted text. From 1.0 to 3.1 (or 3.2): source language, target language. From 3.1 to 3.2: text chunks. From 3.2 to Translation API: translation request. From Translation API to 3.2: translated segment(s). From 3.2 to 3.3: translated segments. From 3.3 to 4.0: translated text, target language.

Table 11.4 summarises the Level 2 decomposition for processes 1.0 and 3.0.

Table 11.4 Level 2 DFD sub-processes

| Parent process | Sub-process | Name                         | Main function                                              |
| -------------- | ----------- | ---------------------------- | ---------------------------------------------------------- |
| 1.0            | 1.1         | Receive Request              | Accept multipart request with file and language params     |
| 1.0            | 1.2         | Validate File                | Check file type and size                                   |
| 1.0            | 1.3         | Validate Language Parameters | Check source and target language present                   |
| 3.0            | 3.1         | Chunk Text                   | Split text into API-sized chunks at paragraph boundaries   |
| 3.0            | 3.2         | Send Translation Request     | Call Translation API per chunk; receive translated segment |
| 3.0            | 3.3         | Assemble Translated Text     | Concatenate segments; output full translated text          |

---

## 11.6 Data Dictionary for Principal Data Flows

The following definitions describe the principal data flows used in the DFDs. They can be used as a minimal data dictionary for the system.

Table 11.5 Data dictionary (principal flows)

| Data flow name      | Description                                          | Composition / Notes                                                    |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| PDF file            | The uploaded document from the user                  | Binary; MIME type application/pdf; max size configurable (e.g., 10 MB) |
| source language     | Code for the language of the source text             | ISO 639-1 (e.g., en, hi, fr); string                                   |
| target language     | Code for the desired output language                 | ISO 639-1; string                                                      |
| PDF buffer          | In-memory representation of the PDF                  | Buffer (binary); output of validation; input to extraction             |
| extracted text      | Text content taken from the PDF                      | Unicode string; may include newlines for paragraphs                    |
| translation request | Payload sent to Translation API                      | Text (or chunk), source, target, authentication as per API             |
| translated text     | Text returned by Translation API                     | Unicode string; assembled from chunk responses                         |
| translated PDF      | Final PDF delivered to the user                      | Binary PDF; Content-Disposition: attachment                            |
| error message       | Message returned on validation or processing failure | Structured (e.g., JSON with success: false, message: string)           |

---

## 11.7 Conclusion

This chapter has presented the Data Flow Diagrams for the GlobalPDF system at three levels. The Context Diagram (Level 0) shows the system as a single process interacting with the User and the Translation API. The Level 1 DFD decomposes the system into five processes: Validate and Receive Upload, Extract Text, Translate Text, Build PDF, and Return Response, with clear data flows between them and to the external entities. The Level 2 DFD elaborates two of these processes: Validate and Receive Upload (sub-processes Receive Request, Validate File, Validate Language Parameters) and Translate Text (sub-processes Chunk Text, Send Translation Request, Assemble Translated Text). The notation and conventions used are standard for structured analysis, and the data dictionary in Section 11.6 defines the principal flows for consistency. These DFDs can be drawn in a tool such as Lucidchart or Draw.io using the descriptions and tables provided and are consistent with the architecture and module specifications in Chapters 7 and 10. They serve as a reference for implementation, review, and maintenance of the GlobalPDF translation pipeline.

---

This chapter has described the Data Flow Diagrams for GlobalPDF. The next chapter may address the Entity-Relationship Diagram, implementation details, or testing.
