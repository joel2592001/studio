'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bot, Send, Sparkles } from 'lucide-react';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo, useState, useTransition, useRef, useEffect } from 'react';
import { chatWithAdvisorAction } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isPending?: boolean;
};

export function AiAdvisor() {
  const { state } = useFinancials();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { totalIncome, totalExpenses, savings } = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      savings: income - expenses,
    };
  }, [state.transactions]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
    };
    const pendingMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: '',
      isPending: true,
    };

    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput('');
    setError(null);

    startTransition(async () => {
      const result = await chatWithAdvisorAction({
        message: input,
        transactions: JSON.stringify(state.transactions),
        goals: JSON.stringify(state.goals),
        totalIncome,
        totalExpenses,
        savings,
      });

      if (result.error) {
        setError(result.error);
        setMessages((prev) => prev.slice(0, -1)); // Remove pending message
      } else if (result.reply) {
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: result.reply,
        };
        setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
          size="icon"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open AI Advisor</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 mr-4 mb-2 p-0" align="end" side="top">
        <Card className="shadow-none border-none flex flex-col h-[60vh]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Financial Advisor
            </CardTitle>
            <CardDescription>
              Ask me anything about your finances.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-sm p-4 bg-secondary rounded-lg border text-center text-muted-foreground">
                    Try asking: &quot;How much did I spend on groceries?&quot;
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="bg-primary text-primary-foreground rounded-full p-2">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs rounded-lg p-3 text-sm ${
                        message.sender === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {message.isPending ? (
                        <div className="space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      ) : (
                        message.text.split('\n').map((line, index) => (
                          <p key={index} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                ))}
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message FinWise..."
                className="flex-1"
                disabled={isPending}
              />
              <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
