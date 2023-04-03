import { NextFunction, Request, Response } from 'express';
import logging from '../../config/logging';
import mysql from 'mysql';
import { params } from '../../config/defalut';

const NAMESPACE = "list-appointment";
const connection = mysql.createConnection(params)

interface user {
    appoint_id: string,
    appoint_date: string,
    owner_case: string,
    appoint_status: number,
    u_id: string,
    branch: string
};

export const ListAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let id : string = req.body.id
        let userQuery = `SELECT aqb_appointment.appoint_id, aqb_appointment.branch, aqb_appointment.appoint_date, aqb_appointment.owner_case, aqb_appointment.appoint_status 
                        FROM aqb_appointment 
                        JOIN aqb_auth ON aqb_auth.u_id = aqb_appointment.u_id 
                        WHERE aqb_auth.u_id = "${req.body.id}";`
        connection.query(userQuery, (error, results, fields) => {
            if (error) throw error;
            if(Object.keys(results).length > 0){
                return res.status(200).json({
                    status: "true",
                    result: results
                  });
            }else{
                return res.status(200).json({
                    status: "false",
                    result: results
                });
            }
        });
    }catch{
        
    }
}