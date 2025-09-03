import React, { useState } from 'react';
import { Mail, Lock, Facebook, Chrome, GraduationCap, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { login, handleApiError } from '../lib/api';

interface LoginScreenProps {
  onLogin: (type: 'student' | 'teacher') => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Para demonstração, vamos aceitar qualquer email/senha
      // Em produção, isso faria uma chamada real para a API
      if (email && password) {
        onLogin(userType);
      } else {
        setError('Por favor, preencha todos os campos');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-5xl sm:text-6xl mb-4 sm:mb-6 font-body text-aged" style={{ fontWeight: 700 }}>
            Veritas Radix
          </h1>
          <p className="text-lg sm:text-xl text-sepia italic font-body mb-4 sm:mb-6">
            "A Verdade nas Raízes das Palavras"
          </p>
          <div className="w-32 sm:w-40 h-px bg-[var(--color-deep-red)] mx-auto"></div>
        </div>

        {/* Cartão de Login */}
        <Card className="parchment-card shadow-xl">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <h2 className="text-xl sm:text-2xl text-aged font-body" style={{ fontWeight: 600 }}>
              Entrar na Academia
            </h2>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 p-6 sm:p-8">
            {/* Seletor de Tipo de Usuário */}
            <div className="space-y-3">
              <p className="text-sepia font-body text-center">Sois:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={userType === 'student' ? 'default' : 'outline'}
                  onClick={() => setUserType('student')}
                  className={`${userType === 'student' ? 'btn-primary' : 'border-deep-red text-sepia hover:bg-deep-red/10'} font-body`}
                >
                  <User className="mr-2" size={16} />
                  Estudante
                </Button>
                <Button
                  type="button"
                  variant={userType === 'teacher' ? 'default' : 'outline'}
                  onClick={() => setUserType('teacher')}
                  className={`${userType === 'teacher' ? 'btn-primary' : 'border-deep-red text-sepia hover:bg-deep-red/10'} font-body`}
                >
                  <GraduationCap className="mr-2" size={16} />
                  Professor
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-body">
                  {error}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sepia" size={18} />
                <Input
                  type="email"
                  placeholder="Vosso endereço de correio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="responsive-input pl-10 sm:pl-12 bg-[var(--color-aged-paper)] border-[var(--color-deep-red-light)] focus:border-[var(--color-deep-red)] rounded-lg font-body text-aged"
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-sepia" size={18} />
                <Input
                  type="password"
                  placeholder="Vossa palavra secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="responsive-input pl-10 sm:pl-12 bg-[var(--color-aged-paper)] border-[var(--color-deep-red-light)] focus:border-[var(--color-deep-red)] rounded-lg font-body text-aged"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary rounded-lg font-body"
                style={{ fontWeight: 600 }}
              >
                <span className="px-2">
                  {isLoading ? 'Adentrando...' : (
                    userType === 'teacher' 
                      ? 'Adentrar o Sanctum Magistri' 
                      : 'Adentrar o Santuário do Saber'
                  )}
                </span>
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-deep-red-light)]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[var(--color-aged-paper)] px-4 sm:px-6 text-base sm:text-lg text-sepia font-body">ou</span>
              </div>
            </div>

            {/* Botões Sociais */}
            <div className="space-y-3 sm:space-y-4">
              <Button 
                variant="outline" 
                disabled={isLoading}
                className="w-full border-[var(--color-deep-red)] text-aged hover:bg-[var(--color-deep-red)]/10 font-body min-h-12 sm:min-h-14"
                onClick={() => onLogin(userType)}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
                  <Chrome size={18} className="flex-shrink-0" />
                  <span>Entrar com Google</span>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                disabled={isLoading}
                className="w-full border-[var(--color-deep-red)] text-aged hover:bg-[var(--color-deep-red)]/10 font-body min-h-12 sm:min-h-14"
                onClick={() => onLogin(userType)}
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
                  <Facebook size={18} className="flex-shrink-0" />
                  <span>Entrar com Facebook</span>
                </div>
              </Button>
            </div>

            <div className="text-center pt-2 sm:pt-4">
              <p className="text-base sm:text-lg text-sepia italic font-body">
                "Per aspera ad astra"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}