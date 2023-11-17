import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import socket from "../SocketClient/socketClient";

interface AuthContextType {
  _id: string | null;
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, accessToken: string, _id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  _id: null,
  isLoggedIn: false,
  username: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [_id, set_Id] = useState<string | null>(localStorage.getItem("_id"));
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );


  const login = (username: string, accessToken: string, _id: string) => {
    set_Id(_id);
    setIsLoggedIn(true);
    setUsername(username);
    setToken(accessToken);
    localStorage.setItem("_id", _id);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("accessToken", accessToken);
  };

  const logout = () => {
    set_Id(null);
    setIsLoggedIn(false);
    setUsername(null);
    setToken(null);
    localStorage.removeItem("_id");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
  };

  useEffect(() => {
    if (isLoggedIn) {
      // If the user is logged in
      socket.emit('updateOnlineStatus',  _id,  true );
      console.log("from authcontext useffect id: " +_id)
      console.log("from authcontext useffect status: " +status)
    } else {
      // If the user is not logged in or logs out
      if (_id) { // Check if there's an ID available
        socket.emit('updateOnlineStatus',  _id, false );
        console.log("from authcontext useffect id: " +_id)
        console.log("from authcontext useffect status: " +status)
      }
    }
  }, [isLoggedIn, _id]);
  
  return (
    <AuthContext.Provider
      value={{ _id, isLoggedIn, username, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
