import React, { createContext, useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transaksi from "./pages/Transaksi";
import Login from "./pages/auth/Login";
import Profile from "./pages/Profile";

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("customer");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <AuthProvider>
      <AppContent 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
    </AuthProvider>
  );
};

const AppContent = ({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-200 font-poppins">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <>
                <Sidebar
                  isOpen={sidebarOpen}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className="flex-1">
                  <Navbar activeMenu={activeMenu} isSidebarOpen={sidebarOpen} />
                  <main
                    className={`p-6 mt-16 transition-all duration-300 ${
                      sidebarOpen ? "ml-64" : "ml-20"
                    }`}
                  >
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/transaksi" element={<Transaksi />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                </div>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;