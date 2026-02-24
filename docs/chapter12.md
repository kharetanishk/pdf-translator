# CHAPTER 12 – ENTITY RELATIONSHIP DIAGRAM (E.R. Diagram)

________________________________________

## 12.1 Introduction

An Entity Relationship Diagram (ER diagram or ERD) is a conceptual model that represents the structure of data in a system in terms of entities, their attributes, and the relationships among them. It is used during the analysis and design phases of software development to define the logical schema of a database and to ensure that the data model supports the functional requirements of the system. For the GlobalPDF project, the ER diagram documents the conceptual data elements involved in a translation request: the upload (file metadata), the translation job (source and target language, status), the supported languages, and the output (generated PDF reference). The current implementation of GlobalPDF is stateless and does not persist translation jobs or user data to a database; the ER diagram presented in this chapter is a conceptual model that clarifies the structure of the data involved in each request and supports future extension (e.g., user accounts, session history, or audit logs) when a database is introduced.

This chapter is structured as follows. Section 12.2 provides an overview of the database design approach and the scope of the model. Section 12.3 defines the key entities and their attributes in a tabular format. Section 12.4 describes the relationship mapping and cardinality between entities. Section 12.5 explains the application of normalization up to the Third Normal Form (3NF) and the preservation of data integrity. Section 12.6 describes the ER diagram in narrative form so that it can be drawn in a tool such as Lucidchart or Draw.io. Section 12.7 concludes the chapter.

---

## 12.2 Overview of Database Design

The database design for GlobalPDF is driven by the need to represent a single translation request and its associated inputs and outputs. Each request involves an uploaded PDF file, a choice of source and target language, the execution of the translation pipeline (extraction, translation, PDF generation), and the delivery of the translated PDF. In a persistent implementation, these would be represented as a translation job linked to an upload record, to language references, and to an output document record. The design therefore centres on a TranslationJob entity as the main transaction entity, with supporting entities for Language (reference data), Upload (input metadata), and OutputDocument (output reference). An optional User entity is included to support future authentication and the association of jobs with users.

The model uses only one-to-one (1:1) and many-to-one (M:1) relationships. There are no many-to-many (M:M) relationships in the current scope. In other domains (e.g., healthcare information systems), many-to-many relationships between entities such as Patient and Doctor are often resolved by introducing an associative entity (e.g., Appointment), which holds the relationship between the two and may carry additional attributes (e.g., date, time, status). Similarly, a many-to-many relationship between Medicine and Patient might be resolved by a Prescription entity. In GlobalPDF, each translation job has exactly one source language and one target language, each job has at most one upload and one output document, and the relationship between TranslationJob and Language is many-to-one in each direction (many jobs per language). No associative entity is required for the current model. The design is kept minimal to reflect the stateless nature of the system while remaining extensible for future persistence requirements.

---

## 12.3 Key Entities and Attributes

The following entities form the conceptual data model for GlobalPDF. Primary keys (PK) uniquely identify each instance of an entity. Foreign keys (FK) reference the primary key of another entity and enforce referential integrity. Attributes are the properties that describe each entity.

Table 12.1 Entities, primary keys, attributes, and descriptions

| Entity Name | Primary Key | Attributes | Description |
|-------------|-------------|------------|-------------|
| Language | lang_code | lang_code (PK), display_name, is_active (optional) | Represents a supported language for translation. lang_code is an ISO 639-1 code (e.g., en, hi, fr). display_name is the human-readable name. Used as reference data for source and target language selection. |
| TranslationJob | job_id | job_id (PK), source_lang_code (FK), target_lang_code (FK), status, created_at, completed_at (optional), file_size (optional), page_count (optional) | Represents one translation request. source_lang_code and target_lang_code reference Language. status indicates the stage (e.g., extracting, translating, generating, done, error). Timestamps and optional metrics support auditing and reporting. |
| Upload | upload_id | upload_id (PK), job_id (FK), file_name, file_size, uploaded_at, stored_path (optional) | Represents the uploaded PDF metadata for a translation job. job_id links to TranslationJob in a one-to-one relationship. stored_path may reference file storage when persistence is implemented. |
| OutputDocument | output_id | output_id (PK), job_id (FK), file_ref, generated_at | Represents the generated translated PDF for a translation job. job_id links to TranslationJob in a one-to-one relationship. file_ref may be a path, blob reference, or URL when persistence is implemented. |
| User (optional, future) | user_id | user_id (PK), email, created_at (optional) | Represents an end user when authentication is introduced. TranslationJob may optionally include user_id (FK) to associate jobs with users for history or quotas. |

