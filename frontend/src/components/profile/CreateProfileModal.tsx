'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const profileSchema = z.object({
  name: z.string().min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki'),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Wiek musi być liczbą większą od 0',
  }),
  gender: z.string().min(1, 'Wybierz płeć'),
  goals: z.string().min(5, 'Cele muszą mieć co najmniej 5 znaków'),
  challenges: z.string().min(5, 'Wyzwania muszą mieć co najmniej 5 znaków'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      age: '',
      gender: '',
      goals: '',
      challenges: '',
    },
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Przekształcenie danych przed wysłaniem
      const formattedData = {
        name: data.name,
        age: parseInt(data.age),
        gender: data.gender,
        goals: data.goals.split('\n').filter(goal => goal.trim() !== ''),
        challenges: data.challenges.split('\n').filter(challenge => challenge.trim() !== ''),
      };
      
      onSubmit(formattedData);
      reset();
    } catch (error) {
      console.error('Błąd tworzenia profilu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Utwórz nowy profil</h2>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Imię i nazwisko"
            {...register('name')}
            error={errors.name?.message}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Wiek"
              type="number"
              {...register('age')}
              error={errors.age?.message}
            />
            
            <Select
              label="Płeć"
              {...register('gender')}
              error={errors.gender?.message}
              options={[
                { value: '', label: 'Wybierz płeć' },
                { value: 'male', label: 'Mężczyzna' },
                { value: 'female', label: 'Kobieta' },
                { value: 'other', label: 'Inna' },
              ]}
            />
          </div>
          
          <Textarea
            label="Cele terapeutyczne (każdy cel w nowej linii)"
            {...register('goals')}
            error={errors.goals?.message}
            placeholder="np. Redukcja stresu&#10;Poprawa relacji&#10;Zwiększenie pewności siebie"
          />
          
          <Textarea
            label="Wyzwania (każde wyzwanie w nowej linii)"
            {...register('challenges')}
            error={errors.challenges?.message}
            placeholder="np. Problemy ze snem&#10;Konflikty w pracy&#10;Trudności w podejmowaniu decyzji"
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Tworzenie...' : 'Utwórz profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfileModal;
