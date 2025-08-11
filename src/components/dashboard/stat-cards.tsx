import { ArrowDownLeft, ArrowUpRight, DollarSign, ArrowLeftRight, TrendingUp, CircleArrowLeft } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import StatCard from './stat-card';

interface StatCardsProps {
  transactions: Transaction[];
  filterType?: 'income' | 'expense';
}

export default function StatCards({ transactions, filterType }: StatCardsProps) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    const totalEmprunt = transactions
        .filter(t => t.category === 'Emprunt' && t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const gainPropre = income - totalEmprunt;

    if (filterType === 'income') {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Revenu total" value={income} icon={ArrowUpRight} />
                <StatCard title="Total emprunt" value={totalEmprunt} icon={ArrowLeftRight} />
                <StatCard title="Gain propre" value={gainPropre} icon={DollarSign} />
            </div>
        );
    }

    if (filterType === 'expense') {
        const totalInvestissement = transactions
            .filter(t => t.category === 'Investissement' && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalRemboursement = transactions
            .filter(t => t.category === 'Remboursement' && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total des dépenses" value={expenses} icon={ArrowDownLeft} />
                <StatCard title="Total investissement" value={totalInvestissement} icon={TrendingUp} />
                <StatCard title="Total remboursement" value={totalRemboursement} icon={CircleArrowLeft} />
            </div>
        );
    }
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Revenu total" value={income} icon={ArrowUpRight} />
            <StatCard title="Dépenses totales" value={expenses} icon={ArrowDownLeft} />
            <StatCard title="Solde net" value={balance} icon={DollarSign} />
        </div>
    );
}
