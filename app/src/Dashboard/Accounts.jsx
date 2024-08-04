import AccountHeader from '../Components/General/AccountHeader';
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
      <AccountHeader
        pageTopic="All Accounts"
        supportingText="Manage your contribution accounts"
        buttonText="Add account"
        isUserDrawerOpen={isUserDrawerOpen}
      />
      <div className="linked-account-container pt-6 max-w-8xl">
        <div className="flex flex-wrap justify-center">
          {dummyData.map((account, index) => (
            <div
            key={index}
            className="w-full md-lg:w-1/2 xl:w-1/3 3xl:w-1/4 p-4"
            >
              <Card {...account} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;