import React from 'react';
import { Crown, Award, BookOpen, Calendar, Target, TrendingUp, Star, Users, Trophy, Medal } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useGamification } from './GamificationSystem';

export function ProfileScreen() {
  const { studentStats, getLeaderboard } = useGamification();
  const leaderboard = getLeaderboard();
  
  const exploredWords = [
    'Democracia', 'Filosofia', 'Biblioteca', 'Astronomia', 'Geografia', 
    'Antropologia', 'Psicologia', 'Arqueologia', 'Mitologia', 'Etimologia'
  ];

  const unlockedAchievements = studentStats.achievements.filter(a => a.unlocked);
  const totalAchievements = studentStats.achievements.length;

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho do Perfil */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-deep-red rounded-full flex items-center justify-center text-4xl text-white shadow-xl">
              👤
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-sepia-light rounded-full flex items-center justify-center">
              <Crown size={16} className="text-antique-white" />
            </div>
          </div>
          
          <h1 className="text-deep-red mb-2 font-display">
            {studentStats.name}
          </h1>
          <Badge className="bg-deep-red text-white mb-4">
            Nível {studentStats.level} - Explorador das Palavras
          </Badge>
          
          <div className="flex justify-center items-center">
            <div className="w-16 h-0.5 bg-deep-red"></div>
            <div className="mx-4 text-sepia italic">
              "Scientia potentia est"
            </div>
            <div className="w-16 h-0.5 bg-deep-red"></div>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <BookOpen className="mx-auto mb-4 text-deep-red" size={32} />
              <h3 className="text-deep-red mb-2">{studentStats.wordsAnalyzed}</h3>
              <p className="text-sepia">Palavras Analisadas</p>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <Target className="mx-auto mb-4 text-deep-red" size={32} />
              <h3 className="text-deep-red mb-2">{studentStats.challengesCompleted}</h3>
              <p className="text-sepia">Desafios Completados</p>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto mb-4 text-deep-red" size={32} />
              <h3 className="text-deep-red mb-2">{studentStats.streakDays}</h3>
              <p className="text-sepia">Dias Consecutivos</p>
            </CardContent>
          </Card>

          <Card className="parchment-card">
            <CardContent className="p-6 text-center">
              <Trophy className="mx-auto mb-4 text-deep-red" size={32} />
              <h3 className="text-deep-red mb-2">{unlockedAchievements.length}/{totalAchievements}</h3>
              <p className="text-sepia">Conquistas</p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso de Nível */}
        <Card className="parchment-card mb-8">
          <CardHeader>
            <h3 className="text-deep-red flex items-center">
              <TrendingUp className="mr-3 text-deep-red" size={24} />
              Progresso do Nível
            </h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-deep-red">Nível {studentStats.level}</span>
              <span className="text-sepia">{studentStats.xp}/{studentStats.xp + studentStats.xpToNext} XP</span>
            </div>
            <Progress 
              value={(studentStats.xp / (studentStats.xp + studentStats.xpToNext)) * 100} 
              className="h-4 bg-parchment-aged" 
            />
            <p className="text-sepia text-sm mt-2">
              Faltam {studentStats.xpToNext} XP para o próximo nível
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conquistas */}
          <div>
            <h2 className="text-deep-red mb-6 flex items-center">
              <Award className="mr-3 text-deep-red" size={24} />
              Galeria de Conquistas
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {studentStats.achievements.map((achievement) => {
                const IconComponent = achievement.icon;
                return (
                  <Card 
                    key={achievement.id}
                    className={`relative transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'parchment-card border-deep-red shadow-lg' 
                        : 'bg-parchment-dark border-sepia opacity-60'
                    } border-2 hover:shadow-xl`}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className={`mx-auto mb-2 ${achievement.unlocked ? 'text-deep-red' : 'text-sepia'}`} size={24} />
                      <h4 className="text-sm mb-1 text-deep-red">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-sepia">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className={`w-3 h-3 ${achievement.unlocked ? 'text-deep-red' : 'text-sepia'}`} />
                        <span className={`text-xs ${achievement.unlocked ? 'text-deep-red' : 'text-sepia'}`}>
                          {achievement.xp} XP
                        </span>
                      </div>
                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-deep-red rounded-full flex items-center justify-center">
                          <Crown size={12} className="text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Ranking e Atividades */}
          <div>
            {/* Leaderboard */}
            <h2 className="text-deep-red mb-6 flex items-center">
              <Users className="mr-3 text-deep-red" size={24} />
              Ranking dos Estudiosos
            </h2>
            
            <Card className="parchment-card mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          index === 0 ? 'bg-deep-red text-white' :
                          index === 1 ? 'bg-sepia-light text-white' :
                          index === 2 ? 'bg-sepia text-white' :
                          'bg-parchment-aged text-sepia'
                        }`}>
                          {index < 3 ? <Medal size={16} /> : index + 1}
                        </div>
                        <div>
                          <p className={`font-medium ${student.id === studentStats.id ? 'text-deep-red' : 'text-sepia'}`}>
                            {student.name}
                            {student.id === studentStats.id && ' (Você)'}
                          </p>
                          <p className="text-sm text-sepia">Nível {student.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-deep-red">{student.totalXp} XP</p>
                        <p className="text-sm text-sepia">{student.streakDays} dias</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Atividade Recente */}
            <Card className="parchment-card">
              <CardHeader>
                <h3 className="text-deep-red flex items-center">
                  <Calendar className="mr-3 text-deep-red" size={20} />
                  Atividade Recente
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-deep-red rounded-full mr-3"></div>
                    <span className="text-sepia">Analisou "Democracia" - 2h atrás</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-sepia rounded-full mr-3"></div>
                    <span className="text-sepia">Completou Quiz Etimológico - 1 dia atrás</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-deep-red rounded-full mr-3"></div>
                    <span className="text-sepia">Desbloqueou "Erudito" - 2 dias atrás</span>
                  </div>
                  {unlockedAchievements.slice(-3).map((achievement, index) => (
                    <div key={achievement.id} className="flex items-center text-sm">
                      <Star className="w-3 h-3 mr-3 text-deep-red" />
                      <span className="text-sepia">
                        Desbloqueou "{achievement.title}" (+{achievement.xp} XP)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}