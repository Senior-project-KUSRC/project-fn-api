import { NextFunction, Request, Response, json } from 'express';
import twilio  from 'twilio';
import crypto from 'crypto';
import dotenv from 'dotenv';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "CREATE-OTP"

export const send_otp = async (req: Request, res: Response, next: NextFunction) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);
    const verificationCode = Math.floor(10000 + Math.random() * 90000);
    let dateObj = new Date();
    let id = "SE" + Date.now()
    let createAt = Date.now()
    let expriresAt = Date.now() + 180000;
    console.log("createAt",createAt)
    console.log("expriresAt",expriresAt)
    try{
        client
        .messages 
        .create({ 
            body: `'${req.body.toTel}' รหัสยืนยันตัวตนของคุณคือ '${verificationCode}'`,  
            messagingServiceSid: process.env.SERVICE_SID, 
            to: `${req.body.toTel}`
        }) 
        .then((data) => {
            let queryInsertOtp = `INSERT INTO aqb_verify_otp (otp_id, check_otp, otp, tel, create_at, expires_at) 
                                  VALUES ("${id}", "waiting", "${verificationCode}", "${req.body.toTel}", ${createAt}, ${expriresAt})`
            let payload = {
                otp_id: id,
                check_otp: "waiting",
                otp: verificationCode,
                tel: req.body.toTel,
                create_at: createAt,
                expriresAt: expriresAt
            }
            Connect()
            .then((connection) => {
                Query(connection, queryInsertOtp)
                    .then(() => {
                        logging.info(NAMESPACE, 'already send otp!');
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
            return res.status(200).json(
                {
                    message: payload,
                }
            )
        })
    }
    catch{
        
    }
}