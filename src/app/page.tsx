
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { PiggyBank } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <PiggyBank className="h-12 w-12 animate-pulse text-primary" />
    </div>
  );
}
