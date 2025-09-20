
'use client'

import { FinancialSummary } from '@/components/dashboard/reports/financial-summary';
import { ExpenseCategoryChart } from '@/components/dashboard/reports/expense-category-chart';

export default function ReportsPage() {
  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
      <FinancialSummary />
      <ExpenseCategoryChart />
    </div>
  );
}
