'use client';

import { useState, useMemo } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFinancials } from '@/contexts/financial-context';
import { ListFilter, FileSearch } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const TRANSACTIONS_PER_PAGE = 10;

export function AllTransactions() {
  const { state } = useFinancials();
  const [filters, setFilters] = useState<{ type: string[]; category: string[] }>({
    type: [],
    category: [],
  });
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getDate = (date: Date | Timestamp) => {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  }

  const uniqueCategories = useMemo(() => {
    const categories = new Set(state.transactions.map((t) => t.category));
    return Array.from(categories);
  }, [state.transactions]);

  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter((transaction) => {
        const typeMatch = filters.type.length === 0 || filters.type.includes(transaction.type);
        const categoryMatch = filters.category.length === 0 || filters.category.includes(transaction.category);
        return typeMatch && categoryMatch;
      })
      .sort((a, b) => getDate(b.date).getTime() - getDate(a.date).getTime());
  }, [state.transactions, filters]);

  const totalPages = Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE
  );

  const handleFilterChange = (filterType: 'type' | 'category', value: string) => {
    setFilters((prev) => {
      const newValues = prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value];
      return { ...prev, [filterType]: newValues };
    });
    setCurrentPage(1);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
                A complete list of your income and expenses.
            </CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                    checked={filters.type.includes('income')}
                    onCheckedChange={() => handleFilterChange('type', 'income')}
                >
                    Income
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={filters.type.includes('expense')}
                    onCheckedChange={() => handleFilterChange('type', 'expense')}
                >
                    Expense
                </DropdownMenuCheckboxItem>
                {uniqueCategories.length > 0 && (
                    <>
                        <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniqueCategories.map(category => (
                            <DropdownMenuCheckboxItem
                                key={category}
                                checked={filters.category.includes(category)}
                                onCheckedChange={() => handleFilterChange('category', category)}
                            >
                                {category}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {filteredTransactions.length > 0 ? (
            <>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell>
                        <div className="font-medium">{transaction.description}</div>
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
                        <TableCell className="hidden md:table-cell">
                            {transaction.category}
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
                <div className="flex justify-between items-center pt-4">
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{(currentPage - 1) * TRANSACTIONS_PER_PAGE + 1} - {Math.min(currentPage * TRANSACTIONS_PER_PAGE, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong> transactions
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </>
        ) : (
             <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
                <FileSearch className="h-16 w-16 text-muted" />
                <div className="space-y-1">
                <h3 className="font-semibold tracking-tight">No transactions found</h3>
                <p className="text-sm text-muted-foreground">
                    Add a transaction to get started.
                </p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
