import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface AyanMiniGameProps {
  onExit: () => void;
}

export const AyanMiniGame = ({ onExit }: AyanMiniGameProps) => {
  const [ayanPosition, setAyanPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [conquered, setConquered] = useState(false);

  const moveAyan = useCallback(() => {
    setAyanPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    });
  }, []);

  const handleClick = () => {
    if (gameOver) return;
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= 5) {
        setConquered(true);
        setGameOver(true);
      }
      return newScore;
    });
    moveAyan();
  };

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const moveInterval = setInterval(moveAyan, 1200);
    return () => clearInterval(moveInterval);
  }, [gameOver, moveAyan]);

  const resetGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setConquered(false);
    moveAyan();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero animate-fade-in p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-primary mb-2">Conquer Ayan</h1>
        <p className="text-muted-foreground mb-4">Click on Ayan 5 times before time runs out</p>
        <div className="flex gap-8 justify-center text-xl">
          <span className="text-foreground">Score: <span className="text-primary font-bold">{score}/5</span></span>
          <span className="text-foreground">Time: <span className={`font-bold ${timeLeft <= 5 ? 'text-destructive' : 'text-accent'}`}>{timeLeft}s</span></span>
        </div>
      </div>

      <div className="relative w-full max-w-2xl h-80 bg-card border border-border rounded-xl overflow-hidden">
        {!gameOver && (
          <button
            onClick={handleClick}
            className="absolute text-5xl transition-all duration-200 hover:scale-125 cursor-pointer select-none animate-pulse"
            style={{
              left: `${ayanPosition.x}%`,
              top: `${ayanPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            👦
          </button>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90">
            {conquered ? (
              <>
                <h2 className="text-3xl font-bold text-primary mb-2">You Conquered Ayan</h2>
                <p className="text-2xl mb-4">AYAN IS NOT THE GOATTTT</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-destructive mb-2">Ayan Escaped</h2>
                <p className="text-muted-foreground mb-4">You only caught him {score} times</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        {gameOver && (
          <Button onClick={resetGame} className="bg-primary hover:bg-primary-glow">
            Play Again
          </Button>
        )}
        <Button onClick={onExit} variant="outline">
          Exit
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground max-w-md text-center">
        <p className="font-semibold mb-2">How to Conquer Ayan:</p>
        <ul className="space-y-1">
          <li>1. Click on Ayan before he moves away</li>
          <li>2. Catch him 5 times to prove he is NOT the GOAT</li>
          <li>3. You have 15 seconds - be quick</li>
        </ul>
      </div>
    </div>
  );
};
