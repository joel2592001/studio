
'use client'

import { Header } from '@/components/header';
import { FinancialProvider } from '@/contexts/financial-context';

function ReportsContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p>This page is under construction.</p>
      </main>
    </div>
  );
}

export default function ReportsPage() {
    return (
        <FinancialProvider>
            <ReportsContent />
        </FinancialProvider>
    )
}
