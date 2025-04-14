'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { toast } from 'react-toastify';
import { getNotificationSettings, updateNotificationSettings, NotificationSettings as NotificationSettingsType } from '@/lib/api/remindersApi';

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email: true,
    push: false,
    sms: false,
    taskReminders: true,
    sessionReminders: true,
    deadlineReminders: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Błąd podczas pobierania ustawień powiadomień:', error);
      toast.error('Nie udało się pobrać ustawień powiadomień');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateNotificationSettings(settings);
      toast.success('Ustawienia powiadomień zostały zapisane');
    } catch (error) {
      console.error('Błąd podczas zapisywania ustawień powiadomień:', error);
      toast.error('Nie udało się zapisać ustawień powiadomień');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettingsType) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <span className="ml-2">Ładowanie ustawień powiadomień...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ustawienia powiadomień</CardTitle>
        <CardDescription>
          Zarządzaj sposobem otrzymywania powiadomień z aplikacji
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Kanały powiadomień</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wybierz, w jaki sposób chcesz otrzymywać powiadomienia
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Powiadomienia e-mail</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj powiadomienia na swój adres e-mail
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email}
                  onCheckedChange={() => handleToggle('email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Powiadomienia push</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj powiadomienia push w przeglądarce
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push}
                  onCheckedChange={() => handleToggle('push')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">Powiadomienia SMS</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj powiadomienia SMS na swój numer telefonu
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.sms}
                  onCheckedChange={() => handleToggle('sms')}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium">Typy powiadomień</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Wybierz, o jakich wydarzeniach chcesz być powiadamiany
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="task-reminders">Przypomnienia o zadaniach</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj przypomnienia o zadaniach terapeutycznych
                  </p>
                </div>
                <Switch
                  id="task-reminders"
                  checked={settings.taskReminders}
                  onCheckedChange={() => handleToggle('taskReminders')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-reminders">Przypomnienia o sesjach</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj przypomnienia o nadchodzących sesjach terapeutycznych
                  </p>
                </div>
                <Switch
                  id="session-reminders"
                  checked={settings.sessionReminders}
                  onCheckedChange={() => handleToggle('sessionReminders')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deadline-reminders">Przypomnienia o terminach</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Otrzymuj przypomnienia o zbliżających się terminach zadań
                  </p>
                </div>
                <Switch
                  id="deadline-reminders"
                  checked={settings.deadlineReminders}
                  onCheckedChange={() => handleToggle('deadlineReminders')}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Zapisywanie...' : 'Zapisz ustawienia'}
        </Button>
      </CardFooter>
    </Card>
  );
}
