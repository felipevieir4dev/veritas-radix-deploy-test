import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { word, etymology } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Palavra não fornecida' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'API Key da OpenAI não configurada' }, { status: 500 });
    }

    // Criar um prompt baseado na palavra e sua etimologia
    const imagePrompt = `
    Create a beautiful, artistic illustration representing the word "${word}" and its etymological origins.
    
    ${etymology ? `Context: ${etymology}` : ''}
    
    Style: Renaissance manuscript illumination with parchment background, golden ornaments, and medieval aesthetic. 
    The image should be elegant, scholarly, and evoke ancient wisdom and knowledge.
    Include decorative borders and elements that reflect the historical origins of the word.
    Colors: warm browns, deep reds (#8b0000), gold accents, aged parchment tones.
    
    Make it suitable for an educational etymology application with a classic, timeless feel.
    `;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'Não foi possível gerar a imagem' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: imagePrompt
    });

  } catch (error: any) {
    console.error('Erro na API do DALL-E:', error);
    
    // Tratar diferentes tipos de erro da OpenAI
    if (error?.response?.status === 429) {
      return NextResponse.json(
        { error: 'Limite de requisições excedido. Tente novamente em alguns minutos.' },
        { status: 429 }
      );
    }
    
    if (error?.response?.status === 400) {
      return NextResponse.json(
        { error: 'Conteúdo não permitido ou prompt inválido.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao gerar imagem', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}