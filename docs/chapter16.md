# CHAPTER 16 – DATABASE / FILE LAYOUTS

________________________________________

## 16.1 Introduction

Database and file layouts define the physical organisation of data on storage media. They specify how records are structured, how many bytes each field occupies (or the maximum size for variable-length fields), how records are ordered and indexed, and how files or tables are stored and accessed. Physical design translates the logical schema (entity-relationship diagram, data dictionary) into an implementable form that a relational database management system (e.g., MySQL or PostgreSQL) or a file-based storage system can use efficiently.

For Global PDF Services (GlobalPDF), the logical schema is documented in the Entity-Relationship Diagram (Chapter 12) and the Data Dictionary (Chapter 14). The structure chart (Chapter 15) shows how the application modules interact with these data structures. This chapter presents the physical table layouts for the five core entities: User, Translation_Request, Translation_Log, Supported_Language, and System_Config. Each layout includes an approximate record size, a logical file or table name, the indexes (primary key, foreign key, clustered, non-clustered), and an offset table that lists the byte offset (or ordinal position), field name, type and size, index participation, and notes. The design assumes a relational database such as MySQL or PostgreSQL, with B-Tree indexing, referential integrity, and normalisation to the Third Normal Form (3NF) as described in Chapter 14. The physical layouts support implementation, capacity planning, and performance tuning and are suitable for inclusion in a final-year engineering project report.

________________________________________

## 16.2 User Table Layout

The User table stores registered user account information. Each record represents one user.

Record size (approximate). 522 bytes per record (fixed-length portion plus maximum variable-length allocation for VARCHAR fields as implemented in the target DBMS; actual storage may use variable-length encoding).

File name. user.dat (or logical table name: User in the database).

Indexes.

Primary key: user_id (clustered). Ensures unique identification and physical ordering of rows by user_id.

Non-clustered unique index: user_email. Enforces uniqueness of email and supports fast lookup by email for login.

Table 16.1 User table offset layout

| Offset | Field        | Type/Size     | Index | Notes                                    |
|--------|--------------|---------------|-------|------------------------------------------|
| 0      | user_id      | INT (4 B)     | PK, Clustered | Auto-increment; unique per record.     |
| 4      | user_name    | VARCHAR(100)  | -     | Display name; NOT NULL.                  |
| 104    | user_email   | VARCHAR(150)  | UNIQUE, Non-clustered | Login identifier; NOT NULL.        |
| 254    | user_password| VARCHAR(255)  | -     | Hashed password (e.g., bcrypt); NOT NULL.|
| 509    | created_at   | DATETIME (8 B)| -     | Creation timestamp; NOT NULL.            |

Note. Offsets for VARCHAR columns assume maximum-length storage for the purpose of fixed-offset calculation; in practice, the database may use variable-length encoding and store only the actual length plus data.

________________________________________

## 16.3 Translation_Request Table Layout

The Translation_Request table stores each translation request submitted to the system, including file metadata, language selection, status, and timestamps.

Record size (approximate). 348 bytes per record (assuming maximum allocation for VARCHAR/CHAR fields where applicable).

File name. translation_request.dat (or logical table name: Translation_Request).

Indexes.

Primary key: request_id (clustered). Unique identification and physical ordering by request_id.

Foreign key (non-clustered): user_id → User.user_id. Supports joins and referential integrity; supports queries by user.

Foreign key (non-clustered): source_language_code → Supported_Language.language_code. Referential integrity and lookups.

Foreign key (non-clustered): target_language_code → Supported_Language.language_code. Referential integrity and lookups.

Non-clustered index: created_at (or request_date). Supports range queries and reporting by date.

Non-clustered index: status. Supports filtering by status (e.g., Pending, Success, Failed).

Table 16.2 Translation_Request table offset layout

| Offset | Field               | Type/Size      | Index | Notes                                    |
|--------|---------------------|----------------|-------|------------------------------------------|
| 0      | request_id         | INT (4 B)      | PK, Clustered | Auto-increment; unique.                |
| 4      | user_id            | INT (4 B)      | FK → User.user_id | Nullable for guest requests.       |
| 8      | original_file_name | VARCHAR(255)   | -     | Name of uploaded PDF; NOT NULL.          |
| 263    | file_size          | INT (4 B)      | -     | File size in bytes; NOT NULL.            |
| 267    | source_language    | VARCHAR(10)    | FK → Supported_Language | ISO 639-1; NOT NULL.           |
| 277    | target_language    | VARCHAR(10)    | FK → Supported_Language | ISO 639-1; NOT NULL.           |
| 287    | status             | ENUM/VARCHAR(50)| Non-clustered | Pending, Success, Failed; NOT NULL.  |
| 337    | created_at         | DATETIME (8 B) | Non-clustered | Request submission time; NOT NULL.   |
| 345    | completed_at       | DATETIME (8 B) | -     | Completion time; NULL until finished.    |

