import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Send, X, Wand2, Bot, Reply, Zap } from "lucide-react";
import { rewriteEmailTone, generateAutoReply, generateSmartReplies, sendEmail, saveDraft } from "@/services/api";

interface AIComposerProps {
  replyToEmail?: {
    id: string;
    sender: string;
    subject: string;
    content: string;
  };
  onClose?: () => void;
  onDraftSaved?: () => void;
}

export default function AIComposer({ replyToEmail, onClose, onDraftSaved }: AIComposerProps) {
  const [recipient, setRecipient] = useState(replyToEmail?.sender || "");
  const [subject, setSubject] = useState(replyToEmail ? `Re: ${replyToEmail.subject}` : "");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoReplying, setIsAutoReplying] = useState(false);
  const [isSmartReplying, setIsSmartReplying] = useState(false);
  const [composeMode, setComposeMode] = useState<'new' | 'reply'>('new');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleSend = async () => {
    if (!recipient || !subject || !message) {
      alert("Please fill in all required fields (To, Subject, Message)");
      return;
    }

    setIsSending(true);
    try {
      const result = await sendEmail({
        to: recipient,
        subject: subject,
        body: message
      });
      
      if (result.success) {
        alert(`Email sent successfully to ${recipient}!`);
        // Clear the form
        setRecipient("");
        setSubject("");
        setMessage("");
        onClose?.();
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Send email error:", error);
      alert("Error sending email. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!message.trim()) {
      alert("Please enter some text to rewrite");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await rewriteEmailTone(message, tone);
      if (response.success) {
        setMessage(response.rewritten_text);
      } else {
        alert("Failed to generate AI content. Please try again.");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Error generating AI content. Please check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoReply = async () => {
    if (!replyToEmail) {
      alert("No email to reply to");
      return;
    }

    setIsAutoReplying(true);
    try {
      const originalEmailText = `Subject: ${replyToEmail.subject}\nFrom: ${replyToEmail.sender}\nContent: ${replyToEmail.content}`;
      const response = await generateAutoReply(originalEmailText);
      if (response.success) {
        setMessage(response.reply);
      } else {
        alert("Failed to generate auto-reply. Please try again.");
      }
    } catch (error) {
      console.error("Auto-reply error:", error);
      alert("Error generating auto-reply. Please check your connection and try again.");
    } finally {
      setIsAutoReplying(false);
    }
  };

  const handleSmartReply = async () => {
    if (!replyToEmail) {
      alert("No email to reply to");
      return;
    }

    setIsSmartReplying(true);
    try {
      const originalEmailText = `Subject: ${replyToEmail.subject}\nFrom: ${replyToEmail.sender}\nContent: ${replyToEmail.content}`;
      const response = await generateSmartReplies(originalEmailText);
      if (response.success) {
        setSmartReplies(response.replies);
      } else {
        alert("Failed to generate smart replies. Please try again.");
      }
    } catch (error) {
      console.error("Smart reply error:", error);
      alert("Error generating smart replies. Please check your connection and try again.");
    } finally {
      setIsSmartReplying(false);
    }
  };

  const selectSmartReply = (reply: string) => {
    setMessage(reply);
    setSmartReplies([]);
  };

  const handleSaveDraft = async () => {
    if (!subject && !message) {
      alert("Please enter either a subject or message to save as draft");
      return;
    }

    setIsSavingDraft(true);
    try {
      const result = await saveDraft({
        to: recipient,
        subject: subject,
        body: message
      });
      
      if (result.success) {
        alert("Draft saved successfully!");
        // Call the callback to refresh drafts
        onDraftSaved?.();
        // Optionally clear the form or close the composer
        // setRecipient("");
        // setSubject("");
        // setMessage("");
        // onClose?.();
      } else {
        alert("Failed to save draft. Please try again.");
      }
    } catch (error) {
      console.error("Save draft error:", error);
      alert("Error saving draft. Please check your connection and try again.");
    } finally {
      setIsSavingDraft(false);
    }
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

      {/* Smart Reply Options */}
      {smartReplies.length > 0 && (
        <div className="space-y-2">
          <Label>Smart Reply Options</Label>
          <div className="space-y-2">
            {smartReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-3"
                onClick={() => selectSmartReply(reply)}
              >
                <span className="text-sm">{reply}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

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
                disabled={isSmartReplying}
                className="ai-button-secondary"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isSmartReplying ? "Smart Replying..." : "Smart Reply"}
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
        <Button 
          variant="outline" 
          onClick={handleSaveDraft}
          disabled={isSavingDraft}
        >
          {isSavingDraft ? "Saving..." : "Save Draft"}
        </Button>
        <Button onClick={handleSend} className="ai-button" disabled={isSending}>
          <Send className="w-4 h-4 mr-2" />
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}