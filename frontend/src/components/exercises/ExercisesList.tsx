'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { getExercises, Exercise, ExerciseFilterOptions } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { Clock, BarChart2, Award } from 'lucide-react';

export default function ExercisesList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExerciseFilterOptions>({
    isActive: true
  });

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getExercises(filters);
      setExercises(data);
    } catch (err) {
      console.error('Błąd pobierania ćwiczeń:', err);
      setError('Nie udało się pobrać ćwiczeń');
      toast.error('Nie udało się pobrać ćwiczeń');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ExerciseFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <span className="ml-2">Ładowanie ćwiczeń...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Szukaj ćwiczeń..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={filters.category || ''}
            onValueChange={(value) => handleFilterChange('category', value || undefined)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Kategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie kategorie</SelectItem>
              <SelectItem value="mindfulness">Mindfulness</SelectItem>
              <SelectItem value="relaxation">Relaksacja</SelectItem>
              <SelectItem value="cognitive">Poznawcze</SelectItem>
              <SelectItem value="emotional">Emocjonalne</SelectItem>
              <SelectItem value="behavioral">Behawioralne</SelectItem>
              <SelectItem value="other">Inne</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.difficulty || ''}
            onValueChange={(value) => handleFilterChange('difficulty', value || undefined)}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Poziom trudności" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Wszystkie poziomy</SelectItem>
              <SelectItem value="beginner">Początkujący</SelectItem>
              <SelectItem value="intermediate">Średniozaawansowany</SelectItem>
              <SelectItem value="advanced">Zaawansowany</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.sortBy || ''}
            onValueChange={(value) => {
              if (value) {
                const [sortBy, sortOrder] = value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder as 'asc' | 'desc');
              } else {
                handleFilterChange('sortBy', undefined);
                handleFilterChange('sortOrder', undefined);
              }
            }}
          >
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Sortowanie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Domyślne</SelectItem>
              <SelectItem value="name-asc">Nazwa (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nazwa (Z-A)</SelectItem>
              <SelectItem value="duration-asc">Czas (rosnąco)</SelectItem>
              <SelectItem value="duration-desc">Czas (malejąco)</SelectItem>
              <SelectItem value="createdAt-desc">Najnowsze</SelectItem>
              <SelectItem value="createdAt-asc">Najstarsze</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Nie znaleziono ćwiczeń spełniających kryteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise._id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{exercise.name}</CardTitle>
                  <Badge className={getCategoryColor(exercise.category)}>
                    {getCategoryLabel(exercise.category)}
                  </Badge>
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">{exercise.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">{getDifficultyLabel(exercise.difficulty)}</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart2 className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">{exercise.history.length} wykonań</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Korzyści:</h4>
                  <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                    {exercise.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                    {exercise.benefits.length > 2 && (
                      <li>...</li>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/exercises/${exercise._id}`} className="w-full">
                  <Button variant="default" className="w-full">
                    Rozpocznij ćwiczenie
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
