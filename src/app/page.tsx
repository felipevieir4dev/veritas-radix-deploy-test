'use client'

import React, { useState } from 'react';
import { LoginScreen } from '../components/LoginScreen';
import { MainScreen } from '../components/MainScreen';
import { MorphologyScreen } from '../components/MorphologyScreen';
import { ChallengesScreen } from '../components/ChallengesScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { EtymologyTreeScreen } from '../components/EtymologyTreeScreen';
import { Navigation } from '../components/Navigation';

export type Screen = 'login' | 'main' | 'morphology' | 'challenges' | 'profile' | 'tree';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('main');
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
      default:
        return <MainScreen onWordSelect={(word) => {
          setSelectedWord(word);
          setCurrentScreen('morphology');
        }} />;
    }
  };

  return (
    <div className="min-h-screen parchment-bg">
      {renderScreen()}
      {isLoggedIn && (
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen}
        />
      )}
    </div>
  );
}