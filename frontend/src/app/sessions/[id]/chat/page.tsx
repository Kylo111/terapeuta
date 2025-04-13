'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import MainLayout from '@/components/layout/MainLayout';
import { formatDateTime } from '@/lib/utils';
import { getSession, addMessage, endSession, addTask, Session as SessionType, SessionMessage } from '@/lib/api/sessionsApi';
import { generateTherapyResponse } from '@/lib/api/llmApi';
import { toast } from 'react-toastify';

export default function SessionChatPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<SessionType | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessionData = async () => {
    try {
      setIsLoading(true);
      const sessionId = params.id as string;

      // Pobieranie danych sesji
      const sessionData = await getSession(sessionId);
      setSession(sessionData);

      // Ustawienie wiadomości z konwersacji sesji
      if (sessionData.conversation) {
        setMessages(sessionData.conversation);
      }

      setError(null);
    } catch (err) {
      setError('Błąd pobierania danych sesji');
      console.error('Błąd pobierania danych sesji:', err);
      toast.error('Nie udało się pobrać danych sesji');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchSessionData();
    }
  }, [params.id]);

  useEffect(() => {
    // Przewijanie do najnowszej wiadomości
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getTherapyMethodLabel = (method) => {
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

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const sessionId = params.id as string;

      // Dodanie wiadomości użytkownika
      const userMessage = await addMessage(sessionId, { role: 'user', content: newMessage });
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Generowanie odpowiedzi asystenta za pomocą API LLM
      try {
        // Pobranie aktualnej sesji, aby uzyskać metodę terapeutyczną
        const currentSession = await getSession(sessionId);

        // Generowanie odpowiedzi asystenta
        const llmResponse = await generateTherapyResponse(
          sessionId,
          messages.concat(userMessage),
          currentSession.therapyMethod
        );

        // Dodanie odpowiedzi asystenta do sesji
        const assistantMessage = await addMessage(sessionId, {
          role: 'assistant',
          content: llmResponse.message.content
        });

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Błąd podczas generowania odpowiedzi asystenta:', error);
        toast.error('Nie udało się wygenerować odpowiedzi asystenta');
      } finally {
        setIsSending(false);
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      toast.error('Nie udało się wysłać wiadomości');
      setIsSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!window.confirm('Czy na pewno chcesz zakończyć sesję?')) return;

    try {
      setIsEnding(true);
      const sessionId = params.id as string;

      // Zakończenie sesji
      const endedSession = await endSession(sessionId, {
        summary: 'Sesja zakończona przez użytkownika',
        emotionalStateEnd: {
          anxiety: 5,
          depression: 5,
          optimism: 5
        },
        sessionEffectivenessRating: 7
      });

      toast.success('Sesja została zakończona');
      router.push(`/sessions/${sessionId}`);
    } catch (error) {
      console.error('Błąd podczas kończenia sesji:', error);
      toast.error('Nie udało się zakończyć sesji');
      setIsEnding(false);
    }
  };

  const handleAddTask = async () => {
    const taskTitle = window.prompt('Podaj tytuł zadania:');
    if (!taskTitle) return;

    const taskDescription = window.prompt('Podaj opis zadania:');
    if (!taskDescription) return;

    try {
      const sessionId = params.id as string;

      // Dodanie zadania
      const task = await addTask(sessionId, {
        title: taskTitle,
        description: taskDescription,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Za tydzień
      });

      toast.success('Zadanie zostało dodane');
    } catch (error) {
      console.error('Błąd podczas dodawania zadania:', error);
      toast.error('Nie udało się dodać zadania');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie sesji...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !session) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Sesja nie znaleziona</h2>
            <p className="mt-2 text-gray-600">Nie znaleziono sesji o podanym identyfikatorze.</p>
            <div className="mt-6">
              <Link href="/sessions">
                <Button>Wróć do listy sesji</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (session.isCompleted) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Sesja zakończona</h2>
            <p className="mt-2 text-gray-600">Ta sesja została już zakończona.</p>
            <div className="mt-6">
              <Link href={`/sessions/${session._id}`}>
                <Button>Zobacz szczegóły sesji</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Sesja terapeutyczna</h1>
            <p className="text-gray-600 text-sm">
              {formatDateTime(session.startTime)} | {getTherapyMethodLabel(session.therapyMethod)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleAddTask}>
              Dodaj zadanie
            </Button>
            <Button variant="destructive" onClick={handleEndSession} disabled={isEnding}>
              {isEnding ? 'Kończenie...' : 'Zakończ sesję'}
            </Button>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-0">
            <div className="h-[60vh] overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Brak wiadomości. Rozpocznij konwersację.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary-500 text-white'
                            : message.role === 'system'
                            ? 'bg-gray-300 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.timestamp && (
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full space-x-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Napisz wiadomość..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? 'Wysyłanie...' : 'Wyślij'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
