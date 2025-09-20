'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from 'lucide-react';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo } from 'react';

function RupeeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 3h12m-12 6h12M9 15h6m-6-6l-4 8m16-8l-4 8m-5-4h2a3 3 0 0 1 0 6H9"
            ></path>
        </svg>
    )
}

export function OverviewCards() {
  const { state } = useFinancials();

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground">Your total income</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">Your total expenses</p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {formatCurrency(savings)}
          </div>
          <p className="text-xs text-muted-foreground">
            Current available balance
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <RupeeIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline">
            {formatCurrency(savings)}
          </div>
          <p className="text-xs text-muted-foreground">
            Your current net worth
          </p>
        </CardContent>
      </Card>
    </>
  );
}
