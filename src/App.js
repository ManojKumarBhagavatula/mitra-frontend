// src/App.js
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

function AppRoutes() {
  const { user } = useAuth();
  return user ? <Chat /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
