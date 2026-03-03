import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getSystemInstruction } from '@/lib/ai/specialist-knowledge';

// Ensure standard edge runtime is used for streaming
export const runtime = 'edge';

// Initialize Google Generative AI provider
// apiKey is automatically picked up from process.env.GOOGLE_GENERATIVE_AI_API_KEY
const google = createGoogleGenerativeAI();

export async function POST(req: Request) {
    try {
        const { messages, data } = await req.json();

        // Retrieve dogId from the request data (sent from client via useChat options)
        const dogId = data?.dogId || 'mochi';

        const systemInstruction = getSystemInstruction(dogId);

        // Call the Gemini 2.5 Flash model via Vercel AI SDK
        const result = await streamText({
            model: google('gemini-2.5-flash'),
            system: systemInstruction,
            messages,
            temperature: 0.7, // Add a slightly creative but focused temperature
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
