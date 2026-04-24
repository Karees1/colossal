const router = require("express").Router();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        // 1. Destructure the req.body (username, password, user_type)
        const { username, password, user_type } = req.body;

        // 2. Check if user exists (if so, throw error)
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [
            username
        ]);

        if (user.rows.length !== 0) {
            return res.status(401).send("User already exists");
        }

        // 3. Bcrypt the user password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 4. Enter the new user inside our database
        const newUser = await pool.query(
            "INSERT INTO users (username, password, user_type) VALUES ($1, $2, $3) RETURNING *",
            [username, bcryptPassword, user_type]
        );

        // 5. Generating our jwt token
        const token = jwt.sign(
            { id: newUser.rows[0].id, user_type: newUser.rows[0].user_type },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        // 1. Destructure the req.body
        const { username, password } = req.body;

        // 2. Check if user doesn't exist (if not then we throw error)
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [
            username
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Username is incorrect");
        }

        // 3. Check if incoming password is the same the database password
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json("Password or Username is incorrect");
        }

        // 4. Give them the jwt token
        const token = jwt.sign(
            { id: user.rows[0].id, user_type: user.rows[0].user_type },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;