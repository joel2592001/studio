
'use client'

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FinancialSummary } from '@/components/dashboard/reports/financial-summary';
import { ExpenseCategoryChart } from '@/components/dashboard/reports/expense-category-chart';
import { useFinancials } from '@/contexts/financial-context';
import { Transaction } from '@/lib/types';
import { CalendarIcon, Download } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


export default function ReportsPage() {
    const { state } = useFinancials();
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });

    const filteredTransactions = useMemo(() => {
        if (!dateRange.from || !dateRange.to) {
            return state.transactions;
        }
        return state.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= dateRange.from! && transactionDate <= dateRange.to!;
        });
    }, [state.transactions, dateRange]);

    const handleExport = () => {
        const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Description'];
        const rows = filteredTransactions.map(t => 
            [t.id, t.type, t.category, t.amount, new Date(t.date).toLocaleDateString(), `"${t.description.replace(/"/g, '""')}"`].join(',')
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
                        "w-[300px] justify-start text-left font-normal",
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
             </div>
             <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export All
            </Button>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <FinancialSummary transactions={filteredTransactions} />
            <ExpenseCategoryChart transactions={filteredTransactions} />
        </div>
    </div>
  );
}

