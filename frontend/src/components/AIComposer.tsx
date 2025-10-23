import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Send, X, Wand2, Bot, Reply, Zap } from "lucide-react";

interface AIComposerProps {
  replyToEmail?: {
    id: string;
    sender: string;
    subject: string;
    content: string;
  };
  onClose?: () => void;
}

export default function AIComposer({ replyToEmail, onClose }: AIComposerProps) {
  const [recipient, setRecipient] = useState(replyToEmail?.sender || "");
  const [subject, setSubject] = useState(replyToEmail ? `Re: ${replyToEmail.subject}` : "");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoReplying, setIsAutoReplying] = useState(false);
  const [composeMode, setComposeMode] = useState<'new' | 'reply'>('new');

  const handleSend = () => {
    // TODO: Implement email sending logic
    console.log("Sending email:", { recipient, subject, message, tone });
    onClose?.();
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    // TODO: Implement AI generation logic based on tone
    setTimeout(() => {
      const toneExamples = {
        professional: "Dear [Name],\n\nI hope this email finds you well. I am writing to discuss...\n\nBest regards,\n[Your Name]",
        casual: "Hey [Name],\n\nHope you're doing well! Just wanted to reach out about...\n\nTalk soon,\n[Your Name]",
        friendly: "Hi [Name],\n\nI hope you're having a great day! I wanted to touch base regarding...\n\nLooking forward to hearing from you,\n[Your Name]",
        formal: "Dear [Name],\n\nI am writing to formally address the matter of...\n\nI look forward to your prompt response.\n\nSincerely,\n[Your Name]"
      };
      setMessage(toneExamples[tone as keyof typeof toneExamples] || toneExamples.professional);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAutoReply = () => {
    setIsAutoReplying(true);
    // TODO: Implement AI auto-reply logic
    setTimeout(() => {
      const autoReplyMessage = `Thank you for your email regarding "${replyToEmail?.subject}". I have received your message and will review it carefully. I will get back to you within 24 hours with a detailed response.\n\nBest regards,\n[Your Name]`;
      setMessage(autoReplyMessage);
      setIsAutoReplying(false);
    }, 3000);
  };

  const handleSmartReply = () => {
    setIsGenerating(true);
    // TODO: Implement smart reply based on email content
    setTimeout(() => {
      const smartReply = `Thank you for reaching out about "${replyToEmail?.subject}". Based on your message, I understand you're looking for information about this topic. Let me provide you with the following details:\n\n[AI-generated response based on email content]\n\nPlease let me know if you need any clarification.\n\nBest regards,\n[Your Name]`;
      setMessage(smartReply);
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Email Composer
          {replyToEmail && (
            <span className="text-sm text-muted-foreground ml-2">
              (Replying to {replyToEmail.sender})
            </span>
          )}
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        <Button
          variant={composeMode === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setComposeMode('new')}
        >
          <Send className="w-4 h-4 mr-2" />
          New Email
        </Button>
        {replyToEmail && (
          <Button
            variant={composeMode === 'reply' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setComposeMode('reply')}
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">To</Label>
          <Input
            id="recipient"
            placeholder="recipient@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">Message</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="ai-button-secondary"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "AI Generate"}
            </Button>
            {replyToEmail && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoReply}
                disabled={isAutoReplying}
                className="ai-button-secondary"
              >
                <Bot className="w-4 h-4 mr-2" />
                {isAutoReplying ? "Auto-Replying..." : "Auto Reply"}
              </Button>
            )}
            {replyToEmail && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSmartReply}
                disabled={isGenerating}
                className="ai-button-secondary"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isGenerating ? "Smart Replying..." : "Smart Reply"}
              </Button>
            )}
          </div>
        </div>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={handleSend} className="ai-button">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}