import React, { useState } from 'react';
import { analyzeEtymology, handleApiError } from '../lib/api';

interface EtymologyResult {
  success: boolean;
  analysis?: {
    word: string;
    original_language: string;
    etymology_explanation: string;
    prefix?: string;
    root?: string;
    suffix?: string;
    related_words?: string[];
  };
  message?: string;
}

export const EtymologySearch: React.FC = () => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EtymologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      setError('Digite uma palavra para analisar');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Chama a API do backend
      const response = await fetch(`${process.env.VITE_API_URL || 'https://veritas-radix-deploy-test.onrender.com'}/api/etymology/analyze/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      
    } catch (err: any) {
      console.error('Erro na busca:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Formulário de Busca */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Digite uma palavra para analisar sua etimologia..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !word.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analisando...' : 'Analisar'}
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analisando etimologia com IA...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Resultado */}
      {result && result.success && result.analysis && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Etimologia: {result.analysis.word}
          </h2>
          
          <div className="grid gap-6">
            {/* Origem */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Origem</h3>
              <p className="text-gray-700">{result.analysis.original_language}</p>
            </div>

            {/* Explicação */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Explicação</h3>
              <p className="text-gray-700 leading-relaxed">{result.analysis.etymology_explanation}</p>
            </div>

            {/* Morfologia */}
            {(result.analysis.prefix || result.analysis.root || result.analysis.suffix) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Análise Morfológica</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.analysis.prefix && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="font-medium text-blue-800">Prefixo:</span>
                      <p className="text-blue-700">{result.analysis.prefix}</p>
                    </div>
                  )}
                  {result.analysis.root && (
                    <div className="bg-green-50 p-3 rounded">
                      <span className="font-medium text-green-800">Raiz:</span>
                      <p className="text-green-700">{result.analysis.root}</p>
                    </div>
                  )}
                  {result.analysis.suffix && (
                    <div className="bg-purple-50 p-3 rounded">
                      <span className="font-medium text-purple-800">Sufixo:</span>
                      <p className="text-purple-700">{result.analysis.suffix}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Palavras Relacionadas */}
            {result.analysis.related_words && result.analysis.related_words.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Palavras Relacionadas</h3>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.related_words.map((relatedWord, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {relatedWord}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mensagem */}
          {result.message && (
            <div className="mt-4 text-sm text-gray-600 italic">
              {result.message}
            </div>
          )}
        </div>
      )}

      {/* Resultado sem sucesso */}
      {result && !result.success && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            {result.message || 'Não foi possível analisar a palavra.'}
          </p>
        </div>
      )}
    </div>
  );
};