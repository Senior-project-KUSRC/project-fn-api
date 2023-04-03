import { NextFunction, Request, Response, json } from 'express';
import mysql from 'mysql';
import config from '../../config/config';
import logging from '../../config/logging';
import { params } from '../../config/defalut';
const NAMESPACE = "VERIFY OTP"

const connection = mysql.createConnection(params)
interface otp {
    otp_id: string,
    check_otp: string,
    otp: string,
    tel: string,
    create_at: string,
    expires_at: number,
};

let verified:boolean;
let cause:boolean;
export const verify_otp = async (req: Request, res: Response, next: NextFunction) => {

    try {
      let query = `SELECT * FROM aqb_verify_otp WHERE tel = "${req.body.toTel}" AND check_otp= "waiting"`;
      connection.query(query, (error, results, fields) => {
        if (error) throw error;
        results.forEach((data: otp) => {
          if (data.tel === req.body.toTel) {
            if (data.otp === req.body.otp) {
              if (Date.now() < data.expires_at) {
                verified = true;
                console.log(verified)
                let query = `UPDATE aqb_verify_otp SET check_otp = "verified" WHERE tel = "${req.body.toTel}" AND check_otp = "waiting"`;
                connection.query(query, (error, results, fields) => {
                  if (error) throw error;
                });
              } else {
                verified = false;
                cause = true;
              }
            } else {
              verified = false;
            }
          }
          if (verified===true) {
            return res.status(200).json({
              result: `"${req.body.toTel}" has verified..`,
            });
          } else {
              if(cause === true){
                  return res.status(200).json({
                      result: `OTP timeout`,
                    });
              }else{
                  return res.status(200).json({
                      result: `Failed to verify OTP`,
                    });
              }
          }
        });
      });
    } catch (error) {
      console.error(error);
      verified = false;
    }
  };
