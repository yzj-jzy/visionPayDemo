import React, { useState, useEffect } from 'react';
import ContentStyle from '../ContentStyle';
import { getTransaction } from '../../../api/Transaction';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaCcVisa, FaCcMastercard, FaDollarSign, FaSearch, FaFileInvoiceDollar} from 'react-icons/fa';
import { SiGooglepay, SiApplepay } from "react-icons/si";
import { FiDownload } from 'react-icons/fi';
import CalendarPicker from '../Utils/CalendarPicker';
import { useAuth } from '../../../contexts/ContentContext';
import TransactionCard from './TransactionCard';
import { format } from 'date-fns';

const TransactionGet = function () {
  const [transactions, setTransactions] = useState({
    totalRecords: 0,
    transactions: [],
    totalSettledSuccessful: 0,
    totalSettledAmount: 0,
    totalRefundSuccessful: 0,
    totalRefundAmount: 0
  });
  const [loading, setLoading] = useState(false);

  const getInitialDateRange = () => {
    const params = new URLSearchParams(window.location.search);
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    if (startDate && endDate) {
      return {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
    } else {
      return {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
      };
    }
  };

  const navigate = useNavigate();
  
  const [dateRange, setDateRange] = useState(getInitialDateRange());
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryDone, setSearchQueryDone] = useState(true);
  const [isRefundOnly, setIsRefundOnly] = useState(false);
  const { selectedMerchant } = useAuth();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const itemsPerPage = 10;
  const { canTransactionView } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
        const endDate = format(dateRange.endDate, 'yyyy-MM-dd');

        const filteredTransactions = await getTransaction(
          selectedMerchant.id,
          searchQuery,
          isRefundOnly,
          startDate,
          endDate,
          (currentPage - 1) * itemsPerPage,
          itemsPerPage,
        );

        // Calculate total pages based on new data
        const newTotalPages = Math.ceil(filteredTransactions.totalRecords / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);
            newParams.set('page', 1);
            return newParams;
          });
        } else {
          setTransactions(filteredTransactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, selectedMerchant, dateRange, searchQueryDone, isRefundOnly]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('startDate', format(newRange.startDate, 'yyyy-MM-dd'));
      newParams.set('endDate', format(newRange.endDate, 'yyyy-MM-dd'));
      return newParams;
    });
  };
  

  const totalRecords = transactions?.totalRecords || 0;
  const transactionList = transactions?.transactions || [];
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams(prevParams => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', newPage);
        return newParams;
      });
    }
  };
  

  const getCardIcon = (cardType) => {
    const baseIconStyle = "w-8 h-8"; 
    const defaultBorder = "border border-gray-300 rounded-lg bg-white shadow-sm"; 
  
    switch (cardType) {
      case 'Visa':
        return <FaCcVisa className={`text-blue-600 ${baseIconStyle}`} />;
      case 'MasterCard':
        return <FaCcMastercard className={`text-orange-600 ${baseIconStyle}`} />;
      case 'GooglePay':
        return (
          <SiGooglepay 
            className={`text-black ${baseIconStyle} ${defaultBorder} p-1`}
          />
        );
      case 'ApplePay':
        return (
          <SiApplepay 
            className={`text-black ${baseIconStyle}`}
          />
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    return status ? 
      <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm">Approved</span> :
      <span className="bg-red-100 text-red-600 py-1 px-3 rounded-full text-sm">Declined</span>;
  };

  const toDecimal = (number) => {
    if (number !== undefined && number !== null) {
      return Number(number.toFixed(2)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return '0.00';
  };
  

  const handleExport = async () => {
    try {
      const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
      const response = await getTransaction(
        selectedMerchant.id,
        searchQuery,
        isRefundOnly,
        startDate,
        endDate,
        0,
        transactions.totalRecords
      );

      const csvData = convertToCSV(response.transactions);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting transactions:", error);
    }
  };

  const convertToCSV = (transactions) => {
    const headers = [
      '"Date"',
      '"Reference"',
      '"Amount"',
      '"Captured"',
      '"Card Holder"',
      '"Payment Method"',
      '"Card Signature"',
      '"Status"'
    ];
    const csvRows = [headers.join(',')];

    transactions.forEach(transaction => {
      const date = transaction.transactionDate ? format(new Date(transaction.transactionDate), 'dd/MM/yyyy HH:mm') : '';
      const reference = transaction.reference ?? '';
      const amount = transaction.captured 
        ? (transaction.capturedAmount ?? 0) 
        : (transaction.authorizedAmount ?? 0);
      const captured = transaction.captured ? 'Yes' : 'No';
      const cardHolder = transaction.cardHolder ?? '';
      const paymentMethod = transaction.cardType ?? '';
      const cardSignature = transaction.cardSignature ?? '';
      const status = transaction.successful ? 'Approved' : 'Declined';

      const row = [
        `"${date}"`,
        `"${reference}"`,
        `"${amount}"`,
        `"${captured}"`,
        `"${cardHolder}"`,
        `"${paymentMethod}"`,
        `"${cardSignature}"`,
        `"${status}"`
      ];
    
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const handleNavigate = (transactionReference) => {
    const params = new URLSearchParams(location.search);
    params.set('ref', transactionReference);
    navigate(`/dashboard/transaction/View?${params.toString()}`);
  };

  return (
    <ContentStyle>
  <div className="h-full bg-white rounded-3xl pb-44 p-6 phone:overflow-x-auto tabletSmall:overflow-x-auto overflow-x-auto box-content">
    <div className="flex phone:block justify-between items-center">
      <h1 className="mt-8 font-semibold phone:mb-2 text-2xl">Transactions</h1>
    </div>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 desktop:grid-cols-4 gap-4 mt-4">
      <TransactionCard  
        icon={<FaCheck className="text-blue-500" />} 
        title="Successful Purchases" 
        value={transactions.totalSettledSuccessful} 
        isInteger={true}
      />
      <TransactionCard 
        icon={<FaDollarSign className="text-green-500" />} 
        title="Purchases Total" 
        value={transactions.totalSettledAmount}
        dollarSign = {true}
      />
      <TransactionCard 
        icon={<FaTimes className="text-red-500" />} 
        title="Refunds Processed" 
        value={transactions.totalRefundSuccessful} 
        isInteger={true}
      />
      <TransactionCard 
        icon={<FaDollarSign className="text-red-500" />} 
        title="Refunds Total" 
        value={transactions.totalRefundAmount}
        dollarSign = {true}
      />
    </div>

    {/* Date Picker and Export Button */}
    <div className="mt-4 flex items-center gap-4">
      <CalendarPicker dateRange={dateRange} setDateRange={handleDateRangeChange} />
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg ml-auto flex items-center"
      >
      <FiDownload className="mr-2" />
        Export
      </button>
    </div>

    {/* Search Field - Separate from Tabs */}
    <div className="mt-2 w-1/4 phone:w-full tabletSmall:w-full flex items-center border rounded-md px-3 py-2 bg-white shadow-sm">
      <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
        onKeyDown={(e) => {
            if (e.key === 'Enter') { 
                setSearchParams({ page: 1 });
                setSearchQueryDone(!searchQueryDone);
            }
        }}
        placeholder="Search"
        className="flex-grow focus:outline-none px-2 bg-transparent min-w-0"
      />
    </div>


    {/* Tabs */}
    <div className="flex gap-4 mt-1 border-b border-gray-300">
      <div
        className={`px-4 py-2 cursor-pointer ${!isRefundOnly ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => setIsRefundOnly(false)}
      >
        All
      </div>
      <div
        className={`px-4 py-2 cursor-pointer ${isRefundOnly ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
        onClick={() => setIsRefundOnly(true)}
      >
        Refunds
      </div>
    </div>

{/* Table */}
<table className="min-w-full mt-4 bg-white border border-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="py-2 px-4 text-left">Date</th>
      <th className="py-2 px-4 text-left">Reference</th>
      <th className="py-2 px-4 text-left">Amount</th>
      <th className="py-2 px-4 text-left">Captured</th>
      <th className="py-2 px-4 text-left">Card Holder</th>
      <th className="py-2 px-4 text-left">Payment Method</th>
      <th className="py-2 px-4 text-left">Status</th>
    </tr>
  </thead>
  <tbody>
    {transactionList.length === 0 ? (
      <tr>
        <td colSpan="7" className="py-10 px-4 text-center text-gray-500">
          <div className="flex flex-col items-center">
            <FaFileInvoiceDollar className="text-6xl mb-4" />
            <h2 className="text-xl font-semibold">No Transactions Found</h2>
            <p className="text-center mt-2">Try adjusting your search filters or date range to find transactions.</p>
          </div>
        </td>
      </tr>
    ) : (
      transactionList.map(transaction => (
        <tr key={transaction.reference} className="border-t h-16 hover:bg-gray-50">
          <td>
            <div className="py-2 px-4">{format(new Date(transaction.transactionDate), 'dd/MM/yyyy')}</div>
            <div className="py-2 px-4">{format(new Date(transaction.transactionDate), 'HH:mm')}</div>
          </td>
          <td className="py-2 px-4">
            {canTransactionView ? (
              <button
              onClick={() => handleNavigate(transaction.reference)}
              className="text-blue-500 underline hover:text-blue-700"
          >
              {transaction.reference}
          </button>
            ) : (
              transaction.reference
            )}
          </td>
          <td className="py-2 px-4">
            AUD ${transaction.captured ? toDecimal(transaction.capturedAmount) : toDecimal(transaction.authorizedAmount)}
          </td>
          <td className="py-2 px-4">
            {transaction.captured ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
          </td>
          <td className="py-2 px-4">{transaction.cardHolder}</td>
          <td className="py-2 px-4 align-middle text-center">
            <div className="flex items-center">
              {getCardIcon(transaction.cardType)}
              <span className="ml-2">{transaction.cardSignature}</span>
            </div>
          </td>
          <td className="py-2 px-4">{getStatusBadge(transaction.successful)}</td>
        </tr>
      ))
    )}
  </tbody>
</table>



    {/* Pagination */}
    <div className="mt-4 flex justify-center items-center space-x-2">
      {(() => {
        const pageNumbers = [];
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage === 1) {
          endPage = Math.min(totalPages - 1, startPage + 2);
        } else if (currentPage === totalPages) {
          startPage = Math.max(2, endPage - 2);
        }

        pageNumbers.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={"px-3 py-1 rounded-md transition " +
              (currentPage === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
          >
            1
          </button>
        );

        if (startPage > 2) {
          pageNumbers.push(<span key="start-ellipsis">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={"px-3 py-1 rounded-md transition " +
                (currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
            >
              {i}
            </button>
          );
        }

        if (endPage < totalPages - 1) {
          pageNumbers.push(<span key="end-ellipsis">...</span>);
        }

        if (totalPages > 1) {
          pageNumbers.push(
            <button
              key={totalPages}
              onClick={() => handlePageChange(totalPages)}
              className={"px-3 py-1 rounded-md transition " +
                (currentPage === totalPages ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300')}
            >
              {totalPages}
            </button>
          );
        }

        return pageNumbers.length > 1 ? pageNumbers : null;
      })()}
    </div>
  </div>
</ContentStyle>

  );
};

export default TransactionGet;
