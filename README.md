# PAKETIN - Prototype E-Commerce Paket Data

Prototype aplikasi e-commerce pembelian paket data internet dengan fitur login, manajemen customer, saldo (top up), dan transaksi paket.  
Dibuat menggunakan React (frontend) dan json-server (backend mock API).

## Cara menjalankan sistem

### 1. Clone Repository
```terminal
git clone https://github.com/afiflh/ecommerce-paketdata.git
cd ecommerce-paketdata
```

### 2. Install Dependencies
masuk ke folder frontend
```terminal
cd frontend
npm install

cd backend
npx json-server --watch db.json --port 3000
// backend akan berjalan di http://localhost:3000
```

### 3. Jalankan Frontend (React + Vite)
```terminal
npm run dev
// frontend akan berjalan di http://localhost:5173
