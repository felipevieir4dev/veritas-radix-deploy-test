import { NextRequest, NextResponse } from 'next/server';

// Imagens de fallback garantidas para cada palavra
const GUARANTEED_IMAGES: Record<string, string> = {
  'Filosofia': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format&q=80',
  'Democracia': 'https://images.unsplash.com/photo-1541872703-74c34d2846b5?w=400&h=300&fit=crop&auto=format&q=80', 
  'Biblioteca': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=80',
  'Psicologia': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format&q=80',
  'Tecnologia': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format&q=80',
  'Nostalgia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80',
  'default': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&auto=format&q=80'
};

// Queries melhoradas para cada palavra
const SEARCH_QUERIES: Record<string, string> = {
  'Filosofia': 'ancient greek philosophy marble statue wisdom',
  'Democracia': 'ancient greek agora columns democracy athens',
  'Biblioteca': 'ancient library alexandria scrolls books knowledge',
  'Psicologia': 'human brain psychology mind consciousness thought',
  'Tecnologia': 'ancient tools craftsmanship engineering innovation',
  'Nostalgia': 'vintage sepia memories old photographs melancholy'
};

export async function POST(request: NextRequest) {
  try {
    const { word, query } = await request.json();

    // Validar entrada
    if (!word && !query) {
      return NextResponse.json({ 
        success: true,
        imageUrl: GUARANTEED_IMAGES.default,
        description: 'Imagem padrão',
        usingFallback: true
      });
    }

    const searchWord = word || 'default';
    const searchQuery = query || SEARCH_QUERIES[searchWord] || `ancient manuscript ${searchWord.toLowerCase()}`;

    // Tentar API do Unsplash se a chave estiver disponível
    if (process.env.UNSPLASH_ACCESS_KEY) {
      try {
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
            },
            // Timeout para evitar travamentos
            signal: AbortSignal.timeout(5000)
          }
        );

        if (unsplashResponse.ok) {
          const data = await unsplashResponse.json();
          
          if (data.results && data.results.length > 0) {
            // Pegar uma imagem aleatória dos primeiros resultados
            const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 3));
            const photo = data.results[randomIndex];
            
            return NextResponse.json({
              success: true,
              imageUrl: photo.urls.regular,
              thumbnailUrl: photo.urls.small,
              description: photo.alt_description || searchQuery,
              attribution: {
                photographer: photo.user.name,
                username: photo.user.username,
                profileUrl: photo.user.links.html
              },
              usingFallback: false
            });
          }
        }
      } catch (apiError) {
        console.warn('Erro na API do Unsplash, usando fallback garantido:', apiError);
      }
    }

    // SEMPRE retornar uma imagem, mesmo que seja fallback
    const fallbackUrl = GUARANTEED_IMAGES[searchWord] || GUARANTEED_IMAGES.default;

    return NextResponse.json({
      success: true,
      imageUrl: fallbackUrl,
      thumbnailUrl: fallbackUrl,
      description: `Imagem relacionada a ${searchWord}`,
      usingFallback: true,
      reason: process.env.UNSPLASH_ACCESS_KEY ? 'API não retornou resultados' : 'API key não configurada'
    });

  } catch (error) {
    console.error('Erro na API de imagens:', error);
    
    // SEMPRE retornar uma resposta válida, mesmo em caso de erro
    return NextResponse.json({
      success: true,
      imageUrl: GUARANTEED_IMAGES.default,
      thumbnailUrl: GUARANTEED_IMAGES.default,
      description: 'Imagem padrão de pergaminho',
      usingFallback: true,
      error: 'Erro interno, usando imagem padrão'
    });
  }
}