CHAPTER 14 – DATA DICTIONARY

________________________________________

14.1 Introduction

A data dictionary is a central repository of metadata that describes the structure, meaning, and constraints of the data stored in a system. It documents every table, column, data type, and rule that the database enforces, thereby providing a single source of truth for developers, database administrators, and maintainers. For the GlobalPDF project, a web-based multilingual PDF translation application, the data dictionary defines the logical schema that would support user management (when authentication is implemented), translation requests, logging, supported languages, and system configuration. The current implementation of GlobalPDF is stateless and may not persist data to a database; the data dictionary presented in this chapter describes a realistic, extensible schema that aligns with the entity-relationship model in Chapter 12 and supports future features such as user accounts, translation history, and configurable settings.

This chapter is organised as follows. Section 14.2 explains the purpose of the data dictionary in the context of system design and maintenance. Section 14.3 provides an overview of the core tables and their roles. Section 14.4 presents the detailed table structures and field definitions for each table. Section 14.5 describes the constraints and data integrity rules, including primary keys, foreign keys, and validation. Section 14.6 concludes with a summary of how the data dictionary supports structured data storage, maintainability, and scalability.

________________________________________

14.2 Purpose of Data Dictionary

The data dictionary serves multiple purposes in a software project. First, it provides a precise specification of the database schema so that implementers can create tables, indexes, and constraints consistently across development, test, and production environments. Second, it acts as documentation for anyone who needs to understand what data the system stores, what each column represents, and what rules apply (e.g., mandatory fields, unique values, relationships between tables). Third, it supports data integrity by making constraints explicit; when primary keys, foreign keys, and check constraints are documented, they can be enforced by the database management system and validated during application development. Fourth, it facilitates maintenance and evolution: when new columns or tables are added, or when existing structures are changed, the data dictionary is updated so that the documentation remains accurate. Fifth, it aids in communication between analysts, designers, and developers by establishing a common vocabulary for the data model.

In the context of GlobalPDF, the data dictionary documents the schema for user accounts (User table), translation requests (Translation_Request table), operational logs (Translation_Log table), reference data for languages (Supported_Language table), and system configuration (System_Config table). This schema supports the optional persistence of translation history and user activity, the auditing of requests and errors, and the centralised storage of configuration parameters. The data types and constraints chosen (e.g., VARCHAR lengths, NOT NULL, UNIQUE, foreign keys) reflect the requirements described in earlier chapters and follow common relational database conventions.

________________________________________

14.3 Core Tables Overview

The database schema for GlobalPDF comprises five core tables. The following paragraphs summarise the role of each table and its place in the overall design.

User. The User table stores information about registered users when authentication is supported. Each row represents one user account. The table holds the user identifier, name, email, hashed password, and creation timestamp. The primary key is user_id. The User table is referenced by Translation_Request when requests are associated with a logged-in user; if guest (anonymous) requests are allowed, user_id in Translation_Request may be nullable.

Translation_Request. The Translation_Request table stores a record of each translation request submitted to the system. Each row represents one request and includes the identifier of the user (if any), the original file name, the source and target language codes, the status of the request (e.g., pending, completed, failed), and the request date. The primary key is request_id. The table references User (via user_id) and Supported_Language (via source_language_code and target_language_code). This table supports translation history, reporting, and auditing.

Translation_Log. The Translation_Log table stores log entries associated with translation requests. Each row may record an error message, processing time, and timestamp for a given request. The primary key is log_id. The table references Translation_Request via request_id. Multiple log entries may exist for one request (e.g., one per pipeline stage or one per error). This table supports debugging, performance analysis, and operational monitoring.

Supported_Language. The Supported_Language table is a reference table that lists the languages supported by the translation service. Each row has a language code (primary key), the display name, and a flag indicating whether the language is currently active for selection. The table is referenced by Translation_Request for source and target language. Maintaining this table allows the application to add or disable languages without code changes.

System_Config. The System_Config table stores key-value configuration parameters (e.g., maximum file size, API endpoint, feature flags). Each row has a unique config key, a value (text), and an update timestamp. The primary key is config_id; config_key is unique. This table supports runtime configuration without redeployment, subject to application design that reads from the database.

