import React, { useState, useRef, useEffect } from 'react';
import { DateRangePicker, createStaticRanges, defaultStaticRanges } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, startOfMonth, endOfMonth, subMonths, startOfYear, format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate, useLocation } from 'react-router-dom';

const CalendarPicker = ({ dateRange, setDateRange }) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection',
  });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Last 7 Days');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const optionsRef = useRef(null);

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };


  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    var endDate = new Date();
    let startDate;
    switch (option) {
      case 'Today':
        startDate = endDate;
        break;
      case 'Yesterday':
        startDate = addDays(endDate, -1);
        endDate = addDays(endDate, -1);
        break;
      case 'Last 7 Days':
        startDate = addDays(endDate, -7);
        break;
      case 'Last 30 Days':
        startDate = addDays(endDate, -30);
        break;
      case 'This Month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'Last Month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0); // Last day of the previous month
        break;
      case 'Last 6 Months':
        startDate = subMonths(endDate, 6); // Subtract 6 months from the current date
        break;
      case 'From Start of Year':
        startDate = startOfYear(endDate); // Start of the current year
        break;
      case 'Last 12 Months':
        startDate = subMonths(endDate, 12); // Subtract 12 months from the current date
        break;
      case 'Custom Range':
        setIsModalOpen(true);
        return;
      default:
        startDate = endDate;
    }
    
    // Ensure startDate and endDate are correctly updated
    setSelectionRange({ startDate, endDate, key: 'selection' });
    setDateRange({ startDate, endDate });

  };

  const handleApply = () => {
    setDateRange({ startDate: selectionRange.startDate, endDate: selectionRange.endDate });
    setIsModalOpen(false);
  };
  
  

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsRef]);

  useEffect(() => {
    setSelectionRange({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      key: 'selection',
    });
  }, [dateRange]);

  const customStaticRanges = createStaticRanges([
    {
      label: 'Today',
      range: () => ({
        startDate: addDays(new Date(), 0),
        endDate: new Date(),
      }),
    },
    {
      label: 'Yesterday',
      range: () => ({
        startDate: addDays(new Date(), -1),
        endDate: addDays(new Date(), -1),
      }),
    },
    {
      label: 'Last 7 Days',
      range: () => ({
        startDate: addDays(new Date(), -7),
        endDate: new Date(),
      }),
    },
    {
      label: 'Last 30 Days',
      range: () => ({
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }),
    },
    {
      label: 'This Month',
      range: () => ({
        startDate: startOfMonth(new Date()),
        endDate: new Date(),
      }),
    },
    {
      label: 'Last Month',
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    {
      label: 'Last 6 Months',
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 6)),
        endDate: new Date(),
      }),
    },
    {
      label: 'From Start of Year',
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: new Date(),
      }),
    },
    {
      label: 'Last 12 Months',
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 12)),
        endDate: new Date(),
      }),
    },
  ]);

  return (
    <div className="flex flex-col rounded-lg relative">
      <div className="relative flex gap-4 mb-4">
        <div
          className="flex gap-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
        >
          <FaCalendarAlt className="text-white" />
          {format(selectionRange.startDate, 'dd/MM/yyyy')} - {format(selectionRange.endDate, 'dd/MM/yyyy')}
        </div>
        {showOptions && (
          <div
            ref={optionsRef}
            className="absolute top-full mt-2 left-3 transform translate-x-0 bg-white border border-gray-300 rounded-lg shadow-md z-[1000]"
          >
            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Last 6 Months','From Start of Year', 'Last 12 Months', 'Custom Range'].map((option) => (
              <div
                key={option}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancel}
        className="relative bg-white p-6 rounded-lg shadow-lg z-[2000] w-full max-w-6xl flex flex-col items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1999] flex items-center justify-center"
      >


        <DateRangePicker
          className='overflow-x-auto w-full '
          ranges={[selectionRange]}
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          direction="horizontal"
          staticRanges={customStaticRanges}
          inputRanges={[]}
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-300 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
          >
            Apply
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarPicker;
