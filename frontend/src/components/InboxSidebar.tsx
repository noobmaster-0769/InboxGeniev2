import { 
  Inbox, 
  Star, 
  Send, 
  Archive, 
  Trash2, 
  Sparkles,
  TrendingUp,
  Users,
  ShoppingBag,
  Bell,
  Calendar,
  Bot,
  Brain,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const categories = [
  { name: "Priority", icon: Zap, count: 12, color: "text-primary", bgColor: "bg-primary/10" },
  { name: "Promotions", icon: ShoppingBag, count: 8, color: "text-accent", bgColor: "bg-accent/10" },
  { name: "Social", icon: Users, count: 15, color: "text-secondary", bgColor: "bg-secondary/10" },
  { name: "Updates", icon: Bell, count: 23, color: "text-muted-foreground", bgColor: "bg-muted" },
];

const folders = [
  { name: "Inbox", icon: Inbox, count: 58 },
  { name: "Starred", icon: Star, count: 7 },
  { name: "Sent", icon: Send, count: 142 },
  { name: "Archive", icon: Archive, count: 1205 },
  { name: "Trash", icon: Trash2, count: 23 },
];

export default function InboxSidebar() {
  return (
    <aside className="w-80 bg-card border-r border-border p-6 space-y-6">
      {/* AI Statistics */}
      <Card className="inbox-card-ai p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold gradient-text">AI Insights</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Emails Processed</span>
            <span className="font-medium">1,247</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spam Filtered</span>
            <span className="font-medium text-success">342</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time Saved</span>
            <span className="font-medium text-primary">4.2 hrs</span>
          </div>
        </div>
      </Card>

      {/* Smart Categories */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Smart Categories</h3>
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className="w-full justify-between hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-md ${category.bgColor}`}>
                  <category.icon className={`w-4 h-4 ${category.color}`} />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Traditional Folders */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Folders</h3>
        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.name}
              variant="ghost"
              className="w-full justify-between hover:bg-muted/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <folder.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{folder.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {folder.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <Card className="inbox-card p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Features</h3>
        </div>
        
        <Button className="ai-button w-full justify-start" size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Smart Compose
        </Button>
        
        <Button className="ai-button-secondary w-full justify-start" size="sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          Email Analytics
        </Button>
        
        <Button variant="outline" className="w-full justify-start hover-lift" size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule AI Review
        </Button>
      </Card>

      {/* Quick Stats */}
      <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">Today's Productivity</p>
        <p className="text-2xl font-bold gradient-text">94%</p>
        <p className="text-xs text-muted-foreground">AI Efficiency Score</p>
      </div>
    </aside>
  );
}