Table 14.1 summarises the core tables and their primary keys and main relationships.

Table 14.1 Core tables overview

| Table Name           | Primary Key   | Main Purpose                                      |
| -------------------- | ------------- | -------------------------------------------------- |
| User                 | user_id       | Store registered user accounts                     |
| Translation_Request   | request_id    | Store each translation request and its metadata    |
| Translation_Log      | log_id        | Store log entries linked to translation requests   |
| Supported_Language   | language_code | Reference data for supported languages             |
| System_Config        | config_id     | Key-value system configuration                     |

________________________________________

14.4 Table Structures and Field Definitions

This section defines each table in detail. For each column, the field name, data type, size (where applicable), constraints, and a brief description are given. The conventions used are: PK for primary key, FK for foreign key, and the notation "FK → table.column" to indicate the referenced table and column.

14.4.1 User Table

The User table stores registered user account information. It is used when the system supports authentication; otherwise, translation requests may be recorded without a user_id (guest requests).

| Field Name    | Data Type | Size   | Constraints                    | Description                                      |
| ------------- | --------- | ------ | ------------------------------- | ------------------------------------------------ |
| user_id       | INT       | -      | PK, Auto-increment              | Unique identifier for the user account.          |
| user_name     | VARCHAR   | 100    | NOT NULL                        | Display name of the user.                        |
| user_email    | VARCHAR   | 150    | UNIQUE, NOT NULL                | Email address; used for login and must be unique.|
| user_password | VARCHAR   | 255    | NOT NULL                        | Hashed password (e.g., bcrypt); never store plain text. |
| created_at    | DATETIME  | -      | NOT NULL                        | Timestamp when the account was created.          |

14.4.2 Translation_Request Table

The Translation_Request table records each translation request submitted to the system. It links to the user (if authenticated), to the source and target languages, and to log entries in Translation_Log.

| Field Name            | Data Type | Size   | Constraints                                    | Description                                      |
| --------------------- | --------- | ------ | ----------------------------------------------- | ------------------------------------------------ |
| request_id            | INT       | -      | PK, Auto-increment                              | Unique identifier for the translation request.   |
| user_id               | INT       | -      | FK → User.user_id, NULL allowed                  | User who submitted the request; NULL for guest.  |
| original_file_name    | VARCHAR   | 255    | NOT NULL                                        | Name of the uploaded PDF file as provided by user. |
| source_language_code  | VARCHAR   | 10     | FK → Supported_Language.language_code, NOT NULL | ISO 639-1 (or similar) code for source language. |
| target_language_code  | VARCHAR   | 10     | FK → Supported_Language.language_code, NOT NULL | ISO 639-1 code for target language.              |
| status                | VARCHAR   | 50     | NOT NULL                                        | Current status (e.g., pending, completed, failed). |
| request_date          | DATETIME  | -      | NOT NULL                                        | Timestamp when the request was submitted.        |

14.4.3 Translation_Log Table

The Translation_Log table stores log entries related to translation requests. Each entry may record an error message, processing time in seconds, and the log timestamp.

| Field Name      | Data Type | Size  | Constraints                          | Description                                      |
| --------------- | --------- | ----- | ------------------------------------- | ------------------------------------------------ |
| log_id          | INT       | -     | PK, Auto-increment                    | Unique identifier for the log entry.             |
| request_id      | INT       | -     | FK → Translation_Request.request_id, NOT NULL | Links this log entry to a translation request.   |
| error_message   | TEXT      | -     | NULL allowed                          | Error message if the request or a stage failed.  |
| processing_time | DECIMAL   | 6,2   | NULL allowed                          | Time taken (e.g., in seconds) for processing.    |
| log_timestamp  | DATETIME  | -     | NOT NULL                              | Timestamp when the log entry was created.        |

14.4.4 Supported_Language Table

The Supported_Language table is a reference table listing languages that can be selected as source or target. The language_code is the standard code (e.g., en, hi) used by the translation API and the application.

