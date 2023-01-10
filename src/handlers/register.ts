import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "REGISTER"

export default interface member {
    id_card: string ;
    surname: string ; 
    lastname: string ; 
    email: string ;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {

    logging.info(NAMESPACE, 'User have registered..');

    let {
        id_card,
        surname,
        lastname,
        email
    } = req.body;
    if (req.body.password == req.body.re_password) {
        let query = `INSERT INTO aqb_user (id_card, username, lastname, email)
                    VALUES ("${id_card}", "${surname}", "${lastname}", "${email}")`
        logging.info(NAMESPACE, `${query}`);
        Connect()
            .then((connection) => {
                Query(connection, query)
                    .then((result) => {
                        return res.status(200).json({
                            result: `"${surname}" created successfully..`,
                            message: result
                        });
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
