import dotenv from "dotenv"


dotenv.config();

export const ENV ={
    PORT: parseInt(process.env.PORT, 10),
    DB_URL: process.env.DB_URL,
};