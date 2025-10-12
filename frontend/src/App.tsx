import { useState, useMemo } from "react";
import { 
  ArrowRight, 
  Sparkles,
  Plus,
  Inbox,
  Star,
  Send,
  Archive,
  Trash2,
  Search,
  Filter,
} from "lucide-react";

import AIComposer from "./components/AIComposer"; 
import EmailCard, { Email } from "./components/EmailCard";
import InboxHeader from "./components/InboxHeader";

const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const threeDaysAgo = new Date(today); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
const lastMonth = new Date(today); lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastYear = new Date(today); lastYear.setFullYear(lastYear.getFullYear() - 1);


const initialEmails: Email[] = [
    { id: 1, sender: 'Sarah Johnson', subject: 'Urgent: Q4 Marketing Strategy Review', content: 'Hi team,\n\nI\'ve finalized the draft for our Q4 marketing strategy...', category: 'Urgent', status: 'inbox', summary: 'Sarah requires an urgent team review of the Q4 marketing document.', isStarred: true, date: today.toISOString() },
    { id: 2, sender: 'Project Manager', subject: 'Action Required: Update Project Timeline', content: 'Team,\n\nPlease update the timeline for the Phoenix project in Asana by EOD...', category: 'Task', status: 'inbox', summary: 'Immediate update to the Phoenix project timeline is required.', isStarred: false, date: yesterday.toISOString() },
    { id: 3, sender: 'Figma', subject: 'New! FigJam Plugins and Widgets', content: 'Unleash your team\'s creativity with plugins and widgets, now available in FigJam!...', category: 'Promotion', status: 'inbox', summary: 'Figma has launched new plugins and widgets for FigJam.', isStarred: false, date: threeDaysAgo.toISOString() },
    { id: 4, sender: 'Alex Chen', subject: 'Follow-up: Project Collaboration Opportunity', content: 'Hi there,\n\nI hope this email finds you well. I\'m writing to follow up on our discussion...', category: 'Important', status: 'inbox', summary: 'Alex Chen is following up on a collaboration proposal.', isStarred: false, date: lastWeek.toISOString() },
    { id: 5, sender: 'GitHub', subject: 'Critical Security Alert for your Repository', content: 'We detected a critical security vulnerability in a dependency within your "smart-inbox-magic" repository...', category: 'Urgent', status: 'inbox', summary: 'A critical security vulnerability has been detected in a GitHub repo.', isStarred: true, date: today.toISOString() },
    { id: 6, sender: 'HR Department', subject: 'Reminder: Complete Your Annual Training', content: 'This is a final reminder to complete your mandatory annual compliance training...', category: 'Task', status: 'archived', summary: 'Final reminder from HR to complete annual training.', isStarred: false, date: lastMonth.toISOString() },
    { id: 7, sender: 'Your Bank', subject: 'Important Information Regarding Your Account', content: 'We have updated our privacy policy and terms of service...', category: 'Important', status: 'trashed', summary: 'Notification of an update to the bank\'s privacy policy.', isStarred: false, date: lastWeek.toISOString() },
    { id: 8, sender: 'Slack', subject: 'New mentions and messages', content: 'You have new mentions and direct messages in your Slack workspace. Catch up on what you missed!', category: 'Important', status: 'inbox', summary: 'You have new notifications in your Slack workspace.', isStarred: false, date: today.toISOString() },
    { id: 9, sender: 'Coursera', subject: 'Your week of learning starts now', content: 'Keep up the great work! Here are some recommendations to continue your learning journey this week.', category: 'Promotion', status: 'inbox', summary: 'Coursera has new course recommendations for you.', isStarred: false, date: threeDaysAgo.toISOString() },
    { id: 10, sender: 'Asana', subject: 'Your daily tasks summary', content: 'Here are the tasks due today and this week to help you stay on track with your projects.', category: 'Task', status: 'inbox', summary: 'A summary of your upcoming tasks in Asana.', isStarred: true, date: yesterday.toISOString() },
    { id: 11, sender: 'Old Newsletter', subject: 'Blast from the past', content: 'This is a newsletter from a long time ago, just to test the year filter.', category: 'Promotion', status: 'inbox', summary: 'An old newsletter.', isStarred: false, date: lastYear.toISOString() },
];

