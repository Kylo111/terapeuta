'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Report } from '@/lib/api/reportsApi';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SessionReportDetailsProps {
  report: Report;
}

export default function SessionReportDetails({ report }: SessionReportDetailsProps) {
  const session = report.data.session;
  
  if (!session) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500">Brak danych sesji w raporcie.</p>
        </CardContent>
      </Card>
    );
  }

  const getEmotionalStateChange = (start: number, end: number) => {
    const diff = end - start;
    if (diff > 0) return `Wzrost o ${diff.toFixed(1)}`;
    if (diff < 0) return `Spadek o ${Math.abs(diff).toFixed(1)}`;
    return 'Bez zmian';
  };

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informacje o sesji</CardTitle>
          <CardDescription>
            Szczegóły sesji terapeutycznej
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data sesji</h3>
              <p>{formatDateTime(session.startTime)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Czas trwania</h3>
              <p>{session.duration ? `${Math.round(session.duration / 60)} minut` : 'Brak danych'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Metoda terapii</h3>
              <p>{getTherapyMethodLabel(session.therapyMethod)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ocena efektywności</h3>
              <p>{session.sessionEffectivenessRating ? `${session.sessionEffectivenessRating}/10` : 'Brak oceny'}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Link href={`/sessions/${session.sessionId}`}>
              <Button variant="outline">
                Zobacz szczegóły sesji
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stan emocjonalny</CardTitle>
          <CardDescription>
            Zmiany stanu emocjonalnego podczas sesji
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session.emotionalStateStart && session.emotionalStateEnd ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Poziom lęku</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateStart.anxiety.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Początek</p>
                  </div>
                  <div className="text-sm">→</div>
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateEnd.anxiety.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Koniec</p>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  {getEmotionalStateChange(session.emotionalStateStart.anxiety, session.emotionalStateEnd.anxiety)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Poziom depresji</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateStart.depression.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Początek</p>
                  </div>
                  <div className="text-sm">→</div>
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateEnd.depression.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Koniec</p>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  {getEmotionalStateChange(session.emotionalStateStart.depression, session.emotionalStateEnd.depression)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Poziom optymizmu</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateStart.optimism.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Początek</p>
                  </div>
                  <div className="text-sm">→</div>
                  <div>
                    <p className="text-lg font-semibold">{session.emotionalStateEnd.optimism.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Koniec</p>
                  </div>
                </div>
                <p className="text-sm mt-2">
                  {getEmotionalStateChange(session.emotionalStateStart.optimism, session.emotionalStateEnd.optimism)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o stanie emocjonalnym.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kluczowe tematy</CardTitle>
          <CardDescription>
            Główne tematy omawiane podczas sesji
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session.keyTopics && session.keyTopics.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {session.keyTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Brak zidentyfikowanych kluczowych tematów.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
