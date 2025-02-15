# **URL Shortener API 🚀**

## **📌 Overview**

This project is a **scalable URL Shortener API** that allows users to shorten long URLs, track analytics, and manage links efficiently. It includes:

- **User Authentication** (Google Sign-In)
- **Short URL Generation** (with custom alias support)
- **Advanced Analytics** (click tracking, device & OS insights)
- **Rate Limiting** (to prevent spam)
- **Caching** (Redis for performance improvement)
- **Dockerized Deployment**

---

## **🛠 Tech Stack**

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Caching:** Redis
- **Authentication:** Google OAuth
- **Deployment:** Docker

---

## **📌 Features**

### **1️⃣ User Authentication**

- Login/Sign-up using **Google OAuth**.

### **2️⃣ Short URL Generation**

- **POST** `/api/shorten`
- Generates a **short URL** with optional **custom alias**.

### **3️⃣ Redirect Short URL**

- **GET** `/api/shorten/{alias}`
- Redirects to the **original URL** and logs analytics.

### **4️⃣ Get URL Analytics**

- **GET** `/api/analytics/{alias}`
- Tracks **total clicks, unique users, OS & device types**.

### **5️⃣ Get Topic-Based Analytics**

- **GET** `/api/analytics/topic/{topic}`
- Aggregates analytics for all URLs under a specific **category**.

### **6️⃣ Get Overall Analytics**

- **GET** `/api/analytics/overall`
- Provides an overview of **all short URLs** created by a user.

### **7️⃣ Caching with Redis**

- **Speeds up redirects & analytics queries**.

---

## **📦 Installation & Setup**

### **🔹 Prerequisites**

- Node.js (`>=16.x`)
- MongoDB (`>=4.x`)
- Redis (`>=6.x`)
- Docker (for deployment)

### **🔹 Clone the Repository**

```sh
git clone https://github.com/Govindrajewar/URL-Shortener-app.git
```
