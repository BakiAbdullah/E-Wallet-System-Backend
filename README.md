
# 💰 Digital Wallet System (Express + TypeScript + MongoDB)

A role-based digital wallet system (similar to bKash/Nagad) built using **Express.js**, **TypeScript**, **MongoDB**, and **Mongoose**. It supports multiple user roles (User, Agent, Admin) with secure transactions including **top-up**, **withdraw**, **send money**, and **transaction tracking**.

---

## 🚀 Features

- 🔐 **JWT-based Authentication**
- 👤 Role-based access: `User`, `Agent`, `Admin`
- 💳 Wallet creation & management
- 💰 Transactions:
  - Top-up (Agent → User)
  - Withdraw (User → Agent)
  - Send money (User → User)
- 📄 Transaction history with pagination, filtering, and sorting
- 🛑 Blocked wallet handling
- ✅ Agent approval flow
- 🔄 Mongoose middleware for validations
- 📊 Aggregation-based reporting

---

## 🏗️ Tech Stack

| Tech             | Description                         |
|------------------|-------------------------------------|
| **Node.js**      | Runtime                             |
| **Express.js**   | Server framework                    |
| **TypeScript**   | Strongly typed JavaScript           |
| **MongoDB**      | NoSQL database                      |
| **Mongoose**     | ODM for MongoDB                     |
| **Zod**          | Schema validation                   |
| **JWT**          | Authentication                      |
| **bcrypt**       | Password hashing                    |
| **dotenv**       | Environment configuration           |

---

## 📁 Project Structure

```
src/
│
├── app/
│   ├── modules/
│   │   ├── user/
│   │   ├── wallet/
│   │   ├── transaction/
│   │   └── auth/
│   ├── middlewares/
│   ├── utils/
│   ├── constants/
│   ├── interfaces/
│   ├── config/
│   └── routes/
│
├── server.ts
└── app.ts
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/your-username/digital-wallet-system.git

# Navigate into the folder
cd digital-wallet-system

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

---

## 🧪 Available Scripts

```bash
# Run in dev mode with nodemon
npm run dev

# Build TypeScript
npm run build

# Start compiled JS
npm start
```

---

## 🧩 API Endpoints

| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/v1/auth/signup`     | Register new user               |
| POST   | `/api/v1/auth/login`      | Login with credentials          |
| GET    | `/api/v1/users/me`        | Get current user profile        |
| POST   | `/api/v1/wallet/top-up`   | Agent tops up user wallet       |
| POST   | `/api/v1/wallet/send`     | User sends money to another     |
| POST   | `/api/v1/wallet/withdraw` | User withdraws via agent        |
| GET    | `/api/v1/transactions`    | List transactions with filters  |

> More routes are available inside `routes/` folder.

---

## 🔐 Roles & Permissions

| Role   | Permissions                                                                 |
|--------|------------------------------------------------------------------------------|
| User   | Send money, withdraw, view wallet, transaction history                      |
| Agent  | Top-up users, receive withdrawals, must be approved to operate              |
| Admin  | Approve agents, block/unblock wallets, view system stats                    |

---

## ✅ Validation & Business Rules

- **Zod validation** on all request inputs
- Agents **must be approved** before they can operate
- Users **cannot top-up themselves**
- Users **cannot send to blocked wallets**
- Wallets **must be active** for all transactions
- **Atomic** operations using MongoDB transactions

---

## 🧠 Developer Notes

- MongoDB transaction used for **top-up**, **withdraw**, and **send money**
- Uses custom `AppError` class and global error handler
- Clean architecture with **modular folders**
- Includes **query builder** for filtering/pagination/sorting
- Uses **Mongoose static & instance methods**, **middleware hooks**

---

## 🌱 Environment Variables

Create a `.env` file in root:

```env
PORT=5000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/walletDB
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

---

## 📬 Postman Collection

👉 Import the `postman_collection.json` file (included in the project) to test all routes.

---

## 📌 TODO (For Production)

- [ ] Add rate limiting
- [ ] Add refresh token support
- [ ] Add email notifications
- [ ] Unit testing with Jest
- [ ] Swagger API docs

---

## 👨‍💻 Author

> Developed with ❤️ by [Your Name]  
> 📧 your.email@example.com  
> 🌐 [GitHub](https://github.com/your-username)

---

## 📄 License

This project is licensed under the MIT License.
