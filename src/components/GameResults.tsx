import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Credits } from "@/components/Credits";

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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    generateVisionImage();
  }, []);

  const getFallbackImage = () => {
    // Calculate dominant themes based on choices
    const themes = {
      space: ['deep-space', 'commercial-space', 'satellite-network'].includes(choices.aerospace),
      green: ['solar-power', 'wind-hydro', 'nuclear-fusion'].includes(choices.greenEnergy),
      smart: ['vertical-cities', 'iot-cities', 'public-transport'].includes(choices.smartCities),
      tech: ['industrial-ai', 'ai-research', 'consumer-ai'].includes(choices.aiRobotics),
      health: ['ai-diagnostics', 'genetic-medicine', 'telemedicine'].includes(choices.medicalTech) || 
              ['agri-biotech', 'vaccine-dev', 'bio-materials'].includes(choices.biotechnology),
      education: ['gamified-learning', 'ai-tutors', 'skill-academies'].includes(choices.education)
    };

    // Specific outcome-based image selection
    if (choices.aerospace === 'deep-space') {
      return "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&h=800&fit=crop"; // Space exploration
    }
    
    if (choices.aerospace === 'satellite-network') {
      return "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=1200&h=800&fit=crop"; // Satellite tech
    }
    
    if (choices.greenEnergy === 'solar-power') {
      return "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop"; // Solar panels India
    }
    
    if (choices.greenEnergy === 'nuclear-fusion') {
      return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=800&fit=crop"; // Futuristic energy
    }
    
    if (choices.smartCities === 'vertical-cities') {
      return "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&h=800&fit=crop"; // Modern architecture
    }
    
    if (choices.smartCities === 'iot-cities') {
      return "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&h=800&fit=crop"; // Smart city Mumbai
    }
    
    if (choices.aiRobotics === 'ai-research') {
      return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=800&fit=crop"; // AI technology
    }
    
    if (choices.medicalTech === 'ai-diagnostics' || choices.medicalTech === 'genetic-medicine') {
      return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop"; // Medical technology
    }
    
    // Combined themes
    if (themes.space && themes.tech) {
      return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop"; // Tech + space
    }
    
    if (themes.green && themes.smart) {
      return "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop"; // Green smart city
    }
    
    // Default: Futuristic India
    return "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&h=800&fit=crop";
  };

  const generateVisionImage = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-india-vision', {
        body: { choices }
      });

      // Check for payment/credits error - error object contains the response for non-200 status
      if (error) {
        // Try to parse the error context which contains the response body
        const errorData = typeof error === 'object' && 'context' in error 
          ? (error as any).context 
          : null;
        
        // Check if it's a payment required error (402)
        if (errorData?.errorType === "payment_required" || 
            error.message?.includes("credits") ||
            error.message?.includes("payment_required")) {
          toast({
            title: "Not Enough AI Credits",
            description: "Please add credits to your Lovable workspace to generate images. Using default vision instead.",
            variant: "destructive"
          });
          setImageUrl(getFallbackImage());
          return;
        }
        throw error;
      }
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error('No image generated');
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      
      toast({
        title: "Image generation failed",
        description: "Using a default vision instead.",
        variant: "destructive"
      });
      setImageUrl(getFallbackImage());
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
        )}


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
        </div>

        {/* Credits section */}
        <div className="mt-16">
          <Credits />
        </div>
      </div>
    </div>
  );
};
