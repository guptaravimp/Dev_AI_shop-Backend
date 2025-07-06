
const mongoose = require("mongoose");

require("dotenv").config();

const DBConnection = () => {
    const mongoUri = process.env.DATABASE_URL || process.env.MONGODB_URI ;
    console.log("Connecting to database:", mongoUri);
    
	mongoose
		.connect(mongoUri)
		.then(() => console.log("Database connection successful"))
		.catch((err) => {
			console.log(`DB CONNECTION ISSUES`);
			console.error(err.message);
			console.log("Server will continue without database connection");
			// Don't exit the process, let the server continue
		});
};

module.exports = DBConnection;