The Language entity is a reference table; its primary key lang_code is used as a foreign key in TranslationJob for both source_lang_code and target_lang_code. TranslationJob is the central entity; Upload and OutputDocument each have a foreign key to job_id, establishing a one-to-one relationship with TranslationJob. The optional User entity, when introduced, would be referenced by TranslationJob via user_id to support a many-to-one relationship (many jobs per user).

---

## 12.4 Relationship Mapping and Cardinality

The relationships between entities are defined by foreign keys and by the cardinality (1:1, 1:M, or M:M) of each relationship. In this model, all relationships are either one-to-one or many-to-one; there are no many-to-many relationships.

TranslationJob and Language. A TranslationJob has one source language and one target language. Each Language can be the source or target for many TranslationJobs. Thus, the relationship from TranslationJob to Language is many-to-one (M:1) for both source_lang_code and target_lang_code. That is, many translation jobs may share the same source language, and many may share the same target language.

TranslationJob and Upload. Each TranslationJob has at most one associated Upload (the PDF metadata for that request). Each Upload belongs to exactly one TranslationJob. The relationship is one-to-one (1:1). The foreign key job_id in Upload references TranslationJob.job_id. In the current stateless design, upload data is not persisted; when a database is introduced, this relationship models the storage of upload metadata per job.

TranslationJob and OutputDocument. Each TranslationJob produces at most one OutputDocument (the generated PDF). Each OutputDocument belongs to exactly one TranslationJob. The relationship is one-to-one (1:1). The foreign key job_id in OutputDocument references TranslationJob.job_id.

TranslationJob and User (optional). When the User entity is introduced, a TranslationJob may be associated with one User (the user who submitted the request). One User may have many TranslationJobs. The relationship from TranslationJob to User is many-to-one (M:1), with user_id in TranslationJob referencing User.user_id.

Table 12.2 summarises the relationships and cardinalities.

Table 12.2 Entity relationships and cardinality

| Entity 1 | Relationship | Entity 2 | Cardinality | Description |
|----------|--------------|----------|--------------|-------------|
| TranslationJob | uses as source | Language | M:1 | Many jobs can have the same source language; job has one source language. FK: source_lang_code in TranslationJob. |
| TranslationJob | uses as target | Language | M:1 | Many jobs can have the same target language; job has one target language. FK: target_lang_code in TranslationJob. |
| TranslationJob | has | Upload | 1:1 | One job has at most one upload record. FK: job_id in Upload. |
| TranslationJob | produces | OutputDocument | 1:1 | One job produces at most one output document. FK: job_id in OutputDocument. |
| TranslationJob | submitted by (optional) | User | M:1 | Many jobs can belong to one user; job has at most one user. FK: user_id in TranslationJob (when User is introduced). |

No associative entity is required in this model because there are no many-to-many relationships. In other domains, an associative entity (e.g., Appointment between Patient and Doctor) is used to resolve M:M relationships by converting them into two M:1 relationships; here, the relationships are already 1:1 or M:1, so the design is complete without an additional entity.

---

## 12.5 Normalization and Data Integrity

Normalization is the process of organising the data model to reduce redundancy and to preserve data integrity. The model for GlobalPDF is described in terms of the First, Second, and Third Normal Forms (1NF, 2NF, 3NF).

First Normal Form (1NF). An entity is in 1NF if every attribute contains atomic (indivisible) values and each row is uniquely identified. In the present model, all attributes are atomic: lang_code, display_name, job_id, status, file_name, file_ref, and so on, are single-valued. Each entity has a primary key (lang_code, job_id, upload_id, output_id, or user_id), so each row is unique. The model therefore satisfies 1NF.

