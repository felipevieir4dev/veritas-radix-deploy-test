import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, TreePine, Brain, Sparkles, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { EtymologyImage } from './EtymologyImage';
import { useGamification } from './GamificationSystem';

interface MorphologyScreenProps {
  word: string;
  onChallengeStart: () => void;
}

export function MorphologyScreen({ word, onChallengeStart }: MorphologyScreenProps) {
  const [showImage, setShowImage] = useState(true);
  const [useDallE, setUseDallE] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const { addXP, unlockAchievement, studentStats, updateStreak } = useGamification();

  // Adicionar XP quando a palavra é analisada
  useEffect(() => {
    if (word && !hasAnalyzed) {
      setHasAnalyzed(true);
      
      // Adicionar XP pela análise
      addXP(25, `Análise da palavra "${word}"`);
      
      // Atualizar streak
      updateStreak();
      
      // Verificar achievements
      if (studentStats.wordsAnalyzed === 0) {
        unlockAchievement('first_word');
      } else if (studentStats.wordsAnalyzed === 9) {
        unlockAchievement('etymology_explorer');
      } else if (studentStats.wordsAnalyzed === 19) {
        unlockAchievement('morphology_expert');
      } else if (studentStats.wordsAnalyzed === 49) {
        unlockAchievement('word_master');
      }
    }
  }, [word, hasAnalyzed, addXP, unlockAchievement, studentStats.wordsAnalyzed, updateStreak]);

  // Dados morfológicos das palavras
  const morphologyData = {
    'Filosofia': {
      origin: "Do grego φιλοσοφία (philosophía)",
      prefix: { text: "φίλος", meaning: "amigo, amante" },
      root: { text: "σοφ-", meaning: "sabedoria" },
      suffix: { text: "-ία", meaning: "qualidade, estado" },
      completeMeaning: "Amor pela sabedoria - a busca pelo conhecimento e pela verdade através da razão e da reflexão.",
      etymology: "Do grego antigo, combinando o amor (philos) com a sabedoria (sophia), representando a busca intelectual pela verdade."
    },
    'Democracia': {
      origin: "Do grego δημοκρατία (dēmokratía)",
      prefix: { text: "δῆμος", meaning: "povo" },
      root: { text: "κρατ-", meaning: "poder" },
      suffix: { text: "-ία", meaning: "qualidade, estado" },
      completeMeaning: "Governo do povo - sistema político onde o poder emana do povo e é exercido por seus representantes.",
      etymology: "Conceito desenvolvido na Grécia antiga, particularmente em Atenas, como forma de governo popular."
    },
    'Biblioteca': {
      origin: "Do grego βιβλιοθήκη (bibliothēkē)",
      prefix: { text: "βιβλίον", meaning: "livro" },
      root: { text: "θηκ-", meaning: "depósito" },
      suffix: { text: "-η", meaning: "lugar" },
      completeMeaning: "Depósito de livros - lugar onde se guardam e organizam livros e outros materiais de leitura.",
      etymology: "Originado na antiga Alexandria, representando o conceito de preservação do conhecimento humano."
    },
    'Psicologia': {
      origin: "Do grego ψυχολογία (psychología)",
      prefix: { text: "ψυχή", meaning: "alma, mente" },
      root: { text: "λογ-", meaning: "estudo" },
      suffix: { text: "-ία", meaning: "qualidade, estado" },
      completeMeaning: "Estudo da alma ou mente - ciência que investiga os processos mentais e comportamentais.",
      etymology: "Termo moderno baseado em raízes gregas antigas, consolidado no século XIX como ciência."
    },
    'Tecnologia': {
      origin: "Do grego τεχνολογία (teknología)",
      prefix: { text: "τέχνη", meaning: "arte, técnica" },
      root: { text: "λογ-", meaning: "estudo" },
      suffix: { text: "-ία", meaning: "qualidade, estado" },
      completeMeaning: "Estudo da técnica - aplicação do conhecimento científico para fins práticos.",
      etymology: "Combinação grega que evoluiu para abranger toda a inovação e aplicação técnica moderna."
    },
    'Nostalgia': {
      origin: "Do grego νοσταλγία (nostalgía)",
      prefix: { text: "νόστος", meaning: "retorno" },
      root: { text: "ἄλγος", meaning: "dor" },
      suffix: { text: "-ία", meaning: "qualidade, estado" },
      completeMeaning: "Dor do retorno - saudade melancólica de tempos ou lugares passados.",
      etymology: "Termo cunhado no século XVII para descrever a 'doença da saudade' de soldados longe de casa."
    }
  };

  const currentWord = morphologyData[word as keyof typeof morphologyData];

  if (!currentWord) {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="font-display text-deep-red mb-4">Análise Morfológica</h1>
            <div className="parchment-card p-8">
              <p className="text-sepia font-body mb-4">
                A análise morfológica de "<strong>{word}</strong>" ainda não está disponível em nossa base de dados.
              </p>
              <p className="text-aged font-body text-sm">
                Esta palavra será analisada e adicionada em breve ao nosso catálogo etimológico.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho com imagem */}
        <div className="text-center mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-6">
            {/* Informações da palavra */}
            <div className="flex-1 max-w-md">
              <h1 className="font-display text-deep-red mb-4">{word}</h1>
              <div className="w-32 h-px bg-[var(--color-deep-red)] mx-auto mb-6"></div>
              <p className="text-sepia font-body italic mb-4">{currentWord.origin}</p>
              <p className="text-aged font-body leading-relaxed">
                {currentWord.completeMeaning}
              </p>
            </div>

            {/* Imagem etimológica */}
            {showImage && (
              <div className="flex-shrink-0">
                <div className="relative">
                  <EtymologyImage
                    word={word}
                    etymology={currentWord.etymology}
                    size="large"
                    useDallE={useDallE}
                    className="mb-4"
                  />
                  
                  {/* Controles da imagem */}
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={() => setUseDallE(!useDallE)}
                      className={`px-3 py-1 text-xs font-body border rounded-full transition-colors ${
                        useDallE 
                          ? 'bg-[var(--color-deep-red)] text-white border-[var(--color-deep-red)]' 
                          : 'text-[var(--color-deep-red)] border-[var(--color-deep-red-light)] hover:bg-[var(--color-deep-red)]/10'
                      }`}
                      title={useDallE ? 'Usando IA para gerar imagens' : 'Usando imagens de arquivo'}
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {useDallE ? 'IA Ativa' : 'Ativar IA'}
                    </button>
                    
                    <button
                      onClick={() => setShowImage(false)}
                      className="px-3 py-1 text-xs font-body text-sepia border border-sepia/30 rounded-full hover:bg-sepia/10"
                      title="Ocultar imagem"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Ocultar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Botão para mostrar imagem quando oculta */}
            {!showImage && (
              <button
                onClick={() => setShowImage(true)}
                className="flex items-center gap-2 px-4 py-2 text-sepia border border-sepia/30 rounded-lg hover:bg-sepia/10 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="font-body">Mostrar Ilustração</span>
              </button>
            )}
          </div>
        </div>

        {/* Análise Morfológica */}
        <div className="mb-12">
          <h2 className="text-center font-display text-aged mb-8">Decomposição Morfológica</h2>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
            {/* Prefixo */}
            <Card className="parchment-card hover-lift morphology-part w-full max-w-xs">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--color-deep-red)] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft size={24} />
                </div>
                <h3 className="font-display text-deep-red mb-2">Prefixo</h3>
                <p className="font-body text-aged mb-2 font-semibold">
                  {currentWord.prefix.text}
                </p>
                <p className="text-sepia font-body text-sm">
                  {currentWord.prefix.meaning}
                </p>
              </CardContent>
            </Card>

            {/* Conectores */}
            <div className="hidden lg:flex items-center">
              <div className="w-12 h-1 bg-[var(--color-deep-red-light)] rounded-full"></div>
              <div className="w-2 h-2 bg-[var(--color-deep-red)] rounded-full mx-2"></div>
              <div className="w-12 h-1 bg-[var(--color-deep-red-light)] rounded-full"></div>
            </div>

            {/* Raiz */}
            <Card className="parchment-card hover-lift morphology-part w-full max-w-xs transform lg:scale-110">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--color-deep-red)] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine size={24} />
                </div>
                <h3 className="font-display text-deep-red mb-2">Raiz</h3>
                <p className="font-body text-aged mb-2 font-semibold">
                  {currentWord.root.text}
                </p>
                <p className="text-sepia font-body text-sm">
                  {currentWord.root.meaning}
                </p>
              </CardContent>
            </Card>

            {/* Conectores */}
            <div className="hidden lg:flex items-center">
              <div className="w-12 h-1 bg-[var(--color-deep-red-light)] rounded-full"></div>
              <div className="w-2 h-2 bg-[var(--color-deep-red)] rounded-full mx-2"></div>
              <div className="w-12 h-1 bg-[var(--color-deep-red-light)] rounded-full"></div>
            </div>

            {/* Sufixo */}
            <Card className="parchment-card hover-lift morphology-part w-full max-w-xs">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[var(--color-deep-red)] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight size={24} />
                </div>
                <h3 className="font-display text-deep-red mb-2">Sufixo</h3>
                <p className="font-body text-aged mb-2 font-semibold">
                  {currentWord.suffix.text}
                </p>
                <p className="text-sepia font-body text-sm">
                  {currentWord.suffix.meaning}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contexto Histórico */}
        <div className="mb-8">
          <Card className="parchment-card max-w-3xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-display text-deep-red mb-4 text-center">Contexto Histórico</h3>
              <p className="font-body text-aged text-center leading-relaxed">
                {currentWord.etymology}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Botão de desafio */}
        <div className="text-center">
          <Button 
            className="btn-primary px-8 py-3" 
            onClick={onChallengeStart}
          >
            <Brain className="w-5 h-5 mr-2" />
            Desafiar-me com esta palavra
          </Button>
        </div>
      </div>
    </div>
  );
}