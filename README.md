# Express Authentication & State Management

## Purpose

This project implements a login/logout authentication flow using in-memory user credentials, session-based route protection, and a persistent dark/light theme toggle stored in a signed cookie — no database required.

---

## Structure

```
express-auth-app/
├── views/
│   ├── layouts/
│   │   └── main.hbs
│   ├── login.hbs
│   └── profile.hbs
├── public/
│   └── style.css
├── app.js
├── package.json
└── README.md
```

---

## Usage

**Install dependencies**

```bash
npm install
```

**Start the server**

```bash
npm start
```

**Start with auto-reload (development)**

```bash
npm run dev
```

The server runs at `http://localhost:3000` by default.
