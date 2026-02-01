'use client';

import { useState, useMemo } from 'react';
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
  const [noButtonTextIndex, setNoButtonTextIndex] = useState(0);

  const [noPosition, setNoPosition] = useState({
    top: '60%',
    left: '55%',
  });

  const celebrationImage = useMemo(() => {
    return PlaceHolderImages.find((img) => img.id === 'valentine-celebration');
  }, []);

  const handleYesClick = () => {
    setIsAgreed(true);
  };

  const handleNoInteraction = () => {
    setYesButtonScale((scale) => Math.min(scale + 0.4, 5));
    setNoButtonTextIndex((prev) => (prev + 1) % phrases.length);

    const newTop = Math.random() * 80 + 10;
    const newLeft = Math.random() * 80 + 10;

    setNoPosition({ top: `${newTop}%`, left: `${newLeft}%` });
  };
  
  const getYesButtonText = () => {
    if (yesButtonScale > 1.5 && yesButtonScale <= 2.5) return "Yesss!";
    if (yesButtonScale > 2.5) return "Click me, beautiful!";
    return "Yes";
  }

  if (isAgreed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 animate-in fade-in zoom-in duration-1000">
          Of course you will!
        </h1>
        <p className="text-2xl text-primary/80 mb-8 animate-in fade-in zoom-in-90 delay-500 duration-1000">
          I love you! See you on the 14th ❤️
        </p>
        {celebrationImage && (
           <div className="relative w-80 h-80 md:w-96 md:h-96 animate-in fade-in zoom-in-75 delay-1000 duration-1000">
             <Image
                src={celebrationImage.imageUrl}
                alt={celebrationImage.description}
                fill
                className="rounded-full object-cover shadow-2xl"
                data-ai-hint={celebrationImage.imageHint}
             />
           </div>
        )}
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4 overflow-hidden">
      <Heart className="absolute top-10 left-10 text-primary/10 size-16 rotate-[-15deg] animate-pulse" fill="currentColor" />
      <Heart className="absolute bottom-16 right-16 text-primary/10 size-24 rotate-[10deg] animate-pulse" fill="currentColor" />
      <Heart className="absolute top-20 right-24 text-primary/5 size-12 rotate-[25deg] animate-pulse delay-500" fill="currentColor" />
      <Heart className="absolute bottom-24 left-20 text-primary/5 size-10 rotate-[-25deg] animate-pulse delay-700" fill="currentColor" />
      
      <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-primary text-center mb-16">
        Will you be my Valentine?
      </h1>
      <div className="flex items-center gap-6 z-10">
        <Button 
          onClick={handleYesClick}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xl py-8 px-12 transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl"
          style={{ transform: `scale(${yesButtonScale})` }}
        >
          {getYesButtonText()}
        </Button>
      </div>

      <Button
        onMouseOver={handleNoInteraction}
        onClick={handleNoInteraction} // for mobile
        style={{ position: 'absolute', top: noPosition.top, left: noPosition.left, transform: 'translate(-50%, -50%)' }}
        className="font-bold text-lg py-3 px-6 transition-all duration-300 ease-in-out shadow-md"
        variant="primary"
      >
        {phrases[noButtonTextIndex]}
      </Button>
    </main>
  );
}
