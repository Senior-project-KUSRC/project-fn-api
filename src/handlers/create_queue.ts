import { NextFunction, Request, Response, json } from 'express';
import logging from '../../config/logging';
import { Connect, Query } from '../../config/mysql';

const NAMESPACE = "CREATE-QUEUE"

export const createQueue = async (req: Request, res: Response, next: NextFunction) => {

    let {
        u_id,
        queue_id,
        qid
    } = req.body;
    let d = new Date,dformat = [d.getMonth()+1,
                                d.getDate(),
                                d.getFullYear()].join('/')+' '+
                                [d.getHours(),
                                d.getMinutes(),
                                d.getSeconds()].join(':');
                                
    let queryUpdate = `UPDATE aqb_queue_arrive SET queue_ensure = queue_ensure + 1 WHERE queu_id = "${queue_id}";`
    let queryInsert = `INSERT INTO aqb_queue_list (u_id, queue_id, qid, queue_status, queue_created_date, queue_ensure)
                        VALUES ("${u_id}", "${queue_id}", "${qid}", "wait", "${dformat}", "wait");`
    try{
        Connect()
            .then((connection) => {
                Query(connection, queryInsert)
                    .then(() => {
                        Query(connection, queryUpdate).then((result) => {
                            console.log(`[${NAMESPACE}][info]: ${u_id} has created queue..`)
                            return res.status(200).json({
                                result: `"${u_id}" created queue..`,
                                message: result
                            });
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
    } catch(e){
        res.status(200).send(e)
    }
}

