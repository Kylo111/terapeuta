'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { ExerciseInput } from '@/lib/api/exercisesApi';
import { toast } from 'react-toastify';
import { Plus, Trash2, X } from 'lucide-react';

interface ExerciseFormProps {
  initialData?: Partial<ExerciseInput>;
  onSubmit: (data: ExerciseInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ExerciseForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting
}: ExerciseFormProps) {
  const [formData, setFormData] = useState<Partial<ExerciseInput>>({
    name: '',
    description: '',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 10,
    instructions: [''],
    tips: [''],
    benefits: [''],
    contraindications: [],
    resources: [],
    isActive: true,
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayItemChange = (
    arrayName: 'instructions' | 'tips' | 'benefits' | 'contraindications',
    index: number,
    value: string
  ) => {
    setFormData(prev => {
      const array = [...(prev[arrayName] || [])];
      array[index] = value;
      return {
        ...prev,
        [arrayName]: array
      };
    });
  };

  const handleAddArrayItem = (arrayName: 'instructions' | 'tips' | 'benefits' | 'contraindications') => {
    setFormData(prev => {
      const array = [...(prev[arrayName] || []), ''];
      return {
        ...prev,
        [arrayName]: array
      };
    });
  };

  const handleRemoveArrayItem = (
    arrayName: 'instructions' | 'tips' | 'benefits' | 'contraindications',
    index: number
  ) => {
    setFormData(prev => {
      const array = [...(prev[arrayName] || [])];
      array.splice(index, 1);
      return {
        ...prev,
        [arrayName]: array
      };
    });
  };

  const handleResourceChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const resources = [...(prev.resources || [])];
      resources[index] = {
        ...resources[index],
        [field]: value
      };
      return {
        ...prev,
        resources
      };
    });
  };

  const handleAddResource = () => {
    setFormData(prev => {
      const resources = [
        ...(prev.resources || []),
        { type: 'link', title: '', url: '', description: '' }
      ];
      return {
        ...prev,
        resources
      };
    });
  };

  const handleRemoveResource = (index: number) => {
    setFormData(prev => {
      const resources = [...(prev.resources || [])];
      resources.splice(index, 1);
      return {
        ...prev,
        resources
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!formData.name?.trim()) {
      toast.error('Nazwa ćwiczenia jest wymagana');
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error('Opis ćwiczenia jest wymagany');
      return;
    }
    
    if (!formData.instructions || formData.instructions.length === 0 || !formData.instructions[0].trim()) {
      toast.error('Przynajmniej jedna instrukcja jest wymagana');
      return;
    }
    
    // Usunięcie pustych elementów z tablic
    const cleanedData: ExerciseInput = {
      name: formData.name!.trim(),
      description: formData.description!.trim(),
      category: formData.category as any,
      difficulty: formData.difficulty as any,
      duration: formData.duration || 10,
      instructions: (formData.instructions || []).filter(item => item.trim()),
      tips: (formData.tips || []).filter(item => item.trim()),
      benefits: (formData.benefits || []).filter(item => item.trim()),
      contraindications: (formData.contraindications || []).filter(item => item.trim()),
      resources: (formData.resources || []).filter(item => item.title.trim() && item.url.trim()),
      isActive: formData.isActive
    };
    
    try {
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Błąd podczas zapisywania ćwiczenia:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Podstawowe informacje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nazwa ćwiczenia *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Np. Uważne oddychanie"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Opis ćwiczenia *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Krótki opis ćwiczenia i jego celu"
              required
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Kategoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="relaxation">Relaksacja</SelectItem>
                  <SelectItem value="cognitive">Poznawcze</SelectItem>
                  <SelectItem value="emotional">Emocjonalne</SelectItem>
                  <SelectItem value="behavioral">Behawioralne</SelectItem>
                  <SelectItem value="other">Inne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficulty">Poziom trudności *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleSelectChange('difficulty', value)}
              >
                <SelectTrigger id="difficulty" className="mt-1">
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Początkujący</SelectItem>
                  <SelectItem value="intermediate">Średniozaawansowany</SelectItem>
                  <SelectItem value="advanced">Zaawansowany</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Czas trwania (minuty) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                value={formData.duration || 10}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instrukcje i wskazówki</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Instrukcje *</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('instructions')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj instrukcję
              </Button>
            </div>
            <div className="space-y-2">
              {formData.instructions?.map((instruction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="mt-2 text-sm text-gray-500">{index + 1}.</div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => handleArrayItemChange('instructions', index, e.target.value)}
                    placeholder={`Krok ${index + 1}`}
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('instructions', index)}
                    disabled={formData.instructions?.length === 1}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Wskazówki</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('tips')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj wskazówkę
              </Button>
            </div>
            <div className="space-y-2">
              {formData.tips?.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={tip}
                    onChange={(e) => handleArrayItemChange('tips', index, e.target.value)}
                    placeholder="Wskazówka dla ćwiczącego"
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('tips', index)}
                    className="mt-1"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Korzyści i przeciwwskazania</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Korzyści</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('benefits')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj korzyść
              </Button>
            </div>
            <div className="space-y-2">
              {formData.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleArrayItemChange('benefits', index, e.target.value)}
                    placeholder="Korzyść z ćwiczenia"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('benefits', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Przeciwwskazania</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('contraindications')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj przeciwwskazanie
              </Button>
            </div>
            <div className="space-y-2">
              {formData.contraindications?.map((contraindication, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    value={contraindication}
                    onChange={(e) => handleArrayItemChange('contraindications', index, e.target.value)}
                    placeholder="Przeciwwskazanie do ćwiczenia"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('contraindications', index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Zasoby dodatkowe</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddResource}
            >
              <Plus className="h-4 w-4 mr-1" />
              Dodaj zasób
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.resources?.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveResource(index)}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor={`resource-title-${index}`}>Tytuł</Label>
                    <Input
                      id={`resource-title-${index}`}
                      value={resource.title || ''}
                      onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                      placeholder="Tytuł zasobu"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`resource-type-${index}`}>Typ</Label>
                    <Select
                      value={resource.type || 'link'}
                      onValueChange={(value) => handleResourceChange(index, 'type', value)}
                    >
                      <SelectTrigger id={`resource-type-${index}`} className="mt-1">
                        <SelectValue placeholder="Wybierz typ zasobu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Wideo</SelectItem>
                        <SelectItem value="image">Obraz</SelectItem>
                        <SelectItem value="text">Tekst</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor={`resource-url-${index}`}>URL</Label>
                  <Input
                    id={`resource-url-${index}`}
                    value={resource.url || ''}
                    onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>
                
                <div className="mt-4">
                  <Label htmlFor={`resource-description-${index}`}>Opis</Label>
                  <Textarea
                    id={`resource-description-${index}`}
                    value={resource.description || ''}
                    onChange={(e) => handleResourceChange(index, 'description', e.target.value)}
                    placeholder="Krótki opis zasobu"
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
            
            {formData.resources?.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                Brak zasobów dodatkowych. Kliknij "Dodaj zasób", aby dodać.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <CardFooter className="flex justify-end space-x-2 px-0">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz ćwiczenie'}
        </Button>
      </CardFooter>
    </form>
  );
}
