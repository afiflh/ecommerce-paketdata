import React, { useState, useEffect } from "react";
import {
    EditOutlined,
    SaveOutlined,
    MailOutlined,
    PhoneOutlined,
    UserOutlined,
    CalendarOutlined,
    IdcardOutlined,
    CloseOutlined
} from "@ant-design/icons";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        id: null,
        name: "",
        username: "",
        email: "",
        phone: "",
        desc: "",
        role: "",
        joinDate: "",
    });
    const [initial, setInitial] = useState("?");

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    };

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const stored = JSON.parse(localStorage.getItem("customer"));
                if (!stored) {
                    console.warn("localStorage customer tidak ditemukan.");
                    return;
                }

                // Jika sudah ada id di localStorage, gunakan langsung
                if (stored.id) {
                    setUserData(prev => ({ ...prev, ...stored }));
                    if (stored.name) setInitial(getInitials(stored.name));
                    return;
                }

                // Kalau belum ada id: coba fetch dari server dengan username
                if (stored.username) {
                    const res = await fetch(`http://localhost:3000/customers?username=${encodeURIComponent(stored.username)}`);
                    if (!res.ok) throw new Error("Gagal fetch customer dari server");
                    const arr = await res.json();
                    if (arr && arr.length > 0) {
                        const full = arr[0];
                        setUserData(prev => ({ ...prev, ...full }));
                        localStorage.setItem("customer", JSON.stringify(full)); // update localStorage agar id tersimpan
                        if (full.name) setInitial(getInitials(full.name));
                        return;
                    }
                }

                // fallback: gunakan data dari localStorage tanpa id
                setUserData(prev => ({ ...prev, ...stored }));
                if (stored.name) setInitial(stored.name.charAt(0).toUpperCase());
            } catch (err) {
                console.error("Error saat load customer:", err);
            }
        };
        loadCustomer();
    }, []);

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // Jangan set isEditing false dulu - tunggu sampai sukses
        if (!userData.id) {
            alert("ID customer tidak ada, tidak bisa update. Pastikan Anda sudah login dengan data yang tersimpan di server.");
            return;
        }

        // payload hanya field yang ingin diupdate => gunakan PATCH agar tidak menimpa seluruh resource
        const payload = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            desc: userData.desc,
            // jika mau update field lain: tambahkan di sini
        };

        try {
            const res = await fetch(`http://localhost:3000/customers/${userData.id}`, {
                method: "PATCH", // lebih aman untuk partial update
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Update gagal (status ${res.status}): ${text}`);
            }

            const updated = await res.json();

            // Gabungkan hasil update dengan state (json-server biasanya mengembalikan full object)
            const merged = { ...userData, ...updated };
            setUserData(merged);
            localStorage.setItem("customer", JSON.stringify(merged));
            setIsEditing(false);
            alert("Profil berhasil diperbarui.");
            console.log("Updated customer:", merged);
        } catch (err) {
            console.error("Error saat update:", err);
            alert("Gagal update profil. Cek console/network dan pastikan json-server berjalan dengan --watch.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-3 rounded-tl-2xl rounded-tr-2xl">
            <div className="relative h-64 bg-gradient-to-r from-red-500 via-red-600 to-red-700 overflow-hidden rounded-tl-2xl rounded-tr-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 -mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-1">
                        <div className="relative mb-6">
                            <div className="w-40 h-40 mx-auto lg:mx-0 relative">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-6xl font-bold shadow-2xl border-4 border-white">
                                    {initial}
                                </div>
                            </div>
                        </div>

                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Informasi Profil</h2>
                                <div className="flex space-x-1">
                                    {isEditing ? (
                                        <>
                                            {/* Tombol Save */}
                                            <button
                                                onClick={handleSave}
                                                className="p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                                            >
                                                <SaveOutlined />
                                            </button>
                                            {/* Tombol Cancel */}
                                            <button
                                                onClick={() => {
                                                    // Reset ke data terakhir yang tersimpan di localStorage
                                                    const stored = JSON.parse(localStorage.getItem("customer"));
                                                    if (stored) setUserData(stored);
                                                    setIsEditing(false);
                                                }}
                                                className="p-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                                            >
                                                <CloseOutlined />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                                        >
                                            <EditOutlined />
                                        </button>
                                    )}
                                </div>
                            </div>


                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <UserOutlined className="text-red-500" />
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-500">Nama Lengkap</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={userData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="font-semibold text-gray-800">{userData.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <IdcardOutlined className="text-red-500" />
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-500">Username</label>
                                        <p className="font-semibold text-gray-800">@{userData.username}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <MailOutlined className="text-red-500" />
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-500">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={userData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            />
                                        ) : (
                                            <p className="font-semibold text-gray-800">{userData.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <PhoneOutlined className="text-red-500" />
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-500">Telepon</label>
                                        <p className="font-semibold text-gray-800">{userData.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <CalendarOutlined className="text-red-500 mt-1" />
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-500">Bergabung Sejak</label>
                                        <p className="font-semibold text-gray-800">{userData.joinDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Bio & Role */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl p-6 lg:mt-46 md:mt-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Tentang Saya</h3>
                            {isEditing ? (
                                <textarea
                                    value={userData.desc}
                                    onChange={(e) => handleInputChange("desc", e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                    placeholder="Ceritakan tentang diri Anda..."
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed">{userData.desc}</p>
                            )}
                        </div>

                        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Role & Status</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{userData.role}</span>
                                        <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">● Aktif</span>
                                    </div>
                                </div>
                                <div className="text-6xl opacity-20">👑</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
