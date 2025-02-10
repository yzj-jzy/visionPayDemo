import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { grossTransactionsData } from '../../../api/Dashboard';
import { useAuth } from '../../../contexts/ContentContext';

const GrossTransactions = ({ startDate, endDate, setDateRange }) => {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const { selectedMerchant } = useAuth();

  function formatISODate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatHour(isoString) {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    return `${hours}:00`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await grossTransactionsData(selectedMerchant.id, formatISODate(startDate), formatISODate(endDate));
        setTotalAmount(res.totalAmount ?? 0);
        setData(res.data ?? []);
      } catch (error) {
        console.error('Error fetching the transaction data', error);
      }
      setSelectedPoints([]);
    };

    fetchData();
  }, [startDate, endDate, selectedMerchant.id]);

  useEffect(() => {
    const chartDom = document.getElementById('chart');
    const myChart = echarts.init(chartDom);
    const isSingleDay = new Date(startDate).toDateString() === new Date(endDate).toDateString();
    const xAxisData = generateXAxisDates(startDate, endDate, isSingleDay);

    const option = {
      title: {
        text: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: params => {
          const item = params[0];
          if (!data.length) return 'No transactions';
          const dateLabel = xAxisData[item.dataIndex];
          const matchedData = data.find(d => {
            const transactionDate = isSingleDay ? formatHour(d.transactionDate) : formatISODate(d.transactionDate);
            return transactionDate === dateLabel;
          });

          const totalAmount = matchedData ? matchedData.totalAmount : 0.00;
          const transactionCount = matchedData ? matchedData.transactionCount : '0';

          return `
            <div class="phone:w-32 p-2 bg-white rounded-md">
              <b class="text-gray-700">${dateLabel}</b><br />
              <span class="text-2xl font-bold text-black">
                $${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmount)}
              </span><br />
              <span class="text-gray-500">${transactionCount} Transactions</span>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 30,
          formatter: (value) => value,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Total Amount',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        axisLabel: {
          formatter: (value) => `$${value}`,
        },
      },
      series: [
        {
          name: 'Total Amount',
          type: 'line',
          data: xAxisData.map(date => {
            const item = data.find(d => {
              const transactionDate = isSingleDay ? formatHour(d.transactionDate) : formatISODate(d.transactionDate);
              return transactionDate === date;
            });
            return item ? item.totalAmount : 0.00;
          }),
          smooth: true,
          symbol: 'circle',
          symbolSize: (value, params) => {
            return selectedPoints.includes(params.dataIndex) ? 15 : 8;
          },
          itemStyle: {
            color: (params) => {
              return selectedPoints.includes(params.dataIndex) ? 'red' : '#5470c6';
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    myChart.off('click');
    myChart.on('click', (params) => {
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
    const currentDate = new Date(startDate);

    if (isSingleDay) {
      for (let i = 0; i < 24; i++) {
        const hourDate = new Date(startDate);
        hourDate.setHours(i, 0, 0, 0);
        dates.push(formatHour(hourDate));
      }
    } else {
      while (currentDate <= endDate) {
        dates.push(formatISODate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return dates;
  }

  return (
    <div className="w-full p-4 mb-4 bg-white shadow-md rounded-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gross Transactions</h2>
        <p className="text-3xl font-semibold text-blue-600 mt-2">
          ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmount)}
        </p>
      </div>
      <div id="chart" className="w-full h-96 rounded-md"></div>
    </div>
  );
};

export default GrossTransactions;
