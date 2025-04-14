'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmotionalStateChartProps {
  data: Array<{
    date: string;
    anxiety?: number;
    depression?: number;
    optimism?: number;
    mood?: number;
  }>;
  title?: string;
  description?: string;
  showLegend?: boolean;
  height?: number;
}

export default function EmotionalStateChart({
  data,
  title = 'Stan emocjonalny',
  description = 'Zmiany stanu emocjonalnego w czasie',
  showLegend = true,
  height = 300
}: EmotionalStateChartProps) {
  // Sortowanie danych według daty
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Przygotowanie etykiet (daty)
  const labels = sortedData.map(item => formatDate(item.date));

  // Przygotowanie danych dla wykresu
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Lęk',
        data: sortedData.map(item => item.anxiety),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
        hidden: !sortedData.some(item => item.anxiety !== undefined)
      },
      {
        label: 'Depresja',
        data: sortedData.map(item => item.depression),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
        hidden: !sortedData.some(item => item.depression !== undefined)
      },
      {
        label: 'Optymizm',
        data: sortedData.map(item => item.optimism),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        hidden: !sortedData.some(item => item.optimism !== undefined)
      },
      {
        label: 'Nastrój',
        data: sortedData.map(item => item.mood),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        tension: 0.3,
        hidden: !sortedData.some(item => item.mood !== undefined)
      }
    ]
  };

  const options: ChartOptions<'line'> = {
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
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Poziom (0-10)'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
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
          <Line options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
