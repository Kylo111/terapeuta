'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface TherapyMethodsChartProps {
  data: Array<{
    method: string;
    effectiveness: number;
    count: number;
  }>;
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

export default function TherapyMethodsChart({
  data,
  title = 'Efektywność metod terapeutycznych',
  description = 'Porównanie efektywności różnych metod terapeutycznych',
  showLegend = true,
  height = 300
}: TherapyMethodsChartProps) {
  // Mapowanie nazw metod terapeutycznych
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cognitive_behavioral':
        return 'Poznawczo-behawioralna';
      case 'psychodynamic':
        return 'Psychodynamiczna';
      case 'humanistic':
        return 'Humanistyczna';
      case 'systemic':
        return 'Systemowa';
      case 'solution_focused':
        return 'Skoncentrowana na rozwiązaniach';
      default:
        return method;
    }
  };

  // Przygotowanie etykiet (metody)
  const labels = data.map(item => getMethodLabel(item.method));

  // Przygotowanie danych dla wykresu
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Efektywność',
        data: data.map(item => item.effectiveness),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ]
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const value = context.raw as number;
            const count = data[index].count;
            return `Efektywność: ${value.toFixed(1)}/10 (${count} ${count === 1 ? 'sesja' : 'sesji'})`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <Radar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
