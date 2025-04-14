'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { createReminder, ReminderInput } from '@/lib/api/notificationsApi';
import { toast } from 'react-toastify';
import { ArrowLeft, Bell } from 'lucide-react';

export default function CreateReminderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<ReminderInput>>({
    title: '',
    message: '',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Domyślnie jutro
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      scheduledFor: date ? date.toISOString() : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!formData.title?.trim()) {
      toast.error('Tytuł przypomnienia jest wymagany');
      return;
    }
    
    if (!formData.message?.trim()) {
      toast.error('Treść przypomnienia jest wymagana');
      return;
    }
    
    if (!formData.scheduledFor) {
      toast.error('Data przypomnienia jest wymagana');
      return;
    }
    
    // Sprawdź, czy data jest w przyszłości
    if (new Date(formData.scheduledFor) <= new Date()) {
      toast.error('Data przypomnienia musi być w przyszłości');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const reminderData: ReminderInput = {
        title: formData.title!.trim(),
        message: formData.message!.trim(),
        scheduledFor: formData.scheduledFor!,
        action: formData.action?.trim()
      };
      
      await createReminder(reminderData);
      
      toast.success('Przypomnienie zostało utworzone');
      router.push('/notifications');
    } catch (error) {
      console.error('Błąd podczas tworzenia przypomnienia:', error);
      toast.error('Nie udało się utworzyć przypomnienia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/notifications">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nowe przypomnienie</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Utwórz przypomnienie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł przypomnienia *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  placeholder="Np. Spotkanie z terapeutą"
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Treść przypomnienia *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message || ''}
                  onChange={handleChange}
                  placeholder="Np. Pamiętaj o spotkaniu z terapeutą"
                  required
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="scheduledFor">Data i czas przypomnienia *</Label>
                <DateTimePicker
                  date={formData.scheduledFor ? new Date(formData.scheduledFor) : undefined}
                  setDate={handleDateChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="action">Akcja (opcjonalnie)</Label>
                <Input
                  id="action"
                  name="action"
                  value={formData.action || ''}
                  onChange={handleChange}
                  placeholder="Np. /sessions/123"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ścieżka URL, do której użytkownik zostanie przekierowany po kliknięciu powiadomienia.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/notifications')}
                disabled={isSubmitting}
              >
                Anuluj
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Tworzenie...' : 'Utwórz przypomnienie'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}
