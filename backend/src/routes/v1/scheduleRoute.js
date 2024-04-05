import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';

const Router = express.Router();

Router.route('')

export const scheduleRoute = Router;