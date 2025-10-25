import { useState, useEffect } from 'react';
import { Star, MoreHorizontal, Sparkles, Archive, Trash2, Inbox, ChevronDown, Reply } from 'lucide-react';
import { summarizeEmailById, suggestReplies } from '../services/api';

// Define the structure of an email object for TypeScript
export interface Email {
  id: string;
  sender: string;
  subject: string;
  content?: string; 
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
  isSelected: boolean;
  onClick: (id: string) => void;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onTrash: (id: string) => void;
  onToggleStar: (id: string) => void;
  onMoveToInbox: (id: string) => void;
  onUnarchive: (id: string) => void;
  onRestore: (id: string) => void;
  onReply: (email: Email) => void;
  isStarred: boolean;
}

// Define category colors for the labels
const categoryStyles = {
    Urgent: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Task: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Promotion: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    Important: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Spam: 'bg-red-800/30 text-red-300 border border-red-600/50',
    Gray: 'bg-gray-600/20 text-gray-400 border border-gray-600/30',
    General: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
};

export default function EmailCard({ email, isExpanded, isSelected, onClick, onSelect, onArchive, onTrash, onToggleStar, onMoveToInbox, onUnarchive, onRestore, onReply, isStarred }: EmailCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  useEffect(() => {
    if (!isExpanded) setShowSummary(false);
  }, [isExpanded]);

  const handleSummarize = async () => {
    if (aiSummary) {
      setShowSummary(!showSummary);
      return;
    }

    setIsLoadingSummary(true);
    try {
      const result = await summarizeEmailById(email.id);
      setAiSummary(result.summary);
      setShowSummary(true);
    } catch (error) {
      console.error("Failed to summarize email:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleLoadSmartReplies = async () => {
    if (smartReplies.length > 0) return;

    setIsLoadingReplies(true);
    try {
      const result = await suggestReplies(email.snippet);
      // Handle the response format: {success: true, replies: [...], message: "..."}
      if (result.success && result.replies) {
        setSmartReplies(result.replies);
      } else {
        console.error("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Failed to load smart replies:", error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleSmartReplyClick = (reply: string) => {
    // This would typically populate a reply form
    console.log("Selected reply:", reply);
    // You could emit an event or call a callback here
  };

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
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => { e.stopPropagation(); onSelect(email.id); }}
                  className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                />
            </div>
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
                          onClick={(e) => { e.stopPropagation(); handleSummarize(); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-purple-400 bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1.5 rounded-md transition-colors"
                          disabled={isLoadingSummary}
                        >
                            <Sparkles className={`w-4 h-4 ${isLoadingSummary ? 'animate-spin' : ''}`} /> 
                            {isLoadingSummary ? "Generating..." : (aiSummary ? (showSummary ? "Hide AI Summary" : "Show AI Summary") : "Summarize")}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onReply(email); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Reply className="w-4 h-4" /> Reply
                        </button>
                        
                        {/* Show different action buttons based on email status */}
                        {email.status === 'archived' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onUnarchive(email.id); }} 
                            className="flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300"
                          >
                            <Inbox className="w-4 h-4" /> Unarchive
                          </button>
                        ) : email.status === 'trashed' ? (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onRestore(email.id); }} 
                            className="flex items-center gap-2 text-xs font-semibold text-green-400 hover:text-green-300"
                          >
                            <Inbox className="w-4 h-4" /> Restore
                          </button>
                        ) : (
                          <>
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
                          </>
                        )}
                    </div>

                    <div className={`grid transition-all duration-500 ease-in-out ${
                      showSummary ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'
                    }`}>
                        <div className="overflow-hidden">
                            {aiSummary && (
                                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded-lg border border-purple-500/30 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-purple-400" />
                                        <span className="text-sm font-semibold text-purple-300">AI Summary</span>
                                    </div>
                                    <p className="text-sm text-slate-200">{aiSummary}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Smart Reply Suggestions */}
                    <div className="mt-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleLoadSmartReplies(); }} 
                          className="flex items-center gap-2 text-xs font-semibold text-green-400 bg-green-500/20 hover:bg-green-500/30 px-3 py-1.5 rounded-md transition-colors mb-3"
                          disabled={isLoadingReplies}
                        >
                            <Sparkles className={`w-4 h-4 ${isLoadingReplies ? 'animate-spin' : ''}`} /> 
                            {isLoadingReplies ? "Loading..." : "Smart Replies"}
                        </button>
                        
                        {smartReplies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {smartReplies.map((reply, index) => (
                              <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); handleSmartReplyClick(reply); }}
                                className="text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-md transition-colors"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