const FOLDERS = ['Inbox', 'Starred', 'Sent', 'Archive', 'Trash'];
const CATEGORIES = ['All', 'Urgent', 'Task', 'Promotion', 'Important'];
const FILTERS = [
    {label: 'All Time', days: Infinity}, 
    {label: 'Last 3 Days', days: 3}, 
    {label: 'This Week', days: 7}, 
    {label: 'This Month', days: 30},
    {label: 'This Year', days: 365}
];

const Dashboard = () => {
  const [isComposing, setIsComposing] = useState(false);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [activeFolder, setActiveFolder] = useState('Inbox');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  const handleUpdateEmailStatus = (id: number, status: Email['status']) => {
    setEmails(emails.map(email => email.id === id ? { ...email, status } : email));
  };
  
  const handleToggleStar = (id: number) => {
    setEmails(emails.map(email => email.id === id ? { ...email, isStarred: !email.isStarred } : email));
  };
  
  const handleEmailClick = (id: number) => {
    setExpandedEmailId(expandedEmailId === id ? null : id);
  };

  const filteredEmails = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    const now = new Date();
    return emails.filter(email => {
        let folderMatches = false;
        if (activeFolder === 'Inbox') folderMatches = email.status === 'inbox';
        else if (activeFolder === 'Starred') folderMatches = email.isStarred;
        else if (activeFolder === 'Archive') folderMatches = email.status === 'archived';
        else if (activeFolder === 'Trash') folderMatches = email.status === 'trashed';
        else if (activeFolder === 'Sent') return false; 

        const categoryMatches = activeCategory === 'All' || email.category === activeCategory;
        
        const searchMatches = searchQuery === '' || 
            email.sender.toLowerCase().includes(searchLower) ||
            email.subject.toLowerCase().includes(searchLower) ||
            email.content.toLowerCase().includes(searchLower);

        const dateMatches = activeFilter.days === Infinity || (now.getTime() - new Date(email.date).getTime()) / (1000 * 3600 * 24) <= activeFilter.days;

        return folderMatches && categoryMatches && searchMatches && dateMatches;
    });
  }, [emails, activeFolder, activeCategory, searchQuery, activeFilter]);

  return (
    <div className="w-full h-full flex text-slate-100 animate-fade-in-fast">
      <nav className="w-64 p-4 pt-20 border-r border-slate-700/50 flex flex-col relative shrink-0 bg-slate-900/50 backdrop-blur-xl">
        <div className="space-y-1">
            {FOLDERS.map(folder => (
                <button key={folder} onClick={() => { setActiveFolder(folder); setActiveCategory('All'); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-left transition-colors ${activeFolder === folder ? 'bg-purple-600/30 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                    <span className="flex items-center gap-3">{folder === 'Inbox' ? <Inbox className="w-5 h-5"/> : folder === 'Starred' ? <Star className="w-5 h-5"/> : folder === 'Sent' ? <Send className="w-5 h-5"/> : folder === 'Archive' ? <Archive className="w-5 h-5"/> : <Trash2 className="w-5 h-5"/>} {folder}</span>
                </button>
            ))}
        </div>
         <div className="mt-6">
             <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Features</h3>
             <div className="space-y-1">
                <a href="#" onClick={() => setIsComposing(true)} className="flex items-center gap-3 px-3 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-105 transition-transform"><Sparkles className="w-5 h-5"/> Smart Compose</a>
            </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col pt-16">
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-xl z-10">
            <div className="relative w-1/2 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input 
                    type="text"
                    placeholder="Search mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-800/50 border border-slate-700 text-sm rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
            </div>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className="flex items-center gap-2 text-sm font-medium bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-2 rounded-full">
                        <Filter className="w-4 h-4"/> 
                        {activeFilter.label}
                    </button>
                    {isFilterMenuOpen && (
                         <div onMouseLeave={() => setIsFilterMenuOpen(false)} className="absolute right-0 mt-2 w-48 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-md shadow-lg z-30">
                            {FILTERS.map(filter => (
                                <a href="#" key={filter.label} onClick={(e) => { e.preventDefault(); setActiveFilter(filter); setIsFilterMenuOpen(false); }} className="block m-1 px-4 py-2 text-sm text-slate-200 hover:bg-purple-600/50 hover:text-white rounded-md">
                                    {filter.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => setIsComposing(true)} className="flex items-center gap-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full"><Plus className="w-4 h-4"/> Compose</button>
            </div>
        </header>
        
        <div className="p-4 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-4">
                 {CATEGORIES.map(category => (
                    <button key={category} onClick={() => setActiveCategory(category)} className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-purple-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'}`}>
                        {category}
                    </button>
                 ))}
            </div>
            <div className="space-y-4">
                {filteredEmails.length > 0 ? filteredEmails.map((email) => (
                    <EmailCard 
                        key={email.id} 
                        email={email} 
                        isExpanded={expandedEmailId === email.id}
                        onClick={handleEmailClick}
                        onArchive={(id) => handleUpdateEmailStatus(id, 'archived')}
                        onTrash={(id) => handleUpdateEmailStatus(id, 'trashed')}
                        onToggleStar={handleToggleStar}
                        onMoveToInbox={(id) => handleUpdateEmailStatus(id, 'inbox')}
                    />
                )) : (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No emails found.</p>
                        <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
      
      {isComposing && <AIComposer onClose={() => setIsComposing(false)} />}
    </div>
  );
};

const LandingPage = ({ onLogin }) => (
    <main className="flex-1 flex flex-col items-center justify-center text-center p-4 animate-fade-in-slow pt-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse-slow"></div>
      <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter mb-4 z-10">InboxGenie</h1>
      <p className="max-w-[600px] text-indigo-200 md:text-xl mb-10 z-10">Transform Your Email Experience with AI Intelligence.</p>
      <div className="flex flex-col sm:flex-row gap-4 z-10">
          <button onClick={onLogin} className="group inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 text-md font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-105">
              Sign Up <ArrowRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button onClick={onLogin} className="inline-flex h-12 items-center justify-center rounded-full bg-gray-700/50 px-8 text-md font-semibold text-white shadow-md transition-all duration-300 hover:bg-gray-700 hover:scale-105">Login</button>
      </div>
    </main>
);

export default function App() {
  const [view, setView] = useState('landing');
  const handleLogin = () => setView('dashboard');
  const handleGoHome = () => setView('landing');
  const isLanding = view === 'landing';

  return (
    <>
      <style>{`
        @keyframes gradient-animation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animated-gradient { background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e); background-size: 400% 400%; animation: gradient-animation 15s ease infinite; }
        .dashboard-bg { background-color: #111827; }
        @keyframes fade-in-slow { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-slow { animation: fade-in-slow 0.8s ease-out forwards; }
        .animate-fade-in-fast { animation: fade-in-fast 0.4s ease-out forwards; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
        .prose { white-space: pre-wrap; }
        .prose-invert { color: #d1d5db; }
        .prose-invert a { color: #a5b4fc; }
      `}</style>
      <div className={`flex flex-col h-screen max-h-screen relative overflow-hidden ${isLanding ? 'animated-gradient' : 'dashboard-bg'}`}>
        <div onClick={isLanding ? undefined : handleGoHome} className={`absolute top-0 left-0 z-20 ${isLanding ? '' : 'cursor-pointer'}`}>
            <InboxHeader />
        </div>
        {isLanding ? <LandingPage onLogin={handleLogin} /> : <Dashboard />}
      </div>
    </>
  );
}

