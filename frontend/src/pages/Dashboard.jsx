import React, { useEffect, useState } from "react";
import { Input, Modal, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import ModalPackage from "../components/ModalPackage";
import ModalTopUp from "../components/ModalTopUp"; // Import komponen baru

const { Search } = Input;

const Dashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // 🔹 state untuk modal top up
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (storedCustomer) setCustomer(storedCustomer);
  }, []);

  useEffect(() => {
    getPackage();
  }, []);

  const handleOpenModal = (paket) => {
    setSelectedPackage(paket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const handlePurchasePackage = async () => {
    if (!customer || !selectedPackage) {
      message.error("Data customer atau paket tidak ditemukan!");
      return;
    }

    // Cek apakah saldo mencukupi
    if (customer.saldo < selectedPackage.price) {
      message.error("Saldo tidak mencukupi! Silakan top up terlebih dahulu.");
      handleCloseModal();
      return;
    }

    setPurchaseLoading(true);
    
    try {
      // Kurangi saldo customer
      const newSaldo = customer.saldo - selectedPackage.price;
      
      console.log('Pembelian paket:', {
        customerName: customer.name,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        oldBalance: customer.saldo,
        newBalance: newSaldo
      });
      
      const response = await fetch(`http://localhost:3000/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...customer,
          saldo: newSaldo,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan pembelian paket");
      }

      const updatedCustomer = await response.json();
      console.log('Customer updated:', updatedCustomer);
      
      // 🔹 Tambahkan transaksi baru ke database
      await createTransaction(customer.id, selectedPackage.id);
      
      // Update state customer dan localStorage
      setCustomer(updatedCustomer);
      localStorage.setItem("customer", JSON.stringify(updatedCustomer));
      
      handleCloseModal();
      showSuccessModal();
      
      message.success(`Pembelian berhasil! Saldo tersisa: Rp ${newSaldo.toLocaleString("id-ID")}`);
    } catch (error) {
      console.error("Error purchase package:", error);
      message.error("Gagal melakukan pembelian paket. Silakan coba lagi.");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const showSuccessModal = () => {
    let secondsToGo = 5;
    const instance = modal.success({
      title: "🎉 Pembelian Berhasil!",
      content: `Paket "${selectedPackage?.name}" telah berhasil dibeli! Saldo Anda sekarang Rp ${(customer?.saldo - selectedPackage?.price)?.toLocaleString("id-ID")}. Modal ini akan tertutup dalam ${secondsToGo} detik.`,
      okText: "Tutup",
      className: "font-poppins",
      okButtonProps: {
        style: {
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          fontFamily: "Poppins, sans-serif",
          fontWeight: "600",
        },
      },
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `Paket "${selectedPackage?.name}" telah berhasil dibeli! Saldo Anda sekarang Rp ${(customer?.saldo - selectedPackage?.price)?.toLocaleString("id-ID")}. Modal ini akan tertutup dalam ${secondsToGo} detik.`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  const getPackage = async () => {
    try {
      const res = await fetch("http://localhost:3000/packages");
      if (!res.ok) throw new Error("Gagal fetch packages");
      const data = await res.json();

      setPackages(data);
      setFilteredPackages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const saldoPulsa = customer?.saldo || 0;

  const onSearch = (value) => {
    const filtered = packages.filter((p) =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPackages(filtered);
  };

  const categories = ["Harian", "Mingguan", "Bulanan"];

  const toggleExpand = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getPackagesByCategory = (category) =>
    filteredPackages.filter((p) =>
      p.name.toLowerCase().includes(category.toLowerCase())
    );

  // 🔹 fungsi handle top up (diperbaharui untuk menerima updated customer dari API)
  const handleTopUp = (updatedCustomer) => {
    setCustomer(updatedCustomer);
    localStorage.setItem("customer", JSON.stringify(updatedCustomer));
  };

  // 🔹 fungsi untuk membuat transaksi baru
  const createTransaction = async (customerId, packageId) => {
    try {
      const transactionData = {
        customerId: parseInt(customerId),
        packageId: parseInt(packageId),
        date: new Date().toISOString(),
        status: "success"
      };

      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat transaksi");
      }

      const newTransaction = await response.json();
      console.log('Transaction created:', newTransaction);
      
      return newTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      // Tidak perlu menampilkan error ke user karena ini background process
    }
  };

  return (
    <div className="bg-gray-100 pb-3 rounded-tl-2xl rounded-tr-2xl p-4">
      {/* Banner */}
      <div className="bg-red-500 text-white rounded-xl p-6 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">PAKETIN</h1>
        <p>
          Halo, <span className="font-semibold">{customer?.name || "User"}</span>
        </p>
        <p className="mt-2 text-xl font-bold flex items-center gap-2">
          Saldo Pulsa: Rp {saldoPulsa.toLocaleString("id-ID")},00
          <PlusCircleOutlined
            className="cursor-pointer text-white text-xl hover:text-gray-200"
            onClick={() => setIsTopUpOpen(true)}
          />
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-red-600">
        Paket yang tersedia
      </h1>
      <div className="mb-6">
        <Search
          placeholder="Cari paket data..."
          onSearch={onSearch}
          enterButton
          className="font-poppins"
        />
      </div>

      {/* Paket Data per Kategori */}
      {categories.map((category) => {
        const paketByCategory = getPackagesByCategory(category);
        if (paketByCategory.length === 0) return null;

        const isExpanded = expandedCategories[category];
        const displayPackages = isExpanded
          ? paketByCategory
          : paketByCategory.slice(0, 3);

        return (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-600">{category}</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
              {displayPackages.map((paket) => (
                <div
                  key={paket.id}
                  className="border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition bg-white"
                >
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    {paket.name}
                  </h3>
                  <p className="text-gray-700">Kuota: {paket.quota}</p>
                  <p className="text-gray-700">
                    Berlaku hingga: {paket.validity}
                  </p>
                  <p className="text-gray-700">
                    Harga: Rp {paket.price.toLocaleString("id-ID")}
                  </p>
                  <button
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleOpenModal(paket)}
                  >
                    Beli Sekarang
                  </button>
                </div>
              ))}
            </div>
            {paketByCategory.length > 3 && (
              <div
                className="flex justify-center mt-4 cursor-pointer text-red-600 font-semibold hover:underline"
                onClick={() => toggleExpand(category)}
              >
                {isExpanded ? "Lihat lebih sedikit" : "Lihat lainnya..."}
              </div>
            )}

            <hr className="my-6 border-gray-300" />
          </div>
        );
      })}

      {/* Modal Package Detail */}
      <ModalPackage
        open={isModalOpen}
        onClose={handleCloseModal}
        paket={selectedPackage}
        onPurchase={handlePurchasePackage}
        customer={customer}
        loading={purchaseLoading}
      />

      {/* Modal Top Up (menggunakan komponen baru) */}
      <ModalTopUp
        open={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
        customer={customer}
      />

      {/* Context Holder untuk Modal Success */}
      {contextHolder}
    </div>
  );
};

export default Dashboard;