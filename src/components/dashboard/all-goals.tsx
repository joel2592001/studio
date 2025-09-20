'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFinancials } from '@/contexts/financial-context';
import { Target, Goal as GoalIcon } from 'lucide-react';
import { useMemo } from 'react';
import { GoalForm } from './goal-form';
import { Timestamp } from 'firebase/firestore';

export function AllGoals() {
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
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="h-6 w-6" />
                    Savings Goals
                </h1>
                <p className="text-muted-foreground">Track and manage your financial goals.</p>
            </div>
            <GoalForm />
        </div>
        {goalsWithProgress.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goalsWithProgress.map((goal) => (
                <Card key={goal.id} className="shadow-md">
                    <CardHeader>
                        <CardTitle>{goal.name}</CardTitle>
                        <CardDescription>
                            Target: {formatCurrency(goal.targetAmount)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium">
                                {formatCurrency(goal.currentAmount)}
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
                        <div className="flex gap-2">
                            <GoalForm goalToEdit={goal} />
                            <Button variant="outline" size="sm">View Details</Button>
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>
        ) : (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center border-2 border-dashed rounded-lg">
                <GoalIcon className="h-16 w-16 text-muted" />
                <div className="space-y-1">
                <h3 className="font-semibold tracking-tight">No goals to display</h3>
                <p className="text-sm text-muted-foreground">
                    Add a new savings goal to start tracking your progress.
                </p>
                </div>
            </div>
        )}
    </div>
  );
}
