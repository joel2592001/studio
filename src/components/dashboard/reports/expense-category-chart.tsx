'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFinancials } from '@/contexts/financial-context';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'
];

export function ExpenseCategoryChart() {
  const { state } = useFinancials();

  const expenseData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    state.transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (categoryTotals[t.category]) {
          categoryTotals[t.category] += t.amount;
        } else {
          categoryTotals[t.category] = t.amount;
        }
      });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [state.transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 border border-border rounded-lg shadow-lg">
          <p className="label">{`${payload[0].name} : ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>A breakdown of your spending habits.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
