
'use client'

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FinancialSummary } from '@/components/dashboard/reports/financial-summary';
import { ExpenseCategoryChart } from '@/components/dashboard/reports/expense-category-chart';
import { useFinancials } from '@/contexts/financial-context';
import { CalendarIcon, Download, ListFilter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Timestamp } from 'firebase/firestore';


export default function ReportsPage() {
    const { state } = useFinancials();
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });
    const [filters, setFilters] = useState<{ type: string[]; category: string[] }>({
        type: [],
        category: [],
    });

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
        return state.transactions.filter(t => {
            const transactionDate = getDate(t.date);
            const dateMatch = !dateRange.from || !dateRange.to || (transactionDate >= dateRange.from && transactionDate <= dateRange.to);
            const typeMatch = filters.type.length === 0 || filters.type.includes(t.type);
            const categoryMatch = filters.category.length === 0 || filters.category.includes(t.category);
            return dateMatch && typeMatch && categoryMatch;
        });
    }, [state.transactions, dateRange, filters]);

    const handleFilterChange = (filterType: 'type' | 'category', value: string) => {
        setFilters((prev) => {
          const newValues = prev[filterType].includes(value)
            ? prev[filterType].filter((v) => v !== value)
            : [...prev[filterType], value];
          return { ...prev, [filterType]: newValues };
        });
    };

    const handleExport = () => {
        const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Description'];
        const rows = filteredTransactions.map(t => 
            [t.id, t.type, t.category, t.amount, getDate(t.date).toLocaleDateString(), `"${t.description.replace(/"/g, '""')}"`].join(',')
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `financial_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-[300px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 gap-1">
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
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>
             <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <FinancialSummary transactions={filteredTransactions} />
            <ExpenseCategoryChart transactions={filteredTransactions} />
        </div>
    </div>
  );
}
