
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMusicExplanation = async (concept: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explique o conceito musical "${concept}" de forma simples e didática para um estudante iniciante em português.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Não foi possível obter uma explicação no momento. Continue praticando!";
  }
};

export const getDailyTip = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Com base em um estudante que tem ${stats.xp} XP e está no nível ${stats.level}, dê uma dica curta (máximo 200 caracteres) de estudo de teoria musical em português.`,
    });
    return response.text;
  } catch {
    return "A prática constante é a chave para o domínio da teoria musical.";
  }
}

export const getProgressInsights = async (history: any[]) => {
  try {
    const historySummary = history.map(h => `${h.category}: ${h.score}pts`).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise o seguinte histórico de exercícios de um estudante de música: [${historySummary}]. 
      Forneça um insight estratégico curto (máximo 300 caracteres) em português sobre o que ele deve focar para evoluir mais rápido. 
      Seja encorajador mas analítico.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text;
  } catch {
    return "Continue diversificando seus estudos para um progresso equilibrado em todas as áreas da teoria.";
  }
}
