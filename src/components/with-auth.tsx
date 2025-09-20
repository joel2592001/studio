'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Logo } from '@/components/logo';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background">
            <Logo />
            <p className="mt-4 text-muted-foreground">Loading Dashboard...</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
