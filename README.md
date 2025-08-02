# 💰 Digital Wallet System (Express + TypeScript + MongoDB)

A secure, scalable digital wallet API system inspired by services like bKash/ Nagad built with **Express.js**, **TypeScript**, **MongoDB**, and **Mongoose**. It supports multiple user roles (User, Agent, Admin) with secure transactions including **top-up**, **withdraw**, **send money**, and **transaction tracking**.

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/BakiAbdullah/E-Wallet-System-Backend

# Navigate into the folder
cd digital-wallet-system

# Install dependencies
npm install
```

---

## 🌱 Environment Variables

Create a `.env` file in root:

```env
PORT=https://digital-wallet-system-backend-tau.vercel.app
DATABASE_URL=mongodb+srv://bakiabdullah:bakiabdullah@cluster0.uqgxsrk.mongodb.net/e-wallet-system?retryWrites=true&w=majority&appName=Cluster0

# Admin Credentials
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=Super_admin2

#(Keep node env in development mode so that error stack can be seen)
# NODE_ENV=production
NODE_ENV=development

# JWT
JWT_SECRET=secret_secret_access_token
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET= refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Express Session
EXPRESS_SESSION_SECRET=secret_express_session_key

# BCRYPT
BCRYPT_SALT_ROUNDS=10

```

---

## 🚀 Features

- 🔐 **JWT-based Authentication**
- 👤 Role-based access: `User`, `Agent`, `Admin`
- 👤 Different register route for `User` and `Agent`
- 💳 Wallet creation & management
- 💰 Transactions:
  - Top-up (Agent → User)
  - Withdraw (User → Agent)
  - Send money (User → User) / (Agent → User)
- 📄 Transaction history with pagination, filtering, and sorting
- 🛑 Blocked wallet handling (Blocked wallet can't perform any action)
- ✅ Agent approval flow ( Agent can not do any operations until admin approves his account.)
- 🔄 Mongoose and ZOD used for data validations
- 🔄 **Atomic** operations using MongoDB transactions

---

## 🏗️ Tech Stack

| Tech            | Description               |
| --------------- | ------------------------- |
| **Node.js**     | Runtime                   |
| **Express.js**  | Server framework          |
| **TypeScript**  | Strongly typed JavaScript |
| **MongoDB**     | NoSQL database            |
| **Mongoose**    | ODM for MongoDB           |
| **passport js** | Local credentials login   |
| **Zod**         | Schema validation         |
| **JWT**         | Authentication            |
| **bcrypt**      | Password hashing          |
| **dotenv**      | Environment configuration |

---
## 📬 Postman Collection (Download and Import)
### API Link: https://drive.google.com/file/d/1B2IFfSgUKJdyX6U1tXqtWOWqBJ8cW2lK/view?usp=sharing
## 🧩 API Endpoints

| Method | Endpoint                           |   Description                          |
| ------ | -------------------------          |   ------------------------------       |
| POST   | `/api/v1/auth/login`               |   Login with email, password           |
| POST   | `/api/v1/auth/change-password`     |   Password change route                |
| GET    | `/api/v1/user`                     |   Get all users (Admin)                |
| POST   | `/api/v1/user/register`            |   Register user                        |
| POST   | `/api/v1/user/register-agent`      |   Register agent                       |
| GET    | `/api/v1/user/agents`              |   Get all agents (Admin)               |
| PATCH  | `/api/v1/user/agent/:id/approve`   |   Approve agent                        |
| POST   | `/api/v1/wallet/top-up`            |   Agent tops up user wallet            |
| POST   | `/api/v1/wallet/withdraw`          |   User withdraws via agent             |
| POST   | `/api/v1/wallet/send-money`        |   User sends money to another user     |
| GET    | `/api/v1/wallet/my-wallet`         |   Get current user's wallet            |
| PATCH  | `/api/v1/wallet/block/:walletId`   |   Block a wallet                       |
| GET    | `/api/v1/transaction/history`      |   Get All transactions with filters    |
| GET    | `/api/v1/transaction/history/me`   |   Get self transaction history         |
| GET    | `/api/v1/transaction/:id`          |   Get transaction details (Admin)      |


---

## 🔐 Roles & Permissions

| Role  | Permissions                                                             |
| ----- | --------------------------------------------------------------          |
| User  | Send money, withdraw, view wallet, transaction history                  |
| Agent | Top-up users, receive withdrawals, must be approved by admin to Operate |
| Admin | Approve agents, block/unblock wallets, view system stats                |

---

## ✅ Validation & Business Rules

- **Zod validation** on all request inputs
- Agents **must be approved** before they can operate
- Users **cannot top-up themselves**
- Users **cannot send to blocked wallets**
- Wallets **must be active** for all transactions

---

## 🧠 Developer Notes

- MongoDB transaction used for **top-up**, **withdraw**, and **send money**
- Uses custom `AppError` class and global error handler
- Clean architecture with **modular folders**
- Includes **query builder** for filtering/pagination/sorting
- Uses **Mongoose instance methods**, **pre middleware hooks**


---

## 👨‍💻 Author

> Developed with ❤️ by [ MD. Abdullahil Baki ]  
> 📧 shatil605@gmail.com  
> 🌐 [GitHub](https://github.com/BakiAbdullah)

