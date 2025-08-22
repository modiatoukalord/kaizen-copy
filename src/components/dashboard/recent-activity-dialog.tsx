
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Expand, Minimize } from 'lucide-react';
import Dashboard from '@/components/dashboard';
import type { Transaction, Transfer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RecentActivityDialogProps {
    initialTransactions: Transaction[];
    initialTransfers: Transfer[];
}

export default function RecentActivityDialog({ initialTransactions, initialTransfers }: RecentActivityDialogProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                 <Button variant="outline" className="h-28 w-full flex-col gap-2 bg-background/75 hover:bg-accent/20 backdrop-blur-sm">
                    <Eye className="h-12 w-12" />
                    <span>Voir l'activité</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={cn(
                "flex flex-col transition-all duration-300 ease-in-out",
                isFullScreen 
                    ? "max-w-full w-full h-full max-h-full" 
                    : "max-w-4xl h-[90vh]"
            )}>
                <DialogHeader className="flex flex-row justify-between items-center pr-10">
                    <DialogTitle>Activité Récente</DialogTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
                        {isFullScreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                        <span className="sr-only">{isFullScreen ? 'Réduire' : 'Agrandir'}</span>
                    </Button>
                </DialogHeader>
                <div className="overflow-y-auto flex-1 pr-6">
                    <Dashboard 
                        initialTransactions={initialTransactions}
                        initialTransfers={initialTransfers}
                        title=""
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
