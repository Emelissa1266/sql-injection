const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "security_tp",
  username: "postgres",
  password: "0556021722",
  port: 5432,
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // ❌ VULNERABLE
  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  try {
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.json({ message: "Login success" });
    } else {
      res.json({ message: "Login failed" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login</title>
    </head>
    <body>
      <h1>Login</h1>
      <form action="/login" method="POST">
        <input type="text" name="username" placeholder="Username" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <button type="submit">Login</button>
      </form>
    </body>
    </html>
  `);
});

app.listen(3000, () => console.log("Server running on port 3000"));
