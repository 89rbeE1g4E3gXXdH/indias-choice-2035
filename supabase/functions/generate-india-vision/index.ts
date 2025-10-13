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
    const educationMap: Record<string, string> = {
      'skill-based': 'modern vocational training centers with students learning practical skills',
      'traditional': 'grand universities with classical architecture and students in traditional study',
      'tech-driven': 'futuristic classrooms with AI, robotics, and holographic displays',
      'no_choice': 'balanced educational institutions'
    };

    const sustainabilityMap: Record<string, string> = {
      'green-energy': 'massive solar farms and wind turbines across landscapes',
      'strict-laws': 'pristine environment with lush greenery and clean cities',
      'grassroots': 'community gardens and sustainable villages with nature integration',
      'no_choice': 'eco-conscious urban planning'
    };

    const economyMap: Record<string, string> = {
      'industrial': 'advanced manufacturing hubs with smart factories',
      'digital': 'tech campuses and digital innovation centers with startup culture',
      'inclusive': 'thriving communities with healthcare, employment across rural and urban',
      'no_choice': 'balanced economic development'
    };

    const prompt = `Create a stunning, photorealistic vision of India in 2035. 
    Show ${educationMap[choices.education] || educationMap['no_choice']}, 
    ${sustainabilityMap[choices.sustainability] || sustainabilityMap['no_choice']}, and 
    ${economyMap[choices.economy] || economyMap['no_choice']}. 
    
    The image should be vibrant, optimistic, and showcase India's cultural heritage merged with futuristic progress. 
    Include iconic Indian architecture elements, diverse people, and a sense of prosperity. 
    Cinematic lighting, ultra-high detail, inspiring and hopeful atmosphere.`;

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
