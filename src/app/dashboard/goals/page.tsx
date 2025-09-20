import { Header } from '@/components/header';

export default function GoalsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
        <h1 className="text-2xl font-bold">Goals</h1>
        <p>This page is under construction.</p>
      </main>
    </div>
  );
}
