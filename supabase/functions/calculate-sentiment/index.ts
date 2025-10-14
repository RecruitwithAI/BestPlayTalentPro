import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messagingFlow, candidateSituation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert in candidate experience and sentiment analysis. Analyze the following recruiter communication flow and generate a sentiment score from 0-100.

Evaluation criteria:
- Empathy and tone (30 points)
- Clarity and professionalism (25 points)
- Constructive feedback provided (25 points)
- Future relationship building (20 points)

Candidate Situation: ${candidateSituation}

Return ONLY a JSON object with this exact structure:
{
  "score": <number between 0-100>,
  "breakdown": {
    "empathy": <number 0-30>,
    "clarity": <number 0-25>,
    "feedback": <number 0-25>,
    "relationship": <number 0-20>
  },
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Messaging Flow:\n${JSON.stringify(messagingFlow, null, 2)}` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "calculate_sentiment",
              description: "Calculate candidate sentiment score",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number", minimum: 0, maximum: 100 },
                  breakdown: {
                    type: "object",
                    properties: {
                      empathy: { type: "number", minimum: 0, maximum: 30 },
                      clarity: { type: "number", minimum: 0, maximum: 25 },
                      feedback: { type: "number", minimum: 0, maximum: 25 },
                      relationship: { type: "number", minimum: 0, maximum: 20 }
                    },
                    required: ["empathy", "clarity", "feedback", "relationship"]
                  },
                  strengths: { type: "array", items: { type: "string" } },
                  improvements: { type: "array", items: { type: "string" } }
                },
                required: ["score", "breakdown", "strengths", "improvements"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "calculate_sentiment" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in calculate-sentiment:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
