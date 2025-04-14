'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Report } from '@/lib/api/reportsApi';
import Link from 'next/link';

interface TasksReportDetailsProps {
  report: Report;
}

export default function TasksReportDetails({ report }: TasksReportDetailsProps) {
  const tasks = report.data.tasks;
  
  if (!tasks) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500">Brak danych zadań w raporcie.</p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'behavioral':
        return 'Behawioralne';
      case 'cognitive':
        return 'Poznawcze';
      case 'emotional':
        return 'Emocjonalne';
      case 'mindfulness':
        return 'Uważność';
      case 'relaxation':
        return 'Relaksacja';
      case 'social':
        return 'Społeczne';
      case 'other':
        return 'Inne';
      default:
        return category;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Wysoki';
      case 'medium':
        return 'Średni';
      case 'low':
        return 'Niski';
      default:
        return priority;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie zadań</CardTitle>
          <CardDescription>
            Ogólne informacje o zadaniach terapeutycznych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Wszystkie zadania</h3>
              <p className="text-3xl font-bold">{tasks.totalTasks}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Ukończone</h3>
              <p className="text-3xl font-bold text-green-600">{tasks.completedTasks}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Nieukończone</h3>
              <p className="text-3xl font-bold text-red-600">{tasks.incompleteTasks}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Oczekujące</h3>
              <p className="text-3xl font-bold text-yellow-600">{tasks.pendingTasks}</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Wskaźnik ukończenia</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${tasks.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{tasks.completionRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Średnia ocena sukcesu</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-primary-500 h-2.5 rounded-full"
                    style={{ width: `${(tasks.averageSuccessRating / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{tasks.averageSuccessRating.toFixed(1)}/10</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Zadania według kategorii</CardTitle>
            <CardDescription>
              Podział zadań na kategorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.tasksByCategory && tasks.tasksByCategory.length > 0 ? (
              <div className="space-y-4">
                {tasks.tasksByCategory.map((category, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">{getCategoryLabel(category.category)}</h3>
                      <span className="text-sm text-gray-500">
                        {category.completedCount}/{category.count} ({category.completionRate.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full"
                          style={{ width: `${category.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o kategoriach zadań.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zadania według priorytetu</CardTitle>
            <CardDescription>
              Podział zadań według priorytetu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.tasksByPriority && tasks.tasksByPriority.length > 0 ? (
              <div className="space-y-4">
                {tasks.tasksByPriority.map((priority, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-medium ${getPriorityClass(priority.priority)}`}>
                        {getPriorityLabel(priority.priority)}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {priority.completedCount}/{priority.count} ({priority.completionRate.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full"
                          style={{ width: `${priority.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o priorytetach zadań.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Najbardziej wymagające zadania</CardTitle>
            <CardDescription>
              Zadania, które sprawiły najwięcej trudności
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.mostChallengingTasks && tasks.mostChallengingTasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.mostChallengingTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.description}</h3>
                      <span className="text-sm text-red-600 font-medium ml-2">
                        {task.successRating}/10
                      </span>
                    </div>
                    {task.challenges && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1">Wyzwania:</h4>
                        <p className="text-sm">{task.challenges}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <Link href={`/tasks/${task.taskId}`}>
                        <span className="text-xs text-primary-600 hover:underline">
                          Zobacz szczegóły zadania
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o wymagających zadaniach.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Najbardziej udane zadania</CardTitle>
            <CardDescription>
              Zadania, które przyniosły najlepsze efekty
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.mostSuccessfulTasks && tasks.mostSuccessfulTasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.mostSuccessfulTasks.map((task, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.description}</h3>
                      <span className="text-sm text-green-600 font-medium ml-2">
                        {task.successRating}/10
                      </span>
                    </div>
                    {task.reflections && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-1">Refleksje:</h4>
                        <p className="text-sm">{task.reflections}</p>
                      </div>
                    )}
                    <div className="mt-2">
                      <Link href={`/tasks/${task.taskId}`}>
                        <span className="text-xs text-primary-600 hover:underline">
                          Zobacz szczegóły zadania
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o udanych zadaniach.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
