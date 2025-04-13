'use client';

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { getTherapyMethods, TherapyMethod } from '@/lib/api/therapyApi';
import TherapyMethodSettings from '@/components/settings/TherapyMethodSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SettingsPage() {
  const [therapyMethods, setTherapyMethods] = useState<TherapyMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapyMethods = async () => {
      try {
        const methods = await getTherapyMethods();
        setTherapyMethods(methods);
      } catch (err) {
        setError('Błąd pobierania metod terapii');
        console.error('Błąd pobierania metod terapii:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapyMethods();
  }, []);

  // Funkcja do odświeżania danych
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const methods = await getTherapyMethods();
      setTherapyMethods(methods);
      setError(null);
    } catch (err) {
      setError('Błąd pobierania metod terapii');
      console.error('Błąd pobierania metod terapii:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = {
    'Metody terapii': {
      description: 'Zarządzaj promptami dla różnych metod terapii',
      content: (
        <div>
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2">Ładowanie metod terapii...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
                {therapyMethods.map((method) => (
                  <Tab
                    key={method._id}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white shadow text-primary-700'
                          : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                      )
                    }
                  >
                    {method.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {therapyMethods.map((method) => (
                  <Tab.Panel
                    key={method._id}
                    className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                  >
                    <TherapyMethodSettings method={method} />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          )}
        </div>
      ),
    },
    'Ustawienia użytkownika': {
      description: 'Zarządzaj swoimi ustawieniami',
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Ustawienia użytkownika</CardTitle>
            <CardDescription>Zarządzaj swoimi ustawieniami</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
          </CardContent>
        </Card>
      ),
    },
    'Ustawienia aplikacji': {
      description: 'Zarządzaj ustawieniami aplikacji',
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Ustawienia aplikacji</CardTitle>
            <CardDescription>Zarządzaj ustawieniami aplikacji</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ta funkcjonalność będzie dostępna wkrótce.</p>
          </CardContent>
        </Card>
      ),
    },
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Ustawienia</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1 mb-8">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-primary-700'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((category, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <div className="mb-4">
                <p className="text-gray-500">{category.description}</p>
              </div>
              {category.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
