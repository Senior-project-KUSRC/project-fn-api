import { NextFunction, Request, Response, json } from 'express';
import mysql from 'mysql';
import config from '../../config/config';
import logging from '../../config/logging';

const NAMESPACE = "VERTIFY IDCARDS"
const path = '../../assets/idcards/';
import * as Tesseract from 'tesseract.js';


interface FontsIdCards {
    idCards: string,
    name: string,
    lastName: string,
    birthDate: string
};

interface BackIdCards {
    lasorCode: string
};

export const verify_font = async (req: Request, res: Response, next: NextFunction) => {

    const { image } = req.body;
    const lang:string = 'tha+eng'

    if (!image) {
        res.status(400).send({ error: 'image is required' });
        return;
    }
    Tesseract.recognize(
        image, 
        lang,
      )
      .then(({ data: { text } }) => {
        console.log(text);
      })
      .catch((err: any) => {
        console.log(err);
      });
}


