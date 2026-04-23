<div align="center">

  <img src="https://img.icons8.com/color/96/000000/shield.png" alt="ReliefSync Shield" width="100" height="100">

  # 🌍 ReliefSync AI Platform

  <p align="center">
    <strong>An Intelligent, Full-Stack Operations & Field Management Ecosystem for NGOs</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/AI_Powered-Gemini_%7C_OpenAI-FF6F00?style=for-the-badge&logo=google&logoColor=white" alt="AI" />
  </p>

  <h3>
    <a href="#-overview">Overview</a>
    <span> · </span>
    <a href="#-key-features">Features</a>
    <span> · </span>
    <a href="#-system-architecture">Architecture</a>
    <span> · </span>
    <a href="#-tech-stack">Tech Stack</a>
    <span> · </span>
    <a href="#-getting-started">Getting Started</a>
  </h3>
</div>

---

## 📋 Overview

> **ReliefSync AI** is a comprehensive, full-stack application engineered to revolutionize how Non-Governmental Organizations (NGOs) handle emergency response and volunteer coordination. 

The platform utilizes advanced **Large Language Models (LLMs)** to automatically parse unstructured field reports (Text and PDFs) into structured emergency needs. It then employs a custom **neural matching algorithm** to instantly deploy the most qualified volunteers based on location, skills, and availability, radically reducing response times during critical incidents.

<br />

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🧠 Artificial Intelligence Integration</h3>
      <ul>
        <li><strong>Automated Intel Parsing:</strong> Upload raw field reports or complex PDF situation assessments. The backend seamlessly extracts critical data (location, required skills, severity) using OpenAI/Google Generative AI.</li>
        <li><strong>Smart Operative Matching:</strong> A proprietary matching engine scores available volunteers against emergency requirements, ensuring the right personnel are dispatched to the right location.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🛡️ Secure Backend Infrastructure</h3>
      <ul>
        <li><strong>JWT Authentication:</strong> Role-based access control (RBAC) separating NGO administrators from standard operatives. Secure password hashing with <code>bcryptjs</code>.</li>
        <li><strong>Robust API Design:</strong> A fully decoupled RESTful API built with Express and Mongoose, featuring data validation, secure CORS policies, and Helmet for HTTP header security.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <h3>💻 Professional Frontend Dashboard</h3>
      <ul>
        <li><strong>SaaS Aesthetic UI:</strong> A clean, highly professional, light-themed interface built with React and Tailwind CSS. Emphasizes typography, structure, and readability for high-stress operational environments.</li>
        <li><strong>Real-Time Operations:</strong> Track active missions, pending intelligence reports, and global personnel networks from a unified, highly responsive Mission Control dashboard.</li>
      </ul>
    </td>
  </tr>
</table>

<br />

## 🏗 System Architecture

The application is structured as a Monorepo containing fully decoupled Frontend and Backend services for maximum scalability.

<details>
<summary><b>Click to expand project structure</b></summary>
<br/>

```text
ReliefSync-AI/
├── Backend/                 # Node.js & Express API Server
│   ├── src/
│   │   ├── controllers/     # Business logic (Auth, Needs, Volunteers, Matching)
│   │   ├── models/          # Mongoose Schemas (MongoDB)
│   │   ├── routes/          # API Endpoint definitions
│   │   ├── middleware/      # JWT verification, upload handling
│   │   └── utils/           # AI service wrappers (Gemini/OpenAI), PDF parsers
│   ├── uploads/             # Ignored directory for temporary PDF storage
│   ├── server.js            # Express server initialization
│   └── .env                 # Backend secrets (MONGO_URI, AI_KEYS, JWT_SECRET)
│
├── Frontend/                # React 19 & Vite Client Application
│   ├── src/
│   │   ├── api/             # Axios interceptors for JWT injection
│   │   ├── components/      # UI elements (Buttons, Inputs, Sidebar)
│   │   ├── pages/           # Views (Dashboard, Volunteers, Reports, Matching)
│   │   └── layouts/         # Structural wrappers
│   ├── tailwind.config.js   # SaaS-style design tokens
│   └── .env                 # Frontend configs (VITE_API_BASE_URL)
│
└── .gitignore               # Root level git ignore
```
</details>

<br />

## 🛠 Tech Stack

<div align="center">
  
  | Frontend | Backend | AI & Utilities |
  | :--- | :--- | :--- |
  | **React 19** | **Node.js (v18+)** | **Google Generative AI** |
  | **Vite** | **Express.js (v5)** | **OpenAI API** |
  | **Tailwind CSS v3** | **MongoDB & Mongoose** | **PDF2JSON** |
  | **React Router v7** | **JWT Authentication** | **Nodemailer** |
  | **Lucide React Icons** | **Bcryptjs & Helmet** | **Multer** |

</div>

<br />

## 🚀 Getting Started

Follow these instructions to run the full stack locally.

### ⚙️ Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **API Keys** for OpenAI or Google Gemini

---

### 1️⃣ Backend Setup

Open your terminal and navigate to the backend directory:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and add the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reliefsync
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_api_key
# OPENAI_API_KEY=your_openai_api_key
```

Start the backend development server:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend client:

```bash
npm run dev
```

---

### 3️⃣ Access the Platform

Navigate to `http://localhost:5173` in your browser. Register a new NGO account to initialize the database and access the secure operations dashboard.

<br />


