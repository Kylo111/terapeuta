'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { getProfiles, Profile } from '@/lib/api/profilesApi';
import { getSessions } from '@/lib/api/sessionsApi';
import { getTasks } from '@/lib/api/tasksApi';
import { generateProgressReport, generateTasksReport, generateSentimentReport, Report } from '@/lib/api/reportsApi';
import { toast } from 'react-toastify';
import { formatDate } from '@/lib/utils';
import EmotionalStateChart from '@/components/charts/EmotionalStateChart';
import TaskCompletionChart from '@/components/charts/TaskCompletionChart';
import TherapyMethodsChart from '@/components/charts/TherapyMethodsChart';
import TopicsFrequencyChart from '@/components/charts/TopicsFrequencyChart';
import SentimentAnalysisChart from '@/components/charts/SentimentAnalysisChart';
import Link from 'next/link';

export default function ProgressDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 dni wstecz
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [progressReport, setProgressReport] = useState<Report | null>(null);
  const [tasksReport, setTasksReport] = useState<Report | null>(null);
  const [sentimentReport, setSentimentReport] = useState<Report | null>(null);
  
  const [emotionalData, setEmotionalData] = useState<any[]>([]);
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([]);
  const [therapyMethodsData, setTherapyMethodsData] = useState<any[]>([]);
  const [topicsFrequencyData, setTopicsFrequencyData] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const profilesData = await getProfiles();
      setProfiles(profilesData);
      
      if (profilesData.length > 0) {
        setSelectedProfileId(profilesData[0]._id);
      }
      
      setError(null);
    } catch (err) {
      console.error('Błąd pobierania profili:', err);
      setError('Nie udało się pobrać profili');
      toast.error('Nie udało się pobrać profili');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReports = async () => {
    if (!selectedProfileId) {
      toast.error('Wybierz profil');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      const options = {
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined
      };
      
      // Generowanie raportów równolegle
      const [progressReportData, tasksReportData, sentimentReportData] = await Promise.all([
        generateProgressReport(selectedProfileId, options),
        generateTasksReport(selectedProfileId, options),
        generateSentimentReport(selectedProfileId, options)
      ]);
      
      setProgressReport(progressReportData);
      setTasksReport(tasksReportData);
      setSentimentReport(sentimentReportData);
      
      // Przygotowanie danych dla wykresów
      prepareChartData(progressReportData, tasksReportData, sentimentReportData);
      
      toast.success('Raporty zostały wygenerowane');
    } catch (err) {
      console.error('Błąd generowania raportów:', err);
      setError('Nie udało się wygenerować raportów');
      toast.error('Nie udało się wygenerować raportów');
    } finally {
      setIsGenerating(false);
    }
  };

  const prepareChartData = (progressReport: Report, tasksReport: Report, sentimentReport: Report) => {
    // Dane dla wykresu stanu emocjonalnego
    if (progressReport?.data?.progress?.emotionalStateChanges) {
      const emotionalStateData = progressReport.data.progress.emotionalStateChanges.map(item => ({
        date: item.date,
        anxiety: item.anxiety,
        depression: item.depression,
        optimism: item.optimism
      }));
      setEmotionalData(emotionalStateData);
    }
    
    // Dane dla wykresu ukończenia zadań
    if (tasksReport?.data?.tasks?.tasksByCategory) {
      const taskCategoryData = tasksReport.data.tasks.tasksByCategory.map(item => ({
        category: item.category,
        completed: item.completedCount,
        incomplete: item.count - item.completedCount,
        pending: 0 // Brak danych o oczekujących zadaniach w podziale na kategorie
      }));
      setTaskCompletionData(taskCategoryData);
    }
    
    // Dane dla wykresu metod terapii
    if (progressReport?.data?.progress?.therapyMethods) {
      const therapyMethodsData = progressReport.data.progress.therapyMethods.map(item => ({
        method: item.method,
        effectiveness: item.effectiveness,
        count: item.count
      }));
      setTherapyMethodsData(therapyMethodsData);
    }
    
    // Dane dla wykresu częstotliwości tematów
    if (progressReport?.data?.progress?.keyTopicsFrequency) {
      const topicsData = progressReport.data.progress.keyTopicsFrequency.map(item => ({
        topic: item.topic,
        count: item.count
      }));
      setTopicsFrequencyData(topicsData);
    }
    
    // Dane dla wykresu analizy sentymentu
    if (sentimentReport?.data?.emotional?.moodChanges) {
      const sentimentData = sentimentReport.data.emotional.moodChanges.map(item => ({
        date: item.date,
        sentiment: (item.mood / 5) - 1, // Konwersja z zakresu 0..10 do -1..1
        source: item.notes
      }));
      setSentimentData(sentimentData);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard postępu</CardTitle>
          <CardDescription>
            Monitoruj swój postęp w terapii
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Profil</label>
              <Select
                value={selectedProfileId}
                onValueChange={setSelectedProfileId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz profil" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile._id} value={profile._id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data początkowa</label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                placeholder="Wybierz datę początkową"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data końcowa</label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                placeholder="Wybierz datę końcową"
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <Button onClick={handleGenerateReports} disabled={isGenerating || !selectedProfileId}>
              {isGenerating ? 'Generowanie...' : 'Generuj raporty'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(progressReport || tasksReport || sentimentReport) && (
        <Tabs defaultValue="emotional" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="emotional">Stan emocjonalny</TabsTrigger>
            <TabsTrigger value="tasks">Zadania</TabsTrigger>
            <TabsTrigger value="therapy">Metody terapii</TabsTrigger>
            <TabsTrigger value="sentiment">Analiza sentymentu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emotional" className="space-y-6">
            <EmotionalStateChart 
              data={emotionalData} 
              title="Zmiany stanu emocjonalnego"
              description={`Okres: ${formatDate(startDate)} - ${formatDate(endDate)}`}
              height={400}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ogólny postęp</CardTitle>
                  <CardDescription>
                    Podsumowanie postępu w terapii
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progressReport?.data?.progress?.overallProgress !== undefined ? (
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold mb-2">
                        {progressReport.data.progress.overallProgress.toFixed(1)}/10
                      </div>
                      <p className="text-gray-500">
                        {progressReport.data.progress.overallProgress < 3 ? 'Niewielki postęp' : 
                         progressReport.data.progress.overallProgress < 7 ? 'Umiarkowany postęp' : 
                         'Znaczący postęp'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">Brak danych o ogólnym postępie</p>
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
                  {progressReport?.data?.progress?.recommendations && 
                   progressReport.data.progress.recommendations.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {progressReport.data.progress.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Brak rekomendacji</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6">
            <TaskCompletionChart 
              data={taskCompletionData} 
              title="Ukończenie zadań według kategorii"
              description={`Okres: ${formatDate(startDate)} - ${formatDate(endDate)}`}
              height={400}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ukończone zadania</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksReport?.data?.tasks?.completedTasks !== undefined ? (
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold mb-2 text-green-600">
                        {tasksReport.data.tasks.completedTasks}
                      </div>
                      <p className="text-gray-500">
                        z {tasksReport.data.tasks.totalTasks} zadań
                      </p>
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">Brak danych o ukończonych zadaniach</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Wskaźnik ukończenia</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksReport?.data?.tasks?.completionRate !== undefined ? (
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold mb-2">
                        {tasksReport.data.tasks.completionRate.toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full"
                          style={{ width: `${tasksReport.data.tasks.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">Brak danych o wskaźniku ukończenia</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Średnia ocena sukcesu</CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksReport?.data?.tasks?.averageSuccessRating !== undefined ? (
                    <div className="text-center py-6">
                      <div className="text-5xl font-bold mb-2">
                        {tasksReport.data.tasks.averageSuccessRating.toFixed(1)}/10
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                        <div
                          className="bg-primary-500 h-2.5 rounded-full"
                          style={{ width: `${(tasksReport.data.tasks.averageSuccessRating / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">Brak danych o średniej ocenie sukcesu</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="therapy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TherapyMethodsChart 
                data={therapyMethodsData} 
                title="Efektywność metod terapeutycznych"
                description={`Okres: ${formatDate(startDate)} - ${formatDate(endDate)}`}
                height={400}
              />
              
              <TopicsFrequencyChart 
                data={topicsFrequencyData} 
                title="Najczęściej omawiane tematy"
                description={`Okres: ${formatDate(startDate)} - ${formatDate(endDate)}`}
                height={400}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Statystyki sesji</CardTitle>
                <CardDescription>
                  Podsumowanie sesji terapeutycznych
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Liczba sesji</h3>
                    <p className="text-3xl font-bold">
                      {progressReport?.data?.progress?.sessionsCount || 0}
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Łączny czas</h3>
                    <p className="text-3xl font-bold">
                      {progressReport?.data?.progress?.totalDuration 
                        ? Math.round(progressReport.data.progress.totalDuration / 60) 
                        : 0} min
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Średni czas sesji</h3>
                    <p className="text-3xl font-bold">
                      {progressReport?.data?.progress?.sessionsCount && progressReport.data.progress.totalDuration
                        ? Math.round(progressReport.data.progress.totalDuration / progressReport.data.progress.sessionsCount / 60)
                        : 0} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sentiment" className="space-y-6">
            <SentimentAnalysisChart 
              data={sentimentData} 
              title="Analiza sentymentu"
              description={`Okres: ${formatDate(startDate)} - ${formatDate(endDate)}`}
              height={400}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Najczęstsze pozytywne słowa</CardTitle>
                  <CardDescription>
                    Słowa o pozytywnym wydźwięku używane najczęściej
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sentimentReport?.data?.emotional?.sentimentAnalysis?.positiveWords && 
                   sentimentReport.data.emotional.sentimentAnalysis.positiveWords.length > 0 ? (
                    <div className="space-y-3">
                      {sentimentReport.data.emotional.sentimentAnalysis.positiveWords.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-green-500 h-2.5 rounded-full"
                              style={{ width: `${Math.min((item.count / Math.max(...sentimentReport.data.emotional.sentimentAnalysis.positiveWords.map(w => w.count))) * 100, 100)}%` }}
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
                  {sentimentReport?.data?.emotional?.sentimentAnalysis?.negativeWords && 
                   sentimentReport.data.emotional.sentimentAnalysis.negativeWords.length > 0 ? (
                    <div className="space-y-3">
                      {sentimentReport.data.emotional.sentimentAnalysis.negativeWords.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-red-500 h-2.5 rounded-full"
                              style={{ width: `${Math.min((item.count / Math.max(...sentimentReport.data.emotional.sentimentAnalysis.negativeWords.map(w => w.count))) * 100, 100)}%` }}
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
                <CardTitle>Ogólny sentyment</CardTitle>
                <CardDescription>
                  Średni sentyment w analizowanym okresie
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sentimentReport?.data?.emotional?.sentimentAnalysis?.overallSentiment !== undefined ? (
                  <div className="text-center py-6">
                    <div className="text-5xl font-bold mb-2">
                      {sentimentReport.data.emotional.sentimentAnalysis.overallSentiment.toFixed(2)}
                    </div>
                    <p className="text-gray-500 mb-4">
                      {sentimentReport.data.emotional.sentimentAnalysis.overallSentiment > 0.5 ? 'Bardzo pozytywny' : 
                       sentimentReport.data.emotional.sentimentAnalysis.overallSentiment > 0.25 ? 'Pozytywny' : 
                       sentimentReport.data.emotional.sentimentAnalysis.overallSentiment > -0.25 ? 'Neutralny' : 
                       sentimentReport.data.emotional.sentimentAnalysis.overallSentiment > -0.5 ? 'Negatywny' : 
                       'Bardzo negatywny'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          sentimentReport.data.emotional.sentimentAnalysis.overallSentiment > 0 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${Math.abs(sentimentReport.data.emotional.sentimentAnalysis.overallSentiment) * 50 + 50}%`,
                          marginLeft: sentimentReport.data.emotional.sentimentAnalysis.overallSentiment < 0 
                            ? '0' 
                            : `${50 - sentimentReport.data.emotional.sentimentAnalysis.overallSentiment * 50}%`
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
          </TabsContent>
        </Tabs>
      )}
      
      <div className="flex justify-center mt-6">
        <Link href="/reports">
          <Button variant="outline">Przejdź do raportów</Button>
        </Link>
      </div>
    </div>
  );
}
