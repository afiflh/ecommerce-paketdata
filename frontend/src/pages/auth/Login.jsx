import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const tooglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
      
        try {
          const response = await fetch(
            `http://localhost:3000/customers?username=${username}&password=${password}`
          );
          const data = await response.json();
      
          if (data.length > 0) {
            // login berhasil
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("customer", JSON.stringify(data[0])); // simpan info customer
            
            // Trigger storage event untuk update App component
            window.dispatchEvent(new Event('storage'));
            
            // Navigate dengan small delay untuk ensure state update
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 50);
          } else {
            alert("Username atau password salah!");
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("Terjadi kesalahan saat login, coba lagi!");
        }
      };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-1">Login</h1>
                    <h2 className="text-2xl font-bold text-white mb-2">"Paketin"</h2>
                    <p className="text-red-100">Masuk ke akun Anda</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-red-300/50 bg-white/10 backdrop-blur-sm text-white placeholder-red-100 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 pr-10 border border-red-300/50 bg-white/10 backdrop-blur-sm text-white placeholder-red-100 rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-colors"
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-white"
                                onClick={tooglePasswordVisibility}
                            >
                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Masuk
                    </button>
                </form>

                {/* <div className="mt-6 text-center text-sm text-red-100">
                <p>Demo: username: <span className="font-semibold text-white">user</span></p>
                <p>password: <span className="font-semibold text-white">password</span></p>
                </div> */}
            </div>
        </div>
    );
};

export default Login;