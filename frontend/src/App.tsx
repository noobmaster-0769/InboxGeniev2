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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-indigo-400/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-pink-400/50 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-violet-400/30 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-1/4 right-1/2 w-1 h-1 bg-blue-400/40 rounded-full animate-bounce" style={{animationDelay: '4s'}}></div>
            
            {/* Animated gradient orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            
            {/* Floating geometric shapes */}
            <div className="absolute top-1/4 right-1/4 w-8 h-8 border border-purple-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
            <div className="absolute bottom-1/4 left-1/4 w-6 h-6 border border-indigo-400/30 rounded-full animate-ping"></div>
        </div>

        <div className="relative z-10 text-center px-4">
            {/* Aesthetic Title with subtle glowing envelope behind */}
            <div className="relative flex items-center justify-center mb-6">
                {/* Decorative envelope glow behind the title */}
                <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-6 md:-top-8 w-44 h-44 md:w-56 md:h-56 opacity-50 blur-sm animate-float"
                    viewBox="0 0 200 200"
                >
                    <defs>
                        <radialGradient id="gradGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="url(#gradGlow)" />
                    <g transform="translate(40,60)" fill="none" stroke="#c4b5fd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="0" y="0" width="120" height="80" rx="14" ry="14" opacity="0.85" />
                        <path d="M4 10 L60 52 L116 10" opacity="0.95" />
                    </g>
                </svg>

                <h1 className="relative text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(147,51,234,0.35)]">
                    InboxGenie
                </h1>
            </div>
            
            <p className="max-w-[600px] text-purple-200 md:text-xl mb-10 mx-auto animate-fade-in">
                Transform Your Email Experience with AI Intelligence.
            </p>
            
            <div className="flex justify-center">
                <button 
                    onClick={onLogin} 
                    disabled={loading} 
                    className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                    {loading ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" /> 
                            Connecting...
                        </>
                    ) : (
                        <>
                            <span className="group-hover:hidden">Login</span>
                            <span className="hidden group-hover:inline-flex items-center gap-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                Continue with Google
                            </span>
                        </>
                    )}
                </button>
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

