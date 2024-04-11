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
  
<<<<<<< HEAD
=======
  const deleteCamara = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const _idDelete = req.query._id;
      const rs = await cameraService.deleteCamara(_idDelete);
      res.status(StatusCodes.OK).json(rs);
    } catch (error) {
      next(error);
    }
  };

  const deleteManyCamara = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const ids = req.body.ids;
      const rs = await cameraService.deleteManyCamara(ids);
      res.status(StatusCodes.OK).json(rs);
    } catch (error) {
      next(error);
    }
  };

  const checkCameraId = async (req, res, next) => {
    try {
      // Dieu huong sang tang Service
      const cameraId = req.query.cameraId;
      const rs = await cameraService.checkCameraId(cameraId);
      res.status(StatusCodes.OK).json(rs);
    } catch (error) {
      next(error);
    }
  };
>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4

export const cameraController = {
    createCamera,
    updateCamara,
    findByFilter,
<<<<<<< HEAD
=======
    deleteCamara,
    deleteManyCamara,
    checkCameraId,
>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4
}