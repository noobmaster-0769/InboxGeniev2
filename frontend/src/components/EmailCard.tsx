import { useState } from 'react';
import { Star, MoreHorizontal, Sparkles, Archive, Trash2, Inbox, ChevronDown } from 'lucide-react';

// Define the structure of an email object for TypeScript
export interface Email {
  id: number;
  sender: string;
  subject: string;
  content: string; 
  category: 'Urgent' | 'Task' | 'Promotion' | 'Important';
  status: 'inbox' | 'archived' | 'trashed';
  summary: string;
  isStarred: boolean;
  date: string; 
}

// Define the props the component will accept
interface EmailCardProps {
  email: Email;
  isExpanded: boolean;
  onClick: (id: number) => void;
  onArchive: (id: number) => void;
  onTrash: (id: number) => void;
  onToggleStar: (id: number) => void;
  onMoveToInbox: (id: number) => void;
}

// Define category colors for the labels
const categoryStyles = {
    Urgent: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Task: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Promotion: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    Important: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
};

export default function EmailCard({ email, isExpanded, onClick, onArchive, onTrash, onToggleStar, onMoveToInbox }: EmailCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categoryColor = categoryStyles[email.category];
  const snippet = email.content.substring(0, 100) + '...';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) return "Today";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  return (
    <div 
        onClick={() => onClick(email.id)}
        className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:border-purple-500 ${isExpanded ? 'ring-2 ring-purple-500' : ''}`}
    >
        {/* --- SUMMARY VIEW --- */}
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-300">
                {email.sender.charAt(0)}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-100">{email.sender}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor}`}>{email.category}</span>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(email.date)}</span>
                </div>
                <p className="font-bold text-lg mt-1 text-slate-50">{email.subject}</p>
                {!isExpanded && <p className="text-sm text-slate-400 mt-1 line-clamp-1">{snippet}</p>}
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>

        {/* --- EXPANDED VIEW --- */}
        <div className={`transition-all duration-500 ease-in-out grid ${isExpanded ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
                <div className="border-t border-slate-700 my-4"></div>
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
                    {email.content}
                </div>
                
                {showSummary && (
                    <div className="bg-slate-700/50 border border-slate-600 p-3 rounded-md mt-4">
                        <p className="text-sm font-semibold text-purple-400 flex items-center gap-2"><Sparkles className="w-4 h-4"/> AI Summary</p>
                        <p className="text-sm text-slate-300 mt-1">{email.summary}</p>
                    </div>
                )}
                
                <div className="mt-6 flex items-center justify-between">
                    <button onClick={(e) => {e.stopPropagation(); setShowSummary(!showSummary)}} className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-md transition-colors">
                        <Sparkles className="w-3 h-3"/>
                        {showSummary ? 'Hide Summary' : 'AI Summary'}
                    </button>
                    <div className="flex items-center gap-3 text-slate-400">
                        <button onClick={(e) => {e.stopPropagation(); onToggleStar(email.id)}} title="Star this email">
                            <Star className={`w-5 h-5 cursor-pointer transition-colors ${email.isStarred ? 'text-yellow-400 fill-yellow-400' : 'hover:text-yellow-400'}`}/>
                        </button>
                        <div className="relative">
                            <button onClick={(e) => {e.stopPropagation(); setIsMenuOpen(!isMenuOpen)}} title="More options">
                                <MoreHorizontal className="w-5 h-5 cursor-pointer"/>
                            </button>
                            {isMenuOpen && (
                                <div onMouseLeave={() => setIsMenuOpen(false)} className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                                   {email.status === 'inbox' && (
                                        <>
                                            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onArchive(email.id); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><Archive className="w-4 h-4"/> Archive</a>
                                            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTrash(email.id); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><Trash2 className="w-4 h-4"/> Move to Trash</a>
                                        </>
                                   )}
                                   {(email.status === 'archived' || email.status === 'trashed') && (
                                        <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMoveToInbox(email.id); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"><Inbox className="w-4 h-4"/> Move to Inbox</a>
                                   )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

