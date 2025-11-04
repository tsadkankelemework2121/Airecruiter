// Server-only OpenAI client
// This file is only used in API routes (server-side)
// DO NOT import this in client components

let openaiClient: any = null;

export async function getOpenAIClient() {
  if (!openaiClient) {
    // Check if we're on the server
    if (typeof window !== 'undefined') {
      throw new Error('OpenAI client can only be used on the server');
    }
    
    // Check API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables. Please add it to .env.local');
    }
    
    try {
      // Use dynamic import with Node.js require fallback for better compatibility
      let OpenAI: any;
      
      try {
        const openaiModule = await import("openai");
        OpenAI = openaiModule.default;
      } catch (importError) {
        // Fallback to require (for Node.js environments)
        const openaiModule = require("openai");
        OpenAI = openaiModule.default || openaiModule.OpenAI || openaiModule;
      }
      
      if (!OpenAI) {
        throw new Error("OpenAI class not found in module");
      }
      
      openaiClient = new OpenAI({
        apiKey: apiKey,
      });
    } catch (error: any) {
      console.error("Error initializing OpenAI client:", error);
      throw new Error(`Failed to initialize OpenAI: ${error.message}`);
    }
  }
  
  return openaiClient;
}

