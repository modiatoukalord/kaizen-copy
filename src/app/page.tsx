
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { PiggyBank } from 'lucide-react';

const ONBOARDING_KEY = 'onboarding-complete';

export default function WelcomePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
    if (onboardingComplete === 'true') {
      router.replace('/dashboard');
    } else {
      setShowOnboarding(true);
    }
  }, [router]);
  
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleNext = () => {
    if (current === count - 1) {
      handleGetStarted();
    } else {
      api?.scrollNext();
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    router.push('/dashboard');
  };

  if (!showOnboarding) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <PiggyBank className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-md md:max-w-lg">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            <CarouselItem>
              <OnboardingStep
                image="/images/onboarding-1.png"
                data-ai-hint="finance management"
                title="Bienvenue chez Le KAIZEN"
                description="Prenez le contrôle total de vos finances. Suivez vos revenus, vos dépenses et atteignez vos objectifs financiers."
              />
            </CarouselItem>
            <CarouselItem>
              <OnboardingStep
                image="/images/onboarding-2.png"
                data-ai-hint="budget planning"
                title="Planifiez Votre Avenir"
                description="Créez des budgets mensuels, suivez vos dépenses par catégorie et recevez des alertes pour rester sur la bonne voie."
              />
            </CarouselItem>
            <CarouselItem>
              <OnboardingStep
                image="/images/onboarding-3.png"
                data-ai-hint="financial analytics"
                title="Visualisez Vos Données"
                description="Des graphiques et des rapports perspicaces pour vous aider à comprendre vos habitudes financières et à prendre de meilleures décisions."
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={handleGetStarted}>
            Passer
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === current ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {current === count - 1 ? 'Commencer' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OnboardingStep({ image, title, description, 'data-ai-hint': dataAiHint }: { image: string, title: string, description: string, 'data-ai-hint': string }) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="flex flex-col items-center justify-center p-0 text-center">
        <Image
          src={image}
          width={400}
          height={400}
          alt={title}
          className="mb-8 aspect-square w-full max-w-xs rounded-lg object-cover"
          data-ai-hint={dataAiHint}
        />
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
