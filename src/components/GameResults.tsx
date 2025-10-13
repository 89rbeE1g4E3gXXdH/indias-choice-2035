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

  const getVisionDescription = () => {
    const descriptions = {
      'skill-based': 'highly skilled workforce ready for the future',
      'traditional': 'strong foundation in core knowledge and values',
      'tech-driven': 'technological innovation leading the way',
      'green-energy': 'powered by clean, renewable energy',
      'strict-laws': 'pristine environment protected by strong regulations',
      'grassroots': 'sustainable practices embedded in every community',
      'industrial': 'manufacturing powerhouse driving global trade',
      'digital': 'digital innovation hub connecting the world',
      'inclusive': 'prosperous society with opportunities for all',
      'no_choice': '⏰ No decision made (time ran out)'
    };

    return {
      education: descriptions[choices.education as keyof typeof descriptions] || choices.education,
      sustainability: descriptions[choices.sustainability as keyof typeof descriptions] || choices.sustainability,
      economy: descriptions[choices.economy as keyof typeof descriptions] || choices.economy,
    };
  };

  const vision = getVisionDescription();

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
              <h2 className="text-2xl font-bold mb-6 text-foreground">Your Vision Created:</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <p className="font-semibold text-foreground">Education</p>
                    <p className="text-muted-foreground capitalize">{vision.education}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <p className="font-semibold text-foreground">Environment</p>
                    <p className="text-muted-foreground capitalize">{vision.sustainability}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <span className="text-2xl">💼</span>
                  <div>
                    <p className="font-semibold text-foreground">Economy</p>
                    <p className="text-muted-foreground capitalize">{vision.economy}</p>
                  </div>
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
              const text = `I shaped India's future! My vision for 2035: ${vision.education}, ${vision.sustainability}, and ${vision.economy}. Build your own future at ${window.location.href}`;
              navigator.clipboard.writeText(text);
              alert('Vision copied to clipboard! Share it with your friends.');
            }}
          >
            📤 Share Your Vision
          </Button>
        </div>
      </div>
    </div>
  );
};
