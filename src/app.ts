import express from 'express';
import { test } from './handlers/test';
import { register } from './handlers/register';
import { verify_otp } from './handlers/verify_otp';
import { send_otp } from './handlers/send_otp';
import { signIn } from './handlers/signIn';
import { ListUser } from './handlers/list_user';
import { ListAppointment } from './handlers/list_ap';
import { verifiedUser } from './handlers/verify_user';
import { ListQueueArrive } from './handlers/list_queue_arrive';
import { createQueue } from './handlers/create_queue';

const app = express();
app.disable('x-powered-by');

// Middleware registration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

router.get('/v1/test', test);
router.get('/v1/list-queue-arrive', ListQueueArrive);


router.post('/v1/list-appointment', ListAppointment);
router.post('/v1/list-user', ListUser);
router.post('/v1/sign-up-v1', register);
router.post('/v1/sign-in-v1', signIn);
router.post('/v1/send-otp', send_otp);
router.post('/v1/verify-otp', verify_otp);
router.post('/v1/verified-user', verifiedUser);
router.post('/v1/create-queue', createQueue);


app.use("/aqb", router);

export default app;