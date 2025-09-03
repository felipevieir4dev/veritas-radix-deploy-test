import React, { useState } from 'react';
import { JoinClassForm } from './JoinClassForm';
import { MyClassesView } from './MyClassesView';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Users, Plus, BookOpen } from 'lucide-react';

interface ClassManagementScreenProps {
  onBack?: () => void;
}

export const ClassManagementScreen: React.FC<ClassManagementScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'my-classes' | 'join-class'>('my-classes');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [joinedClassName, setJoinedClassName] = useState('');

  const handleClassJoined = (className: string) => {
    setJoinedClassName(className);
    setShowSuccessMessage(true);
    
    // Voltar para a aba de turmas após alguns segundos
    setTimeout(() => {
      setActiveTab('my-classes');
      setShowSuccessMessage(false);
    }, 2500);
  };

  const handleJoinNewClass = () => {
    setActiveTab('join-class');
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen parchment-bg p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center py-16">
            <Card className="parchment-card border-2 border-green-600 max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-deep-red mb-2">Parabéns!</h3>
                    <p className="text-sepia">
                      Você entrou na turma <strong>"{joinedClassName}"</strong> com sucesso!
                    </p>
                    <p className="text-sepia text-sm mt-2">
                      Redirecionando para suas turmas...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen parchment-bg">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="border-sepia text-sepia hover:bg-sepia/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-deep-red">Gestão de Turmas</h1>
              <p className="text-sepia">Gerencie suas turmas e entre em novas</p>
            </div>
            <div className="w-24" /> {/* Spacer para centrar o título */}
          </div>

          <div className="divider-line mb-6"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'my-classes' | 'join-class')}>
          <TabsList className="grid w-full grid-cols-2 mb-8 parchment-card border border-deep-red/20">
            <TabsTrigger 
              value="my-classes"
              className="data-[state=active]:bg-deep-red data-[state=active]:text-white text-sepia"
            >
              <Users className="h-4 w-4 mr-2" />
              Minhas Turmas
            </TabsTrigger>
            <TabsTrigger 
              value="join-class"
              className="data-[state=active]:bg-deep-red data-[state=active]:text-white text-sepia"
            >
              <Plus className="h-4 w-4 mr-2" />
              Entrar numa Turma
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-classes" className="space-y-6">
            <MyClassesView onJoinNewClass={handleJoinNewClass} />
          </TabsContent>

          <TabsContent value="join-class" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="parchment-card mb-6">
                <CardHeader>
                  <CardTitle className="text-deep-red text-center flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    Entrar numa Nova Turma
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sepia mb-6">
                    <p>Para entrar numa turma, você precisa do código fornecido pelo professor.</p>
                    <p className="text-sm mt-2 text-sepia/70">
                      O código é único para cada turma e foi criado pelo seu professor.
                    </p>
                  </div>
                  
                  <JoinClassForm 
                    onClassJoined={handleClassJoined}
                    onCancel={() => setActiveTab('my-classes')}
                  />
                </CardContent>
              </Card>

              {/* Informações sobre como funciona */}
              <Card className="parchment-card border-deep-red/20">
                <CardHeader>
                  <CardTitle className="text-sepia text-lg">Como funciona?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-deep-red text-white rounded-full flex items-center justify-center font-medium text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="text-sepia font-medium">Obtenha o código</h4>
                        <p className="text-sepia/70 text-sm">
                          O seu professor criará uma turma e lhe fornecerá um código único (ex: LATIM101).
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-deep-red text-white rounded-full flex items-center justify-center font-medium text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="text-sepia font-medium">Insira o código</h4>
                        <p className="text-sepia/70 text-sm">
                          Use o formulário acima para inserir o código da turma.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-deep-red text-white rounded-full flex items-center justify-center font-medium text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="text-sepia font-medium">Comece a estudar</h4>
                        <p className="text-sepia/70 text-sm">
                          Após entrar na turma, você terá acesso aos desafios e conteúdos específicos.
                        </p>
                      </div>
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
};