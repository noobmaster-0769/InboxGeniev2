import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Send, X, Wand2 } from "lucide-react";

export default function AIComposer() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = () => {
    // TODO: Implement email sending logic
    console.log("Sending email:", { recipient, subject, message, tone });
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    // TODO: Implement AI generation logic
    setTimeout(() => {
      setMessage("AI-generated email content would appear here...");
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Email Composer
        </h3>
        <Button variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
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