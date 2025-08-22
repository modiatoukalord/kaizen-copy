
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PiggyBank, PlusCircle, ArrowRightLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddTransactionSheet } from './add-transaction-sheet';
import { AddTransferSheet } from './add-transfer-sheet';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/contexts/currency-context';
import { useState } from 'react';
import InstallPWA from './install-pwa';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const transactionType = (() => {
    if (pathname === '/income') return 'income';
    if (pathname === '/expenses') return 'expense';
    return undefined;
  })();
  
  const isTransfersPage = pathname === '/transfers';
  const isPlanningPage = pathname === '/planning';
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <PiggyBank className="h-6 w-6 text-primary" />
          <span className="font-headline">Le KAIZEN</span>
        </Link>
      </div>

        <div className="flex flex-1 items-center justify-end gap-2">
            <InstallPWA />
            <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="XOF">FCFA</SelectItem>
                </SelectContent>
            </Select>

            <div className="hidden md:flex items-center gap-2">
                 {!isPlanningPage && !isHomePage && (
                  isTransfersPage ? (
                      <AddTransferSheet>
                          <Button>
                              <ArrowRightLeft className="mr-2 h-4 w-4" />
                              Nouveau virement
                          </Button>
                      </AddTransferSheet>
                  ) : (
                      <AddTransactionSheet type={transactionType}>
                          <Button>
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Ajouter une transaction
                          </Button>
                      </AddTransactionSheet>
                  )
                )}
            </div>
        </div>
    </header>
  );
}
