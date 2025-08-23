
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTransactions } from '@/lib/data';
import IncomeExpenseChart from '@/components/dashboard/income-expense-chart';
import ParetoChart from '@/components/dashboard/pareto-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Transaction } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubNavigation from '@/components/dashboard/sub-navigation';

function ChartsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'MM'));

  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    };
    fetchTransactions();
  }, []);

  const years = useMemo(() => {
    if (transactions.length === 0) return [getYear(new Date())];
    const uniqueYears = [...new Set(transactions.map(t => getYear(new Date(t.date))))];
    return uniqueYears.sort((a, b) => b - a);
  }, [transactions]);
  
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
        value: format(new Date(2000, i), 'MM'),
        label: format(new Date(2000, i), 'MMMM', { locale: fr }),
    }));
  }, []);


  const filteredTransactions = useMemo(() => {
    const year = selectedYear;
    const month = parseInt(selectedMonth, 10);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));
    const interval = { start: startDate, end: endDate };
    
    return transactions.filter(t => isWithinInterval(new Date(t.date), interval));
  }, [selectedYear, selectedMonth, transactions]);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <SubNavigation />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Graphiques</h1>
                <p className="text-muted-foreground">Visualisez vos données financières.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                  <div className="w-full md:w-auto">
                      <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
                          <SelectTrigger className="w-full md:w-[120px]">
                          <SelectValue placeholder="Année" />
                          </SelectTrigger>
                          <SelectContent>
                          {years.map(year => (
                              <SelectItem key={year} value={String(year)}>
                              {year}
                              </SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="w-full md:w-auto">
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                          <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Mois" />
                          </SelectTrigger>
                          <SelectContent>
                          {months.map(month => (
                              <SelectItem key={month.value} value={month.value}>
                              {month.label}
                              </SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                  </div>
              </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-x-auto">
            <div className="w-full">
              <IncomeExpenseChart transactions={filteredTransactions} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="w-full">
              <ParetoChart transactions={filteredTransactions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ChartsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChartsContent />
    </Suspense>
  )
}
