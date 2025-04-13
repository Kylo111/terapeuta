'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { updateTherapyPrompt, resetTherapyPrompt, TherapyPrompt } from '@/lib/api/therapyApi';
import { toast } from 'react-toastify';

interface PromptEditorProps {
  methodName: string;
  promptType: string;
  prompt: TherapyPrompt;
  onUpdate: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ methodName, promptType, prompt, onUpdate }) => {
  const [content, setContent] = useState(prompt.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setContent(prompt.content);
  }, [prompt]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setContent(prompt.content);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTherapyPrompt(methodName, promptType, content);
      setIsEditing(false);
      onUpdate();
      toast.success('Prompt został zaktualizowany');
    } catch (error) {
      console.error('Błąd aktualizacji promptu:', error);
      toast.error('Błąd aktualizacji promptu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Czy na pewno chcesz zresetować prompt do wartości domyślnej?')) {
      setIsResetting(true);
      try {
        await resetTherapyPrompt(methodName, promptType);
        onUpdate();
        toast.success('Prompt został zresetowany do wartości domyślnej');
      } catch (error) {
        console.error('Błąd resetowania promptu:', error);
        toast.error('Błąd resetowania promptu');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{prompt.displayName}</CardTitle>
        <CardDescription>{prompt.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        ) : (
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isEditing ? (
            <>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
                className="mr-2"
              >
                {isSaving ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Anuluj
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={handleEdit}
            >
              Edytuj
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isResetting || isEditing}
        >
          {isResetting ? 'Resetowanie...' : 'Resetuj do domyślnego'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptEditor;
