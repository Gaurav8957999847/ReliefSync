![ReliefSync AI Banner](file:///C:/Users/HP/.gemini/antigravity/brain/0680ec98-55f0-4458-a0f1-c089b4bc2e97/reliefsync_banner_1776952604092.png)

# 🌍 ReliefSync AI
### *Intelligence-Driven Disaster Relief Coordination*

**ReliefSync AI** is a cutting-edge backend ecosystem designed to revolutionize disaster response operations. In the chaos of humanitarian crises, data is often unstructured, fragmented, and delayed. ReliefSync AI bridges this gap by leveraging **Generative AI** to transform raw community reports into structured, actionable intelligence, enabling NGOs to deploy resources with surgical precision and unprecedented speed.

---

## 🚀 Key Features

- **🤖 AI-Powered Information Extraction**: Utilizes **OpenAI's GPT-4o-mini** to parse unstructured text and PDF reports, automatically identifying locations, crisis types, affected populations, and required skills.
- **📝 Intelligent Need Summarization**: Automatically generates concise, professional 140-word briefings for field coordinators, distilling complex crisis data into actionable insights.
- **🎯 Precision Matching Engine**: A multi-factor scoring algorithm that ranks volunteers based on skill relevance (semantic matching), geographical proximity, and real-time availability.
- **📄 Industrial-Strength Document Processing**: Asynchronous PDF ingestion pipeline using `multer` and `pdf2json` for handling large-scale field reports.
- **🔐 Enterprise Security Architecture**: Robust Role-Based Access Control (RBAC) powered by JWT, BcryptJS, and automated security headers via Helmet.js.
- **📧 Real-time Alerts**: Automated notification system via Nodemailer for critical need alerts and volunteer assignments.
- **📊 Operational Dashboard**: Centralized intelligence hub providing real-time statistics on reports, active needs, and volunteer deployments.

---

## 🛠️ Technical Ecosystem

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js (LTS) | High-concurrency event-driven environment. |
| **Framework** | Express.js | Modular API architecture with ES Modules. |
| **Intelligence** | OpenAI GPT-4o-mini | State-of-the-art LLM for data extraction and NLP. |
| **Database** | MongoDB | Distributed NoSQL storage for flexible schema handling. |
| **ODM** | Mongoose | Elegant object modeling for Node.js and MongoDB. |
| **Auth** | JWT & BcryptJS | Stateless authentication and secure password hashing. |
| **Security** | Helmet & CORS | Production-grade middleware for API protection. |
| **Communication**| Nodemailer | Reliable SMTP integration for automated alerts. |

---

## 🧠 Core Intelligence & Logic

### 🧬 AI Extraction & Caching Strategy
ReliefSync AI implements a high-performance caching layer to minimize LLM latency and cost:
1.  **SHA-256 Hashing**: Incoming reports are hashed to generate unique cache keys.
2.  **In-Memory Cache**: Rapid retrieval of previously processed reports.
3.  **JSON Transformation**: OpenAI is prompted with strict schemas to ensure 100% downstream compatibility with the matching engine.

### 🎯 Smart Matching Algorithm
Deployment suitability is calculated using a weighted suitability matrix:
-   **Skill Correlation (25 pts/skill)**: Semantic analysis between volunteer expertise and crisis requirements.
-   **Geographical Proximity (30 pts)**: Weighted scoring to prioritize local responders and reduce deployment lag.
-   **Availability State (20 pts)**: Real-time filtering and weighting based on current volunteer status.

---

## 🔌 API Reference (v1)

### 🔑 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register User, NGO, or Volunteer entities. |
| `POST` | `/api/auth/login` | Authenticate and receive JWT. |
| `GET` | `/api/auth/me` | Retrieve current authenticated user profile. |

### 📋 Reports & Needs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/reports/text` | Submit raw text community report. |
| `POST` | `/api/reports/pdf` | Upload PDF report for AI analysis. |
| `GET` | `/api/reports` | List all submitted reports. |
| `GET` | `/api/needs` | Fetch all active AI-generated relief needs. |
| `POST` | `/api/summaries/generate`| Generate AI summary for a specific need. |

### 🤝 Matching & Assignments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/matching/needs/:id/recommendations` | Get ranked volunteer matches. |
| `POST` | `/api/assignments` | Deploy volunteer to a need. |
| `PATCH`| `/api/assignments/:id/status` | Update assignment status (active/completed). |

---

## 📂 Project Architecture

```text
src/
├── config/             # Database & global configurations
├── controllers/        # Request handlers & logic orchestration
├── middlewares/        # Auth, error handling & security
├── models/             # Mongoose schemas & data definitions
├── repositories/       # Data access layer (Abstraction over Mongoose)
├── routes/             # Express route definitions
├── services/           # Core business & AI logic
└── utils/              # Helper functions & constants
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local or Atlas)
- **OpenAI API Key** (for GPT-4o-mini access)

### 2. Quick Start
```bash
# Clone the repository
git clone https://github.com/Gaurav8957999847/ReliefSync.git

# Enter project directory
cd ReliefSync-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
OPENAI_API_KEY=your_openai_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

