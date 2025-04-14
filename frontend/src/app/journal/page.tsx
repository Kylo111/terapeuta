'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import MainLayout from '@/components/layout/MainLayout';
import JournalEntryList from '@/components/journal/JournalEntryList';
import { getJournalStats } from '@/lib/api/journalApi';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState('entries');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const statsData = await getJournalStats();
      setStats(statsData);
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk:', error);
      toast.error('Nie udało się pobrać statystyk dziennika');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];

  const renderEmotionalProgress = () => {
    if (!stats || !stats.emotionalProgress || stats.emotionalProgress.length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          Brak danych o zmianach emocjonalnych.
        </div>
      );
    }

    // Przygotowanie danych dla wykresu
    const emotions = Object.keys(stats.emotionsStats);
    const data = stats.emotionalProgress.map((entry: any) => {
      const result: any = { date: entry.date };
      for (const emotion in entry.emotions) {
        result[emotion] = entry.emotions[emotion];
      }
      return result;
    });

    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            {emotions.slice(0, 5).map((emotion, index) => (
              <Line
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderEmotionsStats = () => {
    if (!stats || !stats.emotionsStats || Object.keys(stats.emotionsStats).length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          Brak danych o emocjach.
        </div>
      );
    }

    // Przygotowanie danych dla wykresu
    const data = Object.entries(stats.emotionsStats).map(([name, data]: [string, any]) => ({
      name,
      value: data.count,
      averageIntensity: data.averageIntensity
    }));

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} wystąpień`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {data.map((emotion, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded-md">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="font-medium">{emotion.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {emotion.value} {emotion.value === 1 ? 'wystąpienie' : 'wystąpień'}, 
                średnia intensywność: {emotion.averageIntensity.toFixed(1)}/10
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDistortionsStats = () => {
    if (!stats || !stats.distortionsStats || Object.keys(stats.distortionsStats).length === 0) {
      return (
        <div className="text-center py-6 text-gray-500">
          Brak danych o zniekształceniach poznawczych.
        </div>
      );
    }

    // Przygotowanie danych dla wykresu
    const data = Object.entries(stats.distortionsStats)
      .map(([name, count]: [string, any]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return (
      <div className="space-y-3">
        {data.map((distortion, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-medium">{distortion.name}</span>
              <span className="text-sm text-gray-500">
                {distortion.count} {distortion.count === 1 ? 'wystąpienie' : 'wystąpień'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-500 h-2.5 rounded-full"
                style={{ width: `${(distortion.count / Math.max(...data.map(d => d.count))) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dziennik myśli i emocji</h1>
            <p className="text-gray-600 mt-2">
              Monitoruj swoje myśli, emocje i zniekształcenia poznawcze, aby lepiej zrozumieć swoje wzorce myślenia.
            </p>
          </div>
          <Link href="/journal/new">
            <Button>
              Dodaj nowy wpis
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="entries">Wpisy</TabsTrigger>
            <TabsTrigger value="stats">Statystyki</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entries">
            <JournalEntryList />
          </TabsContent>
          
          <TabsContent value="stats">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <span className="ml-2">Ładowanie statystyk...</span>
              </div>
            ) : stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Liczba wpisów</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.totalEntries}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Liczba emocji</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{Object.keys(stats.emotionsStats).length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500">Zniekształcenia poznawcze</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{Object.keys(stats.distortionsStats).length}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Zmiany emocjonalne w czasie</CardTitle>
                    <CardDescription>
                      Wykres intensywności emocji w czasie
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderEmotionalProgress()}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statystyki emocji</CardTitle>
                      <CardDescription>
                        Częstotliwość i intensywność emocji
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderEmotionsStats()}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Zniekształcenia poznawcze</CardTitle>
                      <CardDescription>
                        Najczęstsze zniekształcenia poznawcze
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderDistortionsStats()}
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Popularne tagi</CardTitle>
                    <CardDescription>
                      Najczęściej używane tagi w dzienniku
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.commonTags && stats.commonTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {stats.commonTags.map((tag: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {tag.tag} ({tag.count})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        Brak tagów.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Nie udało się załadować statystyk.</p>
                <Button onClick={fetchStats} className="mt-4">
                  Spróbuj ponownie
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
