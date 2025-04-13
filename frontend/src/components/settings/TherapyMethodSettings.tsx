'use client';

import React, { useState, useEffect } from 'react';
import { getTherapyPrompts, TherapyMethod, TherapyPrompt } from '@/lib/api/therapyApi';
import PromptEditor from './PromptEditor';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface TherapyMethodSettingsProps {
  method: TherapyMethod;
}

const TherapyMethodSettings: React.FC<TherapyMethodSettingsProps> = ({ method }) => {
  const [prompts, setPrompts] = useState<Record<string, TherapyPrompt> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      const promptsData = await getTherapyPrompts(method.methodName);
      setPrompts(promptsData);
      setError(null);
    } catch (err) {
      setError('Błąd pobierania promptów');
      console.error('Błąd pobierania promptów:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [method.methodName]);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{method.displayName}</CardTitle>
          <CardDescription>{method.description}</CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Ładowanie promptów...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : prompts ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Prompty</h3>
          {Object.entries(prompts).map(([promptType, prompt]) => (
            <PromptEditor
              key={promptType}
              methodName={method.methodName}
              promptType={promptType}
              prompt={prompt}
              onUpdate={fetchPrompts}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default TherapyMethodSettings;
