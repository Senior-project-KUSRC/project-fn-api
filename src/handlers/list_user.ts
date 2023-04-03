import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mysql from 'mysql';
import { params } from '../../config/defalut';

const NAMESPACE = "list-user";
const connection = mysql.createConnection(params)

interface user {
    u_id: string,
    id_card: string,
    username: string,
    lastname: string,
    email: string,
    u_age: number,
    u_address: string,
    u_birthday: string,
    user_verify: number,
};

export const ListUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        
        let userQuery = `Select * from aqb_user where u_id = '${req.body.id}'`

        connection.query(userQuery, (error, results, fields) => {
            if (error) throw error;
            if(Object.keys(results).length > 0){
                let u_id
                let id_card
                let username
                let lastname
                let email
                let u_age
                let u_address
                let u_birthday
                let user_verify
                results.forEach((data: user) => {
                    u_id= data.u_id;
                    id_card= data.id_card !== '' ? data.id_card: '1';;
                    username= data.username !== '' ? data.username: '1';
                    lastname= data.lastname !== '' ? data.lastname: '1';
                    email= data.email;
                    u_age= data.u_age;
                    u_address= data.u_address !== '' ? data.u_address: '1';
                    u_birthday = data.u_birthday !== '' ? data.u_birthday: '1';
                    user_verify = data.user_verify;
                })
                return res.status(200).json({
                    status: "true",
                    u_id: u_id,
                    id_card: id_card,
                    username: username,
                    lastname: lastname,
                    email: email,
                    u_age: u_age,
                    u_address: u_address,
                    u_birthday: u_birthday,
                    user_verify: user_verify,
                  });
            }else{
                return res.status(200).json({
                    status: "true",
                    u_id: "none",
                    id_card: "none",
                    username: "none",
                    lastname: "none",
                    email: "none",
                    u_age: "none",
                    u_address: "none",
                    u_birthday: "none",
                    user_verify: "none",
                });
            }
        });
    }
    catch{
        
    }
}