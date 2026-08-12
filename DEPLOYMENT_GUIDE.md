# 🚀 PetVerse Deployment Guide: Render & Vercel

This guide provides step-by-step instructions for deploying **PetVerse**:
* 🔴 **Backend (Node.js/Express)** -> Deployed on **Render.com**
* 🔵 **Frontend (React/Vite)** -> Deployed on **Vercel**

---

## 📌 Deployment Overview

```
┌─────────────────────────┐          ┌─────────────────────────┐
│     Vercel Frontend     │ ───────> │     Render Backend      │
│  (https://...vercel.app)│  HTTP    │ (https://...onrender.com)│
└─────────────────────────┘  APIs    └────────────┬────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │  MongoDB Atlas  │
                                         └─────────────────┘
```

---

## 🔴 Part 1: Deploy Backend to Render.com

### Step 1: Create a Render Web Service
1. Push your repository to **GitHub**.
2. Sign in to [Render.com](https://render.com).
3. Click **New +** -> Select **Web Service**.
4. Connect your GitHub repository.

### Step 2: Configure Service Settings
* **Name**: `petaverse-api` (or any preferred name)
* **Root Directory**: `server`
* **Environment**: `Node`
* **Build Command**: `npm install`
* **Start Command**: `npm run start`

### Step 3: Add Environment Variables in Render
In the **Environment** section of your Render Web Service, add the following key-value pairs from your `server/.env`:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://your-frontend-domain.vercel.app` (Add after Vercel deployment) |
| `MONGODB_URI` | `mongodb+srv://...` (Your MongoDB Atlas connection string) |
| `JWT_ACCESS_SECRET` | `your_access_secret_here` |
| `JWT_REFRESH_SECRET` | `your_refresh_secret_here` |
| `CLOUDINARY_CLOUD_NAME` | `dei8eih6s` |
| `CLOUDINARY_API_KEY` | `611599863473951` |
| `CLOUDINARY_API_SECRET` | `A7NlVwS0L--Lw9d6VdGqZJ2dOaI` |

Click **Deploy Web Service**. Once deployed, Render will provide a live API URL:
👉 `https://petaverse-api.onrender.com`

---

## 🔵 Part 2: Deploy Frontend to Vercel

### Step 1: Import Project to Vercel
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> Select **Project**.
3. Import your GitHub repository.

### Step 2: Configure Vercel Project
* **Framework Preset**: `Vite`
* **Root Directory**: `client`

### Step 3: Add Environment Variables in Vercel
Expand the **Environment Variables** section and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://petaverse-api.onrender.com/api/v1` (Your live Render backend URL) |

### Step 4: Deploy
Click **Deploy**. Vercel will build your React application and provide a live URL:
👉 `https://petaverse.vercel.app`

---

## 🔁 Part 3: Final CORS Linking

Once both deployments finish:
1. Go back to **Render Dashboard** -> **Environment Variables**.
2. Update `CLIENT_URL` to your live Vercel URL: `https://petaverse.vercel.app`.
3. Save changes — Render will automatically restart.

🎉 **Congratulations! Your full-stack PetVerse application is live on the internet!**
