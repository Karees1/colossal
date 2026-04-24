const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
    origin: 'http://localhost:3000',
};
// middleware
app.use(cors(corsOptions));
app.use(express.json()); // req.body
app.use(cors());

// ROUTES //

// register and login routes
app.use("/auth", require("./auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});