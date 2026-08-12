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
In the **Environment** section of your Render Web Service, add the exact key-value pairs from your `server/.env`:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://your-frontend.vercel.app` (Your live Vercel URL) |
| `MONGODB_URI` | `mongodb+srv://raj:Q4pfFTX0L6E1Q5zN@backend.ug9v77v.mongodb.net/petaverse?retryWrites=true&w=majority` |
| `ACCESS_TOKEN_SECRET` | `b96d0a5df0048c99214824da71647ba92a9759a3d65e608f8fe4557f3c3bb455` |
| `REFRESH_TOKEN_SECRET` | `783159d62eb37ddb3af9cfeefd091d629165b309f1d967cd4595f0de88648fbd` |
| `GOOGLE_CLIENT_ID` | `223974208520-mp12hqavep3tdtpg3svo4guvdio2ggf5.apps.googleusercontent.com` |
| `CLOUDINARY_CLOUD_NAME` | `dei8eih6s` |
| `CLOUDINARY_API_KEY` | `218521675735499` |
| `CLOUDINARY_API_SECRET` | `ueiS0zphiUPBPk0hg6S3b5BwF7c` |

Click **Deploy Web Service**. Once deployed, Render will provide a live API URL:
👉 `https://petaverse-api.onrender.com`

---

## 🔵 Part 2: Deploy Frontend to Vercel

### Step 1: Import Project to Vercel
1. Sign in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> Select **Project**.
3. Import your GitHub repository: `rajdubey555/petaverse`.

### Step 2: Configure Vercel Project
* **Framework Preset**: `Vite`
* **Root Directory**: `client`

### Step 3: Add Environment Variables in Vercel
Expand the **Environment Variables** section and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://petaverse-api.onrender.com/api/v1` (Your live Render backend URL) |
| `VITE_GOOGLE_CLIENT_ID` | `223974208520-mp12hqavep3tdtpg3svo4guvdio2ggf5.apps.googleusercontent.com` |

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
