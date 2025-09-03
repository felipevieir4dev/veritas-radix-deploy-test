import React, { useState } from 'react';
import { Search, BookOpen, Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { EtymologyImage } from './EtymologyImage';

interface MainScreenProps {
  onWordSelect: (word: string) => void;
}

export function MainScreen({ onWordSelect }: MainScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showImages, setShowImages] = useState(true);

  const featuredWords = [
    {
      word: "Filosofia",
      origin: "Do grego φιλοσοφία (philosophía)",
      meaning: "Amor pela sabedoria - φίλος (phílos = amigo) + σοφία (sophía = sabedoria)"
    },
    {
      word: "Democracia", 
      origin: "Do grego δημοκρατία (dēmokratía)",
      meaning: "Governo do povo - δῆμος (dêmos = povo) + κράτος (krátos = poder)"
    },
    {
      word: "Biblioteca",
      origin: "Do grego βιβλιοθήκη (bibliothēkē)",
      meaning: "Depósito de livros - βιβλίον (biblíon = livro) + θήκη (thēkē = depósito)"
    },
    {
      word: "Psicologia",
      origin: "Do grego ψυχολογία (psychología)",
      meaning: "Estudo da alma - ψυχή (psychē = alma) + λογία (logía = estudo)"
    },
    {
      word: "Tecnologia",
      origin: "Do grego τεχνολογία (teknología)",
      meaning: "Estudo da técnica - τέχνη (téchnē = arte/técnica) + λογία (logía = estudo)"
    },
    {
      word: "Nostalgia",
      origin: "Do grego νοσταλγία (nostalgía)",
      meaning: "Dor do retorno - νόστος (nóstos = retorno) + ἄλγος (álgos = dor)"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onWordSelect(searchTerm.trim());
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="font-display text-aged mb-4 text-[24px] text-[32px] text-[36px] text-[40px] text-[36px] text-[32px] text-[24px]">
            Veritas Radix
          </h1>
          <div className="w-32 h-px bg-[var(--color-deep-red)] mx-auto mb-6"></div>
          <p className="text-lg text-sepia italic font-body max-w-2xl mx-auto">
            "Explore as raízes etimológicas das palavras e descubra as histórias escondidas na linguagem"
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-sepia)]" size={20} />
              <Input
                type="text"
                placeholder="Digite uma palavra para explorar suas raízes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="responsive-input pl-12 pr-28 bg-[var(--color-aged-paper)] border-[var(--color-deep-red-light)] focus:border-[var(--color-deep-red)] font-body"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2"
              >
                Explorar
              </Button>
            </div>
          </form>
        </div>

        {/* Palavras em Destaque */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-center font-display text-aged flex-1">
              Palavras em Destaque
            </h2>
            
            {/* Toggle para mostrar/ocultar imagens */}
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center gap-2 px-3 py-1 text-sm font-body text-sepia border border-sepia/30 rounded-full hover:bg-sepia/10 transition-colors"
              title={showImages ? 'Ocultar imagens' : 'Mostrar imagens'}
            >
              {showImages ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {showImages ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWords.map((item, index) => (
              <Card 
                key={index}
                className="parchment-card hover-lift cursor-pointer transition-all duration-200"
                onClick={() => onWordSelect(item.word)}
              >
                <CardContent className="p-6">
                  {/* Imagem da palavra (se habilitada) */}
                  {showImages && (
                    <div className="mb-4 flex justify-center">
                      <EtymologyImage
                        word={item.word}
                        size="small"
                        useDallE={false} // Usar apenas Unsplash/fallback na tela principal
                        className=""
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-deep-red">
                      {item.word}
                    </h3>
                    <BookOpen size={18} className="text-[var(--color-sepia)] mt-1 flex-shrink-0" />
                  </div>
                  
                  <p className="text-sepia mb-2 font-body italic text-sm">
                    {item.origin}
                  </p>
                  
                  <p className="text-aged font-body text-sm">
                    {item.meaning}
                  </p>

                  {/* Indicador de ação */}
                  <div className="mt-4 pt-3 border-t border-sepia/20">
                    <p className="text-xs text-sepia font-body italic text-center">
                      Toque para análise completa →
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Citação */}
        <div className="text-center">
          <div className="quote-card inline-block">
            <p className="text-lg font-body italic text-deep-red mb-1">
              "Verba volant, scripta manent"
            </p>
            <p className="text-sm text-sepia font-body">
              As palavras voam, o que se escreve permanece
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}