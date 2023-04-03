import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mysql from 'mysql';
import { params } from '../../config/defalut';

const NAMESPACE = "SignIn";
const connection = mysql.createConnection(params)

interface user {
    u_id: string,
    email: string,
    phone: string,
    password: string,
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try{
        
        let sigInQuery = `Select * from aqb_auth where email = '${req.body.email}' AND password = '${req.body.password}'`
        connection.query(sigInQuery, (error, results, fields) => {
            if (error) throw error;
            if(Object.keys(results).length > 0){
                let id 
                results.forEach((data: user) => {
                    id = data.u_id
                })
                return res.status(200).json({
                    status: "true",
                    u_id: id,
                  });
            }else{
                return res.status(200).json({
                    status: "false",
                    u_id: 'none',
                  });
            }
        });
    }
    catch{
        
    }
}