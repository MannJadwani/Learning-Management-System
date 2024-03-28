import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandeler";

export const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal server error';

    // wrong mongoid
    if (err.name === 'CastError') {
        const message = `Resource not found ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    //duplicate key 

    if (err.statusCode === 11000) {
        const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400)

    }

    //jwt error

    if (err.name === 'JsonWebTokenError') {
        const message = `Your Json Web Token is invalid,try again`;
        err = new ErrorHandler(message, 400)
    }

    //token expire

    if (err.name === 'TokenExpiredError') {
        const message = `Json Web Token expired,try again`;
        err = new ErrorHandler(message, 400)
    }


    res.status(err.statusCode).json({
        success: true,
        message: err.message
    })
}