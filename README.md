# 🚀 Workspace AI – Intelligent AI-Powered Workspace Assistant

<p align="center">
  <b>An AI-powered productivity assistant that intelligently manages Gmail, Google Calendar, Tasks, and Documents using Large Language Models and Retrieval-Augmented Generation (RAG).</b>
</p>

---

## 📖 Overview

Workspace AI is a full-stack AI productivity platform designed to help users organize their daily work from a single interface.

Instead of manually switching between Gmail, Google Calendar, Notes, Tasks, and PDFs, Workspace AI understands natural language and performs intelligent actions using AI agents.

The system combines:

- 📧 Gmail
- 📅 Google Calendar
- ✅ Task Management
- 📄 Document Intelligence (RAG)
- 🤖 AI Planner
- 🧠 Conversation Memory


to create an intelligent workspace assistant.

---

# ✨ Features

## 🤖 AI Assistant

- Natural language conversations
- Context-aware responses
- Multi-turn conversation memory
- AI Planner for intent detection
- Tool Routing
- Entity Resolution
- Response Formatting

Examples

> Show my unread emails

> Summarize today's schedule

> Create a task to finish the report tomorrow

> What qualifications are expected from the Swym JD?

---

## 📧 Gmail Integration

- Gmail OAuth Authentication
- Inbox Retrieval
- Smart Email Prioritization
- Email Categorization
- AI Email Summarization
- Search Emails

Categories include

- Interview
- Job
- Finance
- Education
- Project
- Legal
- Promotion
- Social

---

## 📅 Google Calendar

- View Events
- Create Events
- Update Events
- Delete Events
- AI Calendar Summary
- Priority Ranking
- Today's Schedule
- Upcoming Meetings

---

## ✅ Task Management

- Create Tasks
- Edit Tasks
- Delete Tasks
- Mark Complete
- AI Generated Tasks
- Priority Management
- Due Date Tracking

---

# 📄 Knowledge Base (RAG)

Workspace AI includes a complete Retrieval-Augmented Generation pipeline.

Supported Documents

- PDF
- DOCX
- TXT

Pipeline

Document Upload

↓

Text Extraction

↓

Chunking

↓

Embedding Generation

↓

Vector Database (pgvector)

↓

Semantic Retrieval

↓

AI Answer Generation

Example

> What is the CTC mentioned in the offer letter?

> What projects have I completed?

> What are the required qualifications?

---


# 🧠 AI Architecture

Workspace AI follows an AI Agent architecture.

