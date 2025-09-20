
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '@/lib/types';

type FinancialSummaryProps = {
    transactions: Transaction[];
};

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const { totalIncome, totalExpenses, savings, savingsRate } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const currentSavings = income - expenses;
    const rate = income > 0 ? (currentSavings / income) * 100 : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      savings: currentSavings,
      savingsRate: rate,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>An overview of your financial health.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold font-headline">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold font-headline">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className="text-2xl font-bold font-headline">{formatCurrency(savings)}</p>
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
            <p className="text-lg font-semibold">Savings Rate</p>
            <p className={`text-4xl font-bold font-headline ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                You are saving {savingsRate.toFixed(1)}% of your income.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