Second Normal Form (2NF). An entity is in 2NF if it is in 1NF and every non-key attribute is fully dependent on the entire primary key. In entities with a single-attribute primary key (Language, TranslationJob, Upload, OutputDocument, User), all non-key attributes depend on that key. There are no composite primary keys in this model, so 2NF is satisfied.

Third Normal Form (3NF). An entity is in 3NF if it is in 2NF and no non-key attribute depends on another non-key attribute. In Language, the only non-key attribute is display_name (and optionally is_active), which depends only on lang_code. In TranslationJob, status, created_at, completed_at, file_size, and page_count depend only on job_id; source_lang_code and target_lang_code are foreign keys and depend on job_id by definition. In Upload and OutputDocument, non-key attributes depend only on the primary key (upload_id or output_id) or on the foreign key job_id. There are no transitive dependencies (e.g., a non-key attribute determined by another non-key attribute). The model therefore satisfies 3NF.

Data integrity is maintained as follows. Primary keys ensure entity integrity (uniqueness of each row). Foreign keys ensure referential integrity: source_lang_code and target_lang_code in TranslationJob must exist in Language.lang_code; job_id in Upload and OutputDocument must exist in TranslationJob.job_id; and, when applicable, user_id in TranslationJob must exist in User.user_id. Optional constraints (e.g., check constraints on status, or not-null rules on required attributes) can be added at implementation time in the chosen database system.

---

## 12.6 ER Diagram Description

The ER diagram for GlobalPDF can be drawn using the following description. Standard notation is assumed: rectangles for entities, ovals or text for attributes, underlines for primary keys, and lines connecting entities with cardinality symbols (1, M) or labels (1:1, M:1).

Entities. Draw four main entities: Language, TranslationJob, Upload, and OutputDocument. Optionally draw a fifth entity, User, with a dashed border to indicate future scope.

Language. Inside the Language rectangle, list the attributes: lang_code (underlined to denote PK), display_name, is_active (optional).

TranslationJob. Inside the TranslationJob rectangle, list: job_id (PK), source_lang_code (FK), target_lang_code (FK), status, created_at, completed_at, file_size, page_count. Draw two lines from TranslationJob to Language: one labelled "source" and one "target," each with cardinality M:1 (many jobs to one language).

Upload. List attributes: upload_id (PK), job_id (FK), file_name, file_size, uploaded_at, stored_path. Draw a line from Upload to TranslationJob labelled "belongs to" with cardinality 1:1.

OutputDocument. List attributes: output_id (PK), job_id (FK), file_ref, generated_at. Draw a line from OutputDocument to TranslationJob labelled "produced by" with cardinality 1:1.

User (optional). List attributes: user_id (PK), email, created_at. Draw a line from TranslationJob to User labelled "submitted by" with cardinality M:1.

The diagram should show no many-to-many relationships and no associative entities. All relationships are either one-to-one (TranslationJob–Upload, TranslationJob–OutputDocument) or many-to-one (TranslationJob–Language for source and target, TranslationJob–User when User is present). The diagram can be produced in a tool such as Lucidchart, Draw.io, or Microsoft Visio using this description and the tables in Sections 12.3 and 12.4.

---

## 12.7 Conclusion

This chapter has presented the Entity Relationship Diagram for the GlobalPDF system. The model consists of four core entities—Language, TranslationJob, Upload, and OutputDocument—and an optional fifth entity, User, for future extension. TranslationJob is the central transaction entity, linked to Language by two many-to-one relationships (source and target language), to Upload by a one-to-one relationship, and to OutputDocument by a one-to-one relationship. The design does not require an associative entity because there are no many-to-many relationships; in other domains, entities such as Appointment or Prescription resolve M:M relationships between entities like Patient and Doctor or Medicine and Patient, but in GlobalPDF the relationships are inherently one-to-one or many-to-one. The model is normalised to the Third Normal Form and maintains entity and referential integrity through primary and foreign keys. The ER diagram described in Section 12.6 is consistent with the conceptual data elements referred to in Chapter 7 and with the module specifications in Chapter 10, and it provides a clear basis for implementing a persistent database when the system is extended to support user accounts, session history, or audit logs.

________________________________________

This chapter has described the Entity Relationship Diagram for GlobalPDF. The next chapter may address implementation, testing, or deployment.
