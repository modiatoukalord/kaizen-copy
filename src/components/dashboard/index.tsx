

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  parseISO,
  getYear,
  format
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Transaction, Category, Transfer } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCards from './stat-cards';
import TransactionsTable from './transactions-table';
import { IncomeCategory, AllExpenseSubCategories } from '@/lib/types';
import { getTransactions, getTransfers } from '@/lib/data';


interface DashboardProps {
  initialTransactions: Transaction[];
  initialTransfers?: Transfer[];
  title?: string;
  filterType?: 'income' | 'expense';
  hideCharts?: boolean;
}

export default function Dashboard({ initialTransactions, initialTransfers = [], title, filterType, hideCharts = false }: DashboardProps) {
  const [selectedYear, setSelectedYear] = useState<number>(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'MM'));

  const [globalFilter, setGlobalFilter] = React.useState('');

  const years = useMemo(() => {
    const allYears = new Set(initialTransactions.map(t => getYear(new Date(t.date))));
    const currentYear = getYear(new Date());
    allYears.add(currentYear);
    return Array.from(allYears).sort((a,b) => b - a);
  }, [initialTransactions]);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: format(new Date(2000, i), 'MM'),
      label: format(new Date(2000, i), 'MMMM', { locale: fr }),
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!selectedYear || !selectedMonth) {
        return { transactions: [], transfers: [] };
    }

    const startDate = startOfMonth(new Date(selectedYear, parseInt(selectedMonth, 10) - 1));
    const endDate = endOfMonth(startDate);
    const interval = { start: startDate, end: endDate };
    
    let periodTransactions = initialTransactions.filter(t => isWithinInterval(parseISO(t.date), interval));
    const periodTransfers = initialTransfers.filter(t => isWithinInterval(parseISO(t.date), interval));

    if (filterType) {
        periodTransactions = periodTransactions.filter(t => t.type === filterType);
    }
    
    return { transactions: periodTransactions, transfers: periodTransfers };
  }, [selectedYear, selectedMonth, initialTransactions, initialTransfers, filterType]);
  
  const allTransactionsForType = useMemo(() => {
     let filtered = initialTransactions;
     if (filterType) {
        filtered = filtered.filter(t => t.type === filterType);
    }
    return filtered;
  }, [initialTransactions, filterType]);

  const categoryOptions = React.useMemo(() => {
    let categories: readonly string[];
    if (filterType === 'income') {
      categories = IncomeCategory;
    } else if (filterType === 'expense') {
      categories = AllExpenseSubCategories;
    } else {
      categories = [...IncomeCategory, ...AllExpenseSubCategories];
    }
    return categories.map(cat => ({ label: cat, value: cat }));
  }, [filterType]);


  return (
    <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
            <div className="flex gap-2 w-full md:w-auto">
                <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
                    <SelectTrigger className="w-full">
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
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-full">
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
        
        <StatCards transactions={filteredData.transactions} transfers={filteredData.transfers} filterType={filterType} />
        
        <div className="overflow-x-auto">
            <TransactionsTable 
                transactions={allTransactionsForType} 
                filterType={filterType}
                categoryOptions={categoryOptions}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
            />
        </div>
    </div>
  );
}
