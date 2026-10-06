# Virtual Office
# Flowbit 🚀

Flowbit is a virtual office and collaboration platform designed for distributed teams to communicate, collaborate, and manage work seamlessly within a virtual workspace.

---

## 🏗️ Project Structure

```text
Flowbit/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── realtime-backend/
│   ├── socket/
│   │   ├── rooms.js
│   │   └── signaling.js
│   ├── server.js
│   └── package.json
│
└── ml/
    ├── models/
    ├── scripts/
    │   ├── summarize.py
    │   └── task_extractor.py
    ├── app.py
    └── requirements.txt


Modules
Frontend
- User Interface
- Authentication
- Virtual Workspaces
- Rooms
- Task Management
- Meetings
- Collaboration


Backend
- REST APIs
- User Authentication
- JWT Authorization
- Workspace Management
- Room Management
- Task Management
- Meeting Management
- Email OTP Verification


Real-Time Backend
- Socket.IO Communication
- Room Management
- User Presence
- WebRTC Signaling
- Video & Audio Communication
- Screen Sharing


Machine Learning
- ML-based project features
- Data processing
- Model integration
- AI-assisted collaboration features


Tech Stack
Module	Technologies
Frontend	React, Vite
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Authentication	JWT, bcrypt
Email	Resend
Real-Time	Socket.IO
Communication	WebRTC
Machine Learning	Python, ML


Key Features
- 🔐 Secure Authentication
- 🏢 Virtual Workspaces
- 🚪 Interactive Rooms
- 📋 Task Management
- 📅 Meeting Management
- 🎥 Real-Time Video & Audio
- 🖥️ Screen Sharing
- 💬 Team Collaboration
- 🤖 ML/AI-Assisted Features

Future Enhancements
- AI Meeting Summaries
- AI Task Extraction
- Advanced Analytics
- Hybrid Office Support
- Employee Recognition

