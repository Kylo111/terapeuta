'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ExerciseStats as ExerciseStatsType } from '@/lib/api/exercisesApi';
import { formatDate } from '@/lib/utils';
import { Clock, Award, BarChart2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ExerciseStatsProps {
  stats: ExerciseStatsType;
}

export default function ExerciseStats({ stats }: ExerciseStatsProps) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Liczba ćwiczeń</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalExercises}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Wykonania</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCompletions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Łączny czas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalDuration} min</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Średnia ocena</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}/10</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ćwiczenia według kategorii</CardTitle>
            <CardDescription>
              Liczba ćwiczeń i wykonań w każdej kategorii
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byCategory).map(([category, data]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge className={getCategoryColor(category)}>
                      {getCategoryLabel(category)}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {data.count} {data.count === 1 ? 'ćwiczenie' : 'ćwiczenia'}, {data.completions} {data.completions === 1 ? 'wykonanie' : 'wykonania'}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${(data.completions / Math.max(stats.totalCompletions, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ćwiczenia według poziomu trudności</CardTitle>
            <CardDescription>
              Liczba ćwiczeń i wykonań na każdym poziomie trudności
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byDifficulty).map(([difficulty, data]) => (
                <div key={difficulty} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {getDifficultyLabel(difficulty)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {data.count} {data.count === 1 ? 'ćwiczenie' : 'ćwiczenia'}, {data.completions} {data.completions === 1 ? 'wykonanie' : 'wykonania'}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${(data.completions / Math.max(stats.totalCompletions, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ostatnia aktywność</CardTitle>
          <CardDescription>
            Ostatnio wykonane ćwiczenia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{activity.exerciseName}</h4>
                        <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                      <Badge className={getCategoryColor(activity.category)}>
                        {getCategoryLabel(activity.category)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">{activity.duration} min</span>
                      </div>
                      {activity.rating && (
                        <div className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">Ocena: {activity.rating}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Brak aktywności. Wykonaj ćwiczenie, aby zobaczyć historię.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
