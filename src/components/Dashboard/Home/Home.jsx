import React, { useState } from 'react';
import ContentStyle from '../ContentStyle';
import CalendarPicker from '../Utils/CalendarPicker';
import GrossTransactions from './GrossTransactions';
import PaymentMethod from './PaymentMethod';
import SuccessfulTransactions from './SuccessfulTransactions';
import ThreeDsCompletion from './ThreeDsCompletion';

const Home = function () {

    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)), // Default to 30 days ago
        endDate: new Date(),
      });

    return (
        <ContentStyle>
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 bg-gray-50 rounded-3xl pb-44 p-6 overflow-x-auto box-content h-[80%] phone:overflow-x-auto tabletSmall:overflow-x-auto">
                
                <div className="flex pb-4 pt-6">
                    <h1 className="text-2xl font-bold w-8/12">Dashboard</h1>
                </div>

                <CalendarPicker dateRange={dateRange}  setDateRange={setDateRange} />
                
                <GrossTransactions 
                    startDate={dateRange.startDate.toISOString()} 
                    endDate={dateRange.endDate.toISOString()} 
                    setDateRange={setDateRange}
                />
            <div className="phone:block tabletSmall:block flex mb-4">
                <SuccessfulTransactions
                    startDate={dateRange.startDate.toISOString()} 
                    endDate={dateRange.endDate.toISOString()} 
                    setDateRange={setDateRange}
                />
                <PaymentMethod
                    startDate={dateRange.startDate.toISOString()} 
                    endDate={dateRange.endDate.toISOString()} 
                    setDateRange={setDateRange}
                />
            </div>

                <ThreeDsCompletion
                    startDate={dateRange.startDate.toISOString()} 
                    endDate={dateRange.endDate.toISOString()} 
                    setDateRange={setDateRange}
                />
            </div>
        </ContentStyle>
    );
};

export default Home;
