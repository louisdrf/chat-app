import express from "express";
import { AppDataSource } from "./database/database";
import 'dotenv/config';
import { initRoutes } from "./handlers/routes/routes";
import cors from 'cors';
import http from 'http'; 
import { initializeSocket } from "./socket";

const main = async () => {
    const app = express()
    const port = process.env.SERVER_PORT || 3001

    app.use(cors({
        origin: 'http://localhost:3002',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      }));

    const server = http.createServer(app)

    initializeSocket(server)

    try {
        await AppDataSource.initialize()
        console.error("Well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }

    app.use(express.json())

    initRoutes(app)

    server.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()
