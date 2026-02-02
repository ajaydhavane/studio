
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Upload } from 'lucide-react';
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const celebrationImage = useMemo(() => {
    return PlaceHolderImages.find((img) => img.id === 'valentine-celebration');
  }, []);

  useEffect(() => {
    if (noCount > 0 && containerRef.current && yesButtonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const yesRect = yesButtonRef.current.getBoundingClientRect();
      
      const noButtonWidth = 150; // Approximate width
      const noButtonHeight = 76; // Approximate height

      const safeZone = {
        top: yesRect.top - containerRect.top - noButtonHeight - 20,
        bottom: yesRect.bottom - containerRect.top + 20,
        left: yesRect.left - containerRect.left - noButtonWidth - 20,
        right: yesRect.right - containerRect.left + 20,
      };

      let newTop, newLeft;
      let attempts = 0;
      do {
        newTop = Math.random() * (containerRect.height - noButtonHeight);
        newLeft = Math.random() * (containerRect.width - noButtonWidth);
        attempts++;
      } while (
        attempts < 100 &&
        (newTop > safeZone.top && newTop < safeZone.bottom &&
         newLeft > safeZone.left && newLeft < safeZone.right)
      );
      
      setNoPosition({ top: `${newTop}px`, left: `${newLeft}px` });
    }
  }, [noCount]);

  const handleYesClick = () => {
    setIsAgreed(true);
  };

  const handleNoInteraction = () => {
    setNoCount(count => count + 1);
    const newScale = yesButtonScale + 0.2 * (noCount + 1);
    const maxScale = 1.8;
    setYesButtonScale(Math.min(newScale, maxScale));
  };
  
  const getYesButtonText = () => {
    if (yesButtonScale > 1.5) return "Yesss!";
    return "Yes";
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const noButtonText = phrases[Math.min(noCount, phrases.length - 1)];
  const yesButtonSizeClass = `py-6 px-10 text-xl`;

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
            src={uploadedImage || celebrationImage?.imageUrl || ''}
            alt={uploadedImage ? "Uploaded celebration" : (celebrationImage?.description || 'Celebration image')}
            fill
            className="rounded-full object-cover shadow-2xl"
            data-ai-hint={celebrationImage?.imageHint}
          />
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="mt-8 animate-in fade-in delay-1500 duration-1000"
        >
          <Upload className="mr-2 h-4 w-4" />
          Use your own image
        </Button>
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
        <div className="flex items-center gap-4 relative">
          <Button 
            ref={yesButtonRef}
            onClick={handleYesClick}
            className={`bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-transform duration-300 ease-in-out shadow-lg hover:shadow-2xl ${yesButtonSizeClass}`}
            style={{ transform: `scale(${yesButtonScale})` }}
          >
            {getYesButtonText()}
          </Button>
          <Button
              onMouseOver={handleNoInteraction}
              onClick={handleNoInteraction}
              className={`font-bold transition-all duration-300 ease-in-out shadow-md ${yesButtonSizeClass} ${noCount > 0 ? 'absolute' : 'relative'}`}
              style={noCount > 0 ? {
                top: noPosition?.top,
                left: noPosition?.left,
                visibility: noPosition ? 'visible' : 'hidden',
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
