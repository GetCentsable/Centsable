import NavBar from '../Navigation/NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Discover from './Discover';
import Donations from './Donations';
import Accounts from './Accounts';


const Dashboard = ({ userUsername, signOut, userEmail }) => {
  return (
    <Router>
      <div className="sideNavBar">
        <NavBar
          userUsername={userUsername}
          signOut={signOut}
          userEmail={userEmail}
        />
      </div>
      <main>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </main>
    </Router>
  )
};

export default Dashboard;