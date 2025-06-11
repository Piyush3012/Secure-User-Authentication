# 🔐 Secure User Authentication System – MERN Stack

This is a full-stack web application that provides a secure user authentication system using the **MERN Stack** – MongoDB, Express.js, React.js, and Node.js. The app supports user registration, login, logout, token-based authentication using JWT, and secure handling of user sessions with HTTPOnly cookies.

---

## ✨ Features

- 📝 User Registration and Login
- 🔒 Password Hashing using bcrypt
- 🛡️ JWT Token-Based Authentication
- 🍪 HTTPOnly Cookie Storage for Tokens (prevents XSS)
- 🚫 Protected Routes for Authenticated Users Only
- 🔄 Persistent Login State
- 🧠 Global State Handling using React Context API
- ❌ Proper Error Handling and Form Validation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)

### Authentication & Security
- bcrypt
- JWT (JSON Web Tokens)
- HTTPOnly Cookies

---

## 📁 Folder Structure

mern-auth-app/
├── client/ # React frontend
├── server/ # Node.js + Express backend
└── README.md


---

## ⚙️ Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/mern-auth-app.git
cd mern-auth-app

exit

### 🟦 Step 2: Backend Setup

```bash
cd server
npm install


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

npm start

exit

## 🟦 Step 3: Frontend Setup

```bash 

cd ../client
npm install
npm start
 
exit 

🔐 Security Best Practices:

- Use bcrypt for password hashing before storing in the DB.
- Store JWT tokens in HTTPOnly cookies to prevent XSS attacks.
- Use environment variables for secrets and DB credentials.
- Apply CORS policy carefully to allow frontend domain.



---

Let me know if you'd like me to [create a downloadable file for this](f) or help you [add a license and deployment instructions too](f).
