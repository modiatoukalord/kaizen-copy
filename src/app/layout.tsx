
'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { CurrencyProvider } from '@/contexts/currency-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import MobileNav from '@/components/dashboard/mobile-nav';
import ChatAssistant from '@/components/assistant/chat-assistant';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PiggyBank } from 'lucide-react';

const metadata: Metadata = {
  title: 'Le KAIZEN',
  description: 'A personal finance dashboard to track income and expenses.',
  manifest: '/manifest.webmanifest',
  icons: null,
};

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useAuth();
  
  const publicRoutes = ['/login'];

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !publicRoutes.includes(pathname)) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoading, pathname, router]);

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <PiggyBank className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <PiggyBank className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  const isAppRoute = isAuthenticated && !publicRoutes.includes(pathname);

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#E8EAF6" />
      </head>
      <body className="font-body antialiased">
        <CurrencyProvider>
          <div className="flex min-h-screen w-full flex-col">
              {isAppRoute && <DashboardHeader />}
              <main className={isAppRoute ? "flex-1 pb-24 md:pb-8" : "flex-1"}>
                  {children}
              </main>
          </div>
          {isAppRoute && (
            <>
              <ChatAssistant />
              <MobileNav />
            </>
          )}
          <Toaster />
        </CurrencyProvider>
      </body>
    </html>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  )
}
