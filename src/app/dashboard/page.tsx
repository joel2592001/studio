'use client';

import { OverviewCards } from '@/components/dashboard/overview-cards';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { Goals } from '@/components/dashboard/goals';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <OverviewCards />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <FinancialChart />
            <Goals />
          </div>
          <RecentTransactions />
        </div>
      </div>
    </>
  );
}
