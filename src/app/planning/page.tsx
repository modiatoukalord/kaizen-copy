
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';

// Mock data for budget plan
const initialBudgetItems = [
    { category: 'Nourriture', planned: 200000, spent: 150000 },
    { category: 'Transport', planned: 50000, spent: 35000 },
    { category: 'Divertissement', planned: 75000, spent: 95000 },
];


export default function PlanningPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [budgetItems, setBudgetItems] = React.useState(initialBudgetItems);

  const handleAddItem = () => {
    setBudgetItems([...budgetItems, { category: 'Nouvelle catégorie', planned: 0, spent: 0 }]);
  }

  const handleRemoveItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Planning</h1>
        <p className="text-muted-foreground">Planifiez vos projets, dépenses et budget.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Plan budgétaire</CardTitle>
              <CardDescription>Définissez et suivez votre budget mensuel.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Catégorie</TableHead>
                            <TableHead className="text-right">Prévu</TableHead>
                            <TableHead className="text-right">Dépensé</TableHead>
                            <TableHead className="text-right">Restant</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {budgetItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell><Input defaultValue={item.category} /></TableCell>
                                <TableCell className="text-right"><Input type="number" defaultValue={item.planned} className="text-right" /></TableCell>
                                <TableCell className="text-right">{item.spent.toLocaleString()} FCFA</TableCell>
                                <TableCell className="text-right">{(item.planned - item.spent).toLocaleString()} FCFA</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button onClick={handleAddItem} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter une ligne
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                <CardTitle>Calendrier</CardTitle>
                <CardDescription>Notez vos prévisions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                    <div className="mt-4 space-y-2">
                        <Label htmlFor="event">Événement pour la date sélectionnée</Label>
                        <Input id="event" placeholder="Ex: Paiement facture SENELEC" />
                        <Button className='w-full'>Ajouter l'événement</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
