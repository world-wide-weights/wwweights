import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderRadius: 100,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
    },
    },
  };

const labels = ['Heaviest: IPhone 8', 'Oberes Quartil: IPhone 8+', 'Median: IPhone X', 'Unteres Quartil: IPhone 11', 'Lightest: IPhone 11 Pro'];

export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [202, 194, 188, 174, 165],
        backgroundColor: ['#0967D2','#47A3F3','#FFABCA','#C5BAFC','#4F3DA8']
      }
    ],
  };


export const CompareWeightGraph: React.FC = () => {
  return (
    <div className="flex bg-white rounded-xl p-5">
        <Bar options={options} data={data} />
    </div>
  );
};


