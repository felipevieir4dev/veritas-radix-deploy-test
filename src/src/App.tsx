import React, { useState } from 'react';
import { LoginScreen } from '../components/LoginScreen';
import { MainScreen } from '../components/MainScreen';
import { MorphologyScreen } from '../components/MorphologyScreen';
import { ChallengesScreen } from '../components/ChallengesScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { EtymologyTreeScreen } from '../components/EtymologyTreeScreen';
import { TeacherDashboard } from '../components/TeacherDashboard';
import { ClassManagementWrapper } from '../components/ClassManagementWrapper';
import { Navigation } from '../components/Navigation';
import { HeaderWithGamification } from '../components/HeaderWithGamification';
import { GamificationProvider } from '../components/GamificationSystem';

export type Screen = 'login' | 'main' | 'morphology' | 'challenges' | 'profile' | 'tree' | 'teacher' | 'classes';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  const handleLogin = (type: 'student' | 'teacher' = 'student') => {
    setIsLoggedIn(true);
    setUserType(type);
    setCurrentScreen(type === 'teacher' ? 'teacher' : 'main');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setUserType('student');
    setSelectedWord('');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'main':
        return <MainScreen onWordSelect={(word) => {
          setSelectedWord(word);
          setCurrentScreen('morphology');
        }} />;
      case 'morphology':
        return <MorphologyScreen 
          word={selectedWord} 
          onChallengeStart={() => setCurrentScreen('challenges')}
        />;
      case 'challenges':
        return <ChallengesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'tree':
        return <EtymologyTreeScreen selectedWord={selectedWord} />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'classes':
        return <ClassManagementWrapper 
          onBack={() => setCurrentScreen('main')}
          useMockData={true} // Set to false when backend is ready
        />;
      default:
        return <MainScreen onWordSelect={(word) => {
          setSelectedWord(word);
          setCurrentScreen('morphology');
        }} />;
    }
  };

  return (
    <GamificationProvider>
      <div className="min-h-screen parchment-bg">
        {isLoggedIn && (
          <HeaderWithGamification 
            userType={userType}
            currentScreen={currentScreen}
            onLogout={handleLogout}
          />
        )}
        {renderScreen()}
        {isLoggedIn && (
          <Navigation 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen}
            userType={userType}
          />
        )}
      </div>
    </GamificationProvider>
  );
}