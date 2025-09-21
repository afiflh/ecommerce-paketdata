import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardOutlined, DollarCircleOutlined, UserOutlined } from "@ant-design/icons";

const Navbar = ({ isSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [initial, setInitial] = useState("?");
  const navigate = useNavigate();
  const location = useLocation();

  // Helper ambil inisial dari nama
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  useEffect(() => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    if (customer && customer.name) {
      setInitial(getInitials(customer.name));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("customer");
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname === "/" || location.pathname.includes("/dashboard")) {
      return { icon: <DashboardOutlined className="mr-1" />, title: "Dashboard" };
    }
    if (location.pathname.includes("/transaksi")) {
      return { icon: <DollarCircleOutlined className="mr-1" />, title: "Transaksi Pembelian" };
    }
    if (location.pathname.includes("/profile")) {
      return { icon: <UserOutlined className="mr-1 " />, title: "Profil" };
    }
    return { icon: null, title: "" };
  };

  const { icon, title } = getTitle();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm fixed top-0 left-0 right-0 z-30">
      <div
        className={`flex items-center justify-between p-4 transition-all duration-300 h-16 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <h2 className="text-2xl font-bold text-red-600">
          {icon} {title}
        </h2>

        <div className="relative">
          <button
            className="rounded-full border-2 border-red-100 p-2 w-10 h-10 flex items-center justify-center bg-red-500 text-white font-bold hover:scale-105 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {initial}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg p-2 border border-gray-200">
              <button
                className="w-full text-left p-2 hover:bg-red-50 rounded flex items-center"
                onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false); // ✅ tutup dropdown setelah klik
                }}
              >
                <span className="mr-2">👤</span>
                Profil
              </button>
              <hr className="my-1 border-gray-200" />
              <button
                className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded flex items-center"
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false); // ✅ tutup dropdown juga setelah logout
                }}
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
