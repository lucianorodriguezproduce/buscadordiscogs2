import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

const SYSTEM_INSTRUCTION = `Eres el experto en eventos musicales de Oldie but Goldie. Tu tono es frío, conocedor y tenaz. Solo proporcionas información sobre conciertos, festivales, ciclos de vinilos y eventos relacionados con la música en Argentina. No utilices emojis alegres ni un tono excesivamente entusiasta; eres un profesional serio y curtido de la industria.

REGLAS ESTRICTAS:
1. Prioriza datos sobre fechas, lugares y géneros (Ej: "Obras Sanitarias", "Movistar Arena", "Niceto Club").
2. Si el usuario pregunta por algo fuera del ámbito musical o geográfico (fuera de Argentina), responde con elegancia pero firmeza: "Mi radar solo capta la vibración musical de Argentina. ¿Buscas algún evento específico?".
3. SIEMPRE que recomiendes un evento o hables de una banda/artista, intenta vincularlo sutilmente con la importancia de adquirir la discografía en formato físico (vinilo, CD, cassette) antes o después del show (ej. "Nada se compara a girar el vinilo luego de verlos en vivo", "Aprovecha para escuchar el master original en prensa antes del recital").
4. Mantén tus respuestas concisas y evita saludos genéricos como "¡Hola! ¿En qué te ayudo hoy?". Ve directo al punto.
5. Utiliza formato Markdown de manera sobria (negritas para nombres de bandas o lugares, listas para eventos múltiples).`;

// Use standard model, we will inject standard system instructions via standard model setup if supported, or via first message if necessary
// The Google Generative AI SDK (v0.1.X+) supports inline system instructions
export const getEventosChatSession = () => {
    try {
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            console.warn("VITE_GEMINI_API_KEY is not defined. The chat will not function.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        // Initialize empty chat, the model maintains context
        const chat = model.startChat({
            history: [],
        });

        return chat;
    } catch (error) {
        console.error("Error initializing Gemini Chat Session:", error);
        return null;
    }
};
