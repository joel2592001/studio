
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/logo';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
        <Logo />
        <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}
