import express from 'express';
import { test } from './handlers/test';
import { register } from './handlers/register';
import { create_otp } from './handlers/create_otp';
import { verify_otp } from './handlers/verify_otp';

const app = express();
app.disable('x-powered-by');

// Middleware registration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

router.get('/v1/test', test);
router.post('/v1/register', register);
router.post('/v1/create-otp', create_otp);
router.post('/v1/verify-otp', verify_otp);

app.use("/aqb", router);

export default app;