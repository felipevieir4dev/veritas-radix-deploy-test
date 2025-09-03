import React, { useState } from 'react';
import { TreePine, Info, Search, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface EtymologyTreeScreenProps {
  selectedWord: string;
}

export function EtymologyTreeScreen({ selectedWord = 'Democracia' }: EtymologyTreeScreenProps) {
  const [focusedWord, setFocusedWord] = useState(selectedWord);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const wordConnections = {
    'Democracia': {
      center: { word: 'Democracia', meaning: 'Governo do povo' },
      connections: [
        { word: 'Demagogia', meaning: 'Condução do povo', relation: 'Compartilha "demo-"' },
        { word: 'Demografia', meaning: 'Estudo do povo', relation: 'Compartilha "demo-"' },
        { word: 'Aristocracia', meaning: 'Governo dos nobres', relation: 'Compartilha "-cracia"' },
        { word: 'Teocracia', meaning: 'Governo divino', relation: 'Compartilha "-cracia"' },
        { word: 'Autocracia', meaning: 'Governo de si mesmo', relation: 'Compartilha "-cracia"' },
        { word: 'Epidemia', meaning: 'Sobre o povo', relation: 'Compartilha "demo-"' },
      ]
    },
    'Filosofia': {
      center: { word: 'Filosofia', meaning: 'Amor à sabedoria' },
      connections: [
        { word: 'Filologia', meaning: 'Amor às palavras', relation: 'Compartilha "filo-"' },
        { word: 'Filantropia', meaning: 'Amor à humanidade', relation: 'Compartilha "filo-"' },
        { word: 'Sofisma', meaning: 'Sabedoria aparente', relation: 'Compartilha "sof-"' },
        { word: 'Teologia', meaning: 'Estudo de Deus', relation: 'Compartilha "-logia"' },
        { word: 'Psicologia', meaning: 'Estudo da mente', relation: 'Compartilha "-logia"' },
        { word: 'Filarmônica', meaning: 'Amor à música', relation: 'Compartilha "filo-"' },
      ]
    }
  };

  const currentConnections = wordConnections[focusedWord as keyof typeof wordConnections] || wordConnections['Democracia'];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-3xl mb-4 text-deep-red font-display">
            Árvore Etimológica
          </h1>
          <div className="flex justify-center items-center mb-6">
            <TreePine className="text-sepia mr-3" size={24} />
            <p className="text-sepia italic">
              "Explore as conexões profundas entre as palavras através de suas raízes"
            </p>
            <TreePine className="text-sepia ml-3" size={24} />
          </div>
        </div>

        {/* Seletor de Palavra Central */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center parchment-card p-2">
            <Button 
              onClick={() => setFocusedWord('Democracia')}
              className={`rounded-full px-4 py-2 ${focusedWord === 'Democracia' ? 'bg-deep-red text-white' : 'bg-transparent text-sepia hover:bg-parchment-dark'}`}
            >
              Democracia
            </Button>
            <Button 
              onClick={() => setFocusedWord('Filosofia')}
              className={`rounded-full px-4 py-2 ${focusedWord === 'Filosofia' ? 'bg-deep-red text-white' : 'bg-transparent text-sepia hover:bg-parchment-dark'}`}
            >
              Filosofia
            </Button>
          </div>
        </div>

        {/* Mapa de Conexões */}
        <div className="relative">
          {/* Palavra Central */}
          <div className="flex justify-center mb-12">
            <Card className="bg-deep-red border-4 border-sepia shadow-2xl transform scale-110 z-20 relative">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏛️</div>
                <h2 className="text-2xl mb-2 text-white font-display">
                  {currentConnections.center.word}
                </h2>
                <p className="text-antique-white italic">
                  {currentConnections.center.meaning}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Palavras Conectadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {currentConnections.connections.map((connection, index) => (
              <div key={index} className="relative">
                {/* Linha de Conexão Visual */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-0">
                  <div className="w-0.5 h-16 bg-gradient-to-b from-deep-red to-sepia opacity-50"></div>
                </div>

                <Card 
                  className="parchment-card border-sepia-light hover:border-deep-red transition-all duration-300 cursor-pointer hover:shadow-xl group hover-lift"
                  onClick={() => setShowDetails(showDetails === connection.word ? null : connection.word)}
                >
                  <CardContent className="p-6 text-center relative">
                    <div className="text-2xl mb-3">📚</div>
                    <h3 className="text-lg mb-2 text-ink-brown group-hover:text-deep-red font-display">
                      {connection.word}
                    </h3>
                    <p className="text-sepia text-sm mb-3">
                      {connection.meaning}
                    </p>
                    <div className="text-xs bg-parchment-aged text-ink-brown px-3 py-2 rounded-full border border-sepia-light mb-3">
                      {connection.relation}
                    </div>
                    
                    <Button
                      size="sm"
                      className="bg-deep-red hover:bg-deep-red-dark text-white"
                    >
                      <Info size={14} className="mr-1" />
                      Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pop-up de Detalhes */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="parchment-card max-w-md w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl text-deep-red font-display">{showDetails}</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowDetails(null)}
                    className="border-sepia text-sepia hover:bg-parchment-dark"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="bg-parchment-aged rounded-lg p-4 border border-sepia-light">
                  <p className="text-ink-brown leading-relaxed mb-4">
                    A palavra <strong className="text-deep-red">"{showDetails}"</strong> compartilha 
                    raízes etimológicas com <strong className="text-deep-red">"{focusedWord}"</strong>, 
                    demonstrando como as línguas antigas continuam a influenciar nosso vocabulário moderno.
                  </p>
                  
                  <div className="flex items-center text-sepia text-sm">
                    <Zap className="mr-2" size={16} />
                    <span>Clique em outras palavras para explorar mais conexões!</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4 btn-primary"
                  onClick={() => {
                    setFocusedWord(showDetails);
                    setShowDetails(null);
                  }}
                >
                  <Search className="mr-2" size={16} />
                  Explorar "{showDetails}"
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legenda */}
        <div className="mt-12">
          <Card className="parchment-card">
            <CardContent className="p-6">
              <h3 className="text-lg mb-4 text-deep-red flex items-center font-display">
                <Info className="mr-3 text-sepia" size={20} />
                Como Ler a Árvore Etimológica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-deep-red rounded-full mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-ink-brown">Palavra central em destaque</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-4 h-0.5 bg-sepia mr-3 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-ink-brown">Linhas mostram conexões etimológicas</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-sepia rounded mr-3 mt-1 flex-shrink-0"></div>
                  <div>
                    <p className="text-ink-brown">Palavras relacionadas por raízes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}