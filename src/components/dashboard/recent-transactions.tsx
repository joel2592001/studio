'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFinancials } from '@/contexts/financial-context';
import { useMemo } from 'react';
import { Timestamp } from 'firebase/firestore';
import { FileSearch } from 'lucide-react';

export function RecentTransactions() {
  const { state } = useFinancials();

  const getDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  }

  const recentTransactions = useMemo(() => {
    return state.transactions
      .sort((a, b) => getDate(b.date).getTime() - getDate(a.date).getTime())
      .slice(0, 6);
  }, [state.transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A list of your most recent income and expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      className="text-xs"
                      variant={
                        transaction.type === 'income' ? 'default' : 'secondary'
                      }
                      style={{
                        backgroundColor:
                          transaction.type === 'income'
                            ? 'hsl(var(--primary))'
                            : 'hsl(var(--accent))',
                        color:
                          transaction.type === 'income'
                            ? 'hsl(var(--primary-foreground))'
                            : 'hsl(var(--accent-foreground))',
                      }}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getDate(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
            <FileSearch className="h-16 w-16 text-muted" />
            <div className="space-y-1">
              <h3 className="font-semibold tracking-tight">No transactions found</h3>
              <p className="text-sm text-muted-foreground">
                Add a transaction to see your recent activity.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
