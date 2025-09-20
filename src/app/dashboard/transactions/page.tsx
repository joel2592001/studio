
'use client'

import { Header } from '@/components/header';
import { FinancialProvider } from '@/contexts/financial-context';
import { AllTransactions } from '@/components/dashboard/all-transactions';

function TransactionsContent() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        <AllTransactions />
      </main>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <FinancialProvider>
      <TransactionsContent />
    </FinancialProvider>
  );
}
