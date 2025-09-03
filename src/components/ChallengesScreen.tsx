import React, { useState } from 'react';
import { Trophy, Target, Clock, Star, Zap, Crown, Medal, Sword } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { useGamification } from './GamificationSystem';

export function ChallengesScreen() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const { studentStats, addXP, unlockAchievement, getLeaderboard } = useGamification();
  const leaderboard = getLeaderboard();

  const games = [
    {
      id: 'quiz',
      title: 'Quiz Etimológico',
      description: 'Teste seus conhecimentos sobre origens das palavras',
      difficulty: 'Médio',
      points: 100,
      completed: studentStats.challengesCompleted > 0,
      icon: Target,
      story: 'O Oráculo de Delfos desafia seu conhecimento etimológico...'
    },
    {
      id: 'puzzle',
      title: 'Construtor de Palavras',
      description: 'Monte palavras usando raízes gregas e latinas',
      difficulty: 'Fácil',
      points: 75,
      completed: false,
      icon: Sword,
      story: 'Como um ferreiro das palavras, forje novos termos...'
    },
    {
      id: 'memory',
      title: 'Memória do Escriba',
      description: 'Memorize e combine raízes com seus significados',
      difficulty: 'Difícil',
      points: 150,
      completed: false,
      icon: Crown,
      story: 'Os escribas da Biblioteca de Alexandria testam sua memória...'
    },
    {
      id: 'speed',
      title: 'Corrida dos Filosofos',
      description: 'Descubra origens etimológicas contra o tempo',
      difficulty: 'Médio',
      points: 125,
      completed: false,
      icon: Zap,
      story: 'Corra contra o tempo como Hermes, mensageiro dos deuses...'
    }
  ];

  // Questões para o quiz
  const quizQuestions = [
    {
      question: 'Qual é a origem da palavra "Democracia"?',
      options: ['Grego: demos (povo) + kratos (poder)', 'Latim: democraticus', 'Árabe: dimūqrāṭiyya', 'Sânscrito: demokarma'],
      correct: 0,
      explanation: 'Democracia vem do grego "demokratia", formada por "demos" (povo) e "kratos" (poder, força).'
    },
    {
      question: 'A palavra "Filosofia" significa literalmente:',
      options: ['Conhecimento antigo', 'Amor pela sabedoria', 'Estudo da mente', 'Reflexão profunda'],
      correct: 1,
      explanation: 'Filosofia vem do grego "philosophia": "philos" (amor) + "sophia" (sabedoria).'
    },
    {
      question: 'Qual raiz latina significa "escrever"?',
      options: ['scrib-', 'dict-', 'loqu-', 'vid-'],
      correct: 0,
      explanation: 'A raiz latina "scrib-" significa escrever, presente em palavras como "escrever", "escriba", "manuscrito".'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-600';
      case 'Médio': return 'text-sepia-light';
      case 'Difícil': return 'text-deep-red';
      default: return 'text-sepia-light';
    }
  };

  const handleGameStart = (gameId: string) => {
    setSelectedGame(gameId);
    if (gameId === 'quiz') {
      setIsPlaying(true);
      setCurrentQuestionIndex(0);
      setGameScore(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct.toString();
    
    if (isCorrect) {
      setGameScore(prev => prev + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Fim do jogo
      const finalScore = gameScore + (isCorrect ? 1 : 0);
      const percentage = (finalScore / quizQuestions.length) * 100;
      
      // Adicionar XP baseado na performance
      let xpGained = 50; // XP base
      if (percentage === 100) {
        xpGained = 150;
        unlockAchievement('perfect_score');
      } else if (percentage >= 80) {
        xpGained = 100;
      } else if (percentage >= 60) {
        xpGained = 75;
      }
      
      addXP(xpGained, 'Quiz Etimológico');
      
      // Verificar achievements
      if (studentStats.challengesCompleted === 0) {
        unlockAchievement('challenge_beginner');
      }
      
      setShowResult(true);
      setIsPlaying(false);
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setGameScore(0);
    setShowResult(false);
  };

  // Renderizar jogo específico
  if (isPlaying && selectedGame === 'quiz') {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct.toString();
    
    return (
      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <Card className="parchment-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-deep-red font-display">Quiz Etimológico</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sepia">
                    {currentQuestionIndex + 1}/{quizQuestions.length}
                  </span>
                  <span className="text-deep-red font-medium">
                    Pontos: {gameScore}
                  </span>
                </div>
              </div>
              <Progress 
                value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
                className="h-2 mt-4" 
              />
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="text-deep-red mb-6">{currentQuestion.question}</h3>
              
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index.toString()
                        ? 'border-deep-red bg-deep-red bg-opacity-10'
                        : 'border-sepia-light hover:border-deep-red'
                    }`}
                  >
                    <span className="text-deep-red font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {selectedAnswer !== null && (
                <div className="mb-6 p-4 bg-parchment-aged rounded-lg">
                  <div className={`flex items-center mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                    <span className="font-medium">
                      {isCorrect ? 'Correto!' : 'Incorreto'}
                    </span>
                  </div>
                  <p className="text-sepia text-sm">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button 
                  onClick={resetGame}
                  className="px-6 py-2 border border-sepia-light text-sepia hover:bg-parchment-aged"
                >
                  Sair
                </Button>
                <Button 
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="btn-primary px-6 py-2"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Tela de resultado do quiz
  if (showResult && selectedGame === 'quiz') {
    const percentage = (gameScore / quizQuestions.length) * 100;
    let resultMessage = '';
    let resultColor = '';
    
    if (percentage === 100) {
      resultMessage = 'Perfeito! Você é um verdadeiro etimologista!';
      resultColor = 'text-green-600';
    } else if (percentage >= 80) {
      resultMessage = 'Excelente! Você domina bem a etimologia!';
      resultColor = 'text-green-600';
    } else if (percentage >= 60) {
      resultMessage = 'Bom trabalho! Continue estudando para melhorar!';
      resultColor = 'text-sepia-light';
    } else {
      resultMessage = 'Continue praticando! A etimologia requer dedicação!';
      resultColor = 'text-red-600';
    }

    return (
      <div className="min-h-screen p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <Card className="parchment-card text-center">
            <CardContent className="p-8">
              <Trophy className="w-16 h-16 text-deep-red mx-auto mb-4" />
              <h2 className="text-deep-red font-display mb-4">Quiz Concluído!</h2>
              
              <div className="mb-6">
                <div className="text-4xl text-deep-red font-display mb-2">
                  {gameScore}/{quizQuestions.length}
                </div>
                <div className="text-sepia mb-4">
                  {percentage.toFixed(0)}% de acertos
                </div>
                <p className={`font-medium ${resultColor}`}>
                  {resultMessage}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Star className="w-5 h-5 text-deep-red" />
                <span className="text-deep-red font-medium">
                  +{percentage === 100 ? 150 : percentage >= 80 ? 100 : percentage >= 60 ? 75 : 50} XP ganho!
                </span>
              </div>

              <Button 
                onClick={resetGame}
                className="btn-primary px-8 py-3"
              >
                Voltar aos Desafios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-deep-red font-display mb-4">
            Arena dos Desafios
          </h1>
          <div className="w-24 h-px bg-deep-red mx-auto mb-6"></div>
          <p className="text-sepia italic">
            "Fortuna audaces iuvat - A sorte favorece os audazes"
          </p>
        </div>

        {/* Status do Jogador */}
        <Card className="parchment-card mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Crown className="w-8 h-8 text-deep-red mx-auto mb-2" />
                <div className="text-deep-red font-display">Nível {studentStats.level}</div>
                <div className="text-sepia text-sm">Etimólogo</div>
              </div>
              <div className="text-center">
                <Target className="w-8 h-8 text-deep-red mx-auto mb-2" />
                <div className="text-deep-red font-display">{studentStats.challengesCompleted}</div>
                <div className="text-sepia text-sm">Desafios Concluídos</div>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-deep-red mx-auto mb-2" />
                <div className="text-deep-red font-display">{studentStats.streakDays}</div>
                <div className="text-sepia text-sm">Dias de Sequência</div>
              </div>
              <div className="text-center">
                <Medal className="w-8 h-8 text-deep-red mx-auto mb-2" />
                <div className="text-deep-red font-display">{studentStats.achievements.filter(a => a.unlocked).length}</div>
                <div className="text-sepia text-sm">Conquistas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Desafios */}
          <div className="lg:col-span-2">
            <h2 className="text-deep-red mb-6 font-display flex items-center">
              <Sword className="mr-3 text-deep-red" size={24} />
              Missões Disponíveis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {games.map((game) => {
                const IconComponent = game.icon;
                return (
                  <Card 
                    key={game.id}
                    className={`parchment-card hover-lift cursor-pointer transition-all duration-200 ${
                      game.completed ? 'border-deep-red shadow-lg' : 'hover:border-deep-red-light'
                    }`}
                    onClick={() => handleGameStart(game.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-deep-red rounded-full flex items-center justify-center">
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-deep-red font-display">
                              {game.title}
                            </h3>
                            <span className={`text-sm ${getDifficultyColor(game.difficulty)}`}>
                              {game.difficulty}
                            </span>
                          </div>
                        </div>
                        {game.completed && (
                          <Trophy size={20} className="text-deep-red" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="mb-4 p-3 bg-parchment-aged rounded-lg">
                        <p className="text-sepia text-sm italic">{game.story}</p>
                      </div>
                      
                      <p className="text-sepia mb-4">
                        {game.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-deep-red" />
                          <span className="text-deep-red font-medium">
                            {game.points} XP
                          </span>
                        </div>
                        <div className="text-sepia text-sm">
                          ⏱️ ~10 min
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full ${
                          game.completed 
                            ? 'bg-sepia text-white cursor-not-allowed' 
                            : 'btn-primary'
                        }`}
                        disabled={game.completed}
                      >
                        {game.completed ? '✓ Completado' : '⚔️ Aceitar Missão'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Ranking e Achievements */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div>
              <h2 className="text-deep-red mb-6 font-display flex items-center">
                <Trophy className="mr-3 text-deep-red" size={24} />
                Salão da Fama
              </h2>
              
              <Card className="parchment-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {leaderboard.slice(0, 5).map((player, index) => (
                      <div 
                        key={player.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          player.id === studentStats.id
                            ? 'bg-deep-red bg-opacity-10 border border-deep-red-light' 
                            : 'bg-parchment-aged'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-display font-bold ${
                            index === 0 ? 'bg-deep-red text-white' :
                            index === 1 ? 'bg-sepia-light text-white' :
                            index === 2 ? 'bg-sepia text-white' :
                            'bg-parchment-aged text-sepia border border-sepia-light'
                          }`}>
                            {index < 3 ? <Medal size={16} /> : index + 1}
                          </div>
                          <div>
                            <p className="text-deep-red font-medium">
                              {player.name}
                              {player.id === studentStats.id && ' (Você)'}
                            </p>
                            <p className="text-sepia text-sm">Nível {player.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-deep-red font-medium">{player.totalXp} XP</p>
                          <p className="text-sepia text-sm">{player.streakDays} dias</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conquistas Recentes */}
            <div>
              <h3 className="text-deep-red mb-4 font-display flex items-center">
                <Medal className="mr-2 text-deep-red" size={20} />
                Conquistas Recentes
              </h3>
              
              <Card className="parchment-card">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {studentStats.achievements
                      .filter(a => a.unlocked)
                      .slice(-3)
                      .map((achievement) => {
                        const IconComponent = achievement.icon;
                        return (
                          <div key={achievement.id} className="flex items-center gap-3 p-2 bg-parchment-aged rounded">
                            <div className="w-8 h-8 bg-deep-red rounded-full flex items-center justify-center">
                              <IconComponent size={16} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-deep-red text-sm font-medium">{achievement.title}</p>
                              <p className="text-sepia text-xs">+{achievement.xp} XP</p>
                            </div>
                          </div>
                        );
                      })}
                    {studentStats.achievements.filter(a => a.unlocked).length === 0 && (
                      <p className="text-sepia text-sm text-center italic">
                        Complete desafios para ganhar conquistas!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}