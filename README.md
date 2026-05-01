# Mitra Frontend

React + Tailwind CSS frontend for the Mitra chatbot with Firebase Auth.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add Firebase web config
- Go to Firebase Console → Project Settings → Your Apps
- Click "Add app" → Web → Register
- Copy the config object
- Paste into `src/firebase.js`

### 3. Enable Firebase Auth
- Firebase Console → Authentication → Get Started
- Enable: **Google** and **Email/Password** providers

### 4. Set API URL
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
REACT_APP_API_URL=http://localhost:8000
```
For production, replace with your Render URL.

### 5. Run
```bash
npm start
```
Opens at http://localhost:3000

## Project Structure
```
src/
├── firebase.js          # Firebase config
├── App.js               # Root — shows Login or Chat based on auth
├── context/
│   └── AuthContext.js   # Auth state provider
├── hooks/
│   └── useChat.js       # API calls to FastAPI backend
└── pages/
    ├── Login.jsx        # Google + Email/Password login
    └── Chat.jsx         # Main chat UI with sidebar
```

## Deploy (Vercel — free)
```bash
npm install -g vercel
vercel
```
Set `REACT_APP_API_URL` to your Render backend URL in Vercel dashboard.
