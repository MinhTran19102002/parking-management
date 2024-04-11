import { userModel } from '~/models/personModel'
import ApiError from '~/utils/ApiError'
import { cameraModel } from '~/models/cameraModel'
import { StatusCodes } from 'http-status-codes'

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
<<<<<<< HEAD
    const users = await cameraModel.updateCamara(_id, params);
    if (users == null) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Người dùng cập nhật không thành công',
=======
    const cameraUpdate = await cameraModel.updateCamara(_id, params);
    if (cameraUpdate == null) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Camera cập nhật không thành công',
>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4
        'Not Updated',
        'BR_person_3',
      );
    }
<<<<<<< HEAD
    return users;
=======
    return cameraUpdate;
>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4
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

<<<<<<< HEAD
=======
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

>>>>>>> ecca3b3adc4add041b41fabc8c8e21478cd08cd4
export const cameraService = {
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