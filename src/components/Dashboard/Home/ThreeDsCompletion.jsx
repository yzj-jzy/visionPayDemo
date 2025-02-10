import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { ThreeDsCompletionData } from '../../../api/Dashboard';
import { useAuth } from '../../../contexts/ContentContext';

const ThreeDsCompletion = ({ startDate, endDate, setDateRange }) => {
  const [data, setData] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const { selectedMerchant } = useAuth();
  const [rate, setRate] = useState(0);

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
        const res = await ThreeDsCompletionData(
          selectedMerchant.id,
          formatISODate(startDate),
          formatISODate(endDate)
        );
        setData(res.data ?? []);
        setRate(res.totalRate ?? 0);
      } catch (error) {
        console.error('Error fetching the transaction data', error);
      }
      setSelectedPoints([]);
    };

    fetchData();
  }, [startDate, endDate, selectedMerchant.id]);

  useEffect(() => {
    const chartDom = document.getElementById('3DsChart');
    const myChart = echarts.init(chartDom);
    const isSingleDay = new Date(startDate).toDateString() === new Date(endDate).toDateString();
    const xAxisData = generateXAxisDates(startDate, endDate, isSingleDay);

    const successfulData = xAxisData.map(date => {
      const item = data.find(d => {
        const transactionDate = isSingleDay ? formatHour(new Date(d.transactionDate)) : formatISODate(d.transactionDate);
        return transactionDate === date;
      });
      return item ? item.successfulCount ?? 0 : 0;
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
          const [successful, failed] = params;
          const date = successful.axisValue;
          const item = data.find(d => {
            const transactionDate = isSingleDay ? formatHour(new Date(d.transactionDate)) : formatISODate(d.transactionDate);
            return transactionDate === date;
          });
          const rate = item?.rate ?? 0;
          const successfulCount = item?.successfulCount ?? 0;
          const failedCount = item?.failedCount ?? 0;

          return `
          <div>
              <b>${isSingleDay ? date : date}</b><br />
              <span class="text-2xl font-bold">${rate.toFixed(2)}%</span><br />
              <span>${successfulCount} Successful Transactions</span><br />
              <span>${failedCount} Failed Transactions</span>
          </div>`;
        },
      },
      legend: {
        data: ['Successful', 'Failed'],
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
        },
      },
      yAxis: {
        type: 'value',
        name: 'Count',
        min: 0,
      },
      series: [
        {
          name: 'Successful',
          type: 'line',
          data: successfulData,
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
        hourDate.setHours(i, 0, 0, 0);
        dates.push(formatHour(hourDate));
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
    <div className="w-full p-4 bg-white shadow-md rounded-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">3D-Secure Completion Rate</h2>
        <p className="text-3xl font-semibold">{rate.toFixed(2)}%</p>
      </div>
      <div id="3DsChart" className="w-full h-96 rounded-md"></div>
    </div>
  );
};

export default ThreeDsCompletion;
