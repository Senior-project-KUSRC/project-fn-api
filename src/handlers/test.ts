import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';

const NAMESPACE = 'TEST';

export const test = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Test api endpoints found');
    
    return res.status(200).json({
        message: "test successful..",
    });
}