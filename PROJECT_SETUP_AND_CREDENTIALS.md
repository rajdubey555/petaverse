# 🐾 PetVerse — Complete Setup & Account Credentials Guide

This document contains step-by-step instructions to run **PetVerse** on any new PC, along with all **Admin & User login credentials**.

---

## 📌 Project Architecture

* **Frontend**: React + Vite + Redux Toolkit + TailwindCSS (Runs on `http://localhost:5173`)
* **Backend**: Node.js + Express.js + REST API (Runs on `http://localhost:5000`)
* **Database**: MongoDB Atlas Cloud (Pre-configured connection in `server/.env`)
* **Cloud Storage**: Cloudinary (Pre-configured in `server/.env` for pet & avatar images)

---

## 🔑 Account Login Credentials

All accounts are pre-seeded and ready to use.

### 🛡️ Admin Account (Full Admin Access)

| Field | Details |
| :--- | :--- |
| **Role** | Administrator |
| **Name** | Admin PetVerse |
| **Email** | `admin@petaverse.com` |
| **Password** | `Password123!` |

---

### 👤 Standard User Accounts

| Name | Email | Password | Pre-loaded Listings |
| :--- | :--- | :--- | :--- |
| **Raj Dubey** | `raj.dubey@example.com` | `Password123!` | 10 Pet Listings |
| **Priya Sharma** | `priya.sharma@example.com` | `Password123!` | 12 Pet Listings |
| **Rahul Verma** | `rahul.verma@example.com` | `Password123!` | 10 Pet Listings |
| **Ananya Patel** | `ananya.patel@example.com` | `Password123!` | 8 Pet Listings |
| **Dubey Raj** | `dubeyraj057@gmail.com` | `Password123!` | 0 (New User) |

> 💡 **Note**: All user accounts share the default password: **`Password123!`**

---

## 🛡️ How to Open Admin Panel

1. Go to `http://localhost:5173/login` in your browser.
2. Log in using the Admin credentials:
   * **Email**: `admin@petaverse.com`
   * **Password**: `Password123!`
3. After log in, click on your profile avatar/name at the top right of the Navbar and click **Admin Dashboard**.
4. Or directly visit: `http://localhost:5173/admin`

---

## 🚀 How to Run the Project on Any New PC

Follow these simple steps when unzipping this project on a new PC:

### ⚙️ Prerequisites
Ensure Node.js (v18 or higher) is installed on the machine.
* Download from: [https://nodejs.org](https://nodejs.org)

---

### Step 1: Extract the Zip File
Unzip `petaverse.zip` to any directory (e.g. Desktop or Projects folder).

```bash
cd petaverse
```

---

### Step 2: Start Backend Server

Open a terminal window and run:

```bash
cd server
npm install
npm run dev
```

* Backend server will start running at: `http://localhost:5000`
* You should see: `🟢 Mongoose connection established | ✅ MongoDB Connected`

---

### Step 3: Start Frontend Client

Open a **second terminal window** and run:

```bash
cd client
npm install
npm run dev
```

* Frontend dev server will start running at: `http://localhost:5173`

---

### Step 4: Open in Web Browser

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ Environment Configuration Summary

The `.env` files are already included in both `/server` and `/client` directories.

### `server/.env`
* `PORT=5000`
* `NODE_ENV=development`
* `MONGODB_URI` (Connected to live MongoDB Atlas Cluster)
* `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`
* `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### `client/.env`
* `VITE_API_URL=http://localhost:5000/api/v1`

---

## ⚡ Features Available in Admin Panel (`http://localhost:5173/admin`)

1. **Dashboard Overview**: Live stats on total users, total pet listings, active reports, and recent system activities.
2. **User Management**: View all registered users, total pet counts per user, and instant **Activate / Deactivate** user toggle.
3. **Pet Listings Management**: View all pet listings across all 8 categories (Dogs, Cats, Birds, Fish, Rabbits, Hamsters, Reptiles, Others), **Toggle Featured Pet**, and **1-Click Admin Delete**.
4. **Report & Content Moderation**: Inspect user complaints, **Remove Pet & Resolve Report**, or **Suspend User & Resolve Report**.

---

## ❓ FAQ & Troubleshooting

* **Q: Database Connection Error?**
  * Make sure your PC has active Internet connection since MongoDB database and Cloudinary storage run on cloud services.
* **Q: Port 5000 or 5173 in use?**
  * Close any process running on port 5000 or 5173 before running `npm run dev`.
