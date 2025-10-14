import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface Choice {
  icon: string;
  title: string;
  description: string;
  value: string;
}

interface Round {
  number: number;
  title: string;
  question: string;
  choices: Choice[];
}

interface GameRoundProps {
  round: Round;
  onChoice: (choice: string) => void;
}

export const GameRound = ({ round, onChoice }: GameRoundProps) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    setTimeLeft(10);
    setSelectedChoice(null);
  }, [round]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onChoice(selectedChoice || "no_choice");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedChoice, onChoice]);

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    setTimeout(() => onChoice(choice), 500);
  };

  const progressValue = (timeLeft / 10) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6 animate-fade-in relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary">
            🌟 ROUND {round.number}: {round.title}
          </h2>
          <p className="text-xl text-foreground mb-4">{round.question}</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Time Remaining:</span>
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive animate-glow-pulse' : 'text-primary'}`}>
                ⏰ {timeLeft}s
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {round.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleChoice(choice.value)}
              disabled={selectedChoice !== null}
              className={`
                group relative p-6 rounded-xl border-2 overflow-hidden
                bg-gradient-card backdrop-blur-sm
                transition-all duration-500 text-left
                hover:scale-105 hover:shadow-glow hover:border-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedChoice === choice.value ? 'border-primary scale-105 shadow-glow animate-glow-pulse' : 'border-border'}
                animate-scale-in
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{choice.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors relative z-10">
                {choice.title}
              </h3>
              <p className="text-muted-foreground relative z-10">
                {choice.description}
              </p>
              
              {selectedChoice === choice.value && (
                <>
                  <div className="absolute inset-0 border-2 border-primary rounded-xl animate-glow-pulse"></div>
                  <div className="absolute top-2 right-2 z-20">
                    <Star className="w-6 h-6 text-primary fill-current animate-bounce-in" />
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