Note. status may be implemented as ENUM('Pending','Success','Failed') or VARCHAR(50); ENUM is stored internally as integer in many systems. completed_at is NULL when status is Pending.

________________________________________

## 16.4 Translation_Log Table Layout

The Translation_Log table stores log entries linked to translation requests, including error messages, processing time in milliseconds, and timestamp.

Record size (approximate). Variable; fixed portion approximately 24 bytes plus length of error_message (TEXT). Average record size estimate: 524 bytes (assuming 500-byte average for error_message when present).

File name. translation_log.dat (or logical table name: Translation_Log).

Indexes.

Primary key: log_id (clustered). Unique identification and ordering.

Foreign key (non-clustered): request_id → Translation_Request.request_id. Joins and referential integrity; supports retrieval of all logs for a request.

Non-clustered index: timestamp (or log_timestamp). Supports time-range queries and log rotation.

Table 16.3 Translation_Log table offset layout

| Offset | Field             | Type/Size    | Index | Notes                                    |
|--------|-------------------|--------------|-------|------------------------------------------|
| 0      | log_id            | INT (4 B)    | PK, Clustered | Auto-increment; unique.                |
| 4      | request_id        | INT (4 B)    | FK → Translation_Request.request_id | NOT NULL.        |
| 8      | error_message     | TEXT         | -     | Variable length; NULL if no error.       |
| 8+V    | processing_time_ms| INT (4 B) or DECIMAL(10,2) | - | Processing time in ms; NULL if N/A.  |
| 12+V   | timestamp         | DATETIME (8 B)| Non-clustered | Log entry time; NOT NULL.           |

Note. V denotes the variable length of the error_message field; TEXT is stored as length-prefixed or out-of-line in most RDBMSs. For fixed-offset layout documentation, error_message may be documented as TEXT (max 65535 or 2^16-1 bytes depending on DBMS).

________________________________________

## 16.5 Supported_Language Table Layout

The Supported_Language table is a reference table listing supported languages with code, display name, and active flag.

Record size (approximate). 111 bytes per record.

File name. supported_language.dat (or logical table name: Supported_Language).

Indexes.

Primary key: language_code (clustered). Unique identification; used as foreign key target by Translation_Request.

Non-clustered index: is_active. Supports filtering of active languages for dropdown or API.

Table 16.4 Supported_Language table offset layout

| Offset | Field          | Type/Size    | Index | Notes                                    |
|--------|----------------|--------------|-------|------------------------------------------|
| 0      | language_code  | VARCHAR(10)  | PK, Clustered | ISO 639-1; unique.                    |
| 10     | language_name  | VARCHAR(100) | -     | Display name; NOT NULL.                  |
| 110    | is_active      | BOOLEAN (1 B)| Non-clustered | 1 = active, 0 = inactive; NOT NULL.  |

________________________________________

## 16.6 System_Config Table Layout

The System_Config table stores key-value configuration parameters for admin settings and system behaviour.

Record size (approximate). Variable; fixed portion 112 bytes plus length of config_value (TEXT). Average record size estimate: 312 bytes (assuming 200-byte average value).

File name. system_config.dat (or logical table name: System_Config).

Indexes.

Primary key: config_id (clustered). Unique identification; auto-increment.

Non-clustered unique index: config_key. Ensures one row per key; supports fast lookup by key.

Table 16.5 System_Config table offset layout

| Offset | Field        | Type/Size     | Index | Notes                                    |
|--------|--------------|---------------|-------|------------------------------------------|
| 0      | config_id    | INT (4 B)     | PK, Clustered | Auto-increment; unique.                |
| 4      | config_key   | VARCHAR(100)  | UNIQUE, Non-clustered | Parameter name; NOT NULL.          |
| 104    | config_value | TEXT          | -     | Parameter value; NOT NULL.               |
| 104+V  | updated_at   | DATETIME (8 B)| -     | Last update timestamp; NOT NULL.        |

Note. V denotes variable length of config_value. TEXT storage is implementation-dependent.

________________________________________

## 16.7 Summary of Physical Tables

Table 16.6 summarises the file names, approximate record sizes, and primary index type for each entity.

Table 16.6 Physical table summary

| Entity              | File / Table Name      | Approx. Record Size | Primary Key Index   |
|---------------------|------------------------|----------------------|----------------------|
| User                | user.dat / User        | 522 B                | user_id (Clustered)  |
| Translation_Request | translation_request.dat / Translation_Request | 348 B | request_id (Clustered) |
| Translation_Log     | translation_log.dat / Translation_Log | Variable (~524 B avg) | log_id (Clustered)   |
| Supported_Language  | supported_language.dat / Supported_Language | 111 B | language_code (Clustered) |
| System_Config       | system_config.dat / System_Config | Variable (~312 B avg) | config_id (Clustered) |

