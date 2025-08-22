

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  parseISO,
} from 'date-fns';
import type { Transaction, Period, Category, Transfer } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCards from './stat-cards';
import TransactionsTable from './transactions-table';
import { IncomeCategory, AllExpenseSubCategories } from '@/lib/types';
import SummaryChart from './summary-chart';
import { Card, CardContent } from '../ui/card';
import { getTransactions, getTransfers } from '@/lib/data';


interface DashboardProps {
  initialTransactions: Transaction[];
  initialTransfers?: Transfer[];
  title?: string;
  filterType?: 'income' | 'expense';
  hideCharts?: boolean;
}

export default function Dashboard({ initialTransactions: serverTransactions, initialTransfers: serverTransfers = [], title="Tableau de bord", filterType, hideCharts = false }: DashboardProps) {
  const [period, setPeriod] = useState<Period>('monthly');
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [transactions, setTransactions] = useState(serverTransactions);
  const [transfers, setTransfers] = useState(serverTransfers);

  useEffect(() => {
    // This allows the component to reflect updates from server actions (e.g. adding a transaction)
    setTransactions(serverTransactions);
    setTransfers(serverTransfers);
  }, [serverTransactions, serverTransfers])


  const periodOptions: { label: string, value: Period }[] = [
    { label: 'Semaine', value: 'weekly' },
    { label: 'Mois', value: 'monthly' },
    { label: 'Trimestre', value: 'quarterly' },
    { label: 'Année', value: 'annually' },
  ];

  const filteredData = useMemo(() => {
    const now = new Date();
    let interval;

    switch (period) {
      case 'weekly':
        interval = { start: startOfWeek(now), end: endOfWeek(now) };
        break;
      case 'monthly':
        interval = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      case 'quarterly':
        interval = { start: startOfQuarter(now), end: endOfQuarter(now) };
        break;
      case 'annually':
        interval = { start: startOfYear(now), end: endOfYear(now) };
        break;
    }

    let periodTransactions = transactions.filter(t => isWithinInterval(parseISO(t.date), interval));
    const periodTransfers = transfers.filter(t => isWithinInterval(parseISO(t.date), interval));

    if (filterType) {
        periodTransactions = periodTransactions.filter(t => t.type === filterType);
    }
    
    return { transactions: periodTransactions, transfers: periodTransfers };
  }, [period, transactions, transfers, filterType]);
  
  const allTransactionsForType = useMemo(() => {
     let filtered = transactions;
     if (filterType) {
        filtered = filtered.filter(t => t.type === filterType);
    }
    return filtered;
  }, [transactions, filterType]);

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
    <>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="w-full md:w-auto">
            <div className="block md:hidden">
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
          </div>
        </div>
        
        <StatCards transactions={filteredData.transactions} transfers={filteredData.transfers} filterType={filterType} />
        
        {!hideCharts ? (
             <Tabs defaultValue="chart" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">Graphique</TabsTrigger>
                    <TabsTrigger value="table">Tableau</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                     <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            <SummaryChart transactions={filteredData.transactions} period={period} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="table">
                     <div className="overflow-x-auto">
                        <TransactionsTable 
                            transactions={allTransactionsForType} 
                            filterType={filterType}
                            categoryOptions={categoryOptions}
                            globalFilter={globalFilter}
                            onGlobalFilterChange={setGlobalFilter}
                        />
                    </div>
                </TabsContent>
             </Tabs>
        ) : (
             <div className="overflow-x-auto">
                <TransactionsTable 
                    transactions={allTransactionsForType} 
                    filterType={filterType}
                    categoryOptions={categoryOptions}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                />
            </div>
        )}
       
    </>
  );
}
