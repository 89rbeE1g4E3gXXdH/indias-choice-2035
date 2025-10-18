import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { choices } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build detailed prompt based on choices
    const medicalTechMap: Record<string, string> = {
      'ai-diagnostics': 'advanced AI-powered medical diagnostic centers with holographic displays',
      'genetic-medicine': 'cutting-edge genetic research labs with DNA sequencing equipment',
      'telemedicine': 'modern telemedicine hubs connecting rural and urban healthcare',
      'no_choice': 'standard healthcare facilities'
    };

    const aerospaceMap: Record<string, string> = {
      'satellite-network': 'massive satellite control centers and launch facilities',
      'deep-space': 'space exploration headquarters with Mars mission displays',
      'commercial-space': 'futuristic spaceports with commercial spacecraft',
      'no_choice': 'basic space technology infrastructure'
    };

    const aiRoboticsMap: Record<string, string> = {
      'industrial-ai': 'smart automated factories with robotic assembly lines',
      'consumer-ai': 'smart homes with AI assistants and integrated technology',
      'ai-research': 'advanced AI research centers with quantum computers',
      'no_choice': 'moderate AI integration'
    };

    const quantumComputingMap: Record<string, string> = {
      'quantum-security': 'ultra-secure quantum data centers with encryption systems',
      'quantum-medicine': 'quantum computing labs for drug discovery and molecular simulation',
      'quantum-internet': 'next-generation quantum communication networks',
      'no_choice': 'early-stage quantum facilities'
    };

    const biotechnologyMap: Record<string, string> = {
      'agri-biotech': 'advanced agricultural biotech farms with climate-resistant crops',
      'vaccine-dev': 'state-of-the-art vaccine research and production facilities',
      'bio-materials': 'eco-friendly bioplastic manufacturing and sustainable material labs',
      'no_choice': 'conventional biotech research'
    };

    const greenEnergyMap: Record<string, string> = {
      'solar-power': 'massive solar panel farms covering landscapes with clean energy infrastructure',
      'wind-hydro': 'towering wind turbines and advanced hydroelectric dams',
      'nuclear-fusion': 'futuristic fusion reactor facilities with glowing energy cores',
      'no_choice': 'standard renewable energy setup'
    };

    const smartCitiesMap: Record<string, string> = {
      'public-transport': 'elevated metro networks and hyperloop systems connecting cities',
      'vertical-cities': 'soaring skyscrapers with vertical gardens and sky bridges',
      'iot-cities': 'smart city infrastructure with glowing sensors and connected systems',
      'no_choice': 'modern urban development'
    };

    const educationMap: Record<string, string> = {
      'gamified-learning': 'VR/AR classrooms with students in immersive holographic environments',
      'ai-tutors': 'learning centers with AI hologram teachers and personalized education pods',
      'skill-academies': 'high-tech training facilities with hands-on innovation workshops',
      'no_choice': 'traditional modern schools'
    };

    const prompt = `Create a stunning, photorealistic vision of India in 2035 focused on technological advancement. 
    Show ${medicalTechMap[choices.medicalTech] || medicalTechMap['no_choice']}, 
    ${aerospaceMap[choices.aerospace] || aerospaceMap['no_choice']}, 
    ${aiRoboticsMap[choices.aiRobotics] || aiRoboticsMap['no_choice']},
    ${quantumComputingMap[choices.quantumComputing] || quantumComputingMap['no_choice']},
    ${biotechnologyMap[choices.biotechnology] || biotechnologyMap['no_choice']},
    ${greenEnergyMap[choices.greenEnergy] || greenEnergyMap['no_choice']},
    ${smartCitiesMap[choices.smartCities] || smartCitiesMap['no_choice']}, and
    ${educationMap[choices.education] || educationMap['no_choice']}. 
    
    The image should be vibrant, futuristic, and showcase India as a global technology leader merged with cultural heritage. 
    Include iconic Indian architecture elements, diverse people using advanced technology, and a sense of innovation and prosperity. 
    Cinematic lighting, ultra-high detail, inspiring sci-fi atmosphere with an Indian aesthetic.`;

    console.log('Generating image with prompt:', prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Not enough credits. Please add credits to your Lovable workspace to generate images.",
            errorType: "payment_required"
          }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-india-vision function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
