import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalPackage = ({ open, onClose, paket, onPurchase }) => {
    if (!paket) return null;

    const handlePurchase = () => {
        if (onPurchase) {
            onPurchase();
        } else {
            onClose();
        }
    };

    return (
        <>
            <Modal
                title={
                    <div className="font-poppins text-lg font-semibold text-red-600">
                        Detail Paket - {paket.name}
                    </div>
                }
                open={open}
                onOk={handlePurchase}
                onCancel={onClose}
                okText="Beli"
                cancelText="Batal"
                centered
                width={480}
                className="font-poppins"
                okButtonProps={{
                    style: {
                        backgroundColor: '#dc2626',
                        borderColor: '#dc2626',
                        color: '#ffffff',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                    },
                    onMouseEnter: (e) => {
                        const button = e.currentTarget;
                        button.style.backgroundColor = '#f87171';
                        button.style.borderColor = '#f87171';
                    },
                    onMouseLeave: (e) => {
                        const button = e.currentTarget;
                        button.style.backgroundColor = '#dc2626';
                        button.style.borderColor = '#dc2626';
                    }
                }}
                cancelButtonProps={{
                    style: {
                        backgroundColor: 'transparent',
                        borderColor: '#dc2626',
                        color: '#dc2626',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                    },
                    onMouseEnter: (e) => {
                        const button = e.currentTarget;
                        button.style.backgroundColor = '#dc2626';
                        button.style.color = '#ffffff';
                    },
                    onMouseLeave: (e) => {
                        const button = e.currentTarget;
                        button.style.backgroundColor = 'transparent';
                        button.style.color = '#dc2626';
                    }
                }}
            >
                <div className="flex flex-col gap-5 font-poppins p-6">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-xl border border-slate-200">
                        <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="text-sm font-medium text-slate-500">
                                Nama Paket:
                            </div>
                            <div className="text-base font-semibold text-slate-800">
                                {paket.name}
                            </div>

                            <div className="text-sm font-medium text-slate-500">
                                Kuota:
                            </div>
                            <div className="text-base font-semibold text-slate-800">
                                {paket.quota}
                            </div>

                            <div className="text-sm font-medium text-slate-500">
                                Berlaku:
                            </div>
                            <div className="text-base font-semibold text-slate-800">
                                {paket.validity}
                            </div>

                            <div className="text-sm font-medium text-slate-500">
                                Harga:
                            </div>
                            <div className="text-lg font-bold text-red-600 flex items-center gap-1">
                                <span className="text-sm">Rp</span>
                                {paket.price.toLocaleString("id-ID")}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 text-center font-medium">
                        💡 Pastikan nomor Anda aktif sebelum melakukan pembelian
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalPackage;