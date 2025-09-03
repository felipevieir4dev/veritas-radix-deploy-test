import React, { useState } from 'react';
import { Users, BookOpen, TrendingUp, Award, Calendar, BarChart3, User, Clock, Target, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface Student {
  id: string;
  name: string;
  class: string;
  wordsStudied: number;
  challengesCompleted: number;
  averageScore: number;
  lastActivity: string;
  weeklyProgress: number;
  rank: number;
  badge: string;
}

interface ClassData {
  name: string;
  students: number;
  averageProgress: number;
  activeToday: number;
  wordsStudied: number;
}

export function TeacherDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');

  // Dados mockados para demonstração
  const students: Student[] = [
    {
      id: '1',
      name: 'Ana Costa',
      class: '7º A',
      wordsStudied: 45,
      challengesCompleted: 12,
      averageScore: 87,
      lastActivity: '2 horas atrás',
      weeklyProgress: 85,
      rank: 1,
      badge: 'Etymologist'
    },
    {
      id: '2',
      name: 'Bruno Silva',
      class: '7º A',
      wordsStudied: 38,
      challengesCompleted: 10,
      averageScore: 79,
      lastActivity: '1 dia atrás',
      weeklyProgress: 72,
      rank: 2,
      badge: 'Word Explorer'
    },
    {
      id: '3',
      name: 'Carla Santos',
      class: '7º B',
      wordsStudied: 52,
      challengesCompleted: 15,
      averageScore: 92,
      lastActivity: '30 min atrás',
      weeklyProgress: 95,
      rank: 1,
      badge: 'Root Master'
    },
    {
      id: '4',
      name: 'Diego Ferreira',
      class: '7º B',
      wordsStudied: 29,
      challengesCompleted: 8,
      averageScore: 65,
      lastActivity: '3 dias atrás',
      weeklyProgress: 45,
      rank: 4,
      badge: 'Beginner'
    }
  ];

  const classesData: ClassData[] = [
    { name: '7º A', students: 25, averageProgress: 78, activeToday: 18, wordsStudied: 342 },
    { name: '7º B', students: 23, averageProgress: 82, activeToday: 20, wordsStudied: 389 },
    { name: '8º A', students: 27, averageProgress: 75, activeToday: 15, wordsStudied: 298 },
    { name: '8º B', students: 24, averageProgress: 80, activeToday: 19, wordsStudied: 365 }
  ];

  const weeklyActivityData = [
    { day: 'Seg', students: 45, words: 120 },
    { day: 'Ter', students: 52, words: 145 },
    { day: 'Qua', students: 48, words: 132 },
    { day: 'Qui', students: 58, words: 168 },
    { day: 'Sex', students: 42, words: 98 },
    { day: 'Sáb', students: 25, words: 65 },
    { day: 'Dom', students: 18, words: 42 }
  ];

  const topWordsData = [
    { word: 'Democracia', studies: 45, color: '#8b0000' },
    { word: 'Filosofia', studies: 38, color: '#704214' },
    { word: 'Aristocracia', studies: 32, color: '#a04040' },
    { word: 'Etimologia', studies: 29, color: '#8b6914' },
    { word: 'Morfologia', studies: 25, color: '#660000' }
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClass === 'all' || student.class === selectedClass)
  );

  const totalStudents = students.length;
  const activeToday = students.filter(s => s.lastActivity.includes('horas') || s.lastActivity.includes('min')).length;
  const averageScore = Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length);
  const totalWordsStudied = students.reduce((acc, s) => acc + s.wordsStudied, 0);

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2 text-deep-red font-display">
            Dashboard do Professor
          </h1>
          <p className="text-sepia italic">
            "Acompanhe o progresso etimológico dos seus alunos"
          </p>
        </div>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="parchment-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="text-deep-red mr-3" size={28} />
                <div>
                  <p className="text-sepia text-sm">Total de Alunos</p>
                  <p className="text-2xl text-ink-brown">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="text-deep-red mr-3" size={28} />
                <div>
                  <p className="text-sepia text-sm">Ativos Hoje</p>
                  <p className="text-2xl text-ink-brown">{activeToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="text-deep-red mr-3" size={28} />
                <div>
                  <p className="text-sepia text-sm">Nota Média</p>
                  <p className="text-2xl text-ink-brown">{averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="text-deep-red mr-3" size={28} />
                <div>
                  <p className="text-sepia text-sm">Palavras Estudadas</p>
                  <p className="text-2xl text-ink-brown">{totalWordsStudied}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs do Dashboard */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 parchment-card">
            <TabsTrigger value="overview" className="data-[state=active]:bg-deep-red data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-deep-red data-[state=active]:text-white">
              Alunos
            </TabsTrigger>
            <TabsTrigger value="classes" className="data-[state=active]:bg-deep-red data-[state=active]:text-white">
              Turmas
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-deep-red data-[state=active]:text-white">
              Análises
            </TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Atividade Semanal */}
              <Card className="parchment-card">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display flex items-center">
                    <BarChart3 className="mr-2" size={20} />
                    Atividade Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#704214" opacity={0.3} />
                      <XAxis dataKey="day" stroke="#704214" />
                      <YAxis stroke="#704214" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f7f3e9', 
                          border: '1px solid #8b0000',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="students" fill="#8b0000" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Palavras Mais Estudadas */}
              <Card className="parchment-card">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display flex items-center">
                    <Target className="mr-2" size={20} />
                    Palavras Mais Estudadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={topWordsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="studies"
                        label={({ word, studies }) => `${word}: ${studies}`}
                      >
                        {topWordsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Últimas Atividades */}
              <Card className="parchment-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display flex items-center">
                    <Clock className="mr-2" size={20} />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.slice(0, 4).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-parchment-aged rounded-lg">
                        <div className="flex items-center">
                          <User className="text-sepia mr-3" size={16} />
                          <div>
                            <p className="text-ink-brown">{student.name}</p>
                            <p className="text-sepia text-sm">{student.class} • {student.lastActivity}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-deep-red text-white border-deep-red">
                          {student.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alunos */}
          <TabsContent value="students">
            <div className="space-y-6">
              {/* Filtros */}
              <Card className="parchment-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sepia" size={16} />
                        <Input
                          placeholder="Buscar aluno..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 responsive-input"
                        />
                      </div>
                    </div>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-4 py-2 border border-sepia-light rounded-lg bg-aged-paper text-ink-brown responsive-input"
                    >
                      <option value="all">Todas as turmas</option>
                      <option value="7º A">7º A</option>
                      <option value="7º B">7º B</option>
                      <option value="8º A">8º A</option>
                      <option value="8º B">8º B</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Alunos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="parchment-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg text-ink-brown font-display">{student.name}</h3>
                          <p className="text-sepia text-sm">{student.class} • Rank #{student.rank}</p>
                        </div>
                        <Badge variant="outline" className="bg-deep-red text-white border-deep-red">
                          {student.badge}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sepia text-sm">Progresso Semanal</span>
                          <span className="text-ink-brown text-sm">{student.weeklyProgress}%</span>
                        </div>
                        <Progress value={student.weeklyProgress} className="h-2" />

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-sepia">Palavras</p>
                            <p className="text-ink-brown">{student.wordsStudied}</p>
                          </div>
                          <div>
                            <p className="text-sepia">Nota Média</p>
                            <p className="text-ink-brown">{student.averageScore}%</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-sepia-light">
                          <p className="text-sepia text-xs">Última atividade: {student.lastActivity}</p>
                        </div>
                      </div>

                      <Button className="w-full mt-4 btn-primary">
                        Ver Detalhes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Turmas */}
          <TabsContent value="classes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classesData.map((classItem) => (
                <Card key={classItem.name} className="parchment-card hover-lift">
                  <CardContent className="p-6">
                    <h3 className="text-xl text-ink-brown font-display mb-4">{classItem.name}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl text-deep-red">{classItem.students}</p>
                        <p className="text-sepia text-sm">Alunos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl text-deep-red">{classItem.activeToday}</p>
                        <p className="text-sepia text-sm">Ativos Hoje</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sepia text-sm">Progresso Médio</span>
                        <span className="text-ink-brown text-sm">{classItem.averageProgress}%</span>
                      </div>
                      <Progress value={classItem.averageProgress} className="h-2" />

                      <div className="pt-2 border-t border-sepia-light">
                        <p className="text-sepia text-sm">
                          {classItem.wordsStudied} palavras estudadas esta semana
                        </p>
                      </div>
                    </div>

                    <Button className="w-full mt-4 btn-primary">
                      Gerenciar Turma
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Análises */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progresso ao Longo do Tempo */}
              <Card className="parchment-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display">
                    Progresso das Turmas - Últimos 30 Dias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { day: 1, '7A': 65, '7B': 68, '8A': 62, '8B': 66 },
                      { day: 7, '7A': 68, '7B': 72, '8A': 65, '8B': 69 },
                      { day: 14, '7A': 72, '7B': 76, '8A': 68, '8B': 73 },
                      { day: 21, '7A': 75, '7B': 79, '8A': 71, '8B': 76 },
                      { day: 30, '7A': 78, '7B': 82, '8A': 75, '8B': 80 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#704214" opacity={0.3} />
                      <XAxis dataKey="day" stroke="#704214" />
                      <YAxis stroke="#704214" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#f7f3e9', 
                          border: '1px solid #8b0000',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="7A" stroke="#8b0000" strokeWidth={2} />
                      <Line type="monotone" dataKey="7B" stroke="#704214" strokeWidth={2} />
                      <Line type="monotone" dataKey="8A" stroke="#a04040" strokeWidth={2} />
                      <Line type="monotone" dataKey="8B" stroke="#8b6914" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Estatísticas Detalhadas */}
              <Card className="parchment-card">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display">
                    Estatísticas de Engajamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sepia">Taxa de Conclusão</span>
                      <span className="text-ink-brown">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sepia">Tempo Médio de Sessão</span>
                      <span className="text-ink-brown">12 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sepia">Desafios por Dia</span>
                      <span className="text-ink-brown">3.2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sepia">Melhoria Semanal</span>
                      <span className="text-ink-brown">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recomendações */}
              <Card className="parchment-card">
                <CardHeader>
                  <CardTitle className="text-deep-red font-display">
                    Recomendações Pedagógicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-parchment-aged rounded-lg">
                      <p className="text-ink-brown text-sm">
                        <strong>Foco em palavras latinas:</strong> 73% dos alunos mostram dificuldade com raízes latinas
                      </p>
                    </div>
                    <div className="p-3 bg-parchment-aged rounded-lg">
                      <p className="text-ink-brown text-sm">
                        <strong>Desafios visuais:</strong> Alunos respondem 25% melhor a exercícios com imagens
                      </p>
                    </div>
                    <div className="p-3 bg-parchment-aged rounded-lg">
                      <p className="text-ink-brown text-sm">
                        <strong>Sessões curtas:</strong> Melhores resultados em sessões de 10-15 minutos
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}