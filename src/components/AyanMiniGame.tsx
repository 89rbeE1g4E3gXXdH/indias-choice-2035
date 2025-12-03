import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface AyanMiniGameProps {
  onExit: () => void;
}

type Difficulty = "easy" | "medium" | "hard" | "impossible";

const difficultySettings = {
  easy: { time: 20, moveInterval: 1800, clicksNeeded: 5, label: "Easy", color: "text-green-500" },
  medium: { time: 15, moveInterval: 1200, clicksNeeded: 5, label: "Medium", color: "text-yellow-500" },
  hard: { time: 12, moveInterval: 800, clicksNeeded: 6, label: "Hard", color: "text-orange-500" },
  impossible: { time: 10, moveInterval: 500, clicksNeeded: 7, label: "Impossible", color: "text-destructive" },
};

const roasts = [
  "Nice try being the GOAT, Ayan!",
  "You're more like a baby goat!",
  "GOAT? More like GHOST... disappearing!",
  "Ayan thought he was special!",
  "Caught you slacking!",
  "Where's your crown now?",
  "Not so fast, 'GOAT'!",
  "Ayan.exe has stopped working!",
  "Legend says Ayan is still running!",
  "Even a turtle is faster!",
  "Is that all you got, Ayan?",
  "The GOAT title has been revoked!",
  "Ayan needs more practice!",
  "Too slow, 'champion'!",
  "Your throne is crumbling!",
];

