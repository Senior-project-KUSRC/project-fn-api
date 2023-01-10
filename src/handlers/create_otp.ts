import { NextFunction, Request, Response, json } from 'express';
import twilio  from 'twilio';
import crypto from 'crypto';
import dotenv from 'dotenv';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "CREATE-OTP"

export const create_otp = async (req: Request, res: Response, next: NextFunction) => {

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const n = crypto.randomInt(0, 1000000);
    const client = twilio(accountSid, authToken);
    const verificationCode = n.toString().padStart(6, "0");
    let dateObj = new Date();
    let id = Date.now()
    let query = `INSERT INTO aqb_verify_otp (otp_id, time)
                    VALUES ("${Date.now()}", "${dateObj.getSeconds()}")`
    try{
        client
        .messages 
        .create({ 
            body: `หมายเลข '${req.body.toTel}' รหัสยืนยันตัวตนของคุณคือ '${verificationCode}'`,  
            messagingServiceSid: process.env.SERVICE_SID, 
            to: `${req.body.toTel}`
        }) 
        .then((data) => {
            let queryInsertOtp = `INSERT INTO aqb_verify_otp (otp_id, check_otp, otp, tel) VALUES ("${id}", "waiting..", "${verificationCode}", "${req.body.toTel}")`
            Connect()
            .then((connection) => {
                Query(connection, queryInsertOtp)
                    .then(() => {
                        logging.info(NAMESPACE, 'Timmer 30s to verify otp');
                    })
                    .catch((error) => {
                        logging.error(NAMESPACE, error.message, error);
                    })
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);

                return res.status(200).json({
                    message: error.message,
                    error
                });
            });
            return res.status(200).send(data)
        })
        .finally(() => {
            setTimeout(() => {
                try {
                    let queryDeleteOtp = `DELETE FROM aqb_verify_otp WHERE otp_id='${id}' and check_otp="waiting.."`
                    Connect()
                    .then((connection) => {
                        Query(connection, queryDeleteOtp)
                            .then(() => {
                                logging.info(NAMESPACE, 'otp has Verified..');
                            })
                            .finally(() => {
                                logging.info(NAMESPACE, 'otp timeout!');
                            })
                            .catch((error) => {
                                logging.error(NAMESPACE, error.message, error);
                            })
                    })
                }
                catch{
                    logging.info(NAMESPACE, 'otp has been verified..');
                }
            }, 50000);
        })
    } catch(e){
        res.status(200).send(e)
    }
}

