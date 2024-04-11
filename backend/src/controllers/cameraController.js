import { StatusCodes } from 'http-status-codes';
import { cameraService } from '~/services/cameraService';

const createCamera = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const createNew = await cameraService.createCamera(req.body);

        res.status(StatusCodes.CREATED).json(createNew);
    } catch (error) {
        next(error);
    }
};

const updateCamara = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const newCamara = req.body;
        // delete newUser.account;
        // const rs = await userService.updateUser(req.query._id, newUser);
        const createNew = await cameraService.updateCamara(req.query._id, newCamara);

        res.status(StatusCodes.CREATED).json(createNew);
    } catch (error) {
        next(error);
    }
};

const findByFilter = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const rs = await cameraService.findByFilter(req.query);
      res.status(StatusCodes.OK).json(rs);
    } catch (error) {
      next(error);
    }
  };
  

export const cameraController = {
    createCamera,
    updateCamara,
    findByFilter,
}