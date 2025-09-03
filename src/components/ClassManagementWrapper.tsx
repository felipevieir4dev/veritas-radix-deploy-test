import React from 'react';
import { ClassManagementScreen } from './ClassManagementScreen';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { WifiOff } from 'lucide-react';

interface ClassManagementWrapperProps {
  onBack?: () => void;
  authToken?: string;
  useMockData?: boolean;
}

/**
 * Simplified wrapper for class management
 */
export const ClassManagementWrapper: React.FC<ClassManagementWrapperProps> = ({ 
  onBack, 
  useMockData = true
}) => {
  return (
    <div>
      {useMockData && (
        <Alert className="mb-4 border-blue-200 bg-blue-50">
          <WifiOff className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <div className="flex items-center justify-between">
              <span>
                <strong>Modo de Desenvolvimento:</strong> Usando dados simulados
              </span>
              <Badge variant="outline" className="border-blue-600 text-blue-600">
                Mock Data
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <ClassManagementScreen onBack={onBack} />
    </div>
  );
};