'use client';

import { FinancialProvider } from '@/contexts/financial-context';
import { Header } from '@/components/header';
import { AiAdvisor } from '@/components/dashboard/ai-advisor';

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FinancialProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          {children}
        </main>
        <AiAdvisor />
      </div>
    </FinancialProvider>
  );
}

export default DashboardLayout;
