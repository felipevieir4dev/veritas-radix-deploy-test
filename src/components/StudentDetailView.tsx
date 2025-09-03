import React, { useState } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Award, BookOpen, Target, Clock, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface StudentDetailViewProps {
  studentId: string;
  onBack: () => void;
}

export function StudentDetailView({ studentId, onBack }: StudentDetailViewProps) {
  // Dados mockados para demonstração
  const student = {
    id: studentId,
    name: 'Ana Costa',
    class: '7º A',
    email: 'ana.costa@escola.edu',
    avatar: '👩‍🎓',
    joinDate: '15/02/2024',
    wordsStudied: 45,
    challengesCompleted: 12,
    averageScore: 87,
    totalTimeSpent: '24h 35m',
    currentStreak: 7,
    bestStreak: 12,
    rank: 1,
    badge: 'Etymologist',
    level: 8,
    xp: 2840
  };

  const progressData = [
    { week: 'Sem 1', words: 8, score: 75 },
    { week: 'Sem 2', words: 12, score: 82 },
    { week: 'Sem 3', words: 15, score: 85 },
    { week: 'Sem 4', words: 10, score: 88 }
  ];

  const recentActivities = [
    { date: '23/08', word: 'Democracia', score: 95, time: '8 min' },
    { date: '22/08', word: 'Filosofia', score: 88, time: '12 min' },
    { date: '21/08', word: 'Aristocracia', score: 92, time: '10 min' },
    { date: '20/08', word: 'Etimologia', score: 85, time: '15 min' },
    { date: '19/08', word: 'Morfologia', score: 90, time: '11 min' }
  ];

  const challengePerformance = [
    { type: 'Prefixos', completed: 8, total: 10, accuracy: 85 },
    { type: 'Sufixos', completed: 6, total: 8, accuracy: 92 },
    { type: 'Raízes', completed: 5, total: 6, accuracy: 78 },
    { type: 'Conectar', completed: 7, total: 9, accuracy: 88 }
  ];

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com botão voltar */}
        <div className="flex items-center mb-6">
          <Button 
            onClick={onBack}
            variant="outline"
            className="mr-4 border-sepia text-sepia hover:bg-parchment-dark"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl text-deep-red font-display">
            Acompanhamento Individual
          </h1>
        </div>

        {/* Informações do Aluno */}
        <Card className="parchment-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="text-6xl">{student.avatar}</div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl text-ink-brown font-display">{student.name}</h2>
                    <p className="text-sepia">{student.class} • {student.email}</p>
                    <p className="text-sepia text-sm">Ingressou em {student.joinDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-deep-red text-white border-deep-red">
                      {student.badge}
                    </Badge>
                    <Badge variant="outline" className="bg-sepia text-white border-sepia">
                      Level {student.level}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xl text-deep-red">{student.wordsStudied}</p>
                    <p className="text-sepia text-sm">Palavras Estudadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-deep-red">{student.averageScore}%</p>
                    <p className="text-sepia text-sm">Nota Média</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-deep-red">{student.currentStreak}</p>
                    <p className="text-sepia text-sm">Sequência Atual</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl text-deep-red">{student.totalTimeSpent}</p>
                    <p className="text-sepia text-sm">Tempo Total</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progresso Semanal */}
          <Card className="parchment-card">
            <CardHeader>
              <CardTitle className="text-deep-red font-display flex items-center">
                <TrendingUp className="mr-2" size={20} />
                Progresso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#704214" opacity={0.3} />
                  <XAxis dataKey="week" stroke="#704214" />
                  <YAxis stroke="#704214" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f7f3e9', 
                      border: '1px solid #8b0000',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="words" 
                    stroke="#8b0000" 
                    strokeWidth={3}
                    name="Palavras"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#704214" 
                    strokeWidth={3}
                    name="Pontuação"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance em Desafios */}
          <Card className="parchment-card">
            <CardHeader>
              <CardTitle className="text-deep-red font-display flex items-center">
                <Trophy className="mr-2" size={20} />
                Performance em Desafios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challengePerformance.map((challenge, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-ink-brown">{challenge.type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sepia text-sm">
                          {challenge.completed}/{challenge.total}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            challenge.accuracy >= 90 ? 'bg-green-100 text-green-800 border-green-300' :
                            challenge.accuracy >= 80 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {challenge.accuracy}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(challenge.completed / challenge.total) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card className="parchment-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-deep-red font-display flex items-center">
                <Clock className="mr-2" size={20} />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-parchment-aged rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sepia text-sm">{activity.date}</p>
                      </div>
                      <div>
                        <p className="text-ink-brown font-medium">{activity.word}</p>
                        <p className="text-sepia text-sm">Tempo: {activity.time}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-deep-red font-medium">{activity.score}%</p>
                      <p className="text-sepia text-xs">Pontuação</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <Calendar className="text-deep-red mx-auto mb-3" size={32} />
              <p className="text-2xl text-deep-red">{student.currentStreak}</p>
              <p className="text-sepia">Dias Consecutivos</p>
              <p className="text-sepia text-sm mt-1">Melhor: {student.bestStreak} dias</p>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <Award className="text-deep-red mx-auto mb-3" size={32} />
              <p className="text-2xl text-deep-red">#{student.rank}</p>
              <p className="text-sepia">Ranking na Turma</p>
              <p className="text-sepia text-sm mt-1">{student.xp} XP total</p>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <Target className="text-deep-red mx-auto mb-3" size={32} />
              <p className="text-2xl text-deep-red">{student.challengesCompleted}</p>
              <p className="text-sepia">Desafios Concluídos</p>
              <p className="text-sepia text-sm mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Recomendações */}
        <Card className="parchment-card mt-6">
          <CardHeader>
            <CardTitle className="text-deep-red font-display">
              Recomendações Pedagógicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-parchment-aged rounded-lg">
                <h4 className="text-ink-brown font-medium mb-2">Pontos Fortes</h4>
                <ul className="text-sepia text-sm space-y-1">
                  <li>• Excelente em identificação de sufixos</li>
                  <li>• Consistência nos estudos diários</li>
                  <li>• Boa performance em palavras gregas</li>
                </ul>
              </div>
              <div className="p-4 bg-parchment-aged rounded-lg">
                <h4 className="text-ink-brown font-medium mb-2">Áreas para Melhorar</h4>
                <ul className="text-sepia text-sm space-y-1">
                  <li>• Foco em raízes latinas complexas</li>
                  <li>• Praticar mais exercícios de conexão</li>
                  <li>• Revisar prefixos menos comuns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}