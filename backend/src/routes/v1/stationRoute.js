import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';
import { stationController } from '~/controllers/stationController';

const Router = express.Router();

Router.route('/')
.get(stationController.findByZone) 
.post(stationController.createNew) 

// Router.route('/')
// .post(stationController.createNew) 

export const stationRoute = Router;