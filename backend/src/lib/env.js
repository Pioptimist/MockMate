import dotenv from "dotenv"


dotenv.config();

export const ENV ={
    PORT: parseInt(process.env.PORT, 10),  //since env values are strings and express take only number we had to parse it into int
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
};