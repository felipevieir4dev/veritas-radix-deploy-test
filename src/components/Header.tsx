import React from 'react';
import { LogOut, User, Crown, BookOpen } from 'lucide-react';

interface HeaderProps {
  userType: 'student' | 'teacher';
  currentScreen: string;
  onLogout: () => void;
  studentData?: {
    name: string;
    level: number;
    xp: number;
    xpToNext: number;
  };
}

export function Header({ userType, currentScreen, onLogout, studentData }: HeaderProps) {
  const getScreenTitle = (screen: string) => {
    switch (screen) {
      case 'main': return 'Pesquisa Etimológica';
      case 'morphology': return 'Análise Morfológica';
      case 'challenges': return 'Desafios';
      case 'profile': return 'Perfil';
      case 'tree': return 'Árvore Etimológica';
      case 'teacher': return 'Dashboard do Professor';
      default: return 'Veritas Radix';
    }
  };

  return (
    <div className="parchment-card p-3 mb-4 mx-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-deep-red" />
          <div>
            <h1 className="text-deep-red font-display">Veritas Radix</h1>
            <p className="text-sepia text-sm">{getScreenTitle(currentScreen)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userType === 'student' && studentData && (
            <div className="flex items-center gap-2 text-sm">
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-sepia-light" />
                  <span className="font-medium text-deep-red">Nível {studentData.level}</span>
                </div>
                <div className="text-sepia text-xs">
                  {studentData.xp} / {studentData.xp + studentData.xpToNext} XP
                </div>
              </div>
              <div className="w-20 h-2 bg-parchment-aged rounded-full">
                <div 
                  className="h-full bg-deep-red rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(studentData.xp / (studentData.xp + studentData.xpToNext)) * 100}%` 
                  }}
                />
              </div>
            </div>
          )}

          {userType === 'teacher' && (
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-sepia-light" />
              <span className="text-deep-red font-medium">Professor</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-deep-red hover:bg-parchment-aged rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}