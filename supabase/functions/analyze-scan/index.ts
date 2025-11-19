import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { triageLevel, confidence, heatmapData, fileName } = await req.json();

    console.log('Analyzing scan:', { fileName, triageLevel, confidence });

    if (!triageLevel || confidence === undefined) {
      throw new Error('triageLevel and confidence are required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build detailed prompt for medical analysis
    const systemPrompt = `You are an expert radiologist AI assistant with deep knowledge of medical imaging interpretation and triage protocols.

Your role is to analyze radiology scan triage results and provide clear, actionable clinical insights.

Provide your analysis in the following JSON structure:
{
  "explanation": "Clinical explanation of why this classification was made (2-3 sentences)",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "recommendations": ["Specific action 1", "Specific action 2", "Specific action 3"],
  "confidenceAnalysis": "What the confidence score means in clinical context (1-2 sentences)"
}

Keep responses professional, clear, and clinically relevant. Focus on actionable next steps.`;

    const userPrompt = `Analyze this radiology scan triage result:

**Scan Details:**
- File: ${fileName || 'Unknown'}
- Triage Classification: ${triageLevel}
- Confidence Score: ${(confidence * 100).toFixed(1)}%
- Detected Regions: ${heatmapData?.length || 0} areas of interest

**Your Task:**
1. Explain WHY this scan was classified as ${triageLevel}
2. List 3-5 key clinical findings that led to this classification
3. Provide 3-5 specific, actionable recommendations for patient care
4. Analyze what the ${(confidence * 100).toFixed(1)}% confidence score means clinically

**Context:**
- CRITICAL: Life-threatening, requires immediate intervention
- URGENT: Needs prompt attention within hours
- STABLE: Can wait for routine care
- NON-URGENT: Minor conditions, low priority

Respond ONLY with valid JSON matching the required structure.`;

    // Call Gemini AI via Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ 
            error: 'AI analysis rate limit exceeded. Please try again in a moment.' 
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (response.status === 402) {
        console.error('Payment required - out of credits');
        return new Response(
          JSON.stringify({ 
            error: 'AI analysis credits exhausted. Please add credits to your workspace.' 
          }),
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI response received');

    // Extract the AI-generated content
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse JSON response from AI
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                       content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      
      analysisResult = JSON.parse(jsonContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      
      // Fallback: Create structured response from unstructured content
      analysisResult = {
        explanation: content.substring(0, 200),
        keyFindings: ['AI analysis available in explanation'],
        recommendations: ['Review full AI analysis', 'Consult with medical professional'],
        confidenceAnalysis: `Confidence score: ${(confidence * 100).toFixed(1)}%`
      };
    }

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-scan function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        explanation: 'Failed to generate AI analysis',
        keyFindings: ['Analysis unavailable'],
        recommendations: ['Retry analysis', 'Review scan manually'],
        confidenceAnalysis: 'Analysis failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
