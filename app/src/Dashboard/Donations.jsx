import React, { useState, useEffect } from 'react';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from '../Components/General/Header';
import PieChartSection from '../Components/General/PieChartSection';
import SummaryTable from '../Components/General/SummaryTable';
import DetailTable from '../Components/General/DetailTable';

const Donations = ({ isUserDrawerOpen }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [detailedData, setDetailedData] = useState({});
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [mobileView, setMobileView] = useState('pie');
  const [desktopView, setDesktopView] = useState('summary');

  const communities = [
    { name: 'Animal Rescue Foundation', percentage: 30 },
    { name: 'Tolarian Community College', percentage: 20 },
    { name: 'Rings of Chaos', percentage: 20 },
    { name: 'Tulsa Makerspace', percentage: 15 },
    { name: 'Tulsa Spotlight Theatre', percentage: 10 },
    { name: 'Centsable', percentage: 5 },
  ];
  
  const stores = [
    'Walmart', 'Target', 'Amazon', 'Best Buy', 'Home Depot', 'Lowe\'s', 'Costco', 
    'Kroger', 'Walgreens', 'CVS', 'Aldi', 'Whole Foods', 'Trader Joe\'s', 'Publix', 
    'Safeway', 'Meijer', 'Dollar General', 'Dollar Tree', 'Family Dollar', 'Kohl\'s', 
    'Macy\'s', 'Nordstrom', 'TJ Maxx', 'Ross', 'Marshalls', 'HomeGoods', 'Bed Bath & Beyond', 
    'Staples', 'Office Depot', 'PetSmart'
  ];

  useEffect(() => {
    // Generate detailed data
    const newDetailedData = Array(20).fill().reduce((acc, _, index) => {
      const date = `07/${23 - index}`;
      const transactions = Array(Math.floor(Math.random() * 5) + 1).fill().map(() => ({
        organization: stores[Math.floor(Math.random() * stores.length)],
        amount: (Math.random() * 0.99 + 0.01).toFixed(2),
        photo: `https://picsum.photos/100/100?random=${Math.random()}`
      }));
      acc[date] = transactions;
      return acc;
    }, {});

    // Generate summary data based on detailed data
    const newSummaryData = Object.entries(newDetailedData).map(([date, transactions]) => {
      const amount = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2);
      return {
        date,
        amount,
        transactions: transactions.slice(0, 3)
      };
    });

    // Calculate weekly total (sum of first 7 entries)
    const newWeeklyTotal = newSummaryData.slice(0, 7).reduce((sum, day) => sum + parseFloat(day.amount), 0).toFixed(2);

    setDetailedData(newDetailedData);
    setSummaryData(newSummaryData);
    setWeeklyTotal(newWeeklyTotal);
  }, []);

  const handlePieClick = () => {
    setMobileView('summary');
  };

  const handleSummaryClick = (date) => {
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
      <div className="h-4 mb-4">
        {/* Mobile back button */}
        <button 
          onClick={handleBackClick} 
          className={`md-lg:hidden flex items-center text-red-500 ${mobileView === 'pie' ? 'invisible' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {mobileView === 'detail' ? 'Back to Summary' : 'Back to Pie Chart'}
        </button>
  
        {/* Desktop back button - only shown in detail view */}
        <button 
          onClick={handleBackClick} 
          className={`hidden md-lg:flex items-center text-red-500 ${desktopView !== 'detail' ? 'invisible' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Summary
        </button>
      </div>
      <div className={`grid gap-6 ${isUserDrawerOpen ? 'grid-cols-1' : 'grid-cols-1 md-lg:grid-cols-[auto,1fr]'}`}>
        {/* Pie Chart Column */}
        <div className={`${mobileView === 'pie' ? 'block' : 'hidden'} md-lg:block w-full justify-self-center md-lg:justify-self-start`}>
          <div className="w-full max-w-[90%] mx-auto md-lg:max-w-full">
            <PieChartSection weeklyTotal={weeklyTotal} communities={communities} onClick={handlePieClick} />
          </div>
        </div>
  
        {/* Summary/Detail Column */}
        <div className="w-full">
          {/* Mobile View */}
          <div className="md-lg:hidden">
            {mobileView === 'summary' && (
              <SummaryTable data={summaryData} onRowClick={handleSummaryClick} selectedDate={selectedDate} />
            )}
            {mobileView === 'detail' && (
              <DetailTable data={detailedData[selectedDate]} selectedDate={selectedDate} />
            )}
          </div>
          
          {/* Desktop View */}
          <div className="hidden md-lg:block">
            {desktopView === 'summary' ? (
              <SummaryTable data={summaryData} onRowClick={handleSummaryClick} selectedDate={selectedDate} />
            ) : (
              <DetailTable data={detailedData[selectedDate]} selectedDate={selectedDate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;