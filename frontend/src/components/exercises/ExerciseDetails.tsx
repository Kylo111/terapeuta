'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Exercise, addHistoryEntry, HistoryEntryInput } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { Clock, Award, AlertCircle, CheckCircle2, Lightbulb, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ExerciseHistoryForm from './ExerciseHistoryForm';

interface ExerciseDetailsProps {
  exercise: Exercise;
  onExerciseUpdated: (exercise: Exercise) => void;
}

export default function ExerciseDetails({ exercise, onExerciseUpdated }: ExerciseDetailsProps) {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isPerforming, setIsPerforming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'mindfulness': 'Mindfulness',
      'relaxation': 'Relaksacja',
      'cognitive': 'Poznawcze',
      'emotional': 'Emocjonalne',
      'behavioral': 'Behawioralne',
      'other': 'Inne'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'mindfulness': 'bg-blue-100 text-blue-800',
      'relaxation': 'bg-green-100 text-green-800',
      'cognitive': 'bg-purple-100 text-purple-800',
      'emotional': 'bg-yellow-100 text-yellow-800',
      'behavioral': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const difficulties: Record<string, string> = {
      'beginner': 'Początkujący',
      'intermediate': 'Średniozaawansowany',
      'advanced': 'Zaawansowany'
    };
    return difficulties[difficulty] || difficulty;
  };

  const handleStartExercise = () => {
    setIsPerforming(true);
    setActiveTab('instructions');
  };

  const handleFinishExercise = async (historyEntry: HistoryEntryInput) => {
    try {
      setIsSubmitting(true);
      const updatedExercise = await addHistoryEntry(exercise._id, historyEntry);
      onExerciseUpdated(updatedExercise);
      setIsPerforming(false);
      toast.success('Ćwiczenie zostało zakończone');
    } catch (error) {
      console.error('Błąd podczas zapisywania historii ćwiczenia:', error);
      toast.error('Nie udało się zapisać historii ćwiczenia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelExercise = () => {
    setIsPerforming(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-2xl">{exercise.name}</CardTitle>
              <CardDescription className="mt-2">{exercise.description}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getCategoryColor(exercise.category)}>
                {getCategoryLabel(exercise.category)}
              </Badge>
              <Badge variant="outline">
                <Award className="h-3 w-3 mr-1" />
                {getDifficultyLabel(exercise.difficulty)}
              </Badge>
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {exercise.duration} min
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isPerforming ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Korzyści</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              {exercise.contraindications.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Przeciwwskazania</h3>
                  <ul className="list-disc pl-5 space-y-1 text-red-600">
                    {exercise.contraindications.map((contraindication, index) => (
                      <li key={index}>{contraindication}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="instructions">Instrukcje</TabsTrigger>
                <TabsTrigger value="tips">Wskazówki</TabsTrigger>
                {exercise.resources.length > 0 && (
                  <TabsTrigger value="resources">Zasoby</TabsTrigger>
                )}
                <TabsTrigger value="finish">Zakończ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="instructions">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Instrukcje</h3>
                    <ol className="list-decimal pl-5 space-y-3">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="pl-2">{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab('tips')}>
                      Dalej: Wskazówki
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tips">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Wskazówki</h3>
                    {exercise.tips.length > 0 ? (
                      <ul className="space-y-3">
                        {exercise.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">Brak wskazówek dla tego ćwiczenia.</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('instructions')}>
                      Wróć: Instrukcje
                    </Button>
                    <Button onClick={() => setActiveTab(exercise.resources.length > 0 ? 'resources' : 'finish')}>
                      Dalej: {exercise.resources.length > 0 ? 'Zasoby' : 'Zakończ'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {exercise.resources.length > 0 && (
                <TabsContent value="resources">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Zasoby dodatkowe</h3>
                      <div className="space-y-4">
                        {exercise.resources.map((resource, index) => (
                          <Card key={index}>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">{resource.title}</CardTitle>
                              {resource.description && (
                                <CardDescription>{resource.description}</CardDescription>
                              )}
                            </CardHeader>
                            <CardFooter className="py-3">
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-800 flex items-center"
                              >
                                <span>Otwórz zasób</span>
                                <ExternalLink className="h-4 w-4 ml-1" />
                              </a>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setActiveTab('tips')}>
                        Wróć: Wskazówki
                      </Button>
                      <Button onClick={() => setActiveTab('finish')}>
                        Dalej: Zakończ
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              <TabsContent value="finish">
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-green-800 font-medium">Gratulacje!</h3>
                      <p className="text-green-700">
                        Ukończyłeś ćwiczenie. Zapisz swoje doświadczenia i refleksje poniżej.
                      </p>
                    </div>
                  </div>
                  
                  <ExerciseHistoryForm 
                    exerciseDuration={exercise.duration}
                    onSubmit={handleFinishExercise}
                    onCancel={handleCancelExercise}
                    isSubmitting={isSubmitting}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        {!isPerforming && (
          <CardFooter>
            <Button onClick={handleStartExercise} className="w-full">
              Rozpocznij ćwiczenie
            </Button>
          </CardFooter>
        )}
      </Card>

      {!isPerforming && exercise.history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historia wykonania</CardTitle>
            <CardDescription>
              Ćwiczenie wykonane {exercise.history.length} {exercise.history.length === 1 ? 'raz' : 'razy'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exercise.history.slice(0, 5).map((entry, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{formatDate(entry.date)}</p>
                      <p className="text-sm text-gray-500">Czas trwania: {entry.duration} min</p>
                    </div>
                    {entry.rating && (
                      <Badge variant="outline">
                        Ocena: {entry.rating}/10
                      </Badge>
                    )}
                  </div>
                  {entry.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{entry.notes}</p>
                    </div>
                  )}
                  {entry.mood && (entry.mood.before !== undefined || entry.mood.after !== undefined) && (
                    <div className="mt-2 flex items-center space-x-4">
                      {entry.mood.before !== undefined && (
                        <div className="text-sm">
                          <span className="text-gray-500">Nastrój przed:</span> {entry.mood.before}/10
                        </div>
                      )}
                      {entry.mood.after !== undefined && (
                        <div className="text-sm">
                          <span className="text-gray-500">Nastrój po:</span> {entry.mood.after}/10
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {exercise.history.length > 5 && (
                <div className="text-center">
                  <Button variant="link">
                    Zobacz więcej historii
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
