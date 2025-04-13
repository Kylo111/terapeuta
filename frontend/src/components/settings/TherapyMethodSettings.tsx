'use client';

import React, { useState, useEffect } from 'react';
import { getTherapyPrompts, TherapyMethod, TherapyPrompt } from '@/lib/api/therapyApi';
import PromptEditor from './PromptEditor';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TherapyMethodSettingsProps {
  method: TherapyMethod;
}

const TherapyMethodSettings: React.FC<TherapyMethodSettingsProps> = ({ method }) => {
  const [prompts, setPrompts] = useState<TherapyPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      setIsLoading(true);
      const promptsData = await getTherapyPrompts(method._id);
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
  }, [method._id]);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{method.name}</CardTitle>
          <CardDescription>{method.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Zasady:</h3>
            <ul className="list-disc pl-5 mt-2">
              {method.principles.map((principle, index) => (
                <li key={index}>{principle}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Odpowiednie dla:</h3>
            <ul className="list-disc pl-5 mt-2">
              {method.suitableFor.map((suitable, index) => (
                <li key={index}>{suitable}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Przeciwwskazania:</h3>
            <ul className="list-disc pl-5 mt-2">
              {method.contraindications.map((contraindication, index) => (
                <li key={index}>{contraindication}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Prompty</h3>
        <Button variant="default" onClick={() => {}}>Dodaj nowy prompt</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Ładowanie promptów...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : prompts.length > 0 ? (
        <div>
          {prompts.map((prompt) => (
            <PromptEditor
              key={prompt._id}
              prompt={prompt}
              onUpdate={fetchPrompts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <p>Brak promptów dla tej metody terapeutycznej.</p>
          <Button variant="outline" className="mt-4" onClick={() => {}}>Dodaj pierwszy prompt</Button>
        </div>
      )}
    </div>
  );
};

export default TherapyMethodSettings;
