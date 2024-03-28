import express from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { ErrorMiddleware } from './middleware/error';

app.use(express.json({ limit: '50mb' }))

app.use(cookieParser());

app.use(cors());


app.get('/test', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
})


app.all("*", (req, res, next) => {
    const err = new Error(`${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
})

app.use(ErrorMiddleware);