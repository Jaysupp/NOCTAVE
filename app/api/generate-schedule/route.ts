import { GoogleGenAI } from "@google/genai";

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tasks, sleepTime } = body;

        console.log('Incoming Data:', { sleepTime, tasks });

        if (!process.env.GOOGLE_API_KEY) {
            console.error('Missing GOOGLE_API_KEY');
            return new Response(JSON.stringify({ error: 'Missing GOOGLE_API_KEY' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

        const prompt = `You are a sleep scientist. For a user sleeping at ${sleepTime}, identify their 2-hour "Deep Work" window. If a task involves complex logic (like Algorithms), place it there. If it is lighter, place it near the wind-down period.
        
        Tasks: ${JSON.stringify(tasks)}
        
        Return the schedule as a JSON object with a "Chronotype Tip" for the night.
        The JSON structure should be:
        {
          "schedule": [
            {
              "start_time": "HH:MM AM/PM",
              "task_id": "Task Name",
              "explanation": "Brief explanation",
              "energy_level": "High/Medium/Low"
            }
          ],
          "chronotype_tip": "Specific tip"
        }
        Do not wrap the response in markdown code blocks. Return only valid JSON.`;

        const result = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: 'application/json',
            }
        });

        // According to SDK README, generateContent returns the response directly, 
        // and .text is a property containing the generated text.
        const responseText = result.text;

        if (!responseText) {
            throw new Error("No text returned from Gemini");
        }

        // Safety: ensure no markdown if model ignores instruction (though responseMimeType helps)
        const jsonString = responseText.replace(/```json\n?|\n?```/g, '').trim();

        const data = JSON.parse(jsonString);

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to generate schedule', details: error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

