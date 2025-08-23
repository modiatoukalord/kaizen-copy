
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import SubNavigation from '@/components/dashboard/sub-navigation';

export default function SettingsPage() {
  const { user, changePin } = useAuth();
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPin || !newPin || !confirmPin) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (newPin !== confirmPin) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Les nouveaux codes PIN ne correspondent pas.' });
      return;
    }
    if (newPin.length !== 4) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le nouveau code PIN doit contenir 4 chiffres.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
        try {
            if (user) {
                changePin(user.username, oldPin, newPin);
                toast({ title: 'Succès', description: 'Votre code PIN a été modifié.' });
                setOldPin('');
                setNewPin('');
                setConfirmPin('');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erreur', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, 500);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <SubNavigation />
       <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Paramètres</h1>
          <p className="text-muted-foreground">Gérez les informations de votre compte.</p>
        </div>
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Changer le code PIN</CardTitle>
                <CardDescription>Mettez à jour votre code PIN à 4 chiffres.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="oldPin">Ancien code PIN</Label>
                        <Input
                        id="oldPin"
                        type="password"
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        maxLength={4}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPin">Nouveau code PIN</Label>
                        <Input
                        id="newPin"
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        maxLength={4}
                        required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPin">Confirmer le nouveau code PIN</Label>
                        <Input
                        id="confirmPin"
                        type="password"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        maxLength={4}
                        required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Changer le code PIN
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
