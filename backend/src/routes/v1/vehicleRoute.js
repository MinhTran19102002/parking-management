import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { vehicleController } from '~/controllers/vehicleController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';
import { vehicleValidation } from '~/validations/vehicleValidation';

const Router = express.Router();


Router.route('/vehicle')
  .post(vehicleValidation.create, verifyTokenMidleware.verifyTokenAndManager,vehicleController.createNew);

Router.route('/active').post(
  vehicleController.isActive
)

Router.route('/inActive').post(
  vehicleController.inActive
)

export const vehicleRoute = Router;
