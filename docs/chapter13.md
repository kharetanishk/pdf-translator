CHAPTER 13 – SYSTEM FLOW CHARTS

________________________________________

13.1 Introduction

A system flowchart is a diagrammatic representation of the sequence of operations performed by a system. It shows the order in which processes execute, the points at which decisions are made, and the paths taken when conditions are satisfied or not. For the GlobalPDF project, a web-based multilingual PDF translation system, the system flowcharts represent the sequential operations that occur when a user submits a translation request and when an administrator or deployer configures or monitors the system. These operations include user access to the application, file upload and validation, language selection, authentication of input (validation checks), the translation pipeline (extraction, translation, PDF generation), delivery of the translated document, and optional administrative tasks such as configuration and log review.

This chapter describes the main system flow, the user translation journey flow (the step-by-step path from opening the application to downloading the translated PDF), and the admin or configuration module flow. It also defines the standard flowchart symbols used so that the reader can draw or interpret the diagrams consistently. The flowcharts are aligned with the data flow diagrams in Chapter 11 and the module specifications in Chapter 10. The purpose of this chapter is to provide a clear, formal description of the control flow and decision points in GlobalPDF, suitable for implementation, testing, and documentation in a final-year B.Tech, MCA, or BCA project report.

________________________________________

13.2 Main System Flow Overview

The main system flow describes the high-level path from the user’s entry into the application to exit. In the current implementation, GlobalPDF does not require user login; the end user opens the web application directly and is presented with the translation interface. The main flow is therefore described as follows.

The flow begins when the user accesses the application (e.g., by opening the application URL in a browser). The system displays the main screen or dashboard, which contains the upload area, the language selection controls (source and target language), and the action button to initiate translation. The user may then choose to perform a translation (upload a file, select languages, and submit) or to navigate to other areas if available (e.g., About, Contact, or future Settings). When the user initiates a translation, the system validates the input (file type, file size, presence of both language selections). This validation is represented as a decision: if validation fails, the system displays an error message and returns the user to the same screen so that the user can correct the input; if validation succeeds, the system proceeds to execute the translation pipeline (extract text, translate text, build PDF) and then delivers the translated PDF for download. After the user downloads the file or dismisses the result, the user may start another translation or leave the application (exit or close the browser). If the system is extended with authentication, the main flow would include a login step at the start and a logout step at the end; the decision after login would be whether authentication succeeded (proceed to dashboard) or failed (display error and remain on login screen).

In summary, the main system process flow is: (1) Access application; (2) View dashboard or main screen; (3) Choose action (e.g., Translate PDF); (4) Upload file and select languages; (5) Submit request; (6) Validation decision (valid: proceed; invalid: show error, return to step 4); (7) Execute translation pipeline; (8) Deliver translated PDF or error; (9) User may repeat or exit. Optional future steps include login before step 1 and logout after step 9.

________________________________________

13.3 User Translation Journey Flow

The user translation journey flow describes the detailed step-by-step path that the end user and the system follow from the moment the user intends to translate a document until the user has received the translated PDF or an error message. This flow is the core operational sequence of GlobalPDF.

Step 1: User opens the application. The user navigates to the GlobalPDF web application (e.g., via URL or bookmark). The system loads the frontend and displays the main translation interface.

Step 2: User uploads a PDF file. The user selects a PDF file via drag-and-drop or file picker. The file is held in the browser; the user may remove and replace it before submitting.

Step 3: Decision – File selected and valid type? The system (or user action) checks that a file is selected and that it is a PDF (by extension or MIME type). If no file is selected or the file is not a PDF, the flow returns to step 2 with a prompt to select a valid file. If valid, the flow continues.

Step 4: User selects source and target language. The user chooses the source language (language of the document) and the target language (desired output language) from the dropdown lists. Both selections are required.

Step 5: Decision – Both languages selected? If either language is missing, the system disables the translate button or, on submit, returns an error and the flow remains at step 4. If both are selected, the flow continues.

Step 6: User submits the translation request. The user clicks the translate button. The frontend sends the PDF file and the language parameters to the backend via the API (e.g., POST with multipart form data).

Step 7: Backend validation. The backend validates the request: file present, file type PDF, file size within limit, source and target language present and non-empty. This is a decision point: if validation fails, the backend returns an error response (e.g., HTTP 400) with a message, and the flow goes to step 12 (error handling). If validation succeeds, the flow continues to step 8.

Step 8: Extract text. The backend invokes the extraction service. The PDF buffer is parsed and textual content is extracted. The extracted text is passed in memory to the next step. If extraction fails (e.g., corrupted PDF), the flow may branch to error handling (step 12).

Step 9: Translate text. The backend invokes the translation service. The extracted text is chunked if necessary and sent to the external translation API. The API returns translated text, which is assembled and passed to the next step. If the API is unavailable or returns an error, the flow branches to step 12.

Step 10: Build PDF. The backend invokes the PDF builder service. The translated text and target language are used to generate a new PDF (with appropriate font and layout). The PDF buffer is passed to the response step.

Step 11: Return response and download. The backend sets the response headers (Content-Type: application/pdf, Content-Disposition: attachment) and sends the PDF buffer to the client. The frontend receives the response, creates a download link (e.g., via object URL), and triggers the download. The user receives the translated PDF file. The flow then proceeds to step 13.

Step 12: Error handling. If any validation or processing step fails, the backend (or frontend) sends or displays an error message. The user sees the message and may correct the input (e.g., choose another file, ensure languages are selected) and retry from step 2 or step 4, or exit.

