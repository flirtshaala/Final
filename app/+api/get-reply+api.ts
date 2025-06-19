export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { chatText, responseType } = body;

    console.log('API received request:', { chatText, responseType });

    if (!chatText || !responseType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: chatText and responseType' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get OpenAI API key from environment
    const openaiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    if (!openaiApiKey || openaiApiKey === 'your_openai_key_here') {
      console.log('OpenAI API key not configured, returning mock response');
      
      // Return mock responses when API key is not configured
      const mockResponses = {
        flirty: [
          "Hey there! 😊 That's such a sweet message!",
          "Aww, you're making me blush! 💕",
          "You know just what to say to make someone smile! ✨",
          "That's so thoughtful of you! 😍",
          "You always know how to make my day better! 💖"
        ],
        witty: [
          "Well, well, well... someone's got game! 😏",
          "That's actually pretty clever! I'm impressed 🤔",
          "Smooth operator alert! 🚨",
          "Are you a magician? Because that was smooth! ✨",
          "I see what you did there... nice move! 😎"
        ],
        savage: [
          "Oh really? That's your best shot? 😤",
          "Bold move, let's see how that works out! 💪",
          "Someone's feeling confident today! 🔥",
          "Interesting strategy... let's see if it pays off! 😈",
          "That's one way to get attention! 💯"
        ]
      };
      
      const responses = mockResponses[responseType as keyof typeof mockResponses] || mockResponses.flirty;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return new Response(
        JSON.stringify({ response: randomResponse }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate response using OpenAI
    const systemPrompt = `You are an assistant that helps users turn boring conversations into flirty ones. Use the same language or code-mixed tone as the ongoing conversation. Do not switch to English unless it's already in use. Match the mood, tone, and formality. Make the conversation witty, playful, flirtatious, and fun—but never cringey or creepy. Responses should feel natural and culturally grounded. Prioritize charm, light teasing, humor, and subtle flirtation over cheesy lines. Avoid generic compliments. Be clever.

Response style: ${responseType}

CRITICAL RESPONSE RULES:
1. Keep responses under 50 words
2. Make it sound natural and conversational - like a real person texting
3. Use the EXACT same language, script, and mixing pattern as the input
4. Consider the context and tone of the conversation
5. Avoid being offensive or inappropriate
6. Make it engaging and likely to get a positive response
7. NEVER respond as a chatbot or AI assistant
8. Focus on understanding flirt cues, emojis, and romantic context
9. Generate human-like replies suitable for dating/chatting
10. Use appropriate emojis and modern texting style
11. If input is in Hindi/Devanagari, respond in Hindi/Devanagari
12. If input is in Hinglish/Roman script, respond in Hinglish/Roman script
13. If input is in Marathi, respond in Marathi with same script
14. Match the cultural context and references

Chat context: "${chatText}"

Generate ONLY the response text, no explanations, quotes, or meta-commentary. Respond in the SAME language and script as the input.`;

    try {
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      if (!openaiResponse.ok) {
        console.error('OpenAI API error:', openaiResponse.status, await openaiResponse.text());
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      const generatedResponse = openaiData.choices[0]?.message?.content?.trim();

      if (!generatedResponse) {
        throw new Error('No response generated from OpenAI');
      }

      // Clean up any remaining AI-like responses
      const cleanedResponse = generatedResponse
        .replace(/^(As an AI|I'm an AI|I am an AI)/gi, '')
        .replace(/I'm here to help/gi, '')
        .replace(/How can I assist/gi, '')
        .trim();

      const finalResponse = cleanedResponse || 'Hey! 😊';

      console.log('Generated response:', finalResponse);

      return new Response(
        JSON.stringify({ response: finalResponse }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } catch (openaiError) {
      console.error('OpenAI API failed, using fallback:', openaiError);
      
      // Fallback to mock response if OpenAI fails
      const mockResponses = {
        flirty: [
          "Hey there! 😊 That's such a sweet message!",
          "Aww, you're making me blush! 💕",
          "You know just what to say to make someone smile! ✨"
        ],
        witty: [
          "Well, well, well... someone's got game! 😏",
          "That's actually pretty clever! I'm impressed 🤔",
          "Smooth operator alert! 🚨"
        ],
        savage: [
          "Oh really? That's your best shot? 😤",
          "Bold move, let's see how that works out! 💪",
          "Someone's feeling confident today! 🔥"
        ]
      };
      
      const responses = mockResponses[responseType as keyof typeof mockResponses] || mockResponses.flirty;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return new Response(
        JSON.stringify({ response: randomResponse }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}