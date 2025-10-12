import { useState } from 'react';
import { X, Sparkles, Paperclip, Smile, Mic, Send, ChevronDown } from 'lucide-react';

interface AIComposerProps {
  onClose: () => void;
}

export default function AIComposer({ onClose }: AIComposerProps) {
  const suggestions = [
    "Schedule a meeting for next week",
    "Thank you for your email. I'll review and respond shortly.",
    "Please find the requested documents attached.",
    "I apologize for the delay in responding."
  ];

  const [isToneMenuOpen, setIsToneMenuOpen] = useState(false);
  const tones = ["Professional", "Casual", "Friendly", "Direct", "Persuasive"];
  const [selectedTone, setSelectedTone] = useState("Professional");

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">AI Compose</span>
                </div>
                 {/* NEW: Tone Dropdown */}
                <div className="relative">
                    <button onClick={() => setIsToneMenuOpen(!isToneMenuOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                        <span>Tone: <strong>{selectedTone}</strong></span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isToneMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isToneMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            {tones.map(tone => (
                                <a href="#" key={tone} onClick={() => { setSelectedTone(tone); setIsToneMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    {tone}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
            </button>
        </header>

        <div className="p-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick AI Suggestions:</h3>
                <div className="grid grid-cols-2 gap-2">
                    {suggestions.map((text, i) => (
                        <button key={i} className="text-left text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 p-3 rounded-md transition-colors">
                           {text}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                 <textarea
                    placeholder="Describe what you want to say, and AI will craft the perfect message..."
                    className="w-full h-32 p-3 text-sm border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <footer className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><Paperclip className="w-5 h-5"/></button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><Smile className="w-5 h-5"/></button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100"><Mic className="w-5 h-5"/></button>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md transition-colors">
                    <Sparkles className="w-4 h-4"/>
                    Enhance
                </button>
                 <button className="flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
                    Send
                    <Send className="w-4 h-4"/>
                </button>
            </div>
        </footer>
      </div>
    </div>
  );
}

