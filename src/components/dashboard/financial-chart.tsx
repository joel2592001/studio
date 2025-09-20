'use client';

import { TrendingUp, BarChart } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--primary))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--destructive))',
  },
};

export function FinancialChart() {
  const { state } = useFinancials();

  const getDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  }

  const chartData = useMemo(() => {
    if (state.transactions.length === 0) {
      // Return data for the last 6 months with 0 values
      const data = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        data.push({
          month: d.toLocaleString('default', { month: 'long' }),
          income: 0,
          expenses: 0,
        });
      }
      return data;
    }

    const dataByMonth: { [key: string]: { income: number; expenses: number } } = {};

    state.transactions.forEach(transaction => {
      const month = getDate(transaction.date).toLocaleString('default', { month: 'long' });
      if (!dataByMonth[month]) {
        dataByMonth[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === 'income') {
        dataByMonth[month].income += transaction.amount;
      } else {
        dataByMonth[month].expenses += transaction.amount;
      }
    });

    return Object.keys(dataByMonth).map(month => ({
      month,
      ...dataByMonth[month],
    }));

  }, [state.transactions]);
  
  return (
    <Card className="shadow-md sm:col-span-2">
      <CardHeader>
        <CardTitle>Income vs. Expenses</CardTitle>
        <CardDescription>A chart of your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.transactions.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart
              data={chartData}
              margin={{
                left: -20,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
              />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="income"
                type="natural"
                fill="var(--color-income)"
                fillOpacity={0.4}
                stroke="var(--color-income)"
                stackId="a"
              />
              <Area
                dataKey="expenses"
                type="natural"
                fill="var(--color-expenses)"
                fillOpacity={0.4}
                stroke="var(--color-expenses)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] w-full flex-col items-center justify-center gap-4 text-center">
            <BarChart className="h-16 w-16 text-muted" />
            <div className="space-y-1">
              <h3 className="font-semibold tracking-tight">No chart data</h3>
              <p className="text-sm text-muted-foreground">
                Add transactions to see your income vs. expense chart.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Financial overview
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Track your financial health over time
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
