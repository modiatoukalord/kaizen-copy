
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import SubNavigation from '@/components/dashboard/sub-navigation';
import { useCurrency } from '@/contexts/currency-context';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ProjectionItem = {
  id: string;
  description: string;
  amount: number;
  type: 'once' | 'recurring';
};

export default function ProjectionPage() {
  const { currency } = useCurrency();
  const [initialBalance, setInitialBalance] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [incomes, setIncomes] = useState<ProjectionItem[]>([]);
  const [expenses, setExpenses] = useState<ProjectionItem[]>([]);

  const handleAddItem = (type: 'income' | 'expense') => {
    const newItem: ProjectionItem = { id: crypto.randomUUID(), description: '', amount: 0, type: 'once' };
    if (type === 'income') {
      setIncomes([...incomes, newItem]);
    } else {
      setExpenses([...expenses, newItem]);
    }
  };

  const handleRemoveItem = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomes(incomes.filter(item => item.id !== id));
    } else {
      setExpenses(expenses.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof Omit<ProjectionItem, 'id'>, value: string | number, type: 'income' | 'expense') => {
    const list = type === 'income' ? incomes : expenses;
    const setList = type === 'income' ? setIncomes : setExpenses;
    
    const newList = list.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setList(newList);
  };
  
  const projectionData = useMemo(() => {
    const data = [];
    let currentBalance = initialBalance;

    for (let i = 0; i <= projectionMonths; i++) {
      let monthIncome = 0;
      let monthExpense = 0;

      // Recurring items
      incomes.filter(item => item.type === 'recurring').forEach(item => monthIncome += item.amount);
      expenses.filter(item => item.type === 'recurring').forEach(item => monthExpense += item.amount);
      
      // One-time items in the first month
      if (i === 1) {
          incomes.filter(item => item.type === 'once').forEach(item => monthIncome += item.amount);
          expenses.filter(item => item.type === 'once').forEach(item => monthExpense += item.amount);
      }
      
      if (i > 0) {
        currentBalance += monthIncome - monthExpense;
      }

      data.push({
        month: `Mois ${i}`,
        balance: currentBalance,
      });
    }
    return data;
  }, [initialBalance, projectionMonths, incomes, expenses]);

  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  
  const renderTable = (title: string, items: ProjectionItem[], type: 'income' | 'expense') => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Récurrence</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.description}
                    onChange={e => handleItemChange(item.id, 'description', e.target.value, type)}
                    placeholder="Ex: Salaire, Loyer..."
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={e => handleItemChange(item.id, 'amount', parseFloat(e.target.value) || 0, type)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={item.type}
                    onValueChange={value => handleItemChange(item.id, 'type', value, type)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Unique</SelectItem>
                      <SelectItem value="recurring">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id, type)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={() => handleAddItem(type)} className="mt-4 w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <SubNavigation />
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Projection Financière</h1>
          <p className="text-muted-foreground">Simulez l'évolution de votre solde sur plusieurs mois.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration de la Projection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initial-balance">Solde de départ ({currency})</Label>
                <Input
                  id="initial-balance"
                  type="number"
                  value={initialBalance}
                  onChange={e => setInitialBalance(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projection-months">Horizon (en mois): {projectionMonths}</Label>
                <Slider
                  id="projection-months"
                  min={1}
                  max={24}
                  step={1}
                  value={[projectionMonths]}
                  onValueChange={([value]) => setProjectionMonths(value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Résultats de la Projection</CardTitle>
                <CardDescription>
                    Solde final après {projectionMonths} mois : 
                    <span className="font-bold text-lg text-primary ml-2">{formatCurrency(finalBalance, currency)}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => formatCurrency(value, currency, true)} />
                        <Tooltip content={({ active, payload, label }) => {
                             if (active && payload && payload.length) {
                                return (
                                <div className="p-2 border rounded-lg bg-background shadow-lg">
                                    <p className="label font-bold">{label}</p>
                                    <p style={{ color: 'hsl(var(--primary))' }}>
                                        {`Solde: ${formatCurrency(payload[0].value as number, currency)}`}
                                    </p>
                                </div>
                                );
                            }
                            return null;
                        }} />
                        <Legend />
                        <Line type="monotone" dataKey="balance" name="Solde Projeté" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderTable('Revenus Projetés', incomes, 'income')}
          {renderTable('Dépenses Projetées', expenses, 'expense')}
        </div>
      </div>
    </div>
  );
}
