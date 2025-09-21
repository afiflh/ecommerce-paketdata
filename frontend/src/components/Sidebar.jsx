import React from "react";
import {
    CloseCircleOutlined,
    MenuOutlined,
    DashboardOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation(); // ✅ ambil path aktif sekarang

    const menuItems = [
        { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard", path: "/" },
        { key: "transactions", icon: <DollarOutlined />, label: "Transaksi Pembelian", path: "/transaksi" },
    ];

    return (
        <div
            className={`bg-black text-white transition-all duration-300 ${isOpen ? "w-64" : "w-20"
                } min-h-screen fixed left-0 top-0 z-40 rounded-r-2xl shadow-xl`}
        >
            <div className="p-4 border-b border-gray-200/20 flex items-center justify-between h-16">
                {isOpen && <h1 className="text-xl font-bold">PAKETIN</h1>}
                <button
                    className="text-red-500 hover:bg-white/20 rounded-full p-2 w-10 h-10"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <CloseCircleOutlined /> : <MenuOutlined />}
                </button>
            </div>
            <nav className="p-4 space-y-1 mt-6">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path; // ✅ cek aktif berdasarkan path

                    return (
                        <div key={item.key}>
                            <Link
                                to={item.path}
                                className={`block w-full text-left p-3 rounded-xl items-center space-x-3 transition-colors ${isActive ? "bg-red-500" : "hover:bg-red-500/50"
                                    }`}
                            >
                                {item.icon}
                                {isOpen && <span>{item.label}</span>}
                            </Link>

                            {index < menuItems.length - 1 && (
                                <div
                                    className={`my-2 transition-all duration-300 ${isOpen ? "mx-3" : "mx-2"
                                        }`}
                                >
                                    <div className="h-px bg-gray-600/30"></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
