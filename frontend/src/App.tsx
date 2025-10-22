import React, { useState, useEffect } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import { getGoogleLoginUrl, fetchEmails } from "./services/api";

// --- TYPE DEFINITIONS ---
export interface Email {
  id: string; 
  sender: string;
  subject: string;
  snippet: string;
  content?: string; // Full content
  category: 'Urgent' | 'Task' | 'Important' | 'Promotion' | 'General';
  status: 'inbox' | 'archived' | 'trashed';
  isStarred: boolean;
  date: string;
  isRead: boolean;
  aiSummary?: string;
}

/**
 * Landing Page Component
 * The view for an unauthenticated user, matching 'main.pdf' (Page 2)
 */
const LoginPage: React.FC<{ onLogin: () => void; loading: boolean; }> = ({ onLogin, loading }) => (
    <div className="relative min-h-screen bg-gradient-to-b from-[#1e1b4b] to-[#4c1d95] flex items-center justify-center overflow-hidden text-white">
        <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-4">InboxGenie</h1>
            <p className="max-w-[600px] text-purple-200 md:text-xl mb-10 mx-auto">Transform Your Email Experience with AI Intelligence.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button onClick={onLogin} disabled={loading} className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (<><RefreshCw className="w-5 h-5 animate-spin" /> Connecting...</>) : (<>Sign Up <ArrowRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" /></>)}
                </button>
                 <button onClick={onLogin} className="inline-flex h-12 items-center justify-center rounded-full bg-gray-700/50 px-8 text-md font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:scale-105">Login</button>
            </div>
        </div>
    </div>
);

// ############################################################################
// --- MAIN APP COMPONENT ---
// ############################################################################
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to Google OAuth
      window.location.href = getGoogleLoginUrl();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any stored tokens/session data
    localStorage.removeItem('auth_token');
  };

  // Check if user is already authenticated (you might want to verify this with the backend)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch emails to check if user is authenticated
        const emails = await fetchEmails();
        if (emails.length >= 0) { // Even empty array means authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Not authenticated
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} loading={isLoading} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;

