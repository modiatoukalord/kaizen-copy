
'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard';
import { getTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import SubNavigation from '@/components/dashboard/sub-navigation';

export default function IncomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    };
    fetchTransactions();
  }, []);
  
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
        <SubNavigation />
        <div className="flex flex-col gap-4">
            <Dashboard 
                initialTransactions={transactions} 
                title="Revenus"
                filterType='income'
                hideCharts={true}
            />
        </div>
    </div>
  )
}
