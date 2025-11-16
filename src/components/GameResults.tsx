import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Credits } from "@/components/Credits";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";
import { Confetti } from "@/components/Confetti";
import indiaFuture1 from "@/assets/india-future-1.png";
import indiaFuture2 from "@/assets/india-future-2.png";
import indiaFuture3 from "@/assets/india-future-3.png";
import indiaFuture4 from "@/assets/india-future-4.png";

interface GameResultsProps {
  choices: {
    medicalTech: string;
    aerospace: string;
    aiRobotics: string;
    quantumComputing: string;
    biotechnology: string;
    greenEnergy: string;
    smartCities: string;
    education: string;
  };
  onReplay: () => void;
}

export const GameResults = ({ choices, onReplay }: GameResultsProps) => {
  const { toast } = useToast();
  
  // Array of futuristic India images
  const futuristicIndiaImages = [
    indiaFuture1,
    indiaFuture2,
    indiaFuture3,
    indiaFuture4
  ];
  
  // Randomly select one image
  const imageUrl = useMemo(() => {
    return futuristicIndiaImages[Math.floor(Math.random() * futuristicIndiaImages.length)];
  }, []);

  // Point values for each choice - varying strategic impact
  const choicePoints: Record<string, number> = {
    // Medical Technology
    'ai-diagnostics': 12.5,
    'genetic-medicine': 8,
    'telemedicine': 3,
    
    // Aerospace
    'satellite-network': 8,
    'deep-space': 12.5,
    'commercial-space': 3,
    
    // AI & Robotics
    'industrial-ai': 12.5,
    'consumer-ai': 3,
    'ai-research': 8,
    
    // Quantum Computing
    'quantum-security': 8,
    'quantum-medicine': 12.5,
    'quantum-internet': 3,
    
    // Biotechnology
    'agri-biotech': 12.5,
    'vaccine-dev': 8,
    'bio-materials': 3,
    
    // Green Energy
    'solar-power': 12.5,
    'wind-hydro': 8,
    'nuclear-fusion': 3,
    
    // Smart Cities
    'public-transport': 8,
    'vertical-cities': 3,
    'iot-cities': 12.5,
    
    // Education
    'gamified-learning': 3,
    'ai-tutors': 12.5,
    'skill-academies': 8,
    
    'no_choice': 0
  };

  // Calculate leadership score
  const calculateLeadershipScore = () => {
    let score = 0;
    const choiceValues = Object.values(choices);
    
    choiceValues.forEach((choice) => {
      score += choicePoints[choice] || 0;
    });
    
    return score;
  };

  const leadershipScore = calculateLeadershipScore();
  
  const getLeadershipRating = (score: number) => {
    if (score === 100) return { title: "Visionary Leader", emoji: "🌟", color: "text-yellow-500", description: "Perfect decisions! India thrives under your visionary leadership." };
    if (score >= 87.5) return { title: "Exceptional Leader", emoji: "⭐", color: "text-blue-500", description: "Outstanding choices that transformed India into a global powerhouse." };
    if (score >= 75) return { title: "Strong Leader", emoji: "💪", color: "text-green-500", description: "Solid decisions that propelled India toward greatness." };
    if (score >= 62.5) return { title: "Good Leader", emoji: "👍", color: "text-emerald-500", description: "Good strategic thinking with positive impact on India's future." };
    if (score >= 50) return { title: "Average Leader", emoji: "🤔", color: "text-orange-500", description: "Decent choices, but India could have achieved more." };
    if (score >= 37.5) return { title: "Hesitant Leader", emoji: "😰", color: "text-amber-600", description: "Too much indecision held back India's potential." };
    if (score >= 25) return { title: "Weak Leader", emoji: "😔", color: "text-red-500", description: "Limited vision resulted in missed opportunities." };
    return { title: "Failed Leadership", emoji: "❌", color: "text-red-700", description: "Lack of decisions caused India to fall behind." };
  };

  const leadershipRating = getLeadershipRating(leadershipScore);

  const getCategoryBreakdown = () => {
    const categories = [
      { key: 'medicalTech', name: 'Medical Technology', icon: '🏥' },
      { key: 'aerospace', name: 'Aerospace', icon: '🚀' },
      { key: 'aiRobotics', name: 'AI & Robotics', icon: '🤖' },
      { key: 'quantumComputing', name: 'Quantum Computing', icon: '⚛️' },
      { key: 'biotechnology', name: 'Biotechnology', icon: '🧬' },
      { key: 'greenEnergy', name: 'Green Energy', icon: '🌱' },
      { key: 'smartCities', name: 'Smart Cities', icon: '🏙️' },
      { key: 'education', name: 'Education', icon: '📚' },
    ];

    return categories.map(category => ({
      ...category,
      points: choicePoints[choices[category.key as keyof typeof choices]] || 0
    }));
  };

  const categoryBreakdown = getCategoryBreakdown();

  const getOutcomes = () => {
    const outcomes = {
      'ai-diagnostics': {
        title: '95% Disease Detection Accuracy',
        description: 'AI-powered diagnostics revolutionized healthcare. Early disease detection saved millions of lives annually.'
      },
      'genetic-medicine': {
        title: 'Personalized Healthcare Leader',
        description: 'Gene therapy cured 40+ genetic diseases. India became the global hub for genetic medicine research.'
      },
      'telemedicine': {
        title: 'Healthcare Access for All',
        description: 'Rural areas gained instant medical access. Doctor shortage eliminated through remote consultations.'
      },
      'satellite-network': {
        title: 'Global Communication Hub',
        description: '500+ satellites provide nationwide coverage. India became the preferred satellite launch partner globally.'
      },
      'deep-space': {
        title: 'Space Exploration Pioneer',
        description: 'Successful Mars colony established. India leads international deep space missions consortium.'
      },
      'commercial-space': {
        title: '$50B Space Tourism Industry',
        description: 'Space tourism brought economic boom. 50,000 annual space travelers and 200,000 jobs created.'
      },
      'industrial-ai': {
        title: 'Manufacturing Efficiency +300%',
        description: 'Automated factories dominate exports. India became the world\'s most efficient manufacturer.'
      },
      'consumer-ai': {
        title: 'Smart Living Standard',
        description: 'AI assistants in 80% of homes. Quality of life improved dramatically through intelligent automation.'
      },
      'ai-research': {
        title: 'AI Innovation Capital',
        description: 'Breakthrough AI models developed here. 60% of global AI patents now Indian.'
      },
      'quantum-security': {
        title: 'Unhackable Infrastructure',
        description: 'Quantum encryption secured all systems. India became the world\'s safest digital economy.'
      },
      'quantum-medicine': {
        title: 'Drug Discovery Revolution',
        description: 'Quantum computing cut drug development time by 90%. 200+ new medicines discovered.'
      },
      'quantum-internet': {
        title: 'Next-Gen Internet Leader',
        description: 'Quantum internet deployed nationwide. Data speeds 1000x faster than traditional networks.'
      },
      'agri-biotech': {
        title: 'Food Security Achieved',
        description: 'Climate-resistant crops ended hunger. India now exports food to 80+ countries.'
      },
      'vaccine-dev': {
        title: 'Pandemic Response Leader',
        description: 'Rapid vaccine platform saved millions. India supplies 70% of world\'s vaccines.'
      },
      'bio-materials': {
        title: 'Zero Plastic Waste',
        description: 'Biodegradable materials replaced all plastics. Pollution eliminated, oceans recovered.'
      },
      'solar-power': {
        title: 'Solar Superpower',
        description: 'World\'s largest solar infrastructure. 100% renewable energy achieved, powering the nation.'
      },
      'wind-hydro': {
        title: 'Clean Energy Leader',
        description: 'Massive wind farms and hydro plants. Carbon emissions reduced by 90%.'
      },
      'nuclear-fusion': {
        title: 'Fusion Energy Pioneer',
        description: 'First commercial fusion reactor operational. Unlimited clean energy for all.'
      },
      'public-transport': {
        title: 'Zero Traffic Cities',
        description: 'Metro in every major city. 80% reduction in private vehicles and pollution.'
      },
      'vertical-cities': {
        title: 'Sustainable Urban Living',
        description: 'Vertical farms feed cities. Green spaces integrated into every building.'
      },
      'iot-cities': {
        title: 'Most Connected Cities',
        description: 'AI manages traffic, waste, energy. Cities run at 95% efficiency.'
      },
      'gamified-learning': {
        title: 'Education Revolution',
        description: 'VR classrooms nationwide. Learning engagement increased 200%.'
      },
      'ai-tutors': {
        title: 'Personalized Learning Era',
        description: 'Every student has AI mentor. Education gaps eliminated completely.'
      },
      'skill-academies': {
        title: 'Skilled Workforce Leader',
        description: 'Zero unemployment through skill training. India supplies world\'s top talent.'
      },
      'no_choice': {
        title: 'Missed Opportunity',
        description: '⏰ Indecision led to moderate progress. India followed instead of leading technological revolution.'
      }
    };

    return {
      medicalTech: outcomes[choices.medicalTech as keyof typeof outcomes] || outcomes['no_choice'],
      aerospace: outcomes[choices.aerospace as keyof typeof outcomes] || outcomes['no_choice'],
      aiRobotics: outcomes[choices.aiRobotics as keyof typeof outcomes] || outcomes['no_choice'],
      quantumComputing: outcomes[choices.quantumComputing as keyof typeof outcomes] || outcomes['no_choice'],
      biotechnology: outcomes[choices.biotechnology as keyof typeof outcomes] || outcomes['no_choice'],
      greenEnergy: outcomes[choices.greenEnergy as keyof typeof outcomes] || outcomes['no_choice'],
      smartCities: outcomes[choices.smartCities as keyof typeof outcomes] || outcomes['no_choice'],
      education: outcomes[choices.education as keyof typeof outcomes] || outcomes['no_choice'],
    };
  };

  const outcomes = getOutcomes();

  return (
    <div className="min-h-screen bg-gradient-hero p-6 animate-fade-in relative overflow-hidden">
      {/* Confetti effect */}
      {leadershipScore >= 75 && <Confetti />}
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Floating celebration emojis */}
        {leadershipScore >= 87.5 && (
          <>
            <div className="absolute top-20 left-20 text-4xl opacity-30 animate-float">🏆</div>
            <div className="absolute top-40 right-40 text-4xl opacity-30 animate-float" style={{animationDelay: '1s'}}>👑</div>
            <div className="absolute bottom-20 left-1/4 text-4xl opacity-30 animate-float" style={{animationDelay: '2s'}}>⭐</div>
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            🌅 INDIA 2035
          </h1>
          <p className="text-xl text-muted-foreground">
            ✨ A nation shaped by your leadership
          </p>
        </div>

        {/* Leadership Meter */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-card animate-scale-in">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-fade-in">{leadershipRating.emoji}</div>
            <h2 className={`text-3xl font-bold mb-2 ${leadershipRating.color}`}>
              {leadershipRating.title}
            </h2>
            <p className="text-muted-foreground text-lg">{leadershipRating.description}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Leadership Score</span>
              <span className={`font-bold text-xl ${leadershipRating.color}`}>{leadershipScore}%</span>
            </div>
            <Progress value={leadershipScore} className="h-4 animate-fade-in" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Failed</span>
              <span>Average</span>
              <span>Visionary</span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Points Breakdown by Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryBreakdown.map((category) => (
                <div 
                  key={category.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${category.points > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {category.points > 0 ? '+' : ''}{category.points}
                    </span>
                    {category.points > 0 ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-muted-foreground">○</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card mb-8 animate-scale-in">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="India 2035 Vision" 
              className="w-full h-96 object-cover"
            />
          )}
            
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">India 2035 - Technology Revolution Results:</h2>
              
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🏥</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.medicalTech.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.medicalTech.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🚀</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.aerospace.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.aerospace.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🤖</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.aiRobotics.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.aiRobotics.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">⚛️</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.quantumComputing.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.quantumComputing.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🧬</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.biotechnology.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.biotechnology.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🌱</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.greenEnergy.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.greenEnergy.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🏙️</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.smartCities.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.smartCities.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">📚</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.education.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.education.description}</p>
                </div>
              </div>
            </div>
          </div>


        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onReplay}
            size="lg"
            className="bg-primary hover:bg-primary-glow shadow-intense transition-all duration-300 hover:scale-105 hover:shadow-[0_0_80px_rgba(255,138,0,0.7)]"
          >
            🔁 Play Again
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-glow"
            onClick={() => {
              const text = `I shaped India's tech future in 2035! Results: ${outcomes.medicalTech.title}, ${outcomes.aerospace.title}, ${outcomes.aiRobotics.title}. Build your own future at ${window.location.href}`;
              navigator.clipboard.writeText(text);
              toast({
                title: "Copied!",
                description: "Share your vision with friends"
              });
            }}
          >
            📤 Share Your Vision
          </Button>
          
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-intense transition-all duration-300 hover:scale-105"
            onClick={() => window.open('https://indias-certify.lovable.app/?utm_source=lovable-editor', '_blank')}
          >
            🏆 Claim Your Certificate
          </Button>
        </div>

        {/* Credits section */}
        <div className="mt-16">
          <Credits />
        </div>
      </div>
    </div>
  );
};
