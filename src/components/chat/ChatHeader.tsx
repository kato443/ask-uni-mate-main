import { Sparkles } from "lucide-react";
import ucuLogo from "@/assets/ucu-logo.png";

export const ChatHeader = () => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-border">
      <div className="w-12 h-12 rounded-full border-2 border-primary bg-background shadow-md flex items-center justify-center p-1">
        <img src={ucuLogo} alt="UCU Badge" className="h-9 w-9 object-contain rounded-full" />
      </div>
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">UCU-BBUC Assistant</h1>
        <p className="text-sm text-muted-foreground">Ask me anything about the university</p>
      </div>
      <div className="ml-auto flex items-center gap-2 text-sm text-accent">
        <Sparkles className="w-4 h-4" />
        <span>AI-Powered</span>
      </div>
    </div>
  );
};
