'use client';

import { FinancialProvider } from '@/contexts/financial-context';
import { Header } from '@/components/header';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { Goals } from '@/components/dashboard/goals';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { AiAdvisor } from '@/components/dashboard/ai-advisor';

function DashboardContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
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
      </main>
      <AiAdvisor />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <FinancialProvider>
      <DashboardContent />
    </FinancialProvider>
  );
}
