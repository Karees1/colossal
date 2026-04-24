const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
const pool = new Pool({
    user: "postgres",      // <--- CHANGE THIS to your Postgres username
    host: "localhost",
    database: "colossal2",
    password: "password",  // <--- CHANGE THIS to your Postgres password
    port: 5432,
});

// --- IMAGE UPLOAD CONFIGURATION ---
// Note: We use '../public' because we are inside the 'server' folder
const uploadDir = path.join(__dirname, "../public/utilities/images");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Saves to React's public folder
    },
    filename: (req, file, cb) => {
        // Create a unique filename: timestamp-originalname
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });


// --- ROUTES ---

// 1. GET All Products (with Category Filter)
app.get("/products", async (req, res) => {
    try {
        const { category } = req.query;
        let query = "SELECT * FROM products";
        let params = [];

        if (category) {
            query += " WHERE LOWER(category) = $1";
            params.push(category.toLowerCase());
        }

        const result = await pool.query(query, params);

        // Parse JSON strings back to arrays for the frontend
        const products = result.rows.map(product => ({
            ...product,
            sizes: product.sizes ? JSON.parse(product.sizes) : [],
            colors: product.colors ? JSON.parse(product.colors) : []
        }));

        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. GET Single Product
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const product = result.rows[0];
        // Parse JSON fields
        product.sizes = product.sizes ? JSON.parse(product.sizes) : [];
        product.colors = product.colors ? JSON.parse(product.colors) : [];

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 3. POST Create Product (Admin Upload)
app.post("/products", async (req, res) => {
    try {
        const { name, price, category, sub_category, sizes, colors, frontimg, backimg, description, material } = req.body;

        const newProduct = await pool.query(
            `INSERT INTO products (name, price, category, sub_category, sizes, colors, frontimg, backimg, description, material) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                name,
                price,
                category,
                sub_category,
                JSON.stringify(sizes),   // Convert Array -> String for DB
                JSON.stringify(colors),  // Convert Array -> String for DB
                frontimg,
                backimg,
                description,
                material
            ]
        );

        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 4. POST Upload Image
app.post("/upload", upload.single("image"), (req, res) => {
    try {
        // Return the filename so the frontend can save it to the DB
        res.json({ filename: req.file.filename });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});