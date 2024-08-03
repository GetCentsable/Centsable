import Dashboard from '../Dashboard/Dashboard'
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <div className="flex h-screen">
      {/* Left side - Login */}
      <div className="w-1/2 flex items-center justify-center bg-white p-12">
        <Authenticator>
          {({ signOut, user }) => (
            <div className="w-full max-w-md">
              <img src="/path-to-your-logo.png" alt="Centsable Logo" className="mb-8" />
              <h2 className="text-2xl font-bold mb-6">Log in</h2>
              {user ? (
                <>
                  <Dashboard userUsername={user.username} />
                  <button 
                    onClick={signOut}
                    className="mt-4 w-full bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <p>Please sign in</p>
              )}
            </div>
          )}
        </Authenticator>
      </div>

      {/* Right side - Featured Content */}
      <div className="w-1/2 bg-red-400 p-8 flex flex-col">
        <div className="text-white text-center mb-8">
          <h2 className="text-2xl font-bold">Raised Today</h2>
          <p className="text-4xl font-bold">$123,456.78</p>
        </div>
      </div>
    </div>
  )
}

export default App
