import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "CREATE USER"

export default interface member {
    email: string;
    phone: string;
    password: string;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {

    logging.info(NAMESPACE, 'User have registered..');

    let {
        email,
        phone,
        password,
        username,
        lastname
    } = req.body;
    
    let date = Date.now()
    const id = "U" + "_" + date
    if (req.body.password) {
        let insertAuth = `INSERT INTO aqb_auth (u_id, email, phone, password) VALUES('${id.toString()}','${email}','${phone}','${password}');`
        let insertUser = `INSERT INTO aqb_user (u_id, email, username, lastname) VALUES('${id.toString()}', '${email}' , '${username}' , '${lastname}');`
        Connect()
            .then((connection) => {
                Query(connection, insertAuth)
                    .then(() => {
                        Query(connection, insertUser).then((result) => {
                            console.log(`[${NAMESPACE}][info]: ${email} has already register..`)
                            return res.status(200).json({
                                result: `"${email}" created successfully..`,
                                message: result
                            });
                        })
                    })
                    .catch((error) => {
                        logging.error(NAMESPACE, error.message, error);

                        return res.status(200).json({
                            message: error.message,
                            error
                        });
                    })
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);

                return res.status(200).json({
                    message: error.message,
                    error
                });
            });
    } else {
        return res.status(200).json({
            message: "Password is not the same..",
        });
    }
};
