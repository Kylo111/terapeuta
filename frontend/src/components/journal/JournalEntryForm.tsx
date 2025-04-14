'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { JournalEntryInput, Emotion } from '@/lib/api/journalApi';
import { getProfiles, Profile } from '@/lib/api/profilesApi';
import { toast } from 'react-toastify';
import { Plus, X, Trash2 } from 'lucide-react';

interface JournalEntryFormProps {
  initialData?: Partial<JournalEntryInput>;
  onSubmit: (data: JournalEntryInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

// Lista zniekształceń poznawczych
const cognitiveDistortions = [
  'Czarno-białe myślenie',
  'Nadmierne uogólnianie',
  'Filtrowanie negatywne',
  'Odrzucanie pozytywów',
  'Katastrofizacja',
  'Czytanie w myślach',
  'Wróżenie z kuli',
  'Myślenie emocjonalne',
  'Etykietowanie',
  'Personalizacja',
  'Powinności',
  'Błąd sprawiedliwości',
  'Obwinianie'
];

// Lista popularnych emocji
const commonEmotions = [
  'Radość',
  'Smutek',
  'Złość',
  'Strach',
  'Wstyd',
  'Wina',
  'Zazdrość',
  'Niepokój',
  'Frustracja',
  'Rozczarowanie',
  'Zaskoczenie',
  'Nadzieja',
  'Duma',
  'Ulga',
  'Zmieszanie'
];

export default function JournalEntryForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting
}: JournalEntryFormProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [formData, setFormData] = useState<Partial<JournalEntryInput>>({
    profile: '',
    date: new Date().toISOString(),
    situation: '',
    automaticThoughts: [''],
    emotions: [],
    physicalReactions: [''],
    cognitiveDistortions: [],
    alternativeThoughts: [''],
    emotionsAfter: [],
    conclusions: '',
    tags: [],
    ...initialData
  });
  const [newEmotion, setNewEmotion] = useState({ name: '', intensity: 5 });
  const [newEmotionAfter, setNewEmotionAfter] = useState({ name: '', intensity: 5 });
  const [newTag, setNewTag] = useState('');
  const [selectedDistortion, setSelectedDistortion] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const profilesData = await getProfiles();
      setProfiles(profilesData);
      
