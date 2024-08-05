import React, { useState, useEffect } from 'react';
import { faFilter, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PieChart from '../Components/General/PieChart';
import CommunitiesList from '../Components/General/CommunitiesList';
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
  const [tabletView, setTabletView] = useState('summary');

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
    setTabletView('detail');
  };

  const handleBackClick = () => {
    
    if (mobileView === 'detail') {
      setMobileView('summary');
    } else if (mobileView === 'summary') {
      setMobileView('pie');
    }
    setTabletView('summary');
  };

  return (
    <div className="p-6">
      <Header
        pageTopic="Donations"
        supportingText="Customize and View Donations"
        icon={faFilter}
        buttonText="Apply filter"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      {/* Mobile back button */}
      {mobileView !== 'pie' && (
        <button onClick={handleBackClick} className="mb-4 flex items-center text-red-500 md:hidden">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>
      )}
      <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6">
        {/* Pie Chart Column */}
        <div className={`${mobileView === 'pie' ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-96`}>
          <PieChartSection weeklyTotal={weeklyTotal} communities={communities} onClick={handlePieClick} />
        </div>

        {/* Summary/Detail Column for Mobile, Tablet, and Desktop */}
        <div className="w-full md:flex-1 lg:flex lg:space-x-6">
          {/* Mobile View */}
          <div className="md:hidden">
            {mobileView === 'summary' && <SummaryTable data={summaryData} onRowClick={handleSummaryClick} selectedDate={selectedDate} />}
            {mobileView === 'detail' && <DetailTable data={detailedData[selectedDate]} selectedDate={selectedDate} />}
          </div>
          
          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            {/* Tablet back button */}
            {tabletView === 'detail' && (
              <button onClick={handleBackClick} className="mb-4 flex items-center text-red-500">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Summary
              </button>
            )}
            {tabletView === 'summary' ? 
              <SummaryTable data={summaryData} onRowClick={handleSummaryClick} selectedDate={selectedDate} /> :
              <DetailTable data={detailedData[selectedDate]} selectedDate={selectedDate} />
            }
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex lg:space-x-6">
            <div className="flex-1 min-w-[24rem]">
              <SummaryTable data={summaryData} onRowClick={handleSummaryClick} selectedDate={selectedDate} />
            </div>
            <div className="flex-1 min-w-[24rem]">
              <DetailTable data={detailedData[selectedDate]} selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;