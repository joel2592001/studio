'use client';

import { Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';

export function Goals() {
  const { state } = useFinancials();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDate = (date: Date | Timestamp | undefined) => {
    if (!date) return undefined;
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  }

  const goalsWithProgress = useMemo(() => {
    return state.goals.map((goal) => ({
      ...goal,
      progress: Math.min(
        (goal.currentAmount / goal.targetAmount) * 100,
        100
      ),
    }));
  }, [state.goals]);

  return (
    <Card className="shadow-md sm:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" /> Savings Goals
        </CardTitle>
        <CardDescription>Your progress towards financial goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {goalsWithProgress.map((goal) => (
          <div key={goal.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{goal.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(goal.currentAmount)} /{' '}
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
            <Progress value={goal.progress} className="h-3" />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-muted-foreground">
                {goal.progress.toFixed(0)}% complete
              </span>
              {goal.deadline && (
                 <span className="text-xs text-muted-foreground">
                    Deadline: {getDate(goal.deadline)!.toLocaleDateString()}
                 </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
