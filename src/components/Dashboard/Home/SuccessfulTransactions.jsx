import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { successfulTransactionsData } from '../../../api/Dashboard';
import { useAuth } from '../../../contexts/ContentContext';

const SuccessfulTransactions = ({ startDate, endDate, setDateRange }) => {
  const [data, setData] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]); // Store selected points indices
  const [totalAmount, setTotalAmount] = useState(0);
  const { selectedMerchant } = useAuth();

  function formatISODate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatHour(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    return `${hours}:00`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await successfulTransactionsData(
          selectedMerchant.id,
          formatISODate(startDate),
          formatISODate(endDate)
        );
        setData(res.data ?? []);
        setTotalAmount(res.totalSuccessful ?? 0);
      } catch (error) {
        console.error('Error fetching the transaction data', error);
      }
      setSelectedPoints([]);
    };

    fetchData();
  }, [startDate, endDate, selectedMerchant.id]);

  useEffect(() => {
    const chartDom = document.getElementById('successfulTransaction-chart');
    const myChart = echarts.init(chartDom);
    const isSingleDay = new Date(startDate).toDateString() === new Date(endDate).toDateString();
    const xAxisData = generateXAxisDates(startDate, endDate, isSingleDay);

    const attemptedData = xAxisData.map(date => {
      const item = data.find(d => {
        const transactionDate = isSingleDay ? formatHour(new Date(d.transactionDate)) : formatISODate(d.transactionDate);
        return transactionDate === date;
      });
      return item ? item.attemptedCount : 0;
    });

    const failedData = xAxisData.map(date => {
      const item = data.find(d => {
        const transactionDate = isSingleDay ? formatHour(new Date(d.transactionDate)) : formatISODate(d.transactionDate);
        return transactionDate === date;
      });
      return item ? item.failedCount ?? 0 : 0;
    });

    const option = {
      title: {
        text: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const [attempted, failed] = params;
          const date = attempted.axisValue;
          const item = data.find(d => {
            const transactionDate = isSingleDay ? formatHour(new Date(d.transactionDate)) : formatISODate(d.transactionDate);
            return transactionDate === date;
          });
          const totalAmount = item?.totalAmount ?? 0;
          const successful = item ? item.attemptedCount - (item.failedCount ?? 0) : 0;
          const failedCount = item?.failedCount ?? 0;

          return `
          <div>
              <b class="text-gray-700">${date}</b><br />
              <span class="text-2xl font-bold text-black">
                $${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmount)}
              </span><br />
              <span class="text-gray-500">${successful} Successful Transactions</span><br />
              <span class="text-gray-500">${failedCount} Failed Transactions</span>
          </div>`;
        },
      },
      legend: {
        data: ['Attempted', 'Failed'],
        icon: 'circle',
        bottom: 0,
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        y: 30,
        y2: 90,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: isSingleDay ? 0 : 45,
          formatter: value => value,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Count',
        min: 0,
      },
      series: [
        {
          name: 'Attempted',
          type: 'line',
          data: attemptedData,
          smooth: true,
          symbol: 'circle',
          symbolSize: (value, params) => {
            return selectedPoints.includes(params.dataIndex) ? 15 : 8;
          },
          itemStyle: {
            color: params => {
              return selectedPoints.includes(params.dataIndex) ? 'red' : '#5470c6';
            },
          },
        },
        {
          name: 'Failed',
          type: 'line',
          data: failedData,
          smooth: true,
          itemStyle: {
            color: '#ee6666',
          },
        },
      ],
    };

    myChart.setOption(option);

    myChart.off('click');
    myChart.on('click', params => {
      if (params.componentType === 'series') {
        const clickedIndex = params.dataIndex;
        setSelectedPoints(prevPoints => {
          if (prevPoints.length < 1) {
            return [clickedIndex];
          } else if (prevPoints.length === 1) {
            const newPoints = [...prevPoints, clickedIndex];
            const firstPointDate = new Date(xAxisData[prevPoints[0]]);
            const secondPointDate = new Date(xAxisData[clickedIndex]);

            if (!isSingleDay && newPoints.length === 2) {
              const sortedDates = newPoints.map(index => new Date(xAxisData[index])).sort((a, b) => a - b);
              setDateRange({
                startDate: sortedDates[0],
                endDate: sortedDates[1],
              });
            }
            return newPoints;
          } else {
            return [clickedIndex];
          }
        });
      }
    });

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [data, startDate, endDate, selectedPoints]);

  function generateXAxisDates(start, end, isSingleDay) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    if (isSingleDay) {
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(startDate);
        hourDate.setHours(i, 0, 0, 0); // Set hour
        dates.push(formatHour(hourDate)); // Return hour format
      }
    } else {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(formatISODate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return dates;
  }

  return (
    <div className="w-1/2 phone:w-full tabletSmall:w-full p-4 bg-white shadow-md rounded-2xl h-full">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Successful Transactions</h2>
        <p className="text-3xl font-semibold text-blue-600 mt-2">
          {totalAmount}
        </p>
      </div>
      <div id="successfulTransaction-chart" className="w-full h-96 rounded-md"></div>
    </div>
  );
};

export default SuccessfulTransactions;
