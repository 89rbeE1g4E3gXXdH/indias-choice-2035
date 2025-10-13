import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameResultsProps {
  choices: {
    education: string;
    sustainability: string;
    economy: string;
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
      'skill-based': {
        title: '92% Youth Employment',
        description: 'Vocational training created a workforce ready for modern industries. Manufacturing and service sectors boomed with skilled workers.'
      },
      'traditional': {
        title: 'Strong Cultural Identity',
        description: 'Classical education preserved India\'s heritage while maintaining 78% literacy rate. Values-based learning shaped responsible citizens.'
      },
      'tech-driven': {
        title: 'Global Innovation Hub',
        description: 'AI and robotics education made India a leader in tech. Students from 50+ countries now study here.'
      },
      'green-energy': {
        title: '80% Renewable Energy',
        description: 'Massive solar and wind infrastructure cut carbon emissions by 65%. Energy exports now fuel the economy.'
      },
      'strict-laws': {
        title: 'Cleanest Air in Asia',
        description: 'Environmental regulations transformed cities. Wildlife populations recovered, eco-tourism thrived.'
      },
      'grassroots': {
        title: 'Self-Sustaining Communities',
        description: 'Village-level sustainability projects created local prosperity. Urban-rural divide significantly narrowed.'
      },
      'industrial': {
        title: 'Manufacturing Giant',
        description: 'Smart factories made India the 2nd largest exporter. 45 million manufacturing jobs created.'
      },
      'digital': {
        title: 'Digital Economy Leader',
        description: '250,000 startups launched. India became the global center for fintech, AI, and digital services.'
      },
      'inclusive': {
        title: 'Zero Poverty Achieved',
        description: 'Universal healthcare and employment programs lifted all citizens. Income inequality dropped 40%.'
      },
      'no_choice': {
        title: 'Mixed Results',
        description: '⏰ Lack of decisive leadership led to moderate progress across all sectors without breakthrough achievements.'
      }
    };

    return {
      education: outcomes[choices.education as keyof typeof outcomes] || outcomes['no_choice'],
      sustainability: outcomes[choices.sustainability as keyof typeof outcomes] || outcomes['no_choice'],
      economy: outcomes[choices.economy as keyof typeof outcomes] || outcomes['no_choice'],
    };
  };

  const outcomes = getOutcomes();

  return (
    <div className="min-h-screen bg-gradient-hero p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
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
              <h2 className="text-2xl font-bold mb-6 text-foreground">India 2035 - The Results:</h2>
              
              <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🎓</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.education.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.education.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🌿</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.sustainability.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.sustainability.description}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">💼</span>
                    <h3 className="font-bold text-lg text-foreground">{outcomes.economy.title}</h3>
                  </div>
                  <p className="text-muted-foreground ml-9">{outcomes.economy.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
              const text = `I shaped India's future in 2035! Results: ${outcomes.education.title}, ${outcomes.sustainability.title}, ${outcomes.economy.title}. Build your own future at ${window.location.href}`;
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
