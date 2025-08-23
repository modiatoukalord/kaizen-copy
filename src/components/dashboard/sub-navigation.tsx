
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

const navigationGroups = {
  transactions: [
    { href: '/income', label: 'Revenus' },
    { href: '/expenses', label: 'Dépenses' },
    { href: '/transfers', label: 'Virements' },
  ],
  synthesis: [
    { href: '/charts', label: 'Graphiques' },
  ],
  planning: [
    { href: '/planning', label: 'Planning' },
  ],
  account: [
    { href: '/settings', label: 'Paramètres' },
  ]
};

const findGroup = (pathname: string) => {
  for (const group of Object.values(navigationGroups)) {
    if (group.some(item => pathname.startsWith(item.href))) {
        return group;
    }
  }
  return [];
}

export default function SubNavigation() {
  const pathname = usePathname();
  const currentGroup = findGroup(pathname);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Button variant="outline" asChild className="hidden sm:inline-flex">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tableau de bord
        </Link>
      </Button>
      <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
        {currentGroup.map(item => {
          const isActive = pathname === item.href;
          return (
            <Button key={item.href} variant={isActive ? 'default' : 'ghost'} size="sm" asChild className="text-sm">
              <Link href={item.href}>
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  );
}
