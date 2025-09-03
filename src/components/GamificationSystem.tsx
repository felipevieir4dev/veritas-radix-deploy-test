import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trophy, Star, Award, Zap, Target, BookOpen, Scroll, Crown } from 'lucide-react';

// Tipos do sistema de gamificação
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'etymology' | 'morphology' | 'challenges' | 'general';
}

export interface StudentStats {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  totalXp: number;
  achievements: Achievement[];
  streakDays: number;
  wordsAnalyzed: number;
  challengesCompleted: number;
  averageScore: number;
  lastActive: Date;
  joinedAt: Date;
}

interface GamificationContextType {
  studentStats: StudentStats;
  addXP: (amount: number, source: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStreak: () => void;
  getLeaderboard: () => StudentStats[];
}

const GamificationContext = createContext<GamificationContextType | null>(null);

// Achievements predefinidos
const defaultAchievements: Achievement[] = [
  {
    id: 'first_word',
    title: 'Primeira Descoberta',
    description: 'Analisou sua primeira palavra',
    icon: BookOpen,
    xp: 50,
    unlocked: false,
    category: 'etymology'
  },
  {
    id: 'etymology_explorer',
    title: 'Explorador Etimológico',
    description: 'Analisou 10 palavras diferentes',
    icon: Scroll,
    xp: 200,
    unlocked: false,
    category: 'etymology'
  },
  {
    id: 'word_master',
    title: 'Mestre das Palavras',
    description: 'Analisou 50 palavras diferentes',
    icon: Crown,
    xp: 500,
    unlocked: false,
    category: 'etymology'
  },
  {
    id: 'challenge_beginner',
    title: 'Primeiro Desafio',
    description: 'Completou seu primeiro desafio',
    icon: Target,
    xp: 75,
    unlocked: false,
    category: 'challenges'
  },
  {
    id: 'challenge_master',
    title: 'Mestre dos Desafios',
    description: 'Completou 25 desafios',
    icon: Trophy,
    xp: 400,
    unlocked: false,
    category: 'challenges'
  },
  {
    id: 'streak_week',
    title: 'Dedicação Semanal',
    description: 'Estudou por 7 dias consecutivos',
    icon: Zap,
    xp: 300,
    unlocked: false,
    category: 'general'
  },
  {
    id: 'perfect_score',
    title: 'Pontuação Perfeita',
    description: 'Obteve 100% em um desafio',
    icon: Star,
    xp: 150,
    unlocked: false,
    category: 'challenges'
  },
  {
    id: 'morphology_expert',
    title: 'Especialista em Morfologia',
    description: 'Analisou a morfologia de 20 palavras',
    icon: Award,
    xp: 250,
    unlocked: false,
    category: 'morphology'
  }
];

// Cálculo de nível baseado em XP
const calculateLevel = (totalXp: number): { level: number; xpToNext: number } => {
  // Progressão: 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250...
  let level = 1;
  let xpRequired = 100;
  let totalRequired = 0;

  while (totalXp >= totalRequired + xpRequired) {
    totalRequired += xpRequired;
    level++;
    xpRequired += 50 + (level * 25); // Aumenta progressivamente
  }

  const xpToNext = (totalRequired + xpRequired) - totalXp;
  return { level, xpToNext };
};

// Provider do sistema de gamificação
export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [studentStats, setStudentStats] = useState<StudentStats>({
    id: 'student_1',
    name: 'Estudante',
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalXp: 0,
    achievements: defaultAchievements,
    streakDays: 0,
    wordsAnalyzed: 0,
    challengesCompleted: 0,
    averageScore: 0,
    lastActive: new Date(),
    joinedAt: new Date()
  });

  const addXP = (amount: number, source: string) => {
    setStudentStats(prev => {
      const newTotalXp = prev.totalXp + amount;
      const { level, xpToNext } = calculateLevel(newTotalXp);
      
      // Mostrar notificação de XP ganho
      console.log(`+${amount} XP de ${source}`);
      
      // Verificar se subiu de nível
      if (level > prev.level) {
        console.log(`Parabéns! Você alcançou o nível ${level}!`);
      }

      return {
        ...prev,
        xp: newTotalXp - (newTotalXp - xpToNext - amount), // XP atual no nível
        totalXp: newTotalXp,
        level,
        xpToNext,
        lastActive: new Date()
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setStudentStats(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          console.log(`Achievement desbloqueado: ${achievement.title}!`);
          addXP(achievement.xp, `Achievement: ${achievement.title}`);
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        return achievement;
      });

      return {
        ...prev,
        achievements: updatedAchievements
      };
    });
  };

  const updateStreak = () => {
    setStudentStats(prev => {
      const today = new Date();
      const lastActive = new Date(prev.lastActive);
      const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = prev.streakDays;
      if (daysDiff === 1) {
        // Mantém a sequência
        newStreak = prev.streakDays + 1;
      } else if (daysDiff === 0) {
        // Mesmo dia, mantém a sequência atual
        newStreak = prev.streakDays;
      } else {
        // Quebrou a sequência
        newStreak = 1;
      }

      // Verificar achievement de streak
      if (newStreak === 7) {
        unlockAchievement('streak_week');
      }

      return {
        ...prev,
        streakDays: newStreak,
        lastActive: today
      };
    });
  };

  const getLeaderboard = (): StudentStats[] => {
    // Mock de leaderboard - em produção viria da API
    return [
      studentStats,
      {
        id: 'mock_1',
        name: 'Ana Silva',
        level: 8,
        xp: 450,
        xpToNext: 200,
        totalXp: 2450,
        achievements: [],
        streakDays: 12,
        wordsAnalyzed: 87,
        challengesCompleted: 34,
        averageScore: 92,
        lastActive: new Date(),
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'mock_2',
        name: 'Carlos Santos',
        level: 6,
        xp: 320,
        xpToNext: 180,
        totalXp: 1820,
        achievements: [],
        streakDays: 5,
        wordsAnalyzed: 65,
        challengesCompleted: 28,
        averageScore: 88,
        lastActive: new Date(),
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      }
    ].sort((a, b) => b.totalXp - a.totalXp);
  };

  return (
    <GamificationContext.Provider value={{
      studentStats,
      addXP,
      unlockAchievement,
      updateStreak,
      getLeaderboard
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

// Hook para usar o sistema de gamificação
export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

// Componente de notificação de XP
export function XPNotification({ amount, source }: { amount: number; source: string }) {
  return (
    <div className="fixed top-4 right-4 bg-deep-red text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4" />
        <span>+{amount} XP</span>
      </div>
      <p className="text-xs opacity-90">{source}</p>
    </div>
  );
}

// Componente de achievement desbloqueado
export function AchievementUnlocked({ achievement }: { achievement: Achievement }) {
  const IconComponent = achievement.icon;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="parchment-card p-6 max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-deep-red rounded-full flex items-center justify-center mx-auto mb-4">
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-deep-red mb-2">Achievement Desbloqueado!</h3>
        <h4 className="font-medium mb-2">{achievement.title}</h4>
        <p className="text-sepia mb-4">{achievement.description}</p>
        <div className="flex items-center justify-center gap-2 text-sepia-light">
          <Star className="w-4 h-4" />
          <span>+{achievement.xp} XP</span>
        </div>
      </div>
    </div>
  );
}