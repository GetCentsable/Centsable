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

  useEffect(() => {
    if (!transactionsLoaded) return;

    const currentDate = endOfToday();
    const previousMonday = startOfWeek(currentDate, { weekStartsOn: 1 });

    const newWeeklyTotal = transactions.reduce((totalSum, dateObj) => {
      const dateKey = Object.keys(dateObj)[0];
      const transactionEntries = Object.values(dateObj[dateKey]);

      const date = parse(transactionEntries[0].date, 'MM/dd/yyyy', new Date());
      if (isWithinInterval(date, { start: previousMonday, end: currentDate })) {
        const dateTotal = transactionEntries.reduce((daySum, transaction) => {
          return daySum + parseFloat(transaction.round_up);
        }, 0);
        return totalSum + dateTotal;
      }
      return totalSum;
    }, 0).toFixed(2);

    setWeeklyTotal(newWeeklyTotal);
  }, [transactions, transactionsLoaded]);

  const handlePieClick = () => {
    setMobileView('summary');
    setDesktopView('summary'); // Add this line to update desktop view as well
  };

  const handleUpdateCommunities = (updatedCommunities) => {
    // setCommunities(updatedCommunities);
  };

  const handleSummaryClick = (date) => {
    setSelectedDate(date);
    setMobileView('detail');
    setDesktopView('detail');
  };

  const handleBackClick = () => {
    if (mobileView === 'detail' || desktopView === 'detail') {
      setMobileView('summary');
      setDesktopView('summary');
    } else if (mobileView === 'summary') {
      setMobileView('pie');
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
      {/* Mobile back button */}
      <button 
        onClick={handleBackClick} 
        className={`mb-2 lg:hidden flex items-center text-red-500 ${mobileView === 'pie' ? 'invisible' : ''}`}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        {mobileView === 'detail' ? 'Back to Summary' : 'Back to Pie Chart'}
      </button>
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
        <div className={`flex flex-col lg:flex-row gap-6`}>
          {/* Pie Chart Column */}
          <div className={`
            ${mobileView === 'pie' ? 'block' : 'hidden'}
            lg:block
            w-full 
            md-lg:w-[100%] lg:w-[40%] xl:w-[33%] 2xl:w-[33%]
            max-w-[650px] 
            mx-auto lg:mx-0 md-lg:pt-9
          `}>
            <PieChartSection 
              weeklyTotal={weeklyTotal} 
              onUpdateCommunities={handleUpdateCommunities}
              onClick={handlePieClick}
            />
          </div>
  
          {/* Summary/Detail Column */}
          <div className="w-full">
            {/* Mobile and Intermediate View (up to 1023px) */}
            <div className="lg:hidden">
              {(mobileView === 'summary' || mobileView === 'detail') && (
                mobileView === 'summary' ? (
                  <SummaryTable onRowClick={handleSummaryClick} selectedDate={selectedDate} />
                ) : (
                  <DetailTable selectedDate={selectedDate} />
                )
              )}
            </div>
            
            {/* Desktop View (1024px and above) */}
            <div className="hidden lg:block">
              <button 
                onClick={handleBackClick}
                className={`ms-5 mb-3 hidden lg:flex items-center text-red-500 ${desktopView !== 'detail' ? 'invisible' : ''}`}
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