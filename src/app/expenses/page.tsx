
'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/dashboard';
import { getTransactions } from '@/lib/data';
import type { Transaction } from '@/lib/types';

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col gap-4">
        <Dashboard 
            initialTransactions={transactions} 
            title="Dépenses"
            filterType='expense'
            hideCharts={true}
        />
    </div>
  )
}