| Field Name     | Data Type | Size   | Constraints     | Description                                      |
| -------------- | --------- | ------ | ---------------- | ------------------------------------------------ |
| language_code  | VARCHAR   | 10     | PK               | ISO 639-1 or similar code; unique identifier.    |
| language_name  | VARCHAR   | 100    | NOT NULL         | Human-readable name of the language.             |
| is_active      | BOOLEAN   | -      | NOT NULL         | Whether the language is available for selection.  |

14.4.5 System_Config Table

The System_Config table stores configuration key-value pairs. Each row represents one setting (e.g., max_file_size_mb, translation_api_url). The config_key must be unique.

| Field Name   | Data Type | Size   | Constraints     | Description                                      |
| ------------ | --------- | ------ | ---------------- | ------------------------------------------------ |
| config_id    | INT       | -      | PK, Auto-increment | Unique identifier for the configuration row.   |
| config_key   | VARCHAR   | 100    | UNIQUE, NOT NULL | Name of the configuration parameter.            |
| config_value | TEXT      | -      | NOT NULL         | Value of the parameter (stored as text).        |
| updated_at   | DATETIME  | -      | NOT NULL         | Timestamp when the value was last updated.       |

________________________________________

14.5 Constraints and Data Integrity Rules

This section explains the constraints and rules that the data dictionary defines and how they enforce data integrity and consistency.

Primary Keys. A primary key (PK) uniquely identifies each row in a table. No two rows can have the same primary key value, and the primary key column(s) cannot be NULL. In this schema, User uses user_id; Translation_Request uses request_id; Translation_Log uses log_id; Supported_Language uses language_code; and System_Config uses config_id. The use of a single-column primary key for each table simplifies referencing and indexing. For User, Translation_Request, Translation_Log, and System_Config, the primary key is an integer with auto-increment, so the database generates a unique value when a new row is inserted. For Supported_Language, the primary key is language_code (e.g., en, hi), which is a business key rather than a surrogate.

Foreign Keys. A foreign key (FK) is a column (or set of columns) that references the primary key of another table. It enforces referential integrity: the referenced row must exist, and, depending on the database rules, deletion or update of the referenced row may be restricted or cascaded. In this schema, Translation_Request.user_id references User.user_id; Translation_Request.source_language_code and target_language_code reference Supported_Language.language_code; and Translation_Log.request_id references Translation_Request.request_id. The user_id in Translation_Request is nullable to allow guest requests when no user is logged in. All other foreign keys are NOT NULL so that every request is tied to valid language codes and every log entry is tied to a request. Foreign key constraints prevent orphaned records (e.g., a log entry without a request) and ensure that language codes used in requests exist in Supported_Language.

NOT NULL Constraint. The NOT NULL constraint ensures that a column must have a value; NULL is not allowed. It is applied to columns that are essential for the meaning of the row or for downstream processing. In the User table, user_name, user_email, user_password, and created_at are NOT NULL. In Translation_Request, original_file_name, source_language_code, target_language_code, status, and request_date are NOT NULL. In Translation_Log, request_id and log_timestamp are NOT NULL. In Supported_Language, language_name and is_active are NOT NULL. In System_Config, config_key, config_value, and updated_at are NOT NULL. Columns that may be unknown or inapplicable (e.g., user_id for guest requests, error_message when there is no error, processing_time when not yet measured) allow NULL.

UNIQUE Constraint. The UNIQUE constraint ensures that no two rows have the same value in the specified column(s). It is used for business keys that must be unique across the table. In the User table, user_email is UNIQUE so that one email corresponds to at most one account. In the System_Config table, config_key is UNIQUE so that each configuration parameter has at most one row. Supported_Language.language_code is the primary key and is therefore unique by definition.

Auto-increment. Auto-increment (or identity or serial, depending on the database system) causes the database to generate the next integer value automatically when a new row is inserted. It is used for surrogate primary keys where the application does not need to supply the value. In this schema, user_id, request_id, log_id, and config_id are auto-increment. This avoids the need for the application to generate unique IDs and reduces the risk of collisions in concurrent inserts.

