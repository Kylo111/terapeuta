'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Report } from '@/lib/api/reportsApi';

interface ProgressReportDetailsProps {
  report: Report;
}

export default function ProgressReportDetails({ report }: ProgressReportDetailsProps) {
  const progress = report.data.progress;
  
  if (!progress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500">Brak danych postępu w raporcie.</p>
        </CardContent>
      </Card>
    );
  }

  const getTherapyMethodLabel = (method: string) => {
    switch (method) {
      case 'cognitive_behavioral':
        return 'Terapia poznawczo-behawioralna';
      case 'psychodynamic':
        return 'Terapia psychodynamiczna';
      case 'humanistic':
        return 'Terapia humanistyczna';
      case 'systemic':
        return 'Terapia systemowa';
      case 'solution_focused':
        return 'Terapia skoncentrowana na rozwiązaniach';
      default:
        return method;
    }
  };

  const getProgressLabel = (value: number) => {
    if (value < 3) return 'Niewielki';
    if (value < 7) return 'Umiarkowany';
    return 'Znaczący';
  };

  const getProgressClass = (value: number) => {
    if (value < 3) return 'text-yellow-600';
    if (value < 7) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie postępu</CardTitle>
          <CardDescription>
            Ogólne informacje o postępie w terapii
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Liczba sesji</h3>
              <p className="text-3xl font-bold">{progress.sessionsCount}</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Łączny czas</h3>
              <p className="text-3xl font-bold">{Math.round(progress.totalDuration / 60)} min</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Ogólny postęp</h3>
              <p className={`text-3xl font-bold ${getProgressClass(progress.overallProgress)}`}>
                {progress.overallProgress.toFixed(1)}/10
              </p>
              <p className="text-sm mt-1">{getProgressLabel(progress.overallProgress)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metody terapii</CardTitle>
          <CardDescription>
            Efektywność różnych metod terapeutycznych
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress.therapyMethods && progress.therapyMethods.length > 0 ? (
            <div className="space-y-4">
              {progress.therapyMethods.map((method, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{getTherapyMethodLabel(method.method)}</h3>
                    <span className="text-sm text-gray-500">Liczba sesji: {method.count}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-primary-500 h-2.5 rounded-full"
                        style={{ width: `${(method.effectiveness / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{method.effectiveness.toFixed(1)}/10</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o metodach terapii.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kluczowe tematy</CardTitle>
          <CardDescription>
            Najczęściej omawiane tematy podczas sesji
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress.keyTopicsFrequency && progress.keyTopicsFrequency.length > 0 ? (
            <div className="space-y-3">
              {progress.keyTopicsFrequency.map((topic, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${Math.min((topic.count / Math.max(...progress.keyTopicsFrequency.map(t => t.count))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm">{topic.topic}</span>
                    <span className="text-xs text-gray-500 ml-2">{topic.count} {topic.count === 1 ? 'raz' : 'razy'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o kluczowych tematach.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rekomendacje</CardTitle>
          <CardDescription>
            Zalecenia na podstawie analizy postępu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progress.recommendations && progress.recommendations.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {progress.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Brak rekomendacji.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
