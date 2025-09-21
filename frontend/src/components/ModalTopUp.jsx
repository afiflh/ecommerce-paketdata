import React, { useState, useEffect } from "react";
import { Modal, InputNumber, message } from "antd";

const ModalTopUp = ({ open, onClose, onTopUp, customer }) => {
  const [topUpValue, setTopUpValue] = useState(10000);
  const [loading, setLoading] = useState(false);

  // Reset nilai ketika modal ditutup
  useEffect(() => {
    if (!open) {
      setTopUpValue(10000);
    }
  }, [open]);

  const handleTopUp = async () => {
    if (!customer) {
      message.error("Data customer tidak ditemukan!");
      return;
    }

    setLoading(true);
    try {
      const newSaldo = customer.saldo + Number(topUpValue);
      
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
        throw new Error("Gagal melakukan top up");
      }

      const updatedCustomer = await response.json();
      
      // Callback ke parent component dengan data customer yang sudah diupdate
      onTopUp(updatedCustomer);
      
      message.success(`Top up berhasil! Saldo Anda sekarang Rp ${newSaldo.toLocaleString("id-ID")}`);
      onClose();
    } catch (error) {
      console.error("Error top up:", error);
      message.error("Gagal melakukan top up. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="💰 Top Up Saldo"
      open={open}
      onCancel={onClose}
      onOk={handleTopUp}
      okText="Top Up"
      cancelText="Batal"
      confirmLoading={loading}
      okButtonProps={{
        style: {
          backgroundColor: "#dc2626",
          borderColor: "#dc2626",
          fontFamily: "Poppins, sans-serif",
          fontWeight: "600",
        },
      }}
    >
      <p className="mb-2">Masukkan nominal saldo:</p>
      <InputNumber
        value={topUpValue}
        min={5000}
        step={5000}
        style={{ width: "100%" }}
        className="custom-modaltopup-input"
        formatter={(value) =>
          `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        parser={(value) => value.replace(/[^\d]/g, "")}
        onChange={(value) => setTopUpValue(value)}
      />
    </Modal>
  );
};

export default ModalTopUp;