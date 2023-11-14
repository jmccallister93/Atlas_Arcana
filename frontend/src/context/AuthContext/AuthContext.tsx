import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import socket from '../SocketClient/socketClient';


interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  isLoggedIn: false,
  username: null,
  token: null,
  login: () => {},
  logout: () => {}
});
export const useAuth = () => {
  const context = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");
  console.log("From auth context: " + context)
  console.log("From auth token: " + token)
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem('username')
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setToken(accessToken);
    }
  }, []);

  const login = (username: string, accessToken: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setToken(accessToken);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('accessToken', accessToken);
    socket.emit('userStatusChange', { username, status: 'online' });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    socket.emit('userStatusChange', { username, status: 'offline' });
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, username, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
