'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, 'HH:mm') : '12:00'
  );

  // Generowanie opcji godzin
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  
  // Generowanie opcji minut
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // Aktualizacja czasu po zmianie daty
  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, 'HH:mm'));
    }
  }, [date]);

  // Aktualizacja daty po zmianie czasu
  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime);
    
    if (date) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setDate(newDate);
    }
  };

  // Aktualizacja daty po wybraniu daty z kalendarza
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
    }
    setDate(newDate);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP, HH:mm', { locale: pl }) : <span>Wybierz datę i czas</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={pl}
          />
          <div className="p-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={selectedTime.split(':')[0]}
                  onValueChange={(value) => handleTimeChange(`${value}:${selectedTime.split(':')[1]}`)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Godzina" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTime.split(':')[1]}
                  onValueChange={(value) => handleTimeChange(`${selectedTime.split(':')[0]}:${value}`)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Minuta" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
