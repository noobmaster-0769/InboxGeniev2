import { 
  Inbox, 
  Star, 
  Send, 
  Archive, 
  Trash2, 
  Sparkles,
  Mail,
  LogOut,
  FileText,
  AlertTriangle,
  CheckCircle,
  ShoppingBag
} from "lucide-react";

interface InboxSidebarProps {
  onLogout: () => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  counts: { unread: number; starred: number };
}

export default function InboxSidebar({ onLogout, activeCategory, setActiveCategory, counts }: InboxSidebarProps) {
  // Standard folders from 'main.pdf'
  const navItems = [
    { name: 'all', label: 'All Mail', icon: Inbox, count: null },
    { name: 'unread', label: 'Unread', icon: FileText, count: counts.unread },
    { name: 'starred', label: 'Starred', icon: Star, count: counts.starred },
    { name: 'sent', label: 'Sent', icon: Send, count: 0 },
  ];

  // AI-driven categories from 'main.pdf'
  const aiCategories = [
    { name: 'Urgent', icon: AlertTriangle },
    { name: 'Important', icon: CheckCircle },
    { name: 'Task', icon: CheckCircle },
    { name: 'Promotion', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm p-4 flex flex-col border-r border-slate-700/50">
      {/* Logo from 'main.pdf' */}
      <div className="flex items-center gap-3 mb-8 pt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">InboxGenie</h1>
      </div>

      <nav className="space-y-1 flex-1">
        {/* Standard Folders */}
        {navItems.map((item) => (
          <button 
            key={item.name} 
            onClick={() => setActiveCategory(item.name)} 
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
              activeCategory === item.name 
                ? 'bg-purple-600/30 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-5 h-5" /> 
              <span className="font-semibold">{item.label}</span>
            </span>
            {item.count !== null && item.count > 0 && (
              <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
          </button>
        ))}

        {/* AI Categories from 'main.pdf' */}
        <h3 className="px-3 pt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Smart Categories
        </h3>
        {aiCategories.map((item) => (
          <button 
            key={item.name} 
            onClick={() => setActiveCategory(item.name)} 
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
              activeCategory === item.name 
                ? 'bg-purple-600/30 text-white' 
                : 'text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-5 h-5" /> 
              <span className="font-semibold">{item.name}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* AI Features section from 'main.pdf' */}
      <div className="mt-6">
        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          AI Features
        </h3>
        <div className="space-y-2">
          <a 
            href="#" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5"/> Smart Compose
          </a>
        </div>
      </div>

      {/* Logout button from 'main.pdf' */}
      <div className="mt-6">
        <button 
          onClick={onLogout} 
          className="w-full bg-red-600/80 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}