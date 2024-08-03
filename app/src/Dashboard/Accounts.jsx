import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../Components/General/Header';
import Card from '../Components/General/Card';

const Accounts = ({ isUserDrawerOpen }) => {
  const dummyData = [
    { bank: "Chase Bank", name: "SABEL PENNY", lastFour: "1234", expDate: "05/24", donated: 10.93, limit: 50 },
    { bank: "Bank of Oklahoma", name: "SABEL PENNY", lastFour: "1234", expDate: "05/24", donated: 13.37, limit: 50 },
    { bank: "TFCU", name: "SABEL PENNY", lastFour: "1234", expDate: "05/24", donated: 2.48, limit: 50 },
    { bank: "Capital One", name: "SABEL PENNY", lastFour: "1234", expDate: "05/25", donated: 0.00, limit: 50 },
    { bank: "Apple Cash", name: "SABEL PENNY", lastFour: "1234", expDate: "05/25", donated: 0.87, limit: 50 },
    { bank: "Cash App", name: "SABEL PENNY", lastFour: "1234", expDate: "05/24", donated: 3.17, limit: 50 },
  ];

  return (
    <div className="p-6">
      <Header
        pageTopic="All Accounts"
        supportingText="Manage your contribution accounts"
        icon={faPlus}
        buttonText="Add account"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      <div className="pt-14 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mx-auto">
          {dummyData.map((account, index) => (
            <Card key={index} {...account} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;