Step 13: Decision – Another translation? The user may start another translation (return to step 2) or leave the application (step 14).

Step 14: Exit. The user closes the browser tab or navigates away. The flow ends.

Data storage points in this journey are minimal in the current design: the file and intermediate data (extracted text, translated text) are held in memory for the duration of the request. No persistent database is used for the translation job unless the system is extended in a future phase. System validation checks occur at steps 3, 5, and 7 as described above.

________________________________________

13.4 Admin or Configuration Module Flow

The admin or configuration module flow applies to the person responsible for deploying and configuring the GlobalPDF application (e.g., setting the translation API key, adjusting file size limits, or viewing logs). In the current implementation, there is no separate admin login or dashboard; configuration is performed via environment variables and deployment platform settings. The following flow describes the logical sequence of administrative tasks as they would be performed when such a module is present or when the deployer interacts with the system.

Step 1: Access admin or configuration interface. The administrator or deployer accesses the system (e.g., by logging in to the deployment platform or by editing configuration files). If authentication is implemented, the flow includes a login step and a decision: if credentials are valid, proceed to the dashboard; if not, display an error and remain on the login screen.

Step 2: View dashboard. The admin sees an overview or menu offering options such as manage configuration, view logs, or (in an extended system) manage users or view usage.

Step 3: Select task. The admin chooses one of: Manage configuration (e.g., API key, file size limit, supported languages); View logs (error logs, request logs); or, in a future extension, manage doctors, patients, medicines, appointments, or reports as in a clinic management system. For GlobalPDF, the relevant tasks are configuration and log review.

Step 4: Manage configuration. If the admin selects configuration, the system displays or allows editing of settings (e.g., translation API key, maximum file size, CORS origins). The admin updates the values and saves. The system validates the input (e.g., API key non-empty, file size a positive number) and, if valid, stores the configuration (in environment variables or a secure store). If invalid, the system displays an error and the admin may correct and retry. This may involve writing to a configuration store or updating environment variables in the deployment platform.

Step 5: View logs. If the admin selects log review, the system retrieves log entries from the storage or output where logs are written (e.g., server stdout, log files, or a logging service). The admin may filter by date or severity. No modification of data is performed in this step; it is read-only.

Step 6: Logout or exit. The admin logs out (if login was required) or leaves the configuration interface. The flow ends.

In a full administrative module, additional branches could include: manage doctors (add, edit, delete, view); manage patients; manage medicines; process appointments; generate reports (by date or by doctor). These are not applicable to the current GlobalPDF scope but may be included in the flowchart if the report is extended to a hybrid or comparative study. For GlobalPDF, the admin flow is limited to configuration and log review as described above.

________________________________________

13.5 Flowchart Symbols Used

The flowcharts described in this chapter can be drawn using standard flowchart symbols. The following table defines the symbols and their meaning. When drawing the diagrams, use these symbols consistently so that the flow is unambiguous and suitable for implementation and review.

Table 13.1 Standard flowchart symbols

| Symbol       | Name        | Description                                                                 |
| ------------ | ----------- | --------------------------------------------------------------------------- |
| Oval         | Start / End | Indicates the beginning or the end of a process flow. Labelled "Start" or "End". |
| Rectangle    | Process     | Represents an action or operation (e.g., "Extract text", "Validate upload"). One or more inputs; one or more outputs. |
| Diamond      | Decision    | Represents a conditional branch. The flow splits into two or more paths (e.g., Yes/No) based on the condition. Labelled with the question (e.g., "File valid?"). |
| Parallelogram| Input/Output| Represents data entering the system (input) or leaving the system (output). e.g., "PDF file", "Translated PDF", "Error message". |
| Arrow        | Flow line   | Shows the direction of flow from one symbol to the next. Connects ovals, rectangles, diamonds, and parallelograms in sequence. |

Decision boxes (diamonds) are used at validation points: for example, "File valid?" with one branch for Yes (continue to next process) and one for No (go to error handling or return to input). Process rectangles are used for each operation (upload, validate, extract, translate, build PDF, return response). Input/output parallelograms are used where data enters (e.g., PDF file, language selection) or leaves (e.g., translated PDF, error message). The flow starts at an oval (Start) and ends at an oval (End), with arrows indicating the sequence and the decision branches.

________________________________________

13.6 Conclusion

System flowcharts provide a clear, visual representation of the sequence of operations and the decision points in a system. For GlobalPDF, the main system flow describes the path from user access to the application through dashboard and module selection, validation, translation pipeline execution, and delivery of the translated PDF or error message. The user translation journey flow details each step from opening the application and uploading a file to validation, extraction, translation, PDF generation, download, and exit, including the decision points for file validity, language selection, and backend validation. The admin or configuration module flow describes the logical sequence for the deployer or administrator to configure the system (e.g., API key, file size limit) and to view logs. The use of standard flowchart symbols (oval for start/end, rectangle for process, diamond for decision, parallelogram for input/output, arrow for flow) ensures that the diagrams can be drawn and interpreted consistently.

Flowcharts improve system clarity by making the order of operations and the conditions for branching explicit; they support implementation accuracy by serving as a reference for developers and testers and by highlighting validation checks and error paths. They complement the data flow diagrams (Chapter 11) and the entity-relationship diagram (Chapter 12) by focusing on control flow rather than data flow or data structure. Together, these representations form a complete documentation set for the GlobalPDF system and are suitable for inclusion in a final-year B.Tech, MCA, or BCA project report.

________________________________________

End of Chapter 13.
