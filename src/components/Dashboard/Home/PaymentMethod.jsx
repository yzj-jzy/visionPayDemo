import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { paymentMethodData } from '../../../api/Dashboard';
import { useAuth } from '../../../contexts/ContentContext';

const PaymentMethod = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const { selectedMerchant } = useAuth();
  
  function formatISODate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await paymentMethodData(selectedMerchant.id, formatISODate(startDate), formatISODate(endDate));
        setData(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error('Error fetching payment method data', error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedMerchant.id]);

  useEffect(() => {
    const chartDom = document.getElementById('payment-method-chart');
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Payment Method',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        left: 'right',
        bottom: 10, 
        data: data.map(item => item.paymentMethod),
      },
      series: [
        {
          name: 'Payment Method',
          type: 'pie',
          radius: ['40%', '70%'], 
          data: data.map(item => ({
            value: item.total,
            name: item.paymentMethod,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [data]);

  return (
    <div className="w-1/2 phone:w-full tabletSmall:w-full tabletSmall:ml-0 p-4 bg-white shadow-md rounded-2xl phone:ml-0  ml-8 ">
      <div id="payment-method-chart" className="w-full h-96 rounded-md"></div>
    </div>
  );
};

export default PaymentMethod;
