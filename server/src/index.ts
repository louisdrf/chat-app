import express from "express";
import { AppDataSource } from "./database/database";
import 'dotenv/config';

const main = async () => {
    const app = express()
    const port = process.env.SERVER_PORT || 3001

    try {
        await AppDataSource.initialize()
        console.error("Well connected to database")
    } catch (error) {
        console.log(error)
        console.error("Cannot contact database")
        process.exit(1)
    }

    app.use(express.json())

    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
}

main()
