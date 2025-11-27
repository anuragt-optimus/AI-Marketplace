import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, X, Minimize2, Maximize2, RefreshCw, MinusCircle, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FloatingAIChatProps {
  activeSection: string;
  onClose: () => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const FloatingAIChat = ({ 
  activeSection, 
  onClose, 
  isMinimized,
  onToggleMinimize 
}: FloatingAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I'm here to help you improve your ${activeSection.replace(/([A-Z])/g, " $1").trim()}. What would you like to change?`
    }
  ]);
  const [input, setInput] = useState("");

  const quickActions = [
    { label: "Regenerate", icon: RefreshCw, action: "Regenerate this section with fresh content" },
    { label: "Improve", icon: Wand2, action: "Make this more professional and compelling" },
    { label: "Shorten", icon: MinusCircle, action: "Make this more concise" },
    { label: "Expand", icon: Maximize2, action: "Add more detail and examples" },
  ];

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "I'll help you with that. Here's my suggestion..." }
    ]);
    setInput("");
  };

  if (isMinimized) {
    return (
      <Button
        onClick={onToggleMinimize}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 z-50"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl border-primary/20 z-50 flex flex-col animate-scale-in">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 animate-pulse">
                <Sparkles className="w-4 h-4 text-primary opacity-50" />
              </div>
            </div>
            AI Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggleMinimize}
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Editing: {activeSection.replace(/([A-Z])/g, " $1").trim()}
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%] text-sm",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleSend(action.action)}
                className="text-xs h-auto py-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder="Describe what you'd like to change..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              className="resize-none text-sm min-h-[60px]"
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="self-end"
            >
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
