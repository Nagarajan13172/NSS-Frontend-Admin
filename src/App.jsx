import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { getToken, removeToken } from './auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };

  return isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
}

export default App;
