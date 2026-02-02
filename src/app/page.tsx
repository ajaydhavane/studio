'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const phrases = [
  "No", "Are you sure?", "Really sure?", "Think again!", "Last chance!", 
  "Surely not?", "Pookie please", "Don't do this to me", "I'm gonna cry...", "You're breaking my heart ;(",
];

export default function ValentinePage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ top: string; left: string } | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const celebrationImage = useMemo(() => {
    return PlaceHolderImages.find((img) => img.id === 'valentine-celebration');
  }, []);

  useEffect(() => {
    if (noCount > 0 && containerRef.current && yesButtonRef.current && noButtonRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const yesButtonRect = yesButtonRef.current.getBoundingClientRect();
        const noButtonRect = noButtonRef.current.getBoundingClientRect();
  
        let newTop, newLeft;
        let attempts = 0;
        const maxAttempts = 100;
  
        const safePadding = 20;
  
        do {
          newTop = Math.random() * (containerRect.height - noButtonRect.height);
          newLeft = Math.random() * (containerRect.width - noButtonRect.width);
  
          const yesLeft = yesButtonRect.left - containerRect.left;
          const yesTop = yesButtonRect.top - containerRect.top;
          const yesRight = yesButtonRect.right - containerRect.left;
          const yesBottom = yesButtonRect.bottom - containerRect.top;

          const overlap =
            newLeft < yesRight + safePadding &&
            newLeft + noButtonRect.width > yesLeft - safePadding &&
            newTop < yesBottom + safePadding &&
            newTop + noButtonRect.height > yesTop - safePadding;
          
          if (!overlap) {
            break;
          }
          attempts++;
        } while (attempts < maxAttempts);
  
        setNoPosition({ top: `${newTop}px`, left: `${newLeft}px` });
      }
  }, [noCount, yesButtonScale]);

  const handleYesClick = () => {
    setIsAgreed(true);
  };

  const handleNoInteraction = () => {
    setNoCount(count => count + 1);
    const newScale = yesButtonScale + 0.2;
    const maxScale = 1.6;
    setYesButtonScale(Math.min(newScale, maxScale));
  };
  
  const getYesButtonText = () => {
    if (noCount > 4) return "Yesss!";
    return "Yes";
  }

  const noButtonText = phrases[Math.min(noCount, phrases.length - 1)];
  const buttonSizeClass = `py-4 px-8 text-lg`;

  if (isAgreed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 animate-in fade-in zoom-in duration-1000">
          Of course you will!
        </h1>
        <p className="text-2xl text-primary/80 mb-8 animate-in fade-in zoom-in-90 delay-500 duration-1000">
          I love you! See you on the 14th ❤️
        </p>
        <div className="relative w-80 h-80 md:w-96 md:h-96 animate-in fade-in zoom-in-75 delay-1000 duration-1000">
          <Image
            src={celebrationImage?.imageUrl || ''}
            alt={celebrationImage?.description || 'Celebration image'}
            fill
            className="rounded-full object-cover shadow-2xl"
            data-ai-hint={celebrationImage?.imageHint}
          />
        </div>
      </main>
    );
  }

  return (
    <main ref={containerRef} className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <Heart className="absolute top-10 left-10 text-primary/10 size-16 rotate-[-15deg] animate-pulse" fill="currentColor" />
      <Heart className="absolute bottom-16 right-16 text-primary/10 size-24 rotate-[10deg] animate-pulse" fill="currentColor" />
      <Heart className="absolute top-20 right-24 text-primary/5 size-12 rotate-[25deg] animate-pulse delay-500" fill="currentColor" />
      <Heart className="absolute bottom-24 left-20 text-primary/5 size-10 rotate-[-25deg] animate-pulse delay-700" fill="currentColor" />
      
      <div className="z-10 flex flex-col items-center gap-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-primary text-center max-w-2xl">
          Will you be my Valentine?
        </h1>
        <div className="relative flex items-center justify-center gap-4 h-24 w-full">
          <Button 
            ref={yesButtonRef}
            onClick={handleYesClick}
            className={`bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl ${buttonSizeClass}`}
            style={{ transform: `scale(${yesButtonScale})`, transformOrigin: 'center' }}
          >
            {getYesButtonText()}
          </Button>
          <Button
              ref={noButtonRef}
              onMouseOver={handleNoInteraction}
              onClick={handleNoInteraction}
              className={`font-bold transition-all duration-300 ease-in-out shadow-md ${buttonSizeClass} ${noCount > 0 ? 'absolute' : ''}`}
              style={noCount > 0 && noPosition ? {
                top: noPosition.top,
                left: noPosition.left,
                transition: 'top 0.4s ease, left 0.4s ease',
              } : {}}
              variant="primary"
            >
              {noButtonText}
            </Button>
        </div>
      </div>
    </main>
  );
}
