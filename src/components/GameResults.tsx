import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AchievementBadge, calculateAchievements } from "@/components/AchievementBadge";

interface GameResultsProps {
  choices: {
    medicalTech: string;
    aerospace: string;
    aiRobotics: string;
    quantumComputing: string;
    biotechnology: string;
  };
  onReplay: () => void;
}

export const GameResults = ({ choices, onReplay }: GameResultsProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const achievements = calculateAchievements(choices);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  useEffect(() => {
    generateVisionImage();
  }, []);

  const generateVisionImage = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-india-vision', {
        body: { choices }
      });

      if (error) throw error;
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: "Using a default vision instead.",
        variant: "destructive"
      });
      setImageUrl("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&h=800&fit=crop");
    } finally {
      setIsLoading(false);
    }
  };

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
    };
  };

  const outcomes = getOutcomes();

  return (
    <div className="min-h-screen bg-gradient-hero p-6 animate-fade-in relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
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

        {isLoading ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-card mb-8">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-xl text-muted-foreground">🎨 Generating your vision of India...</p>
            <p className="text-sm text-muted-foreground mt-2">Analyzing your choices and rendering the future...</p>
          </div>
        ) : (
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
              </div>
            </div>
          </div>
        )}

        {/* Achievements Section */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card mb-8 animate-scale-in" style={{animationDelay: '300ms'}}>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Achievements Unlocked</h2>
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              🏆 You earned {unlockedCount} out of {achievements.length} achievements!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onReplay}
            size="lg"
            className="bg-primary hover:bg-primary-glow shadow-glow transition-all duration-300 hover:scale-105"
          >
            🔁 Play Again
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
        </div>
      </div>
    </div>
  );
};
