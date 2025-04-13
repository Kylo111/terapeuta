'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { updatePrompt, deletePrompt, TherapyPrompt } from '@/lib/api/therapyApi';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/Badge';

interface PromptEditorProps {
  prompt: TherapyPrompt;
  onUpdate: () => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ prompt, onUpdate }) => {
  const [content, setContent] = useState(prompt.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      await updatePrompt(prompt._id, { content });
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

  const handleDelete = async () => {
    if (window.confirm('Czy na pewno chcesz usunąć ten prompt?')) {
      setIsDeleting(true);
      try {
        await deletePrompt(prompt._id);
        onUpdate();
        toast.success('Prompt został usunięty');
      } catch (error) {
        console.error('Błąd usuwania promptu:', error);
        toast.error('Błąd usuwania promptu');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{prompt.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge className="mr-2">{prompt.purpose}</Badge>
              <span className="text-sm text-gray-500">Wersja: {prompt.version}</span>
              {prompt.usageCount > 0 && (
                <span className="ml-2 text-sm text-gray-500">Użyty: {prompt.usageCount} razy</span>
              )}
              {prompt.effectivenessRating && (
                <span className="ml-2 text-sm text-gray-500">Ocena: {prompt.effectivenessRating.toFixed(1)}/10</span>
              )}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {prompt.tags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Zmienne:</h4>
          <div className="flex flex-wrap gap-2">
            {prompt.variables.length > 0 ? (
              prompt.variables.map((variable, index) => (
                <Badge key={index} variant="secondary">
                  {variable.name}{variable.defaultValue ? ` (domyślnie: ${variable.defaultValue})` : ''}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-500">Brak zmiennych</span>
            )}
          </div>
        </div>

        <h4 className="text-sm font-medium mb-2">Treść promptu:</h4>
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
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || isEditing}
        >
          {isDeleting ? 'Usuwanie...' : 'Usuń'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromptEditor;
