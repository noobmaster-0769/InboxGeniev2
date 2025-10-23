import { useState, useEffect } from 'react';
import { Star, MoreHorizontal, Sparkles, Archive, Trash2, Inbox, ChevronDown, Reply } from 'lucide-react';

// Define the structure of an email object for TypeScript
export interface Email {
  id: string;
  sender: string;
  subject: string;
  content: string; 
  category: 'Urgent' | 'Task' | 'Promotion' | 'Important' | 'General';
  status: 'inbox' | 'archived' | 'trashed';
  aiSummary?: string;
  isStarred: boolean;
  date: string;
  isRead: boolean;
  snippet: string;
}

// Define the props the component will accept
interface EmailCardProps {
  email: Email;
  isExpanded: boolean;
  onClick: (id: string) => void;
  onArchive: (id: string) => void;
  onTrash: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMoveToInbox: (id: string) => void;
  onReply: (email: Email) => void;
  isStarred: boolean;
}

// Define category colors for the labels
const categoryStyles = {
    Urgent: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Task: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Promotion: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    Important: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    General: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
};

export default function EmailCard({ email, isExpanded, onClick, onArchive, onTrash, onToggleStar, onMoveToInbox, onReply, isStarred }: EmailCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isExpanded) setShowSummary(false);
  }, [isExpanded]);

  const categoryColor = categoryStyles[email.category] || categoryStyles.General;

  return (
    <div 
        onClick={() => onClick(email.id)}
        className={`p-4 border-b border-gray-500/50 cursor-pointer hover:bg-purple-900/20 transition-all duration-200 ${
          !email.isRead ? 'bg-purple-900/10' : ''
        } ${isExpanded ? 'bg-purple-900/30' : ''}`}
    >
        <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
                <button onClick={(e) => { e.stopPropagation(); onToggleStar(email.id); }}>
                    <Star className={`h-5 w-5 transition-colors duration-200 ${
                      isStarred ? 'text-yellow-400 fill-current' : 'text-gray-500 hover:text-yellow-400'
                    }`} />
                </button>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-gray-200 truncate">{email.sender}</p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor}`}>
                          {email.category}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 flex-shrink-0 ml-4">{email.date}</p>
                </div>
                <p className="font-normal text-gray-300 truncate">{email.subject}</p>
                {!isExpanded && <p className="text-sm text-gray-400 truncate">{email.snippet}</p>}
            </div>
        </div>

        {/* In-place expansion logic from 'main.pdf' */}
        <div className={`grid transition-all duration-500 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'
        }`}>
            <div className="overflow-hidden">
                <div className="pl-14">
                    <p className="text-slate-300 whitespace-pre-wrap mb-4">{email.content || email.snippet}</p>
                    
                    <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setShowSummary(!showSummary); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-md transition-colors"
                        >
                            <Sparkles className="w-4 h-4" /> 
                            {showSummary ? "Hide AI Summary" : "Show AI Summary"}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onReply(email); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Reply className="w-4 h-4" /> Reply
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onArchive(email.id); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
                        >
                          <Archive className="w-4 h-4" /> Archive
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onTrash(email.id); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>

                    <div className={`grid transition-all duration-500 ease-in-out ${
                      showSummary ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'
                    }`}>
                        <div className="overflow-hidden">
                            {email.aiSummary && (
                                <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
                                    <p className="text-sm text-slate-300">{email.aiSummary}</p>
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