export const AyanMiniGame = ({ onExit }: AyanMiniGameProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [ayanPosition, setAyanPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [conquered, setConquered] = useState(false);
  const [currentRoast, setCurrentRoast] = useState("");
  const [showRoast, setShowRoast] = useState(false);
  const [clickEffects, setClickEffects] = useState<{ id: number; x: number; y: number }[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [roastQueue, setRoastQueue] = useState<string[]>([]);

  const settings = difficulty ? difficultySettings[difficulty] : null;

  const moveAyan = useCallback(() => {
    setAyanPosition({
      x: Math.random() * 70 + 15,
      y: Math.random() * 50 + 25,
    });
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (gameOver || !settings) return;
    
    // Add click effect
    const rect = e.currentTarget.getBoundingClientRect();
    const newEffect = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(ef => ef.id !== newEffect.id));
    }, 600);

    // Screen shake
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 200);

    // Show roast - guaranteed 1.5 seconds minimum
    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
    setCurrentRoast(randomRoast);
    setShowRoast(true);
    
    // Clear any existing timeout and set new one
    setTimeout(() => {
      setShowRoast(false);
    }, 1500);

    // Update combo
    setComboCount(prev => prev + 1);

    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= settings.clicksNeeded) {
        setConquered(true);
        setGameOver(true);
      }
      return newScore;
    });
    moveAyan();
  };

  useEffect(() => {
    if (gameOver || !settings) return;
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
  }, [gameOver, settings]);

  useEffect(() => {
    if (gameOver || !settings) return;
    const moveInterval = setInterval(() => {
      moveAyan();
      setComboCount(0);
    }, settings.moveInterval);
    return () => clearInterval(moveInterval);
  }, [gameOver, moveAyan, settings]);

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setTimeLeft(difficultySettings[selectedDifficulty].time);
    setScore(0);
    setGameOver(false);
    setConquered(false);
    setCurrentRoast("");
    setShowRoast(false);
    setComboCount(0);
    moveAyan();
  };

  const resetGame = () => {
    if (!settings) return;
    setScore(0);
    setTimeLeft(settings.time);
    setGameOver(false);
    setConquered(false);
    setCurrentRoast("");
    setShowRoast(false);
    setComboCount(0);
    moveAyan();
  };

  const backToMenu = () => {
    setDifficulty(null);
    setGameOver(false);
  };

  // Difficulty selection screen
  if (!difficulty) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero animate-fade-in p-4">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-glow-pulse">
            Conquer Ayan
          </h1>
          <p className="text-xl text-muted-foreground mb-8">Select your difficulty</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => startGame("easy")}
              className="bg-card/80 backdrop-blur-sm border-2 border-green-500/50 hover:border-green-500 p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-green-500 mb-2">Easy</h3>
              <p className="text-sm text-muted-foreground">20 seconds, slow movement</p>
              <p className="text-xs text-muted-foreground mt-1">Catch 5 times</p>
            </button>

            <button
              onClick={() => startGame("medium")}
              className="bg-card/80 backdrop-blur-sm border-2 border-yellow-500/50 hover:border-yellow-500 p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-yellow-500 mb-2">Medium</h3>
              <p className="text-sm text-muted-foreground">15 seconds, normal speed</p>
              <p className="text-xs text-muted-foreground mt-1">Catch 5 times</p>
            </button>

            <button
              onClick={() => startGame("hard")}
              className="bg-card/80 backdrop-blur-sm border-2 border-orange-500/50 hover:border-orange-500 p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-orange-500 mb-2">Hard</h3>
              <p className="text-sm text-muted-foreground">12 seconds, fast movement</p>
              <p className="text-xs text-muted-foreground mt-1">Catch 6 times</p>
            </button>

            <button
              onClick={() => startGame("impossible")}
              className="bg-card/80 backdrop-blur-sm border-2 border-destructive/50 hover:border-destructive p-6 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-destructive mb-2">Impossible</h3>
              <p className="text-sm text-muted-foreground">10 seconds, lightning fast</p>
              <p className="text-xs text-muted-foreground mt-1">Catch 7 times</p>
            </button>
          </div>

          <Button onClick={onExit} variant="outline" className="mt-8 hover:scale-105 transition-all">
            Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-hero animate-fade-in p-4 transition-all ${screenShake ? 'animate-pulse' : ''}`}>
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 animate-glow-pulse">
          Conquer Ayan
        </h1>
        <p className={`font-semibold mb-4 ${settings.color}`}>{settings.label} Mode</p>
        
        {/* Score display with effects */}
        <div className="flex gap-4 md:gap-8 justify-center text-lg md:text-xl flex-wrap">
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <span className="text-foreground">Score: </span>
            <span className={`text-primary font-bold ${score > 0 ? 'animate-pulse' : ''}`}>{score}/{settings.clicksNeeded}</span>
          </div>
          <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border">
            <span className="text-foreground">Time: </span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-destructive animate-pulse' : 'text-accent'}`}>{timeLeft}s</span>
          </div>
          {comboCount > 1 && (
            <div className="bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary animate-bounce">
              <span className="text-primary font-bold">x{comboCount} COMBO</span>
            </div>
          )}
        </div>
      </div>

      {/* Roast display - now guaranteed to show */}
      {showRoast && (
        <div className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-intense text-lg font-bold animate-bounce whitespace-nowrap">
            {currentRoast}
          </div>
        </div>
      )}

      {/* Game area */}
      <div 
        className={`relative w-full max-w-2xl h-80 bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl overflow-hidden shadow-card transition-transform ${screenShake ? 'scale-[1.02]' : ''}`}
      >
        {/* Click effects */}
        {clickEffects.map(effect => (
          <div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{ left: effect.x, top: effect.y }}
          >
            <div className="w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/50 animate-ping" />
            <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/70 animate-ping" style={{ animationDelay: '0.1s' }} />
          </div>
        ))}

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${(score / settings.clicksNeeded) * 100}%` }}
          />
        </div>

        {!gameOver && (
          <button
            onClick={handleClick}
            className="absolute transition-all duration-150 hover:scale-150 cursor-pointer select-none group"
            style={{
              left: `${ayanPosition.x}%`,
              top: `${ayanPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Ayan with darker skin tone */}
            <span className="text-6xl drop-shadow-lg group-hover:drop-shadow-[0_0_20px_rgba(255,138,0,0.8)] transition-all">
              👦🏾
            </span>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse -z-10" />
          </button>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            {conquered ? (
              <>
                <div className="text-6xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  You Conquered Ayan
                </h2>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-4 animate-pulse">
                  AYAN IS NOT THE GOATTTT
                </p>
                <p className="text-muted-foreground">Difficulty: <span className={settings.color}>{settings.label}</span></p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-3xl font-bold text-destructive mb-2">Ayan Escaped</h2>
                <p className="text-muted-foreground mb-2">You only caught him {score} times</p>
                <p className="text-sm text-muted-foreground">Maybe try an easier difficulty?</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6 relative z-10 flex-wrap justify-center">
        {gameOver && (
          <Button onClick={resetGame} className="bg-primary hover:bg-primary-glow shadow-intense hover:scale-105 transition-all">
            Play Again
          </Button>
        )}
        <Button onClick={backToMenu} variant="outline" className="hover:scale-105 transition-all">
          Change Difficulty
        </Button>
        <Button onClick={onExit} variant="outline" className="hover:scale-105 transition-all">
          Exit
        </Button>
      </div>

      <div className="mt-8 text-sm text-muted-foreground max-w-md text-center bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border relative z-10">
        <p className="font-semibold mb-2 text-foreground">How to Conquer Ayan:</p>
        <ul className="space-y-1">
          <li>1. Click on Ayan before he moves away</li>
          <li>2. Catch him {settings.clicksNeeded} times to prove he is NOT the GOAT</li>
          <li>3. You have {settings.time} seconds - be quick</li>
          <li>4. Build combos for extra satisfaction</li>
        </ul>
      </div>
    </div>
  );
};