________________________________________

## 16.8 File Organisation and Access

This section describes how the physical layout is organised and accessed: indexing, referential integrity, normalisation, optimisation, backup, and scalability.

B-Tree indexing. Primary and secondary indexes are implemented as B-Tree (or B+Tree) structures in relational databases such as MySQL and PostgreSQL. B-Trees support efficient equality and range lookups, ordered traversal, and insertion and deletion with logarithmic cost. Primary key lookups (e.g., find user by user_id, find request by request_id) use the clustered index. Lookups by email (User), by user_id or date or status (Translation_Request), by request_id or timestamp (Translation_Log), and by config_key (System_Config) use non-clustered indexes to avoid full table scans.

Clustered indexes on primary keys. The primary key of each table is the clustered index (where the DBMS supports one clustered index per table). Rows are stored in key order on disk, so range scans on the primary key (e.g., request_id from 1 to 1000) are efficient. In MySQL InnoDB, the primary key is always the clustered index; in PostgreSQL, the default is heap storage with a separate B-Tree index on the primary key unless a clustering option is used. The layouts in this chapter assume clustered primary key where applicable.

Foreign key constraints. Foreign keys (user_id in Translation_Request; request_id in Translation_Log; source_language and target_language in Translation_Request) are enforced by the database to maintain referential integrity. Inserts or updates that reference a non-existent parent row are rejected. Deletes or updates on the parent (e.g., User, Translation_Request, Supported_Language) can be configured to RESTRICT, CASCADE, or SET NULL so that child rows are handled consistently. Indexes on foreign key columns improve the performance of joins and of referential checks.

Normalisation (3NF). The schema is in the Third Normal Form: no repeating groups, every non-key attribute depends on the whole primary key, and no non-key attribute depends on another non-key attribute. Reference data (Supported_Language, System_Config) is separated from transactional data (Translation_Request, Translation_Log) and from user data (User). This reduces redundancy and update anomalies and keeps the physical layout aligned with the logical design in Chapter 12 and Chapter 14.

Optimisation strategies. (1) Use the appropriate index for frequent query patterns (e.g., index on created_at for date-range reports, on status for filtering). (2) Avoid over-indexing; each index adds write cost. (3) For Translation_Log and other high-volume tables, consider partitioning by timestamp (e.g., monthly) to improve query and maintenance performance. (4) Use EXPLAIN (or equivalent) to verify that critical queries use indexes. (5) Monitor table and index sizes for capacity planning.

Backup strategy. A full backup captures all tables and indexes at a point in time and is the base for recovery. Incremental (or differential) backups capture only changes since the last full or incremental backup, reducing backup time and storage. Recommended approach: full backup on a schedule (e.g., weekly) and incremental backups more frequently (e.g., daily). Retain backups according to policy (e.g., 30 days) and test restore procedures. For MySQL or PostgreSQL, use native tools (e.g., mysqldump, pg_dump, or filesystem/volume snapshots with consistent state) and document the backup and restore steps in the deployment guide.

Scalability considerations. (1) Vertical scaling: increase server resources (CPU, RAM, disk) to handle more load. (2) Read replicas: use replica instances for read-heavy reporting and analytics so that the primary handles writes and critical reads. (3) Connection pooling: limit connection count and reuse connections to avoid exhaustion. (4) Archiving: move old Translation_Request and Translation_Log rows to archive tables or cold storage to keep the active tables small and indexes efficient. (5) Caching: cache reference data (Supported_Language, System_Config) in the application when appropriate to reduce database load.

________________________________________

## 16.9 Conclusion

This chapter has presented the database and file layouts for Global PDF Services. The physical layout of each of the five core tables (User, Translation_Request, Translation_Log, Supported_Language, System_Config) has been specified in terms of approximate record size, logical file or table name, indexes (primary key, foreign key, clustered, non-clustered), and an offset table with field name, type/size, index participation, and notes. The Translation_Request table includes request_id, user_id, original_file_name, file_size, source_language, target_language, status (Pending/Success/Failed), created_at, and completed_at; the Translation_Log table includes log_id, request_id, error_message, processing_time_ms, and timestamp. The file organisation and access section has described the use of B-Tree indexing, clustered indexes on primary keys, foreign key constraints, normalisation to 3NF, optimisation strategies, a backup strategy (full and incremental), and scalability considerations. The physical design is consistent with the ER diagram (Chapter 12), the data dictionary (Chapter 14), and the structure chart (Chapter 15) and is suitable for implementation in a relational database such as MySQL or PostgreSQL and for inclusion in a final-year engineering project report.

________________________________________

End of Chapter 16.
