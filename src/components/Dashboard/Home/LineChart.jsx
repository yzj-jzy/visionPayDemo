import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const data = {
        labels: ['1500', '1600', '1700', '1750', '1800', '1850', '1900', '1950', '2000'],
        datasets: [
            {
                label: 'Sales',
                data: [0, 0, 0, 0, 10, 50, 150, 300, 450],
                fill: false,
                borderColor: '#0B57B9',
                backgroundColor: '#0B57B9',  
                tension: 0.1,
                borderDash: [],  
                pointRadius: 3,  
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,  
        plugins: {
            title: {
                display: true,
                text: "Purchase Details",
            },
            legend: {
                position: 'top',
                align: 'center',
                
            },
        },
        elements: {
            line: {
                tension: 0.1,  
            },
            point: {
                radius: 0,  
            },
        },
    };

    return (
        <div className="chart-container w-full h-96">
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
