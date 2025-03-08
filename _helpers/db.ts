import { DataSource } from "typeorm";
import { User } from "../users/user.model";
import config from "../config.json";
import mysql from "mysql2/promise";

// Create database if it doesn't exist
async function initialize() {
    const { host, port, user, password, database } = config.database;
    
    // Create connection to check database existence
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Connect to the database using TypeORM DataSource
    const AppDataSource = new DataSource({
        type: "mysql",
        host,
        port,
        username: user,
        password,
        database,
        entities: [User],  // Import all entities here
        synchronize: true,  // Auto-sync database schema (use only in development)
        logging: true
    });

    // Initialize the connection
    await AppDataSource.initialize()
        .then(() => {
            console.log("Database connected successfully!");
        })
        .catch((error) => {
            console.error("Database connection error:", error);
        });

    return AppDataSource;
}

export default initialize;
