import React, { useState, useEffect, useContext } from 'react';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startOfWeek, endOfToday, parse, isWithinInterval } from 'date-fns';
import Header from '../Components/General/Header';
import PieChartSection from '../Components/General/PieChartSection';
import SummaryTable from '../Components/General/SummaryTable';
import DetailTable from '../Components/General/DetailTable';
import TransactionContext from '../Context/TransactionsContext';

const Donations = ({ isUserDrawerOpen }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [mobileView, setMobileView] = useState('pie');
  const [desktopView, setDesktopView] = useState('summary');
  const { transactions, transactionsLoaded } = useContext(TransactionContext);

  const communities = [
    { name: 'Animal Rescue Foundation', percentage: 30 },
    { name: 'Tolarian Community College', percentage: 20 },
    { name: 'Rings of Chaos', percentage: 20 },
    { name: 'Tulsa Makerspace', percentage: 15 },
    { name: 'Tulsa Spotlight Theatre', percentage: 10 },
    { name: 'Centsable', percentage: 5 },
  ];

  useEffect(() => {
    if (!transactionsLoaded) return;

    const currentDate = endOfToday();
    // console.log(currentDate);
    const previousMonday = startOfWeek(currentDate, { weekStartsOn: 1 });
    // console.log(previousMonday);

    const newWeeklyTotal = transactions.reduce((totalSum, dateObj) => {
      const dateKey = Object.keys(dateObj)[0];
      const transactionEntries = Object.values(dateObj[dateKey]);
      // console.log(transactionEntries);

      const date = parse(transactionEntries[0].date, 'MM/dd/yyyy', new Date());
      // console.log(date);
      if (isWithinInterval(date, { start: previousMonday, end: currentDate })) {
        const dateTotal = transactionEntries.reduce((daySum, transaction) => {
          return daySum + parseFloat(transaction.amount);
        }, 0);
        return totalSum + dateTotal;
      }
      return totalSum;
    }, 0).toFixed(2);

    setWeeklyTotal(newWeeklyTotal);
  }, [transactions, transactionsLoaded]);

  // Logging the transactions on page load
  // useEffect(() => {console.log(transactions)}, [transactionsLoaded]);

  const handlePieClick = () => {
    setMobileView('summary');
  };

  const handleSummaryClick = (date) => {
    // console.log('Summary clicked, selected date is', date);
    setSelectedDate(date);
    setMobileView('detail');
    setDesktopView('detail');
  };

  const handleBackClick = () => {
    if (mobileView === 'detail') {
      setMobileView('summary');
    } else if (mobileView === 'summary') {
      setMobileView('pie');
    }
    
    if (desktopView === 'detail') {
      setDesktopView('summary');
    }

    setSelectedDate(null);
  };

  return (
    <div className="p-6 pt-6">
      <Header
        pageTopic="Donations"
        supportingText="Customize and View Donations"
        icon={faFilter}
        buttonText="Apply filter"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      {/* Back button placeholder */}
      <div className="mb-4">
        {/* Mobile back button */}
        <button 
          onClick={handleBackClick} 
          className={`md-lg:hidden flex items-center text-red-500 ${mobileView === 'pie' ? 'invisible' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {mobileView === 'detail' ? 'Back to Summary' : 'Back to Pie Chart'}
        </button>
      </div>
      {!transactionsLoaded ? (
        <div className="loading-spinner-container flex items-center justify-center h-full" style={{ minHeight: '70vh' }}>
          <div role="status">
            <svg aria-hidden="true" className="inline w-36 h-36 text-gray-200 animate-spin dark:text-neutral-300 fill-red-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className={`grid gap-6 ${isUserDrawerOpen ? 'grid-cols-1' : 'grid-cols-1 md-lg:grid-cols-[auto,1fr]'}`}>
        {/* Pie Chart Column */}
        <div className={`${mobileView === 'pie' ? 'block' : 'hidden'} md-lg:mt-9 md-lg:block w-full justify-self-center md-lg:justify-self-start`}>
          <div className="w-full max-w-[90%] mx-auto md-lg:max-w-full">
            <PieChartSection weeklyTotal={weeklyTotal} communities={communities} onClick={handlePieClick} />
          </div>
        </div>
  
        {/* Summary/Detail Column */}
        <div className="w-full">
          {/* Mobile View */}
          <div className="md-lg:hidden">
            {mobileView === 'summary' && (
              <SummaryTable onRowClick={handleSummaryClick} selectedDate={selectedDate} />
            )}
            {mobileView === 'detail' && (
              <DetailTable selectedDate={selectedDate} />
            )}
          </div>
          
          {/* Desktop View */}
          <div className="hidden md-lg:block">
            <button 
              onClick={handleBackClick}
              className={`ms-5 mb-3 hidden md-lg:flex items-center text-red-500 ${desktopView !== 'detail' ? 'invisible' : ''}`}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Summary
            </button>
            {desktopView === 'summary' ? (
              <SummaryTable onRowClick={handleSummaryClick} selectedDate={selectedDate} />
            ) : (
              <DetailTable selectedDate={selectedDate} />
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Donations;