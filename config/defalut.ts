import dotenv from 'dotenv';
import config from '../config/config';

export const params = {
    user: config.mysql.user,
    password: config.mysql.pass,
    host: config.mysql.host,
    database: config.mysql.database
};