import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Users, BookOpen, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface JoinClassFormProps {
  onClassJoined?: (className: string) => void;
  onCancel?: () => void;
}

interface ClassInfo {
  id: string;
  nome: string;
  professor: string;
  descricao?: string;
  numeroAlunos: number;
}

export const JoinClassForm: React.FC<JoinClassFormProps> = ({ onClassJoined, onCancel }) => {
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCode.trim()) {
      setError('Por favor, insira o código da turma.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Simular busca da turma (substituir pela chamada real à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de resposta da API
      const mockClassInfo: ClassInfo = {
        id: classCode.toUpperCase(),
        nome: `Turma ${classCode.toUpperCase()}`,
        professor: 'Prof. Marcus Aurélius',
        descricao: 'Estudo avançado de etimologia latina e grega',
        numeroAlunos: Math.floor(Math.random() * 25) + 5
      };

      setClassInfo(mockClassInfo);
      setShowConfirmation(true);
    } catch (err: any) {
      setError('Turma não encontrada. Verifique o código e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const confirmJoinClass = async () => {
    if (!classInfo) return;

    setLoading(true);
    try {
      // Simular entrada na turma (substituir pela chamada real à API)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage(`Você entrou na turma "${classInfo.nome}" com sucesso!`);
      
      setTimeout(() => {
        onClassJoined?.(classInfo.nome);
      }, 2000);
    } catch (err: any) {
      setError('Erro ao entrar na turma. Tente novamente.');
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClassCode('');
    setClassInfo(null);
    setShowConfirmation(false);
    setError('');
    setMessage('');
  };

  if (message) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="parchment-card border-2 border-deep-red">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-deep-red mb-2">Sucesso!</h3>
                <p className="text-sepia">{message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showConfirmation && classInfo) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="parchment-card border-2 border-deep-red">
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 text-deep-red mx-auto mb-4" />
            <CardTitle className="text-deep-red">Confirmar Entrada</CardTitle>
            <CardDescription className="text-sepia">
              Deseja entrar nesta turma?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="parchment-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sepia">Turma:</span>
                <Badge variant="outline" className="border-deep-red text-deep-red">
                  {classInfo.nome}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sepia">Professor:</span>
                <span className="text-ink-brown font-medium">{classInfo.professor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sepia">Alunos:</span>
                <div className="flex items-center gap-1 text-sepia">
                  <Users className="h-4 w-4" />
                  <span>{classInfo.numeroAlunos}</span>
                </div>
              </div>
              {classInfo.descricao && (
                <div className="pt-2 border-t border-sepia/20">
                  <p className="text-sepia text-sm">{classInfo.descricao}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="flex-1 border-sepia text-sepia hover:bg-sepia/10"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmJoinClass}
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card className="parchment-card border-2 border-deep-red">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 text-deep-red mx-auto mb-4" />
          <CardTitle className="text-deep-red">Entrar numa Turma</CardTitle>
          <CardDescription className="text-sepia">
            Insira o código fornecido pelo seu professor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="classCode" className="text-sepia font-medium">
                Código da Turma
              </label>
              <Input
                id="classCode"
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="Ex: LATIM101"
                className="responsive-input simple-border text-center tracking-wider"
                maxLength={20}
                disabled={loading}
              />
              <p className="text-xs text-sepia/70 text-center">
                O código é fornecido pelo professor
              </p>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-2">
              {onCancel && (
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="flex-1 border-sepia text-sepia hover:bg-sepia/10"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                className={`${onCancel ? 'flex-1' : 'w-full'} btn-primary`}
                disabled={loading || !classCode.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procurando...
                  </>
                ) : (
                  'Entrar na Turma'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-sepia/20">
            <div className="text-center">
              <p className="text-xs text-sepia/70 mb-2">Precisa de ajuda?</p>
              <p className="text-xs text-sepia">
                Contacte o seu professor para obter o código da turma
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};