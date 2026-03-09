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

  // ❌ VULNERABLE (gardé exprès pour le TP)
  const query = `
    SELECT * FROM users 
    WHERE username = '${username}' 
    AND password = '${password}'
  `;

  try {
    const result = await pool.query(query);

    if (result.rows.length > 0) {
      // Interface après login
      return res.redirect(`/dashboard?username=${encodeURIComponent(username)}`);
    }

    return res.redirect(`/login?error=${encodeURIComponent("Identifiants incorrects")} `);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/dashboard", (req, res) => {
  const username = req.query.username ? String(req.query.username) : "";
  const safeUsername = username ? escapeHtml(username) : "utilisateur";

  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard</title>
  <style>
    :root{
      --bg:#0b1020;
      --card:#111a33;
      --text:#e8ecff;
      --muted:#aab2d5;
      --border:#2a3566;
      --accent:#7aa2ff;
      --danger:#ff6b6b;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    *{ box-sizing:border-box; }
    body{
      margin:0;
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
      background: radial-gradient(1200px 600px at 20% 0%, #121b3a 0%, var(--bg) 60%);
      color:var(--text);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
    .wrap{ width:min(720px, 100%); }
    .card{
      background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
      border:1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      backdrop-filter: blur(6px);
    }
    h1{ margin:0 0 10px; font-size: 22px; }
    p{ margin:0 0 12px; color: var(--muted); }
    .mono{ font-family: var(--mono); }
    .actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 14px; }
    a.btn{
      display:inline-block;
      padding:10px 12px;
      border:1px solid var(--border);
      border-radius: 10px;
      background: #1a2a55;
      color: var(--text);
      font-weight: 650;
      text-decoration:none;
    }
    a.btn:hover{ border-color: var(--accent); }
    .note{
      margin-top: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      border:1px solid rgba(255,107,107,0.35);
      background: rgba(0,0,0,0.25);
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>Bienvenue, <span class="mono">${safeUsername}</span></h1>
      <p>Tu es connecté. Ceci est l'interface affichée après le login.</p>

      <div class="actions">
        <a class="btn" href="/login">Se déconnecter (retour login)</a>
      </div>

      <div class="note">
        <strong>Note TP sécurité :</strong>
        cette app est volontairement vulnérable (SQL injection) — n'utilise pas ça en production.
      </div>
    </div>
  </div>
</body>
</html>`);
});

app.get("/login", (req, res) => {
  const error = req.query.error ? String(req.query.error) : "";

  const banner = error
    ? `<div class="alert fail"><strong>Erreur:</strong> <span class="mono">${escapeHtml(error)}</span></div>`
    : `<div class="alert warn">Astuce: essaie avec un compte existant dans ta table <span class="mono">users</span>.</div>`;

  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login</title>
  <style>
    :root{
      --bg:#0b1020;
      --card:#111a33;
      --text:#e8ecff;
      --muted:#aab2d5;
      --border:#2a3566;
      --accent:#7aa2ff;
      --ok:#4ade80;
      --fail:#ff6b6b;
      --warn:#fbbf24;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    *{ box-sizing:border-box; }
    body{
      margin:0;
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
      background: radial-gradient(1200px 600px at 20% 0%, #121b3a 0%, var(--bg) 60%);
      color:var(--text);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
    .card{
      width: min(440px, 100%);
      background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
      border:1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      backdrop-filter: blur(6px);
    }
    h1{ margin:0 0 12px; font-size: 22px; }
    p{ margin:0 0 14px; color: var(--muted); }
    label{ display:block; margin: 10px 0; font-size: 13px; color: var(--muted); }
    input{
      width:100%;
      margin-top:6px;
      padding:10px 12px;
      border-radius: 10px;
      border:1px solid var(--border);
      background: #0c1430;
      color: var(--text);
      outline:none;
    }
    input:focus{ border-color: var(--accent); }
    button{
      width:100%;
      margin-top: 8px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: #1a2a55;
      color: var(--text);
      font-weight: 650;
      cursor:pointer;
    }
    button:hover{ border-color: var(--accent); }
    .alert{
      margin: 0 0 12px;
      padding: 10px 12px;
      border-radius: 12px;
      border:1px solid var(--border);
      background: rgba(0,0,0,0.25);
      font-size: 13px;
    }
    .ok{ border-color: rgba(74,222,128,0.35); }
    .fail{ border-color: rgba(255,107,107,0.35); }
    .warn{ border-color: rgba(251,191,36,0.35); }
    .mono{ font-family: var(--mono); }
    .footer{
      margin-top: 10px;
      font-size: 12px;
      color: var(--muted);
      text-align:center;
    }
    .footer a{ color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Login</h1>
    <p>Entre ton username et password.</p>
    ${banner}
    <form action="/login" method="POST">
      <label>
        Username
        <input type="text" name="username" placeholder="Username" required />
      </label>

      <label>
        Password
        <input type="password" name="password" placeholder="Password" required />
      </label>

      <button type="submit">Login</button>
    </form>
    <div class="footer">
      <span class="mono">GET /login</span> • <span class="mono">POST /login</span>
    </div>
  </div>
</body>
</html>`);
});

// petite fonction utilitaire pour éviter d'injecter du HTML dans le message d'erreur
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.listen(3000, () => console.log("Server running on port 3000"));