Referential Integrity. Referential integrity is maintained by the foreign key constraints. When a row in Translation_Request references User.user_id, that user_id must exist in User (or be NULL if allowed). When a row in Translation_Request references Supported_Language.language_code for source and target, those codes must exist in Supported_Language. When a row in Translation_Log references Translation_Request.request_id, that request_id must exist in Translation_Request. The database can be configured to reject inserts or updates that violate these rules and to restrict or cascade deletes (e.g., when a request is deleted, whether associated log rows must be deleted or blocked). The data dictionary documents these relationships so that application logic and database triggers or constraints can be aligned.

Data Validation Rules. Beyond the constraints above, additional validation rules may be applied at the application or database level. Examples: user_email should match a valid email format; user_password should store only a hash, never plain text; status in Translation_Request should be one of a defined set of values (e.g., pending, extracting, translating, generating, completed, failed); language_code in Supported_Language should follow ISO 639-1 where possible; processing_time in Translation_Log should be non-negative when not NULL; config_key may follow a naming convention (e.g., section.key). Check constraints or enumerated types can enforce some of these rules in the database; the data dictionary documents the intended rules for implementers.

Relationship Between Tables. The relationships are as follows. User and Translation_Request: one user may have many translation requests (1:M); the relationship is implemented by user_id in Translation_Request. Supported_Language and Translation_Request: one language may be the source or target of many requests (1:M); the relationship is implemented by source_language_code and target_language_code in Translation_Request. Translation_Request and Translation_Log: one request may have many log entries (1:M); the relationship is implemented by request_id in Translation_Log. System_Config has no foreign keys; it stands alone as a configuration store. These relationships match the entity-relationship diagram in Chapter 12 and support the flows described in Chapters 11 and 13.

Table 14.2 summarises the foreign key relationships.

Table 14.2 Foreign key relationships

| Table               | Column                 | References                    | Nullable | Description                          |
| ------------------- | ---------------------- | ----------------------------- | -------- | ------------------------------------ |
| Translation_Request | user_id                | User.user_id                  | Yes      | User who submitted the request       |
| Translation_Request | source_language_code   | Supported_Language.language_code | No   | Source language code                 |
| Translation_Request | target_language_code   | Supported_Language.language_code | No   | Target language code                 |
| Translation_Log    | request_id             | Translation_Request.request_id | No     | Translation request this log belongs to |

________________________________________

14.6 Conclusion

The data dictionary for GlobalPDF defines a structured, normalised schema that supports user management, translation request tracking, logging, language reference data, and system configuration. The five tables (User, Translation_Request, Translation_Log, Supported_Language, System_Config) are specified with clear field names, data types, sizes, and constraints. Primary keys ensure uniqueness and identity for each row; foreign keys enforce referential integrity between User, Translation_Request, Translation_Log, and Supported_Language; NOT NULL and UNIQUE constraints prevent invalid or duplicate data; and auto-increment simplifies the generation of surrogate keys. The documented relationships (one-to-many between User and Translation_Request, Supported_Language and Translation_Request, and Translation_Request and Translation_Log) align with the entity-relationship model and support querying, reporting, and auditing.

A well-maintained data dictionary ensures structured data storage by providing a single, authoritative definition of the schema. Implementers can create tables and indexes that match the specification, reducing the risk of inconsistent or missing columns across environments. Maintainability is improved because new team members and maintainers can understand the data model from one document, and changes (e.g., new columns or tables) can be planned and recorded in the same place. System scalability is supported because the schema is normalised, keyed appropriately, and ready for indexing and tuning; the separation of reference data (Supported_Language, System_Config) from transactional data (Translation_Request, Translation_Log) and user data (User) allows each area to be optimised or extended independently. Together with the ER diagram (Chapter 12) and the data flow diagrams (Chapter 11), the data dictionary completes the documentation set for the GlobalPDF data design and provides a solid foundation for implementation and long-term evolution of the system.

________________________________________

End of Chapter 14.
