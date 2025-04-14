'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Slider } from '@/components/ui/Slider';
import { Input } from '@/components/ui/Input';
import { HistoryEntryInput } from '@/lib/api/exercisesApi';

interface ExerciseHistoryFormProps {
  exerciseDuration: number;
  onSubmit: (historyEntry: HistoryEntryInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ExerciseHistoryForm({ 
  exerciseDuration, 
  onSubmit, 
  onCancel,
  isSubmitting
}: ExerciseHistoryFormProps) {
  const [duration, setDuration] = useState(exerciseDuration);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [moodBefore, setMoodBefore] = useState<number | null>(null);
  const [moodAfter, setMoodAfter] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const historyEntry: HistoryEntryInput = {
      date: new Date().toISOString(),
      duration,
      notes: notes.trim() || undefined,
      rating: rating || undefined,
      mood: {
        before: moodBefore || undefined,
        after: moodAfter || undefined
      }
    };
    
    onSubmit(historyEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="duration">Czas trwania (minuty)</Label>
          <Input
            id="duration"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || exerciseDuration)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="rating">Ocena ćwiczenia (1-10)</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Slider
              id="rating"
              min={1}
              max={10}
              step={1}
              value={rating ? [rating] : [5]}
              onValueChange={(value) => setRating(value[0])}
            />
            <span className="w-8 text-center">{rating || '-'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="moodBefore">Nastrój przed ćwiczeniem (1-10)</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Slider
                id="moodBefore"
                min={1}
                max={10}
                step={1}
                value={moodBefore ? [moodBefore] : [5]}
                onValueChange={(value) => setMoodBefore(value[0])}
              />
              <span className="w-8 text-center">{moodBefore || '-'}</span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="moodAfter">Nastrój po ćwiczeniu (1-10)</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Slider
                id="moodAfter"
                min={1}
                max={10}
                step={1}
                value={moodAfter ? [moodAfter] : [5]}
                onValueChange={(value) => setMoodAfter(value[0])}
              />
              <span className="w-8 text-center">{moodAfter || '-'}</span>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="notes">Notatki i refleksje</Label>
          <Textarea
            id="notes"
            placeholder="Zapisz swoje doświadczenia, refleksje lub wnioski z ćwiczenia..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz i zakończ'}
        </Button>
      </div>
    </form>
  );
}
