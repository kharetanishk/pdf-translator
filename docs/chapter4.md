# CHAPTER 4 – OPERATING ENVIRONMENT

________________________________________

This chapter describes the operating environment required to develop, test, and deploy the GlobalPDF system. It specifies hardware and software requirements for both development and production, outlines the development and deployment setups, and states client-side and network prerequisites. A clear definition of the operating environment ensures that the system can be built, run, and maintained consistently across different stages of the project lifecycle.

---

## 4.1 Hardware Requirements

The hardware requirements are divided into development and production (deployment) environments. Development needs are typical for a modern full-stack application; production requirements depend on the chosen hosting platform and expected load.

### 4.1.1 Development Environment

| Component        | Minimum Specification                    | Recommended Specification                 |
|------------------|------------------------------------------|------------------------------------------|
| **Processor**    | Dual-core, 2.0 GHz                       | Quad-core, 2.5 GHz or higher             |
| **RAM**          | 8 GB                                     | 16 GB or more                            |
| **Storage**      | 10 GB free space (SSD preferred)         | 20 GB free space (SSD)                   |
| **Display**      | 1366 × 768 resolution                    | 1920 × 1080 or higher                    |
| **Network**      | Broadband for API access and deployment | Stable broadband (e.g., 10 Mbps or more) |

Development involves running a Next.js frontend dev server, an Express backend server, and supporting tools (e.g., Node.js, package managers, IDE). Adequate RAM and storage improve build times and allow concurrent services without undue slowdown.

### 4.1.2 Production (Deployment) Environment

| Component        | Minimum Specification                    | Notes                                          |
|------------------|------------------------------------------|------------------------------------------------|
| **Server / Compute** | 1 vCPU, 512 MB RAM (e.g., free tier)   | Scale with traffic; 1 GB+ RAM recommended for backend |
| **Storage**      | 1 GB for application and logs            | Increase if persistent file storage is added  |
| **Network**      | Public internet, HTTPS support           | Required for API and frontend hosting          |

Production deployment may use platform-as-a-service (PaaS) offerings such as Vercel (frontend) and Render or AWS (backend), where compute and storage are provisioned by the provider according to the chosen plan.

---

## 4.2 Software Requirements

The software stack is organised by layer: runtime and toolchain, frontend, backend, external services, and supporting tools.

### 4.2.1 Runtime and Toolchain

| Software           | Version / Requirement        | Purpose                                      |
|--------------------|------------------------------|----------------------------------------------|
| **Node.js**        | 18.x or higher (LTS)         | Runtime for backend and frontend build tools |
| **Package manager**| pnpm 9.x (or npm / yarn)     | Dependency management and workspace support  |
| **TypeScript**     | 5.x                          | Static typing and compilation                |
| **Git**            | 2.x or higher                | Version control                               |

The project uses a Node.js-based monorepo; a single Node.js version supports both the Next.js application and the Express backend.

### 4.2.2 Frontend Stack

| Technology       | Version / Requirement   | Role in the System                          |
|------------------|-------------------------|---------------------------------------------|
| **Next.js**      | 16.x                    | React framework, App Router, SSR/SSG        |
| **React**        | 19.x                    | UI components and state management          |
| **Tailwind CSS** | 4.x                     | Styling and responsive layout               |
| **TypeScript**   | 5.x                     | Type-safe frontend code                      |

The frontend provides the user interface for file upload, language selection, progress indication, and download of the translated PDF.

### 4.2.3 Backend Stack

| Technology       | Version / Requirement   | Role in the System                          |
|------------------|-------------------------|---------------------------------------------|
| **Node.js**      | 18.x or higher          | Runtime                                     |
| **Express**      | 5.x                     | HTTP server and routing                     |
| **TypeScript**   | 5.x                     | Type-safe backend code                      |
| **unpdf**        | 1.x                     | PDF text extraction                         |
| **pdfkit**       | 0.15.x                  | PDF generation with Unicode fonts           |
| **multer**       | 2.x                     | Multipart file upload handling              |
| **dotenv**       | Latest                  | Environment and configuration management     |

The backend implements the extraction, translation, and PDF-building pipeline and exposes a REST API for the frontend.

### 4.2.4 External Services and APIs

| Service / API         | Purpose                    | Requirement                                  |
|-----------------------|----------------------------|----------------------------------------------|
| **Google Translate API** (or equivalent) | Machine translation | Valid API key; HTTPS access; adherence to quota and terms |
| **Font files**        | Unicode rendering in PDF   | Noto (or similar) fonts in project `fonts/` directory      |

The system depends on the availability and acceptable use policies of the chosen translation API. Font files are bundled or deployed with the application for correct rendering of multiple scripts.

### 4.2.5 Development and Support Tools

| Tool / Category   | Purpose                                      |
|-------------------|----------------------------------------------|
| **IDE / Editor**  | Code editing (e.g., VS Code, Cursor)         |
| **ESLint**        | Linting and code quality                    |
| **Prettier**      | Code formatting                             |
| **Postman / Insomnia** | API testing for backend endpoints     |
| **Browser**       | Testing frontend (Chrome, Firefox, Edge)     |
| **Docker**        | Optional containerisation for deployment    |

These tools support consistent development, testing, and deployment practices.

---

## 4.3 Development Environment Setup

