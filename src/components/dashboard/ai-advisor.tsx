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
import { MessageCircle, Sparkles, Bot } from 'lucide-react';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo, useState, useTransition } from 'react';
import { getFinancialAdviceAction } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function AiAdvisor() {
  const { state } = useFinancials();
  const [advice, setAdvice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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

  const handleGetAdvice = () => {
    startTransition(async () => {
      setError(null);
      setAdvice(null);
      const result = await getFinancialAdviceAction({
        income: totalIncome,
        expenses: totalExpenses,
        savings: savings,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setAdvice(result.advice);
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
      <PopoverContent className="w-80 mr-4 mb-2" align="end" side="top">
        <Card className="shadow-none border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Financial Advisor
            </CardTitle>
            <CardDescription>
              Get personalized advice based on your financial data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {advice && (
              <div className="text-sm p-4 bg-secondary rounded-lg border">
                {advice.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            )}
            {!advice && !isPending && !error && (
              <p className="text-sm text-muted-foreground">
                Click the button below to generate your personalized financial
                advice.
              </p>
            )}
            <Button
              onClick={handleGetAdvice}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? 'Generating...' : 'Get Advice'}
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
