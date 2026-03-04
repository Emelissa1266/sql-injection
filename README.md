# 🔐 SQL Injection Lab – Security TP

## 📌 Objective

The objective of this lab is to understand:

- How SQL Injection works
- How attackers exploit vulnerable queries
- How to detect SQL Injection
- How to protect an application against it

This project demonstrates a vulnerable login system built with:

- Node.js
- Express.js
- PostgreSQL

---

## 🏗 Project Structure
sql-injection-tp/
│
├── server.js
├── package.json
└── README.md


---

## ⚙️ Technologies Used

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL client)

---

## 🗄 Database Setup

### 1️⃣ Create the database
CREATE DATABASE security_tp;


## 2️⃣ Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50)
);

## 3️⃣ Insert sample user
INSERT INTO users (username, password)
VALUES ('admin', '1234');
🚀 Running the Project
1️⃣ Install dependencies
npm install
2️⃣ Start server
node server.js

Server runs on:

http://localhost:3000/login
🔴 Part 1 — Vulnerable Login (SQL Injection)

The vulnerable query:

const query = `
  SELECT * FROM users
  WHERE username = '${username}'
  AND password = '${password}'
`;
⚠ Why is this vulnerable?

User input is directly inserted into the SQL query.

An attacker can inject SQL code.

## 💥 Example of SQL Injection Attack

In the login form:

- Username:

' OR '1'='1

- Password:

anything

- Generated SQL:

**SELECT * FROM users
WHERE username = '' OR '1'='1'
AND password = 'anything';**

Since '1'='1' is always TRUE, the condition bypasses authentication.

-vResult:

Login success

- Even without knowing the password.

## ✅ Secure Version
const query = `
  SELECT * FROM users
  WHERE username = $1
  AND password = $2
`;

const result = await pool.query(query, [username, password]);

;
### 🔒 Why is this secure?

- User input is treated as data

- It cannot modify SQL structure

- Injection becomes impossible


# 🛡 Security Best Practices

- Use parameterized queries

- Hash passwords (bcrypt)

- Validate user input

- Use an ORM

- Apply least privilege to DB users

- Use IDS/IPS tools like Snort

## 🎓 What We Learned

- SQL Injection is caused by unsafe query construction

- It allows authentication bypass

- It can expose or destroy data

- Proper query parameterization prevents it completely

