import { NextFunction, Request, Response, json } from 'express';
import mysql from 'mysql';
import config from '../../config/config';
import logging from '../../config/logging';

const NAMESPACE = "VERIFY OTP"

const params = {
    user: config.mysql.user,
    password: config.mysql.pass,
    host: config.mysql.host,
    database: config.mysql.database
};

interface otp {
    otp_id: string,
    check_otp: string,
    otp: string,
    tel: string
};

const connection = mysql.createConnection(params)

export const verify_otp = async (req: Request, res: Response, next: NextFunction) => {
    let query = `SELECT * FROM aqb_verify_otp WHERE tel = "${req.body.toTel}"`
    connection.query(query, (error, results, fields) => {
        if (error) throw error;
        results.forEach((data: otp) => {
            if(data.tel === req.body.toTel){
                 if (data.otp === req.body.otp) {
                    let query = `UPDATE aqb_verify_otp SET check_otp = "verified.." WHERE tel = "${req.body.toTel}"`
                    connection.query(query, (error, results, fields) => {
                        if (error) throw error;
                        return res.status(200).json({
                            result: `"${req.body.toTel}" has verified..`,
                        });
                    })
                }else{
                    return res.status(200).json({
                        result: `otp wrong please try again..`,
                    });
                }
            }else{
                logging.info(NAMESPACE, 'otp timeout!');
                return res.status(200).json({
                    result: `otp timeout..`,
                });
            }
        });
      });
}
