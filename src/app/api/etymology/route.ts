import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Palavra não fornecida' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'API Key do Google não configurada' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Analise a etimologia da palavra "${word}" em português de forma detalhada e acadêmica.

    Por favor, forneça as seguintes informações em formato JSON:

    {
      "word": "${word}",
      "etymology": {
        "origin": "idioma de origem (latim, grego, etc.)",
        "originalForm": "forma original da palavra",
        "meaning": "significado original",
        "evolution": "como a palavra evoluiu até o português"
      },
      "morphology": {
        "prefix": "prefixo (se houver)",
        "root": "raiz principal",
        "suffix": "sufixo (se houver)",
        "explanation": "explicação da formação morfológica"
      },
      "relatedWords": [
        {
          "word": "palavra relacionada",
          "relationship": "tipo de relação (cognato, derivada, etc.)",
          "explanation": "breve explicação da relação"
        }
      ],
      "historicalContext": "contexto histórico e cultural da palavra",
      "curiosities": [
        "curiosidade interessante sobre a palavra"
      ]
    }

    Seja preciso e academicamente correto. Se não tiver certeza de alguma informação, indique isso claramente.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Tentar extrair JSON da resposta
    let etymologyData;
    try {
      // Remover markdown code blocks se existirem
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      etymologyData = JSON.parse(cleanText);
    } catch (parseError) {
      // Se não conseguir parsear, criar uma estrutura básica
      etymologyData = {
        word: word,
        etymology: {
          origin: "Análise completa disponível no texto",
          originalForm: word,
          meaning: "Consulte a análise detalhada",
          evolution: text
        },
        morphology: {
          prefix: "",
          root: word,
          suffix: "",
          explanation: "Análise morfológica disponível na resposta completa"
        },
        relatedWords: [],
        historicalContext: text,
        curiosities: ["Análise detalhada fornecida pelo Gemini"]
      };
    }

    return NextResponse.json({
      success: true,
      data: etymologyData,
      rawResponse: text
    });

  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}