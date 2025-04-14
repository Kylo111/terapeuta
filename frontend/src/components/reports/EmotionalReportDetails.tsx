'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Report } from '@/lib/api/reportsApi';
import { formatDate } from '@/lib/utils';
import SentimentAnalysisChart from '@/components/charts/SentimentAnalysisChart';

interface EmotionalReportDetailsProps {
  report: Report;
}

export default function EmotionalReportDetails({ report }: EmotionalReportDetailsProps) {
  const emotional = report.data.emotional;
  
  if (!emotional) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-gray-500">Brak danych emocjonalnych w raporcie.</p>
        </CardContent>
      </Card>
    );
  }

  // Przygotowanie danych dla wykresu sentymentu
  const sentimentData = emotional.moodChanges.map(item => ({
    date: item.date,
    sentiment: (item.mood / 5) - 1, // Konwersja z zakresu 0..10 do -1..1
    source: item.notes
  }));

  // Funkcja do interpretacji sentymentu
  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.5) return 'Bardzo pozytywny';
    if (sentiment > 0.25) return 'Pozytywny';
    if (sentiment > -0.25) return 'Neutralny';
    if (sentiment > -0.5) return 'Negatywny';
    return 'Bardzo negatywny';
  };

  // Funkcja do określania klasy CSS na podstawie sentymentu
  const getSentimentClass = (sentiment: number) => {
    if (sentiment > 0.25) return 'text-green-600';
    if (sentiment > -0.25) return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <SentimentAnalysisChart 
        data={sentimentData} 
        title="Analiza sentymentu"
        description="Zmiany sentymentu w czasie"
        height={400}
      />

      <Card>
        <CardHeader>
          <CardTitle>Ogólny sentyment</CardTitle>
          <CardDescription>
            Średni sentyment w analizowanym okresie
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emotional.sentimentAnalysis?.overallSentiment !== undefined ? (
            <div className="text-center py-6">
              <div className={`text-5xl font-bold mb-2 ${getSentimentClass(emotional.sentimentAnalysis.overallSentiment)}`}>
                {emotional.sentimentAnalysis.overallSentiment.toFixed(2)}
              </div>
              <p className="text-gray-500 mb-4">
                {getSentimentLabel(emotional.sentimentAnalysis.overallSentiment)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    emotional.sentimentAnalysis.overallSentiment > 0 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.abs(emotional.sentimentAnalysis.overallSentiment) * 50 + 50}%`,
                    marginLeft: emotional.sentimentAnalysis.overallSentiment < 0 
                      ? '0' 
                      : `${50 - emotional.sentimentAnalysis.overallSentiment * 50}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Negatywny (-1)</span>
                <span className="text-xs text-gray-500">Neutralny (0)</span>
                <span className="text-xs text-gray-500">Pozytywny (1)</span>
              </div>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">Brak danych o ogólnym sentymencie</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Najczęstsze pozytywne słowa</CardTitle>
            <CardDescription>
              Słowa o pozytywnym wydźwięku używane najczęściej
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emotional.sentimentAnalysis?.positiveWords && 
             emotional.sentimentAnalysis.positiveWords.length > 0 ? (
              <div className="space-y-3">
                {emotional.sentimentAnalysis.positiveWords.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min((item.count / Math.max(...emotional.sentimentAnalysis.positiveWords.map(w => w.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm">{item.word}</span>
                      <span className="text-xs text-gray-500 ml-2">{item.count} {item.count === 1 ? 'raz' : 'razy'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o pozytywnych słowach</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Najczęstsze negatywne słowa</CardTitle>
            <CardDescription>
              Słowa o negatywnym wydźwięku używane najczęściej
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emotional.sentimentAnalysis?.negativeWords && 
             emotional.sentimentAnalysis.negativeWords.length > 0 ? (
              <div className="space-y-3">
                {emotional.sentimentAnalysis.negativeWords.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min((item.count / Math.max(...emotional.sentimentAnalysis.negativeWords.map(w => w.count))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm">{item.word}</span>
                      <span className="text-xs text-gray-500 ml-2">{item.count} {item.count === 1 ? 'raz' : 'razy'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Brak danych o negatywnych słowach</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zmiany nastroju</CardTitle>
          <CardDescription>
            Historia zmian nastroju w czasie
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emotional.moodChanges && emotional.moodChanges.length > 0 ? (
            <div className="space-y-4">
              {emotional.moodChanges.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{formatDate(item.date)}</h3>
                      {item.notes && <p className="text-sm text-gray-500">{item.notes}</p>}
                    </div>
                    <div className={`text-sm font-medium ${getSentimentClass((item.mood / 5) - 1)}`}>
                      {item.mood.toFixed(1)}/10
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${item.mood > 5 ? 'bg-green-500' : item.mood > 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${(item.mood / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o zmianach nastroju</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
