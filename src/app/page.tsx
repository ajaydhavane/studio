'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const phrases = [
  "No", "Are you sure?", "Really sure?", "Think again!", "Last chance!", 
  "Surely not?", "Pookie please", "Don't do this to me", "I'm gonna cry...", "You're breaking my heart ;(",
];

export default function ValentinePage() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [isNoButtonAbsolute, setIsNoButtonAbsolute] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (noCount > 0 && containerRef.current && yesButtonRef.current && noButtonRef.current && headingRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const yesButtonRect = yesButtonRef.current.getBoundingClientRect();
        const headingRect = headingRef.current.getBoundingClientRect();
        
        const noButtonRect = noButtonRef.current.getBoundingClientRect();
  
        let newTop, newLeft;
        let attempts = 0;
        const maxAttempts = 100;

        const yesBox = {
            top: yesButtonRect.top - containerRect.top,
            left: yesButtonRect.left - containerRect.left,
            right: yesButtonRect.right - containerRect.left,
            bottom: yesButtonRect.bottom - containerRect.top,
        };

        const headingBox = {
            top: headingRect.top - containerRect.top,
            left: headingRect.left - containerRect.left,
            right: headingRect.right - containerRect.left,
            bottom: headingRect.bottom - containerRect.top,
        };
  
        do {
          newTop = Math.random() * (container.clientHeight - noButtonRect.height);
          newLeft = Math.random() * (container.clientWidth - noButtonRect.width);
  
          const noBox = {
            top: newTop,
            left: newLeft,
            right: newLeft + noButtonRect.width,
            bottom: newTop + noButtonRect.height,
          };
  
          const overlapWithYes = !(
            noBox.right < yesBox.left ||
            noBox.left > yesBox.right ||
            noBox.bottom < yesBox.top ||
            noBox.top > yesBox.bottom
          );

          const overlapWithHeading = !(
            noBox.right < headingBox.left ||
            noBox.left > headingBox.right ||
            noBox.bottom < headingBox.top ||
            noBox.top > headingBox.bottom
          );
  
          if (!overlapWithYes && !overlapWithHeading) {
            break;
          }
          attempts++;
        } while (attempts < maxAttempts);
  
        if (attempts < maxAttempts) {
            setNoButtonPosition({ top: newTop, left: newLeft });
        } else {
            setNoButtonPosition({ top: 0, left: 0 });
        }
      }
  }, [noCount]);

  const handleYesClick = () => {
    setIsAgreed(true);
  };

  const handleNoInteraction = () => {
    if (!isNoButtonAbsolute) {
        setIsNoButtonAbsolute(true);
    }
    setNoCount(count => count + 1);
    setYesButtonScale(scale => Math.min(scale + 0.2, 1.8)); 
  };
  
  const getNoButtonText = () => {
    return phrases[Math.min(noCount, phrases.length - 1)];
  }

  const getYesButtonText = () => {
    if (noCount > 4) return "Yesss!";
    return "Yes";
  }

  const buttonStyle: React.CSSProperties = {
    height: '48px',
    width: '120px',
    fontSize: '18px',
  };
  
  const { width, ...restButtonStyle } = buttonStyle;

  if (isAgreed) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 animate-in fade-in zoom-in duration-1000">
          Of course you will!
        </h1>
        <p className="text-2xl text-primary/80 mb-8 animate-in fade-in zoom-in-90 delay-500 duration-1000">
          I love you! ❤️
        </p>
        <div className="relative w-80 h-80 md:w-96 md:h-96 animate-in fade-in zoom-in-75 delay-1000 duration-1000">
          <Image
            src="/celebration.jpg"
            alt="Celebration image"
            fill
            className="rounded-full object-cover shadow-2xl"
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
        <h1 ref={headingRef} className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-primary text-center max-w-2xl">
          Will you be my Valentine?
        </h1>
        <div className="flex items-center justify-center gap-4 h-24 w-full">
          <Button 
            ref={yesButtonRef}
            onClick={handleYesClick}
            className={`bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl`}
            style={{ 
              ...buttonStyle,
              transform: `scale(${yesButtonScale})`, 
              transformOrigin: 'center'
            }}
          >
            {getYesButtonText()}
          </Button>
          <Button
              ref={noButtonRef}
              onMouseOver={handleNoInteraction}
              onClick={handleNoInteraction}
              className={`font-bold shadow-md transition-all duration-300 ease-in-out ${isNoButtonAbsolute ? 'absolute' : ''}`}
              style={isNoButtonAbsolute && noButtonPosition ? {
                ...restButtonStyle,
                top: `${noButtonPosition.top}px`,
                left: `${noButtonPosition.left}px`,
                transition: 'top 0.4s ease, left 0.4s ease',
              } : buttonStyle}
              variant="variant"
            >
              {getNoButtonText()}
            </Button>
        </div>
      </div>
    </main>
  );
}
