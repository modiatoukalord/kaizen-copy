
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTransactions } from '@/lib/data';
import IncomeExpenseChart from '@/components/dashboard/income-expense-chart';
import ParetoChart from '@/components/dashboard/pareto-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sub, add, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Transaction, Period } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubNavigation from '@/components/dashboard/sub-navigation';

function ChartsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [period, setPeriod] = useState<Period>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTransactions = async () => {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    };
    fetchTransactions();
  }, []);

  const handlePrev = () => {
    const newDate = sub(currentDate, { [period.slice(0, -2) + 's']: 1 });
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = add(currentDate, { [period.slice(0, -2) + 's']: 1 });
    setCurrentDate(newDate);
  };

  const { filteredTransactions, currentPeriodLabel } = useMemo(() => {
    let interval;
    let label: string;

    switch (period) {
      case 'weekly':
        interval = { start: startOfWeek(currentDate, { locale: fr }), end: endOfWeek(currentDate, { locale: fr }) };
        label = `Semaine du ${format(interval.start, 'd MMM', { locale: fr })} au ${format(interval.end, 'd MMM yyyy', { locale: fr })}`;
        break;
      case 'monthly':
        interval = { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
        label = format(currentDate, 'MMMM yyyy', { locale: fr });
        break;
      case 'quarterly':
        interval = { start: startOfQuarter(currentDate), end: endOfQuarter(currentDate) };
        const startMonth = format(interval.start, 'LLL', { locale: fr });
        const endMonth = format(interval.end, 'LLL', { locale: fr });
        label = `T${format(currentDate, 'q')} (${startMonth}. - ${endMonth}.) ${format(currentDate, 'yyyy', { locale: fr })}`;
        break;
      case 'annually':
        interval = { start: startOfYear(currentDate), end: endOfYear(currentDate) };
        label = format(currentDate, 'yyyy', { locale: fr });
        break;
    }
    
    const filtered = transactions.filter(t => isWithinInterval(new Date(t.date), interval));
    
    return { filteredTransactions: filtered, currentPeriodLabel: label };
  }, [period, currentDate, transactions]);

  const periodOptions: { label: string, value: Period }[] = [
    { label: 'Semaine', value: 'weekly' },
    { label: 'Mois', value: 'monthly' },
    { label: 'Trimestre', value: 'quarterly' },
    { label: 'Année', value: 'annually' },
  ];

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
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                 <div className="block md:hidden w-full">
                    <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                      <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                          {periodOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                              {option.label}
                          </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="hidden md:block">
                      <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)} className="hidden md:block">
                      <TabsList>
                          {periodOptions.map(option => (
                          <TabsTrigger key={option.value} value={option.value}>{option.label}</TabsTrigger>
                          ))}
                      </TabsList>
                      </Tabs>
                  </div>
                <div className='flex items-center justify-between gap-2'>
                    <Button variant="outline" size="icon" onClick={handlePrev}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium text-center w-[200px] md:w-auto">{currentPeriodLabel}</span>
                    <Button variant="outline" size="icon" onClick={handleNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
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
