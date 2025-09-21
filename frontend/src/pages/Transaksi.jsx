import React, { useEffect, useState } from "react";
import { Spin, Tag, Empty, message } from "antd";
import { CalendarOutlined, ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    if (storedCustomer) {
      setCustomer(storedCustomer);
    }
  }, []);

  useEffect(() => {
    if (customer) {
      fetchTransactions();
      fetchPackages();
    }
  }, [customer]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3000/transactions");
      if (!response.ok) throw new Error("Gagal fetch transactions");
      
      const data = await response.json();
      
      // Filter transaksi berdasarkan customerId yang login
      const customerTransactions = data.filter(
        transaction => transaction.customerId === parseInt(customer.id)
      );
      
      // Sort berdasarkan tanggal terbaru
      const sortedTransactions = customerTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      message.error("Gagal mengambil data transaksi");
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:3000/packages");
      if (!response.ok) throw new Error("Gagal fetch packages");
      
      const data = await response.json();
      setPackages(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Gagal mengambil data paket");
      setLoading(false);
    }
  };

  const getPackageInfo = (packageId) => {
    return packages.find(pkg => pkg.id === packageId.toString());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusTag = (status) => {
    if (status === "success") {
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Berhasil
        </Tag>
      );
    } else if (status === "pending") {
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          Menunggu
        </Tag>
      );
    }
    return <Tag color="default">{status}</Tag>;
  };

  if (loading) {
    return (
      <div className="bg-gray-100 pb-3 rounded-tl-2xl rounded-tr-2xl p-4">
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pb-3 rounded-tl-2xl rounded-tr-2xl p-4">
      <h2 className="text-xl font-bold mb-1 text-red-600">Riwayat Transaksi Pembelian</h2>
      <p className="text-gray-600 text-sm">
        {transactions.length} transaksi telah dilakukan.
      </p>
      <div className="border-b border-gray-300 mb-7"></div>
      
      {transactions.length === 0 ? (
        <Empty 
          description="Belum ada transaksi"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {transactions.map((transaction) => {
            const packageInfo = getPackageInfo(transaction.packageId);
            
            return (
              <div 
                key={transaction.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-red-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingOutlined className="text-red-500" />
                    <h3 className="font-semibold text-gray-800">
                      {packageInfo ? packageInfo.name : `Paket ID: ${transaction.packageId}`}
                    </h3>
                  </div>
                  {getStatusTag(transaction.status)}
                </div>
                
                {packageInfo && (
                  <div className="mb-3 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Kuota:</span> {packageInfo.quota}
                    </div>
                    <div>
                      <span className="font-medium">Berlaku:</span> {packageInfo.validity}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Harga:</span> 
                      <span className="text-red-600 font-bold ml-1">
                        Rp {packageInfo.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarOutlined />
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Transaksi;