const Pool = require("pg").Pool; // 1. Import the 'Pool' tool

const pool = new Pool({          // 2. Configure the connection
    user: "postgres",
    password: "Kariuki_123",
    host: "localhost",
    port: 5432,
    database: "colossal1"
});

module.exports = pool;           // 3. Export it so other files can use it