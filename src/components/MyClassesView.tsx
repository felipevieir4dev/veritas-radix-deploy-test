import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  Plus, 
  GraduationCap,
  Clock,
  Star,
  TrendingUp
} from 'lucide-react';

interface ClassData {
  id: string;
  nome: string;
  codigo_turma: string;
  professor: string;
  descricao?: string;
  numeroAlunos: number;
  dataEntrada: string;
  progresso: {
    nivel: number;
    xp: number;
    xpTotal: number;
    desafiosConcluidos: number;
    totalDesafios: number;
    palavrasEstudadas: number;
  };
  medalhas: Array<{
    id: string;
    nome: string;
    icone: string;
    cor: string;
  }>;
  ultimaAtividade: string;
}

interface MyClassesViewProps {
  onJoinNewClass: () => void;
}

export const MyClassesView: React.FC<MyClassesViewProps> = ({ onJoinNewClass }) => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento das turmas do aluno
    const loadClasses = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data das turmas
      const mockClasses: ClassData[] = [
        {
          id: '1',
          nome: 'Etimologia Latina Avançada',
          codigo_turma: 'LATIM101',
          professor: 'Prof. Marcus Aurélius',
          descricao: 'Estudo profundo das raízes latinas e sua evolução',
          numeroAlunos: 18,
          dataEntrada: '2024-01-15',
          progresso: {
            nivel: 3,
            xp: 450,
            xpTotal: 600,
            desafiosConcluidos: 12,
            totalDesafios: 20,
            palavrasEstudadas: 87
          },
          medalhas: [
            { id: '1', nome: 'Explorador', icone: '🗺️', cor: 'bronze' },
            { id: '2', nome: 'Estudioso', icone: '📚', cor: 'prata' }
          ],
          ultimaAtividade: '2024-01-20'
        },
        {
          id: '2',
          nome: 'Raízes Gregas Fundamentais',
          codigo_turma: 'GREGO201',
          professor: 'Prof. Helena de Troia',
          descricao: 'Fundamentos da etimologia grega clássica',
          numeroAlunos: 22,
          dataEntrada: '2024-01-10',
          progresso: {
            nivel: 2,
            xp: 280,
            xpTotal: 400,
            desafiosConcluidos: 8,
            totalDesafios: 15,
            palavrasEstudadas: 53
          },
          medalhas: [
            { id: '3', nome: 'Iniciante', icone: '🌱', cor: 'bronze' }
          ],
          ultimaAtividade: '2024-01-18'
        }
      ];
      
      setClasses(mockClasses);
      setLoading(false);
    };

    loadClasses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (xp: number, xpTotal: number) => {
    return Math.round((xp / xpTotal) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="parchment-card">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-sepia/20 rounded w-3/4"></div>
                <div className="h-4 bg-sepia/20 rounded w-1/2"></div>
                <div className="h-20 bg-sepia/20 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="parchment-card border-2 border-deep-red/20">
          <CardContent className="p-8">
            <GraduationCap className="h-16 w-16 text-sepia/50 mx-auto mb-4" />
            <h3 className="text-deep-red mb-2">Nenhuma turma encontrada</h3>
            <p className="text-sepia mb-6">
              Você ainda não está inscrito em nenhuma turma. Entre numa turma usando o código fornecido pelo seu professor.
            </p>
            <Button onClick={onJoinNewClass} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Entrar numa Turma
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-deep-red">Minhas Turmas</h2>
          <p className="text-sepia">Gerencie suas turmas e acompanhe o progresso</p>
        </div>
        <Button onClick={onJoinNewClass} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Turma
        </Button>
      </div>

      <div className="grid gap-6">
        {classes.map((classData) => (
          <Card key={classData.id} className="parchment-card border-l-4 border-l-deep-red hover-lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-deep-red flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {classData.nome}
                  </CardTitle>
                  <CardDescription className="text-sepia mt-1">
                    {classData.professor} • Código: {classData.codigo_turma}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-deep-red text-deep-red">
                  Nível {classData.progresso.nivel}
                </Badge>
              </div>
              {classData.descricao && (
                <p className="text-sepia text-sm mt-2">{classData.descricao}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progresso XP */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sepia text-sm">Progresso no Nível</span>
                  <span className="text-deep-red font-medium">
                    {classData.progresso.xp} / {classData.progresso.xpTotal} XP
                  </span>
                </div>
                <div className="w-full bg-sepia/20 rounded-full h-2">
                  <div 
                    className="bg-deep-red h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(classData.progresso.xp, classData.progresso.xpTotal)}%` }}
                  ></div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 parchment-card">
                  <Award className="h-6 w-6 text-deep-red mx-auto mb-1" />
                  <div className="text-deep-red font-medium">
                    {classData.progresso.desafiosConcluidos}
                  </div>
                  <div className="text-xs text-sepia">Desafios</div>
                </div>
                <div className="text-center p-3 parchment-card">
                  <BookOpen className="h-6 w-6 text-deep-red mx-auto mb-1" />
                  <div className="text-deep-red font-medium">
                    {classData.progresso.palavrasEstudadas}
                  </div>
                  <div className="text-xs text-sepia">Palavras</div>
                </div>
                <div className="text-center p-3 parchment-card">
                  <Users className="h-6 w-6 text-deep-red mx-auto mb-1" />
                  <div className="text-deep-red font-medium">
                    {classData.numeroAlunos}
                  </div>
                  <div className="text-xs text-sepia">Alunos</div>
                </div>
                <div className="text-center p-3 parchment-card">
                  <TrendingUp className="h-6 w-6 text-deep-red mx-auto mb-1" />
                  <div className="text-deep-red font-medium">
                    {getProgressPercentage(classData.progresso.desafiosConcluidos, classData.progresso.totalDesafios)}%
                  </div>
                  <div className="text-xs text-sepia">Conclusão</div>
                </div>
              </div>

              {/* Medalhas */}
              {classData.medalhas.length > 0 && (
                <div>
                  <h4 className="text-sepia text-sm mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Medalhas Conquistadas
                  </h4>
                  <div className="flex gap-2">
                    {classData.medalhas.map((medalha) => (
                      <div
                        key={medalha.id}
                        className="flex items-center gap-1 px-2 py-1 parchment-card rounded-lg"
                      >
                        <span className="text-sm">{medalha.icone}</span>
                        <span className="text-xs text-sepia">{medalha.nome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="bg-sepia/20" />

              {/* Informações adicionais */}
              <div className="flex justify-between items-center text-xs text-sepia">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Entrou em {formatDate(classData.dataEntrada)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Ativo em {formatDate(classData.ultimaAtividade)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="border-deep-red/20 bg-aged-paper">
        <BookOpen className="h-4 w-4 text-deep-red" />
        <AlertDescription className="text-sepia">
          <strong className="text-deep-red">Dica:</strong> Participe regularmente dos desafios e estudos para avançar mais rapidamente de nível e conquistar medalhas especiais!
        </AlertDescription>
      </Alert>
    </div>
  );
};