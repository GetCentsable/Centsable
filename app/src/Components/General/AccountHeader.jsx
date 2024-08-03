import PlaidLinkButton from '../Plaid/PlaidLinkButton';

const Header = ({ pageTopic, supportingText, icon, buttonText }) => {
  return (
    <div className="mb-6 flex row-auto justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pageTopic}</h1>
          <p className="text-gray-600">{supportingText}</p>
        </div>
        <PlaidLinkButton />
      </div>
  )
};

export default Header;