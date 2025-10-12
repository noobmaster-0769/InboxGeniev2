import { Mail } from 'lucide-react';

export default function InboxHeader() {
  return (
    <header className="absolute top-0 left-0 p-4 z-20">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
        <Mail className="w-5 h-5 text-white" />
      </div>
    </header>
  );
}