The development environment is the configuration used by developers to run and test the application locally.

- **Repository:** The project is maintained in a Git repository (e.g., monorepo with `apps/frontend` and `apps/backend`). Developers clone the repository and install dependencies using the project’s package manager (e.g., `pnpm install`).

- **Frontend:** From the frontend app directory, `pnpm dev` (or `npm run dev`) starts the Next.js development server, typically at `http://localhost:3000`. Hot reload is available for rapid UI changes.

- **Backend:** From the backend app directory, `pnpm dev` (or equivalent) starts the Express server with a file watcher (e.g., tsx watch), typically at `http://localhost:4000`. Environment variables (e.g., `PORT`, `GOOGLE_TRANSLATE_API_KEY`) are loaded from a `.env` file.

- **Configuration:** API base URL for the frontend is set via `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:4000`) so that the client can reach the backend during development. Backend and frontend run concurrently; cross-origin requests are allowed via CORS configuration on the backend.

- **Fonts:** The PDF builder expects Noto (or similar) font files in the backend `fonts/` directory. Developers must ensure these files are present as per the project’s font documentation (e.g., `fonts/README.md`).

This setup allows full local execution of the upload–translate–download workflow for development and debugging.

---

## 4.4 Production and Deployment Environment

The production environment is where the application is hosted for end-users.

- **Frontend hosting:** The Next.js application is built (`pnpm build`) and deployed to a static or Node-compatible host. Platforms such as Vercel provide built-in support for Next.js, including server-side features if used. The build output is served over HTTPS.

- **Backend hosting:** The Express application is compiled to JavaScript (`pnpm build`), and the output (e.g., `dist/`) is run with Node.js (`node dist/index.js`). Deployment can be on a PaaS (e.g., Render, Railway, AWS Elastic Beanstalk) or on a virtual machine. Environment variables (e.g., `PORT`, `GOOGLE_TRANSLATE_API_KEY`) must be set in the hosting control panel or configuration. The `fonts/` directory (or equivalent) must be included in the deployment so that the PDF builder can load Unicode fonts.

- **Network and security:** The backend is exposed over HTTPS. API keys and secrets are not committed to the repository; they are supplied through the deployment environment. CORS is configured to allow requests from the frontend origin(s) only.

- **Scalability:** The backend is designed to be stateless; file processing uses in-memory or short-lived storage. Horizontal scaling can be achieved by running multiple instances behind a load balancer, subject to the constraints of the translation API (e.g., rate limits and quotas).

---

## 4.5 Client-Side (Browser) Requirements

End-users access GlobalPDF through a web browser. The following requirements ensure compatibility with the frontend and the upload–download workflow.

| Requirement            | Specification                                              |
|------------------------|------------------------------------------------------------|
| **Browser**            | Modern, evergreen browser (Chrome, Firefox, Edge, Safari)  |
| **JavaScript**         | Enabled                                                    |
| **Cookies / Storage**  | Standard behaviour (no specific persistent storage required for core flow) |
| **Resolution**        | Minimum 320 px width (responsive layout)                   |
| **Network**            | Stable internet connection for upload and download         |

The frontend uses standard web APIs (e.g., `fetch`, `FormData`, `Blob`, `URL.createObjectURL`) for file upload and PDF download. Browsers that support these APIs and meet the above criteria are sufficient for normal use.

---

## 4.6 Network and Connectivity Requirements

| Aspect              | Requirement                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Internet access** | Required for the client (upload, download) and for the server (translation API calls). |
| **Protocol**        | HTTPS in production for all traffic between client and server.             |
| **Firewall / proxy**| Outbound HTTPS (e.g., 443) to the translation API and any CDN or asset hosts. |
| **Latency**         | Translation API response time affects end-to-end duration; typical usage assumes normal broadband latency. |

No special network configuration is required beyond outbound HTTPS and correct DNS resolution for the chosen hosting domains.

---

## 4.7 Summary of Operating Environment

The following table summarises the main elements of the operating environment for quick reference.

| Category              | Development                          | Production / Client                          |
|------------------------|--------------------------------------|----------------------------------------------|
| **Hardware**           | 8 GB+ RAM, multi-core CPU, 10+ GB free storage | Provider-defined (e.g., 512 MB–1 GB RAM); client: modern device |
| **Runtime**            | Node.js 18+                          | Node.js 18+ (backend); browser (client)       |
| **Frontend**           | Next.js 16, React 19, Tailwind 4     | Same (built and deployed)                    |
| **Backend**            | Express 5, TypeScript, unpdf, pdfkit, multer | Same (compiled and run with Node)        |
| **External**           | Google Translate API, font files     | Same; API key and fonts configured in deployment |
| **Tools**              | Git, IDE, ESLint, Postman, Docker (optional) | N/A (deployment platform–specific)      |

---

A well-defined operating environment reduces setup errors, eases onboarding of developers, and clarifies the conditions under which the system is designed to operate. The specifications in this chapter are sufficient to develop, test, and deploy GlobalPDF in academic and small-scale production contexts. Subsequent chapters will cover system design, implementation details, and testing within this environment.

---

*This chapter has specified the hardware, software, development and production setups, client-side requirements, and network conditions for the GlobalPDF project. The next chapter will present the system design and architecture.*
