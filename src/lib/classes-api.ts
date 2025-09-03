// API functions for class management
// This file contains the functions to interact with the Django backend for class-related operations

import { API_CONFIG } from './config';

export interface ClassInfo {
  id: string;
  nome: string;
  codigo_turma: string;
  professor: string;
  descricao?: string;
  numeroAlunos: number;
  dataEntrada?: string;
  progresso?: {
    nivel: number;
    xp: number;
    xpTotal: number;
    desafiosConcluidos: number;
    totalDesafios: number;
    palavrasEstudadas: number;
  };
  medalhas?: Array<{
    id: string;
    nome: string;
    icone: string;
    cor: string;
  }>;
  ultimaAtividade?: string;
}

export interface JoinClassRequest {
  codigo_turma: string;
}

export interface JoinClassResponse {
  success: boolean;
  message: string;
  turma?: ClassInfo;
}

/**
 * Get user's classes
 */
export async function getUserClasses(authToken: string): Promise<ClassInfo[]> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/turmas/minhas/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching user classes:', error);
    throw error;
  }
}

/**
 * Join a class using code
 */
export async function joinClass(
  codigo_turma: string, 
  authToken: string
): Promise<JoinClassResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/turmas/entrar/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo_turma }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Erro ao entrar na turma'
      };
    }

    return {
      success: true,
      message: data.message || 'Entrada na turma realizada com sucesso!',
      turma: data.turma
    };
  } catch (error) {
    console.error('Error joining class:', error);
    return {
      success: false,
      message: 'Erro de conexão. Tente novamente.'
    };
  }
}

/**
 * Get class information by code (for preview before joining)
 */
export async function getClassInfo(
  codigo_turma: string, 
  authToken: string
): Promise<ClassInfo | null> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/turmas/info/${codigo_turma}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.turma || null;
  } catch (error) {
    console.error('Error fetching class info:', error);
    return null;
  }
}

/**
 * Leave a class
 */
export async function leaveClass(
  turmaId: string, 
  authToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/turmas/${turmaId}/sair/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Erro ao sair da turma'
      };
    }

    return {
      success: true,
      message: data.message || 'Você saiu da turma com sucesso!'
    };
  } catch (error) {
    console.error('Error leaving class:', error);
    return {
      success: false,
      message: 'Erro de conexão. Tente novamente.'
    };
  }
}

/**
 * Get class progress and statistics
 */
export async function getClassProgress(
  turmaId: string, 
  authToken: string
): Promise<any> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/turmas/${turmaId}/progresso/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching class progress:', error);
    throw error;
  }
}