```
User
   │
   ▼
Conversation Memory
   │
   ▼
AI Planner
   │
   ▼
Tool Router
   │
   ├── Gmail
   ├── Calendar
   ├── Tasks
   └── RAG
   │
   ▼
Response Formatter
   │
   ▼
User
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Bootstrap 5
- Axios
- React Router

---

## Backend

- Node.js
- Express.js

---

## Database

- Supabase PostgreSQL
- pgvector

---

## AI

- Google Gemini
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- AI Planner
- AI Orchestrator

---

## Authentication

- JWT Authentication
- Google OAuth 2.0

---

## External APIs

- Gmail API
- Google Calendar API

---

# 📁 Project Structure

```
Workspace-AI
│
├── frontend
│
├── backend
│   ├── ai
│   ├── config
│   ├── middleware
│   ├── modules
│   │
│   ├── gmail
│   ├── calendar
│   ├── tasks
│   ├── rag
│   ├── auth
│   ├── conversation
│   ├── entity
│   └── toolMemory
│
└── README.md
```

---

# 🔥 Core Modules

## Authentication

- Register
- Login
- JWT
- Google OAuth

---

## Gmail Module

- Fetch Inbox
- Search Emails
- Email Statistics
- Email Ranking
- Email Summarization

---

## Calendar Module

- Fetch Calendar
- Create Meeting
- Update Meeting
- Delete Meeting

---

## Task Module

- CRUD Operations
- AI Task Creation

---

## RAG Module

- Upload Documents
- Index Documents
- Semantic Search
- AI Question Answering

---

## Planner

Converts natural language into structured tool execution.

Example

User

```
Show my unread interview emails
```

Planner

```json
{
  "action":"tool",
  "tool":"searchEmails"
}
```

---

# 💡 Example Queries

### Gmail

- Show unread emails
- Show interview emails
- Summarize inbox

### Calendar

- What's on my schedule today?
- Create a meeting tomorrow at 3 PM

### Tasks

- Create a task to complete DSA revision
- Show pending tasks

### Knowledge

- Summarize this document
- What is the CTC?
- What technologies are required?

---

# 🚀 Key Highlights

✅ AI Planner

✅ Tool Router

✅ Gmail Integration

✅ Google Calendar Integration

✅ JWT Authentication

✅ Google OAuth

✅ Retrieval-Augmented Generation

✅ pgvector Semantic Search

✅ Automatic Gmail Attachment Indexing

✅ Conversation Memory

✅ Tool Memory

✅ Entity Resolution

✅ Responsive UI

---

# 📊 Future Improvements

- Multi-user Workspaces
- Voice Assistant
- Slack Integration
- Microsoft Outlook Integration
- Teams Integration
- Notification Center
- Mobile Application
- AI Meeting Minutes
- AI Daily Planner
- AI Email Draft Generation

---

# 📷 Screenshots

### Login Page
<img width="953" height="473" alt="Screenshot 2026-07-11 204542" src="https://github.com/user-attachments/assets/1ddbb783-79a2-43cb-b428-817462b9ad87" />

### Dashboard
<img width="948" height="443" alt="Screenshot 2026-07-11 204626" src="https://github.com/user-attachments/assets/c2227722-ec54-4163-bda8-ede4dceea7be" />

### AI Chat Page
<img width="955" height="467" alt="Screenshot 2026-07-11 204723" src="https://github.com/user-attachments/assets/7754c21c-97ab-40e5-8504-2d3f40cad7bd" />

### RAG Page
<img width="944" height="472" alt="Screenshot 2026-07-11 205027" src="https://github.com/user-attachments/assets/ab26a8d2-1f71-4dd9-bc7a-bea295793d3c" />

### Google Email Page 
<img width="934" height="476" alt="Screenshot 2026-07-11 205044" src="https://github.com/user-attachments/assets/260d04f5-82fc-422a-a569-dcddb67a05f9" />

### Google Calender
<img width="949" height="439" alt="Screenshot 2026-07-11 205308" src="https://github.com/user-attachments/assets/ab36ef36-716c-4092-9d14-3cb128d522d1" />

### Task Page
<img width="940" height="430" alt="Screenshot 2026-07-11 205438" src="https://github.com/user-attachments/assets/86f3cee5-42e5-4fed-9792-f69f8d50a4d2" />

### Settings Page
<img width="946" height="440" alt="Screenshot 2026-07-11 205453" src="https://github.com/user-attachments/assets/3128f279-c2f6-4bd1-a13c-eb195b288ae8" />


---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/workspace-ai.git
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Environment Variables

```
SUPABASE_URL=

SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=

GEMINI_API_KEY=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REDIRECT_URI=
```

---

# 🎯 Purpose

Workspace AI was developed to demonstrate the practical integration of Artificial Intelligence into everyday productivity workflows.

The project showcases how Large Language Models can orchestrate multiple enterprise services such as Gmail, Google Calendar, Task Management, and Retrieval-Augmented Generation to provide an intelligent workspace experience.

---

# 👨‍💻 Author

## Vishal Raman V

B.Tech Information Technology

SASTRA University

GitHub:
https://github.com/Vishalraman-26

LinkedIn:
https://www.linkedin.com/in/vishal-raman-v-762857300/

---

# ⭐ If you found this project useful, consider giving it a star!
