import { userModel } from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import { cameraModel } from '~/models/cameraModel'
import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import path from 'path';
import uploadImageHandler from '~/utils/uploads'

const createCamera = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createNew = await cameraModel.createNew(data)
    if (createNew.acknowledged == false) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Tạo camera không thành công', 'Not Created', 'BR_parking_2')
    }
    return createNew
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const updateCamara = async (_id, params) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const cameraUpdate = await cameraModel.updateCamara(_id, params);
    if (cameraUpdate == null) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Camera cập nhật không thành công',
        'Not Updated',
        'BR_person_3',
      );
    }
    return cameraUpdate;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const updateManyCamara = async (listCamrera) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let listUpdate = []
    await Promise.allSettled(
      listCamrera.map(async (data) => {
        // console.log(data)
        const cameraUpdate = await cameraModel.updateCamara(data._id, data);
        return cameraUpdate;
      }),
    )
      .then((results) => {
        results.forEach((result) => {
          listUpdate.push(result.value)
        });
      })
      .catch((error) => {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
      });
    return listUpdate;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const findByFilter = async (filter) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findcamera = await cameraModel.findByFilter(filter);
    if (findcamera.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người lái xe không tồn tại',
        'Not Found',
        'BR_person_1_1',
      );
    }
    return findcamera;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findByFilterUnused = async (filter, use) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const findcamera = await cameraModel.findByFilterUnused(filter, use);
    if (findcamera.acknowledged == false) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Người lái xe không tồn tại',
        'Not Found',
        'BR_person_1_1',
      );
    }
    return findcamera;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const deleteCamara = async (_id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const cameraDelete = await cameraModel.deleteCamara(_id);
    if (cameraDelete.deletedCount == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return cameraDelete;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};


const deleteManyCamara = async (ids) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const cameraDelete = await cameraModel.deleteManyCamara(ids);
    if (cameraDelete.deletedCount == 0) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Xóa người dùng không thành công',
        'Not Deleted',
        'BR_person_4',
      );
    }
    return cameraDelete;
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const checkCameraId = async (cameraId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const valid = await cameraModel.checkCameraId(cameraId)
    return valid
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}

const upload = async (req, res, next) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const  uploadImage = await uploadImageHandler(req, res)
    return uploadImage
} catch (error) {
  if (error.type && error.code)
    throw new ApiError(error.statusCode, error.message, error.type, error.code);
  else throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
}
}

export const cameraService = {
  createCamera,
  updateCamara,
  findByFilter,
  deleteCamara,
  deleteManyCamara,
  checkCameraId,
  upload,
  findByFilterUnused,
  updateManyCamara,
}