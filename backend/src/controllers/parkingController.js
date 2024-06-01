import { StatusCodes } from 'http-status-codes';
import { parkingService } from '~/services/parkingService';
import ApiError from '~/utils/ApiError';

const getStatusByZone = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getStatusByZone = await parkingService.getStatusByZone(req.query.zone);
    res.status(StatusCodes.OK).json(getStatusByZone);
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getStatus = await parkingService.getStatus(req.query.zone);
    res.status(StatusCodes.OK).json(getStatus);
  } catch (error) {
    next(error);
  }
};

const getStatusByDriver = async (req, res, next) => {
  try {
    let zone = '0'
    // Dieu huong sang tang Service
    if(req.query.zone)
      {
        
        zone = req.query.zone
        console.log(zone)
      }
    const getStatus = await parkingService.getStatusByDriver(zone, req.query.phone);
    res.status(StatusCodes.OK).json(getStatus);
  } catch (error) {
    next(error);
  }
};

const createPaking = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createPaking = await parkingService.createPaking(req.body);

    res.status(StatusCodes.CREATED).json(createPaking);
  } catch (error) {
    next(error);
  }
};


const updateSlot = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const updateSlot = await parkingService.updateSlot(req.body);

    res.status(StatusCodes.CREATED).json(updateSlot);
  } catch (error) {
    next(error);
  }
};


export const parkingController = {
  getStatusByZone,
  createPaking,
  getStatus,
  updateSlot,
  getStatusByDriver,
};
