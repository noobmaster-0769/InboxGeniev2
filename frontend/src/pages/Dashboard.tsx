import { useState } from "react";
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
  List
} from "lucide-react";

// Mock email data
const mockEmails = [
  {
    id: "1",
    sender: "Sarah Johnson",
    subject: "Q4 Marketing Strategy Review",
    preview: "Hi team, I've prepared the quarterly review document for our marketing initiatives. Please review the attached analytics report...",
    time: "2 min ago",
    isRead: false,
    isStarred: true,
    priority: "high" as const,
    category: "priority" as const,
    aiSummary: "Marketing team requests review of Q4 strategy document with analytics. Action required: Review attached report by EOW.",
    sentiment: "neutral" as const,
  },
  {
    id: "2",
    sender: "LinkedIn",
    subject: "Your weekly network update",
    preview: "See who viewed your profile this week and connect with professionals in your industry...",
    time: "15 min ago",
    isRead: true,
    isStarred: false,
    priority: "low" as const,
    category: "social" as const,
    aiSummary: "Weekly LinkedIn digest with profile views and connection suggestions. No action required.",
  },
  {
    id: "3",
    sender: "Amazon",
    subject: "Your order has been shipped!",
    preview: "Great news! Your recent order is on its way. Track your package and see estimated delivery...",
    time: "1 hour ago",
    isRead: false,
    isStarred: false,
    priority: "medium" as const,
    category: "promotions" as const,
  },
  {
    id: "4",
    sender: "Alex Chen",
    subject: "Project Collaboration Opportunity",
    preview: "I hope this email finds you well. I'm reaching out regarding a potential collaboration on the upcoming AI project...",
    time: "3 hours ago",
    isRead: true,
    isStarred: true,
    priority: "high" as const,
    category: "priority" as const,
    aiSummary: "Business collaboration proposal for AI project. Suggests scheduling call to discuss partnership details.",
    sentiment: "positive" as const,
  },
  {
    id: "5",
    sender: "GitHub",
    subject: "Security alert for your repository",
    preview: "We detected a potential security vulnerability in one of your repositories. Please review the following...",
    time: "4 hours ago",
    isRead: false,
    isStarred: false,
    priority: "high" as const,
    category: "updates" as const,
    aiSummary: "Security vulnerability detected in GitHub repository. Immediate action required to review and patch.",
    sentiment: "negative" as const,
  },
];

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showComposer, setShowComposer] = useState(false);

  const filteredEmails = selectedTab === "all" 
    ? mockEmails 
    : mockEmails.filter(email => email.category === selectedTab);

  return (
    <div className="min-h-screen bg-background">
      <InboxHeader />
      
      <div className="flex">
        <InboxSidebar />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="hover-lift"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              >
                {viewMode === "list" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
              
              <Button variant="outline" size="sm" className="hover-lift">
                <SortDesc className="w-4 h-4 mr-2" />
                Sort
              </Button>
              
              <Button variant="outline" size="sm" className="hover-lift">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button 
                className="ai-button hover-glow"
                onClick={() => setShowComposer(!showComposer)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>

          {/* AI Composer */}
          {showComposer && (
            <div className="slide-up">
              <AIComposer />
            </div>
          )}

          {/* Email Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All ({mockEmails.length})
              </TabsTrigger>
              <TabsTrigger value="priority" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Priority ({mockEmails.filter(e => e.category === "priority").length})
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Social ({mockEmails.filter(e => e.category === "social").length})
              </TabsTrigger>
              <TabsTrigger value="promotions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Promotions ({mockEmails.filter(e => e.category === "promotions").length})
              </TabsTrigger>
              <TabsTrigger value="updates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Updates ({mockEmails.filter(e => e.category === "updates").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
                : "space-y-3"
              }>
                {filteredEmails.map((email, index) => (
                  <div 
                    key={email.id} 
                    className="fade-in" 
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EmailCard email={email} />
                  </div>
                ))}
              </div>
              
              {filteredEmails.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No emails in this category</p>
                  <p className="text-sm text-muted-foreground">AI will automatically organize new emails here</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}