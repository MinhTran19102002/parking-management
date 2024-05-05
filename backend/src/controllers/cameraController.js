import { StatusCodes } from 'http-status-codes';
import { cameraService } from '~/services/cameraService';
import { uploadImageHandler } from '~/utils/uploads';

const createCamera = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    // console.log(req.body)
    let image = await uploadImageHandler.uploadImageSingle(req, res, 'camera')
    // let images  = []
    if(!image){
      image = ''
    }
    const createNew = await cameraService.createCamera(req.body, image);

    res.status(StatusCodes.CREATED).json(createNew);
  } catch (error) {
    next(error);
  }
};

const updateCamera = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    // const images = await uploadImageHandler.uploadImageMultiple(req, res, 'camera')
    const newCamera = req.body;
    // if (images != []) {
    //   newCamera.images = im
    // }
    // delete newUser.account;
    const createNew = await cameraService.updateCamera(req.query._id, newCamera);

    res.status(StatusCodes.CREATED).json(createNew);
  } catch (error) {
    next(error);
  }
};

const updateManyCamera = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    // delete newUser.account;
    // const rs = await userService.updateUser(req.query._id, newUser);
    const createNew = await cameraService.updateManyCamera(req.body);

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

const findByFilterUnused = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await cameraService.findByFilterUnused(req.query, false);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};


const findByFilterUsed = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await cameraService.findByFilterUnused(req.query, true);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};



const deleteCamera = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const _idDelete = req.query._id;
    const rs = await cameraService.deleteCamera(_idDelete);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const deleteManyCamera = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const ids = req.body.ids;
    const rs = await cameraService.deleteManyCamera(ids);
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

const upload = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const rs = await cameraService.upload(req, res, next);
    res.status(StatusCodes.OK).json(rs);
  } catch (error) {
    next(error);
  }
};

const addImage = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    req.query._id
    const file = await uploadImageHandler.uploadImageSingle(req, res, 'camera')
    let image = file.filename;
    const createUser = await cameraService.updateAvatar(req.query._id, image);
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};


export const cameraController = {
  createCamera,
  updateCamera,
  findByFilter,
  deleteCamera,
  deleteManyCamera,
  checkCameraId,
  upload,
  addImage,
  findByFilterUnused,
  findByFilterUsed,
  updateManyCamera,
}