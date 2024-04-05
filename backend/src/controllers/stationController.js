import { StatusCodes } from 'http-status-codes';
import { stationService } from '~/services/stationService';

const createNew = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const createNew = await stationService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createNew);
  } catch (error) {
    next(error);
  }
};

const findByZone = async (req, res, next) => {
  try {
    var zone = 'all'
    if (req.body.zone) {
     zone = req.body.zone
    }
    console.log(zone)
    // Dieu huong sang tang Service
    const findByZone = await stationService.findByZone(zone);

    res.status(StatusCodes.CREATED).json(findByZone);
  } catch (error) {
    next(error);
  }
};

export const stationController = {
  createNew,
  findByZone,
};
