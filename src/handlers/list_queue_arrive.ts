import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mysql from 'mysql';
import { params } from '../../config/defalut';

const NAMESPACE = "list-appointment";
const connection = mysql.createConnection(params)

interface queue {
    queue_id: string,
    queue_date: string,
    queue_total_per_day: number,
    queue_ensure: number,
    queue_branch: string,
};

export const ListQueueArrive = async (req: Request, res: Response, next: NextFunction) => {
    try{
        
        let toDay = new Date();
        let isoString = toDay.toISOString(); // "2023-03-21T12:34:56.789Z"
        let formattedDate = isoString.slice(2, 4) + '-' + isoString.slice(5, 7) + '-' + isoString.slice(8, 10);
        let formattedTime = isoString.slice(11, 19);
        let formattedDateTime = formattedDate + ' ' + formattedTime;
        let userQuery = `SELECT * FROM aqb_queue_arrive WHERE queue_date  >= '${formattedDateTime}' ORDER BY queue_date ASC`;

        connection.query(userQuery, (error, results, fields) => {
            if (error) throw error;
            if(Object.keys(results).length > 0){
                return res.status(200).json({
                    status: "true",
                    result: results
                  });
            }else{
                return res.status(200).json({
                    status: "true",
                    queue_id: "none",
                    queue_date: "none",
                    queue_total: "none",
                    queue_ensure: "none",
                    branch: "none"
                });
            }
        });
    }
    catch{
        
    }
}