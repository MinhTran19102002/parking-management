import { StatusCodes } from 'http-status-codes';
import { vehicleService } from '~/services/vehicleService';

const createNew = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    const type = req.body.type;
    // Dieu huong sang tang Service
    const createVehicle = await vehicleService.createVehicle(licenePlate, type);

    res.status(StatusCodes.CREATED).json(createVehicle);
  } catch (error) {
    next(error);
  }
};

const isActive = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    const idUser = req.body.idUser;
    // Dieu huong sang tang Service
    const isActive = await vehicleService.isActive(licenePlate, idUser);

    res.status(StatusCodes.CREATED).json(isActive);
  } catch (error) {
    next(error);
  }
};

const inActive = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    // Dieu huong sang tang Service
    const inActive = await vehicleService.inActive(licenePlate);

    res.status(StatusCodes.CREATED).json(inActive);
  } catch (error) {
    next(error);
  }
};

export const vehicleController = {
  createNew,
  isActive,
  inActive,
};
