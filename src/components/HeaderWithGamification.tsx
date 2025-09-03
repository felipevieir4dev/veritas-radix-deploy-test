import React from 'react';
import { Header } from './Header';
import { useGamification } from './GamificationSystem';

interface HeaderWithGamificationProps {
  userType: 'student' | 'teacher';
  currentScreen: string;
  onLogout: () => void;
}

export function HeaderWithGamification({ userType, currentScreen, onLogout }: HeaderWithGamificationProps) {
  const { studentStats } = useGamification();

  return (
    <Header 
      userType={userType}
      currentScreen={currentScreen}
      onLogout={onLogout}
      studentData={userType === 'student' ? {
        name: studentStats.name,
        level: studentStats.level,
        xp: studentStats.xp,
        xpToNext: studentStats.xpToNext
      } : undefined}
    />
  );
}