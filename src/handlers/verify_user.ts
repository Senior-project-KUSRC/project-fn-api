import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "VERIFY ID"

export default interface auth {
    fullName: string;
    lastName: string;
    idCard: string;
    age : number;
    sex: string;
    weight : number;
    height : number;
}

export const verifiedUser = async (req: Request, res: Response, next: NextFunction) => {

    logging.info(NAMESPACE, 'User have registered..');

    let {
        u_id,
        id_card,
        u_age,
        u_gender,
        u_address,
        u_birthday,
        weight,
        height
    } = req.body;
    if (req.body !== '') {
        let updateAuthUser = `UPDATE aqb_user 
                                SET id_card = '${id_card}', u_gender = '${u_gender}', u_age = ${u_age},
                                u_address = '${u_address}', u_birthday = '${u_birthday}', u_weight = ${weight}, u_height= ${height} ,user_verify = 1
                                WHERE u_id = '${u_id}'`
        Connect()
            .then((connection) => {
                Query(connection, updateAuthUser)
                    .then(() => {
                        Query(connection, updateAuthUser).then((result) => {
                            console.log(`[${NAMESPACE}][info]: ${id_card} has already verify ID..`)
                            return res.status(200).json({
                                result: result,
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
            message: "Please fill forms",
        });
    }
};
