import { useState, useMemo, useEffect } from "react";
import { 
  Sparkles,
  Inbox,
  Star,
  Send,
  Search,
  Mail,
  LogOut,
  LogIn,
  RefreshCw,
  X,
  FileText,
  AlertTriangle,
  CheckCircle,
  ShoppingBag
} from "lucide-react";

// Integration: Import the API functions from the correct relative path
import { getGoogleLoginUrl, fetchEmails } from "./services/api.ts";

// --- TYPE DEFINITIONS ---
export interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  content?: string;
  category: 'Urgent' | 'Task' | 'Important' | 'Promotion' | 'General';
  status: 'inbox' | 'archived' | 'trashed';
  isStarred: boolean;
  date: string;
  isRead: boolean;
  aiSummary?: string;
}

// ############################################################################
// --- CHILD COMPONENTS ---
// ############################################################################

const Sidebar: React.FC<{ 
    onLogout: () => void; 
    activeCategory: string; 
    setActiveCategory: (category: string) => void; 
    counts: {unread: number; starred: number;} 
}> = ({ onLogout, activeCategory, setActiveCategory, counts }) => {
    
    const navItems = [
        { name: 'All', icon: Inbox, count: null},
        { name: 'Urgent', icon: AlertTriangle, count: null },
        { name: 'Important', icon: CheckCircle, count: null },
        { name: 'Promotion', icon: ShoppingBag, count: null },
        { name: 'Unread', icon: FileText, count: counts.unread },
        { name: 'Starred', icon: Star, count: counts.starred },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-4 flex flex-col border-r border-slate-700/50">
            <div className="flex items-center gap-3 mb-8 pt-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Mail className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">InboxGenie</h1>
            </div>

            <nav className="space-y-1 flex-1">
                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Smart Categories</h3>
                {navItems.map((item) => (
                    <button key={item.name} onClick={() => setActiveCategory(item.name)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${activeCategory === item.name ? 'bg-purple-600/30 text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}>
                        <span className="flex items-center gap-3"><item.icon className="w-5 h-5" /> <span className="font-semibold">{item.name}</span></span>
                        {item.count !== null && item.count > 0 && (<span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full">{item.count}</span>)}
                    </button>
                ))}
            </nav>

            <div className="mt-6">
                <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Features</h3>
                <div className="space-y-2">
                    <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-105 transition-transform"><Sparkles className="w-5 h-5"/> Smart Compose</a>
                </div>
            </div>

            <div className="mt-6">
                <button onClick={onLogout} className="w-full bg-red-600/80 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </aside>
    );
};


const LoginPage: React.FC<{ onLogin: () => void; loading: boolean; }> = ({ onLogin, loading }) => (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-purple-900 flex items-center justify-center overflow-hidden">
        <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl"><Mail className="w-7 h-7 text-white" /></div>
            <span className="text-2xl font-bold text-white">InboxGenie</span>
        </div>
        <div className="relative z-10 text-center px-4">
            <div className="backdrop-blur-2xl bg-black/20 rounded-3xl shadow-2xl border border-white/20 p-12 max-w-2xl mx-auto">
                <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">Welcome to InboxGenie</h1>
                <p className="text-xl text-purple-200 font-medium mb-10">Transform Your Email Experience with AI Intelligence.</p>
                <button onClick={onLogin} disabled={loading} className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? (<><RefreshCw className="w-5 h-5 animate-spin" /> Connecting...</>) : (<><LogIn className="w-5 h-5" /> Sign in with Google</>)}
                </button>
            </div>
        </div>
    </div>
);

// ############################################################################
// --- MAIN APP COMPONENT ---
// ############################################################################

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleLogin = () => {
    setLoadingLogin(true);
    window.location.href = getGoogleLoginUrl();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} loading={loadingLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}


// --- DASHBOARD COMPONENT ---
const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);

  const loadEmails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEmails();
      setEmails(data);
    } catch (err) {
      console.error("Failed to load emails:", err);
      setError("Could not retrieve emails.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, []);

  const handleEmailClick = (id: string) => {
    setExpandedEmailId(expandedEmailId === id ? null : id);
  };
  
  const filteredEmails = useMemo(() => {
    let tempEmails = emails;

    if (activeCategory !== 'All') {
        if (activeCategory === 'Unread') {
            tempEmails = tempEmails.filter(e => !e.isRead);
        } else if (activeCategory === 'Starred') {
            tempEmails = tempEmails.filter(e => e.isStarred);
        } else {
            tempEmails = tempEmails.filter(e => e.category === activeCategory);
        }
    }
    
    if (searchQuery) {
        tempEmails = tempEmails.filter(e =>
            e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return tempEmails;
  }, [emails, activeCategory, searchQuery]);

  const counts = {
    unread: emails.filter(e => !e.isRead).length,
    starred: emails.filter(e => e.isStarred).length,
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#1e1b4b] to-[#4c1d95] font-['Inter',_sans-serif] text-gray-200">
      <Sidebar onLogout={onLogout} activeCategory={activeCategory} setActiveCategory={setActiveCategory} counts={counts}/>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-end p-4 border-b border-gray-500/50 flex-shrink-0">
          <div className="relative w-1/2 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
           {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">Loading emails...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">{error}</div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">No emails found.</div>
          ) : (
             filteredEmails.map((email) => (
                <EmailItem 
                    key={email.id} 
                    email={email} 
                    isExpanded={expandedEmailId === email.id}
                    onEmailClick={handleEmailClick}
                />
             ))
          )}
        </div>
      </main>
    </div>
  );
};

const EmailItem: React.FC<{ email: Email; isExpanded: boolean; onEmailClick: (id: string) => void; }> = ({ email, isExpanded, onEmailClick }) => {
    const [showSummary, setShowSummary] = useState(false);

    return (
        <div onClick={() => onEmailClick(email.id)} className={`p-4 border-b border-gray-500/50 cursor-pointer hover:bg-purple-900/20 ${!email.isRead ? 'bg-purple-900/10' : ''} ${isExpanded ? 'bg-purple-900/30' : ''}`}>
            <div className="flex items-center">
                 <div className="flex-shrink-0 mr-4">
                    <button onClick={(e) => { e.stopPropagation(); /* handle star */ }}>
                        <Star className={`h-5 w-5 transition-colors duration-200 ${email.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-500 hover:text-yellow-400'}`} />
                    </button>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                        <p className="font-semibold text-gray-200 truncate">{email.sender}</p>
                        <p className="text-sm text-gray-400">{email.date}</p>
                    </div>
                    <p className="font-normal text-gray-300 truncate">{email.subject}</p>
                    {!isExpanded && <p className="text-sm text-gray-400 truncate">{email.snippet}</p>}
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 pl-14">
                    <p className="text-slate-300 whitespace-pre-wrap">{email.content || email.snippet}</p>
                    <div className="mt-4">
                        <button onClick={(e) => { e.stopPropagation(); setShowSummary(!showSummary);}} className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-md transition-colors">
                            <Sparkles className="w-4 h-4" /> {showSummary ? "Hide AI Summary" : "Show AI Summary"}
                        </button>
                    </div>
                    {showSummary && email.aiSummary && (
                         <div className="mt-3 bg-slate-800/50 p-3 rounded-md border border-slate-700">
                             <p className="text-sm text-slate-300">{email.aiSummary}</p>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default App;

