const express      = require("express");
const cors         = require("cors");
const { Pool }     = require("pg");
const multer       = require("multer");
const path         = require("path");
const fs           = require("fs");
const bcrypt       = require("bcrypt");
const jwt          = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const rateLimit    = require("express-rate-limit");

const app  = express();
const PORT = 5000;

const JWT_SECRET         = "gentleman_jwt_secret_2024";
const JWT_REFRESH_SECRET = "gentleman_refresh_secret_2024";
const SALT_ROUNDS        = 10;

// ─── MIDDLEWARE ──────────────────────────────────────────
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Static files – serve uploaded images
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

// ─── DATABASE ────────────────────────────────────────────
const pool = new Pool({
    user:     "postgres",
    host:     "localhost",
    database: "colossal2",
    password: "Kariuki_123",
    port:     5432,
});

// Auto-create tables on startup
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id            SERIAL PRIMARY KEY,
                username      VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                user_type     VARCHAR(20) DEFAULT 'user',
                created_at    TIMESTAMP DEFAULT NOW()
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id         SERIAL PRIMARY KEY,
                user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
                items      JSONB NOT NULL,
                shipping   JSONB,
                billing    JSONB,
                currency   VARCHAR(10) DEFAULT 'KES',
                status     VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        const { rows } = await pool.query("SELECT count(*) FROM products");
        console.log(`✅ Connected to 'colossal2' — ${rows[0].count} products`);
    } catch (err) {
        console.error("DB init error:", err.message);
    }
};

initDB();

// ─── RATE LIMITERS ───────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts — please try again later." },
});

// ─── AUTH MIDDLEWARE ─────────────────────────────────────
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        req.user = jwt.verify(header.split(" ")[1], JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

const adminOnly = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user?.user_type !== "admin")
            return res.status(403).json({ error: "Admin access required" });
        next();
    });
};

// ─── IMAGE UPLOAD ─────────────────────────────────────────
const uploadDir = path.join(__dirname, "../public/utilities/images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename:    (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, Date.now() + "-" + Math.random().toString(36).slice(2) + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Only image files are allowed (JPEG, PNG, WEBP, GIF)"));
    },
});

// ─── AUTH ROUTES ──────────────────────────────────────────

// POST /auth/register
app.post("/auth/register", authLimiter, async (req, res) => {
    try {
        const { username, password, user_type = "user" } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: "Username and password are required" });

        const exists = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
        if (exists.rows.length > 0)
            return res.status(409).json({ error: "Username already taken" });

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const { rows } = await pool.query(
            "INSERT INTO users (username, password_hash, user_type) VALUES ($1, $2, $3) RETURNING id, username, user_type",
            [username, password_hash, user_type]
        );

        const user         = rows[0];
        const accessToken  = jwt.sign({ id: user.id, username: user.username, user_type: user.user_type }, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:   false,
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ accessToken, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /auth/login
app.post("/auth/login", authLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: "Username and password are required" });

        const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (rows.length === 0)
            return res.status(401).json({ error: "Invalid username or password" });

        const user  = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ error: "Invalid username or password" });

        const accessToken  = jwt.sign({ id: user.id, username: user.username, user_type: user.user_type }, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:   false,
            sameSite: "lax",
            maxAge:   7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken, user: { id: user.id, username: user.username, user_type: user.user_type } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /auth/logout
app.post("/auth/logout", (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
    res.json({ message: "Logged out" });
});

// POST /auth/refresh
app.post("/auth/refresh", async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ error: "No refresh token" });

        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

        const { rows } = await pool.query(
            "SELECT id, username, user_type FROM users WHERE id = $1",
            [decoded.id]
        );
        if (rows.length === 0) return res.status(401).json({ error: "User not found" });

        const user        = rows[0];
        const accessToken = jwt.sign({ id: user.id, username: user.username, user_type: user.user_type }, JWT_SECRET, { expiresIn: "24h" });

        res.json({ accessToken, user });
    } catch {
        res.status(401).json({ error: "Invalid refresh token" });
    }
});

// ─── ORDERS ROUTES ────────────────────────────────────────

// POST /api/orders  (guest or authenticated)
app.post("/api/orders", async (req, res) => {
    try {
        const { userId, items, shipping, billing, currency = "KES" } = req.body;

        const { rows } = await pool.query(
            "INSERT INTO orders (user_id, items, shipping, billing, currency) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [userId || null, JSON.stringify(items), JSON.stringify(shipping), JSON.stringify(billing), currency]
        );

        res.status(201).json({ orderId: rows[0].id, message: "Order placed successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// GET /api/orders/user/:userId  (authenticated)
app.get("/api/orders/user/:userId", authenticate, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.id !== userId && req.user.user_type !== "admin")
            return res.status(403).json({ error: "Forbidden" });

        const { rows } = await pool.query(
            "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ─── PRODUCT ROUTES ───────────────────────────────────────

// GET /products  (with optional ?category= filter)
app.get("/products", async (req, res) => {
    try {
        const { category } = req.query;
        let query  = "SELECT * FROM products";
        let params = [];

        if (category) {
            query += " WHERE LOWER(category) = $1";
            params.push(category.toLowerCase());
        }

        const { rows } = await pool.query(query, params);

        const products = rows.map(p => ({
            ...p,
            sizes:  p.sizes  ? JSON.parse(p.sizes)  : [],
            colors: p.colors ? JSON.parse(p.colors) : [],
        }));

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /products/:id
app.get("/products/:id", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [req.params.id]);

        if (rows.length === 0)
            return res.status(404).json({ message: "Product not found" });

        const product   = rows[0];
        product.sizes   = product.sizes  ? JSON.parse(product.sizes)  : [];
        product.colors  = product.colors ? JSON.parse(product.colors) : [];

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /products  (admin)
app.post("/products", adminOnly, async (req, res) => {
    try {
        const { name, price, category, sub_category, sizes, colors, frontimg, backimg, description, material } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO products (name, price, category, sub_category, sizes, colors, frontimg, backimg, description, material)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [name, price, category, sub_category, JSON.stringify(sizes), JSON.stringify(colors), frontimg, backimg, description, material]
        );

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /upload  (admin)
app.post("/upload", adminOnly, upload.single("image"), (req, res) => {
    try {
        res.json({ filename: req.file.filename });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Upload failed" });
    }
});

// PUT /products/:id  (admin)
app.put("/products/:id", adminOnly, async (req, res) => {
    try {
        const { name, price, category, sub_category, sizes, colors, frontimg, backimg, description, material } = req.body;

        const { rows } = await pool.query(
            `UPDATE products
             SET name=$1, price=$2, category=$3, sub_category=$4, sizes=$5, colors=$6,
                 frontimg=$7, backimg=$8, description=$9, material=$10
             WHERE id=$11 RETURNING *`,
            [name, price, category, sub_category, JSON.stringify(sizes), JSON.stringify(colors), frontimg, backimg, description, material, req.params.id]
        );

        if (rows.length === 0)
            return res.status(404).json({ message: "Product not found" });

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// DELETE /products/:id  (admin)
app.delete("/products/:id", adminOnly, async (req, res) => {
    try {
        const { rows } = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [req.params.id]);

        if (rows.length === 0)
            return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ─── ERROR HANDLER ───────────────────────────────────────
// Catches multer errors (file size / type) and other unhandled errors
app.use((err, req, res, next) => {
    if (err.name === "MulterError" || err.message?.includes("image files")) {
        return res.status(400).json({ error: err.message });
    }
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
});

// ─────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
