# Mitra — Frontend

The React frontend for **Mitra**, an adaptive conversational companion. It provides account sign-in, a chat interface, mode-aware conversations and message feedback, and communicates with the Mitra FastAPI backend.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Mitra-647B63?style=for-the-badge)](https://mitra-frontend-ivory.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-UI-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

## Overview

Mitra is designed to adapt its conversational style to the user's messages. The interface supports three conversation modes:

- **Friend** — warm, conversational responses.
- **Guide** — structured, practical guidance.
- **Therapist** — reflective, empathetic responses.

The backend determines the mode when automatic mode is selected. These labels describe response styles, not professional or clinical services.

## Features

- Sign in and sign up with Google or email/password using Firebase Authentication.
- Chat interface with a sidebar and session-aware conversations.
- Automatic mode selection or a selected conversation mode.
- Display the mode used for each assistant response.
- Submit thumbs-up or thumbs-down feedback on assistant messages.
- Communicate with the FastAPI service through an environment-configured API URL.

## Architecture

```mermaid
flowchart LR
    U[User] --> FE[React frontend]
    FE --> AUTH[Firebase Authentication]
    FE --> API[FastAPI backend]
    API --> DB[(Firebase Firestore)]
    API --> LLM[Groq API]
    API --> PE[Pattern engine]
    PE --> LLM
    LLM --> API
    API --> FE
```

The frontend is maintained separately from the backend:

- **Frontend:** [mitra-frontend](https://github.com/ManojKumarBhagavatula/mitra-frontend)
- **Backend:** [mitra-backend](https://github.com/ManojKumarBhagavatula/mitra-backend)

## Tech Stack

| Area | Technology |
|---|---|
| UI | React 18 |
| Styling | Tailwind CSS |
| Authentication | Firebase Authentication |
| HTTP requests | Axios |
| API | FastAPI backend |

## Run Locally

### Prerequisites

- Node.js and npm
- A Firebase project with a Web App registered
- The Mitra backend running locally or deployed

### 1. Clone and install

```bash
git clone https://github.com/ManojKumarBhagavatula/mitra-frontend.git
cd mitra-frontend
npm install
```

### 2. Configure Firebase

In the Firebase Console:

1. Create or select your Firebase project.
2. Register a Web App and copy its Firebase configuration.
3. Enable **Google** and **Email/Password** under Authentication → Sign-in method.
4. Update the configuration values in `src/firebase.js`.

Firebase web configuration is intended to be present in client applications. Protect your project with appropriate Firebase Authentication settings, authorized domains and Firestore security rules. Never place service-account credentials or private server API keys in frontend code.

### 3. Configure the backend URL

Copy the example environment file:

```bash
cp .env.example .env.local
```

Set the backend URL in `.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000
```

For a deployed frontend, set `REACT_APP_API_URL` to the deployed backend's base URL in your hosting provider's environment settings.

### 4. Start the development server

```bash
npm start
```

The React development server runs at [http://localhost:3000](http://localhost:3000).

### 5. Create a production build

```bash
npm run build
```

## Deployment

The frontend can be deployed to Vercel:

1. Import this GitHub repository into Vercel.
2. Set `REACT_APP_API_URL` to the deployed FastAPI backend URL.
3. Add your deployed frontend domain to Firebase Authentication's authorized domains.
4. Deploy the application.

See the [Vercel documentation](https://vercel.com/docs) for framework and deployment settings.

## Related Links

- [Live application](https://mitra-frontend-ivory.vercel.app/)
- [Backend repository and API setup](https://github.com/ManojKumarBhagavatula/mitra-backend)
- [Firebase documentation](https://firebase.google.com/docs)
- [React documentation](https://react.dev/)

---

<div align="center">

Part of the **Mitra Adaptive Companion Chatbot** project.

</div>
