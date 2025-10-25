import { useState, useEffect, useMemo } from "react";
import InboxHeader from "@/components/InboxHeader";
import InboxSidebar from "@/components/InboxSidebar";
import EmailCard from "@/components/EmailCard";
import AIComposer from "@/components/AIComposer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Plus, 
  Filter,
  SortDesc,
  LayoutGrid,
  List,
  Search,
  RefreshCw
} from "lucide-react";
import { fetchEmails, Email, archiveEmail, trashEmail, moveToInbox, markEmailRead } from "../services/api";

const CATEGORIES = ['General', 'Urgent', 'Task', 'Important', 'Promotion'];

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showComposer, setShowComposer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const [replyToEmail, setReplyToEmail] = useState<any>(null);
  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    // Optionally: persist starring in localStorage
    const stored = localStorage.getItem('starredIds');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const loadEmails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: any[] = await fetchEmails();
      
      // Transform backend data to match our Email interface
      const emailsWithFeatures: Email[] = data.map((email: any) => ({
        id: email.id ? email.id.toString() : Math.random().toString(),
        sender: email.sender || "Unknown Sender",
        subject: email.subject || "No Subject",
        snippet: email.snippet || "No snippet available",
        content: email.snippet + "\n\nThis is placeholder content for the full email body.",
        category: CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1] as any,
        status: 'inbox',
        isStarred: email.isStarred || false,
        date: email.date ? new Date(email.date).toLocaleDateString() : new Date().toLocaleDateString(),
        isRead: email.isRead || false,
        aiSummary: `This is a sample AI summary for the email from ${email.sender}. The main topic is "${email.subject}".`,
      }));
      setEmails(emailsWithFeatures);
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

  const filteredEmails = useMemo(() => {
    let tempEmails = emails;

    if (selectedTab !== "all") {
      if (selectedTab === "unread") tempEmails = tempEmails.filter(e => !e.isRead);
      else if (selectedTab === "starred") tempEmails = tempEmails.filter(e => starredIds.has(e.id));
      else if (selectedTab === "sent") tempEmails = tempEmails.filter(e => e.status === "sent" || (e.labels || '').includes("SENT"));
      else tempEmails = tempEmails.filter(e => e.category === selectedTab);
    }
    
    if (searchQuery) {
      tempEmails = tempEmails.filter(e =>
        (e.sender && e.sender.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.subject && e.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return tempEmails;
  }, [emails, selectedTab, searchQuery, starredIds]);

  const handleEmailClick = (id: string) => {
    setExpandedEmailId(prevId => prevId === id ? null : id);
  };

  const handleReply = (email: any) => {
    setReplyToEmail(email);
    setShowComposer(true);
  };

  const handleCompose = () => {
    setReplyToEmail(null);
    setShowComposer(true);
  };

  const handleCloseComposer = () => {
    setShowComposer(false);
    setReplyToEmail(null);
  };

  const handleToggleStar = (emailId: string) => {
    setStarredIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emailId)) {
        newSet.delete(emailId);
      } else {
        newSet.add(emailId);
      }
      // LocalStorage sync for persistence across tab refreshes
      localStorage.setItem('starredIds', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleArchive = async (emailId: string) => {
    try {
      await archiveEmail(emailId);
      // Update local state to reflect the change
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, status: 'archived' } : email
        )
      );
    } catch (error) {
      console.error("Failed to archive email:", error);
      alert("Failed to archive email. Please try again.");
    }
  };

  const handleTrash = async (emailId: string) => {
    try {
      await trashEmail(emailId);
      // Update local state to reflect the change
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, status: 'trashed' } : email
        )
      );
    } catch (error) {
      console.error("Failed to trash email:", error);
      alert("Failed to move email to trash. Please try again.");
    }
  };

  const handleMoveToInbox = async (emailId: string) => {
    try {
      await moveToInbox(emailId);
      // Update local state to reflect the change
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, status: 'inbox' } : email
        )
      );
    } catch (error) {
      console.error("Failed to move email to inbox:", error);
      alert("Failed to move email to inbox. Please try again.");
    }
  };

  const handleMarkAsRead = async (emailId: string) => {
    try {
      await markEmailRead(emailId);
      // Update local state to reflect the change
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, isRead: true } : email
        )
      );
    } catch (error) {
      console.error("Failed to mark email as read:", error);
      alert("Failed to mark email as read. Please try again.");
    }
  };

  const counts = {
    unread: emails.filter(e => !e.isRead).length,
    starred: starredIds.size,
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#1e1b4b] to-[#4c1d95] font-['Inter',_sans-serif] text-gray-200">
      <InboxSidebar onLogout={onLogout} activeCategory={selectedTab} setActiveCategory={setSelectedTab} counts={counts} onCompose={handleCompose} />

      <main className="flex-1 flex flex-col">
        {/* Header with search */}
        <header className="flex items-center justify-center p-4 border-b border-gray-500/50 flex-shrink-0">
          <div className="relative w-1/2 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4 hover-lift"
            onClick={loadEmails}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </header>

        {/* AI Composer */}
        {showComposer && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <AIComposer 
                replyToEmail={replyToEmail}
                onClose={handleCloseComposer}
              />
            </div>
          </div>
        )}

        {/* Email List Area */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              Loading your inbox...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-400">{error}</div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">No emails found.</div>
          ) : (
            filteredEmails.map((email) => (
              <EmailCard 
                key={email.id} 
                email={email} 
                isExpanded={expandedEmailId === email.id}
                onClick={handleEmailClick}
                onArchive={() => handleArchive(email.id)}
                onTrash={() => handleTrash(email.id)}
                onToggleStar={handleToggleStar}
                onMoveToInbox={() => handleMoveToInbox(email.id)}
                onReply={() => handleReply(email)}
                isStarred={starredIds.has(email.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;