      // Jeśli nie ma wybranego profilu, a są dostępne profile, wybierz pierwszy
      if (!formData.profile && profilesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          profile: profilesData[0]._id
        }));
      }
    } catch (err) {
      console.error('Błąd pobierania profili:', err);
      toast.error('Nie udało się pobrać profili');
    }
  };

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

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      date: date ? date.toISOString() : new Date().toISOString()
    }));
  };

  const handleArrayItemChange = (
    arrayName: 'automaticThoughts' | 'physicalReactions' | 'alternativeThoughts',
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

  const handleAddArrayItem = (arrayName: 'automaticThoughts' | 'physicalReactions' | 'alternativeThoughts') => {
    setFormData(prev => {
      const array = [...(prev[arrayName] || []), ''];
      return {
        ...prev,
        [arrayName]: array
      };
    });
  };

  const handleRemoveArrayItem = (
    arrayName: 'automaticThoughts' | 'physicalReactions' | 'alternativeThoughts',
    index: number
  ) => {
    setFormData(prev => {
      const array = [...(prev[arrayName] || [])];
      array.splice(index, 1);
      return {
        ...prev,
        [arrayName]: array.length > 0 ? array : ['']
      };
    });
  };

  const handleAddEmotion = () => {
    if (!newEmotion.name.trim()) {
      toast.error('Nazwa emocji jest wymagana');
      return;
    }
    
    // Sprawdź, czy emocja już istnieje
    if (formData.emotions?.some(e => e.name.toLowerCase() === newEmotion.name.toLowerCase())) {
      toast.error('Ta emocja już istnieje');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      emotions: [...(prev.emotions || []), { ...newEmotion, name: newEmotion.name.trim() }]
    }));
    
    setNewEmotion({ name: '', intensity: 5 });
  };

  const handleRemoveEmotion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emotions: (prev.emotions || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddEmotionAfter = () => {
    if (!newEmotionAfter.name.trim()) {
      toast.error('Nazwa emocji jest wymagana');
      return;
    }
    
    // Sprawdź, czy emocja już istnieje
    if (formData.emotionsAfter?.some(e => e.name.toLowerCase() === newEmotionAfter.name.toLowerCase())) {
      toast.error('Ta emocja już istnieje');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      emotionsAfter: [...(prev.emotionsAfter || []), { ...newEmotionAfter, name: newEmotionAfter.name.trim() }]
    }));
    
    setNewEmotionAfter({ name: '', intensity: 5 });
  };

  const handleRemoveEmotionAfter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emotionsAfter: (prev.emotionsAfter || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddDistortion = () => {
    if (!selectedDistortion) return;
    
    // Sprawdź, czy zniekształcenie już istnieje
    if (formData.cognitiveDistortions?.includes(selectedDistortion)) {
      toast.error('To zniekształcenie już zostało dodane');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      cognitiveDistortions: [...(prev.cognitiveDistortions || []), selectedDistortion]
    }));
    
    setSelectedDistortion('');
  };

  const handleRemoveDistortion = (distortion: string) => {
    setFormData(prev => ({
      ...prev,
      cognitiveDistortions: (prev.cognitiveDistortions || []).filter(d => d !== distortion)
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    // Sprawdź, czy tag już istnieje
    if (formData.tags?.includes(newTag.trim())) {
      toast.error('Ten tag już istnieje');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()]
    }));
    
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Walidacja
    if (!formData.profile) {
      toast.error('Wybierz profil');
      return;
    }
    
    if (!formData.situation?.trim()) {
      toast.error('Opis sytuacji jest wymagany');
      return;
    }
    
    if (!formData.automaticThoughts || formData.automaticThoughts.length === 0 || !formData.automaticThoughts[0].trim()) {
      toast.error('Przynajmniej jedna myśl automatyczna jest wymagana');
      return;
    }
    
    if (!formData.emotions || formData.emotions.length === 0) {
      toast.error('Przynajmniej jedna emocja jest wymagana');
      return;
    }
    
    // Usunięcie pustych elementów z tablic
    const cleanedData: JournalEntryInput = {
      profile: formData.profile!,
      date: formData.date,
      situation: formData.situation!.trim(),
      automaticThoughts: (formData.automaticThoughts || []).filter(item => item.trim()),
      emotions: formData.emotions!,
      physicalReactions: (formData.physicalReactions || []).filter(item => item.trim()),
      cognitiveDistortions: formData.cognitiveDistortions,
      alternativeThoughts: (formData.alternativeThoughts || []).filter(item => item.trim()),
      emotionsAfter: formData.emotionsAfter,
      conclusions: formData.conclusions?.trim(),
      tags: formData.tags
    };
    
    try {
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Błąd podczas zapisywania wpisu:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Podstawowe informacje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profile">Profil *</Label>
              <Select
                value={formData.profile}
                onValueChange={(value) => handleSelectChange('profile', value)}
              >
                <SelectTrigger id="profile" className="mt-1">
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
              <Label htmlFor="date">Data *</Label>
              <DatePicker
                date={formData.date ? new Date(formData.date) : undefined}
                setDate={handleDateChange}
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="situation">Sytuacja *</Label>
            <Textarea
              id="situation"
              name="situation"
              value={formData.situation || ''}
              onChange={handleChange}
              placeholder="Opisz sytuację, która wywołała myśli i emocje"
              required
              rows={3}
              className="mt-1"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Myśli automatyczne *</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('automaticThoughts')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj myśl
              </Button>
            </div>
            <div className="space-y-2">
              {formData.automaticThoughts?.map((thought, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={thought}
                    onChange={(e) => handleArrayItemChange('automaticThoughts', index, e.target.value)}
                    placeholder="Myśl automatyczna"
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('automaticThoughts', index)}
                    disabled={formData.automaticThoughts?.length === 1}
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
          <CardTitle>Emocje i reakcje fizyczne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Emocje *</Label>
              <div className="flex gap-2">
                <Select
                  value={newEmotion.name}
                  onValueChange={(value) => setNewEmotion(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Wybierz emocję" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonEmotions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">{newEmotion.intensity}</span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[newEmotion.intensity]}
                    onValueChange={(value) => setNewEmotion(prev => ({ ...prev, intensity: value[0] }))}
                    className="w-24"
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddEmotion}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              {formData.emotions && formData.emotions.length > 0 ? (
                <div className="space-y-2">
                  {formData.emotions.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center">
                        <span className="font-medium">{emotion.name}</span>
                        <span className="mx-2">-</span>
                        <span>{emotion.intensity}/10</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveEmotion(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 border rounded-md">
                  Brak emocji. Dodaj przynajmniej jedną emocję.
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Reakcje fizyczne</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('physicalReactions')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj reakcję
              </Button>
            </div>
            <div className="space-y-2">
              {formData.physicalReactions?.map((reaction, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Input
                    value={reaction}
                    onChange={(e) => handleArrayItemChange('physicalReactions', index, e.target.value)}
                    placeholder="Reakcja fizyczna"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('physicalReactions', index)}
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
          <CardTitle>Zniekształcenia poznawcze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={selectedDistortion}
              onValueChange={setSelectedDistortion}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Wybierz zniekształcenie poznawcze" />
              </SelectTrigger>
              <SelectContent>
                {cognitiveDistortions.map((distortion) => (
                  <SelectItem key={distortion} value={distortion}>
                    {distortion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleAddDistortion}
              disabled={!selectedDistortion}
            >
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </div>
          
          <div className="mt-4">
            {formData.cognitiveDistortions && formData.cognitiveDistortions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.cognitiveDistortions.map((distortion, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-800 border-red-200 flex items-center gap-1">
                    {distortion}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveDistortion(distortion)}
                      className="h-4 w-4 p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 border rounded-md">
                Brak zniekształceń poznawczych.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Restrukturyzacja poznawcza</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Alternatywne myśli</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleAddArrayItem('alternativeThoughts')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Dodaj myśl
              </Button>
            </div>
            <div className="space-y-2">
              {formData.alternativeThoughts?.map((thought, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={thought}
                    onChange={(e) => handleArrayItemChange('alternativeThoughts', index, e.target.value)}
                    placeholder="Alternatywna myśl"
                    rows={2}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveArrayItem('alternativeThoughts', index)}
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
              <Label>Emocje po restrukturyzacji</Label>
              <div className="flex gap-2">
                <Select
                  value={newEmotionAfter.name}
                  onValueChange={(value) => setNewEmotionAfter(prev => ({ ...prev, name: value }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Wybierz emocję" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonEmotions.map((emotion) => (
                      <SelectItem key={emotion} value={emotion}>
                        {emotion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">{newEmotionAfter.intensity}</span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[newEmotionAfter.intensity]}
                    onValueChange={(value) => setNewEmotionAfter(prev => ({ ...prev, intensity: value[0] }))}
                    className="w-24"
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddEmotionAfter}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              {formData.emotionsAfter && formData.emotionsAfter.length > 0 ? (
                <div className="space-y-2">
                  {formData.emotionsAfter.map((emotion, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center">
                        <span className="font-medium">{emotion.name}</span>
                        <span className="mx-2">-</span>
                        <span>{emotion.intensity}/10</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveEmotionAfter(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 border rounded-md">
                  Brak emocji po restrukturyzacji.
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="conclusions">Wnioski</Label>
            <Textarea
              id="conclusions"
              name="conclusions"
              value={formData.conclusions || ''}
              onChange={handleChange}
              placeholder="Jakie wnioski wyciągasz z tej sytuacji?"
              rows={3}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tagi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nowy tag"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={handleAddTag}
            >
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </div>
          
          <div>
            {formData.tags && formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-4 w-4 p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 border rounded-md">
                Brak tagów.
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
          {isSubmitting ? 'Zapisywanie...' : 'Zapisz wpis'}
        </Button>
      </CardFooter>
    </form>
  );
}
