'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskCompletionChartProps {
  data: Array<{
    category: string;
    completed: number;
    incomplete: number;
    pending: number;
  }>;
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

export default function TaskCompletionChart({
  data,
  title = 'Ukończenie zadań według kategorii',
  description = 'Liczba ukończonych, nieukończonych i oczekujących zadań według kategorii',
  showLegend = true,
  height = 300
}: TaskCompletionChartProps) {
  // Przygotowanie etykiet (kategorie)
  const labels = data.map(item => item.category);

  // Przygotowanie danych dla wykresu
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ukończone',
        data: data.map(item => item.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
      {
        label: 'Nieukończone',
        data: data.map(item => item.incomplete),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'Oczekujące',
        data: data.map(item => item.pending),
        backgroundColor: 'rgba(255, 205, 86, 0.7)',
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Liczba zadań'
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
          <Bar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
