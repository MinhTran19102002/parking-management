import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

import { parkingModel } from '~/models/parkingModel'

const CAMERA_COLLECTION_NAME = 'camera';
const CAMENRA_COLLECTION_SCHEMA = Joi.object({
  cameraId: Joi.string().required().min(1).max(50).trim().strict(),
  name: Joi.string().min(1).max(50).trim().strict(),
  image: Joi.string().optional().min(0).max(100).trim().strict().default(''),
  type: Joi.string().valid('normal', 'cam360').required(),
  zone: Joi.string().optional().min(1).max(10).trim().strict(),
  streamLink: Joi.string().optional().min(1).max(100).trim().strict(),
  slots: Joi.array().items(Joi.string().min(4).max(6).trim().strict()),
  location: Joi.object({
    top: Joi.number().strict(),
    left: Joi.number().strict(),
    width: Joi.number().strict(),
    height: Joi.number().strict(),
    rotate: Joi.number().strict(),
    iconId: Joi.string().strict(),
    cameraIconId: Joi.string().strict(),
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now).strict(),
  updatedAt: Joi.date().timestamp('javascript').default(null).strict(),
  _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
  return await CAMENRA_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const checkCamera = await GET_DB().collection(CAMERA_COLLECTION_NAME).findOne({ "cameraId": data.cameraId });

    if (checkCamera) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'CameraId đã tồn tại', 'already exist', 'BR_zone_1');
    }
    if (data.image == '') {
      delete data.image
    }
    console.log(data)
    const validateData = await validateBeforCreate(data);
    let checkParking
    if (data.zone) {
      checkParking = await parkingModel.findOne(data.zone);
      if (!checkParking) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1');
      }
    }
    const createNew = await GET_DB().collection(CAMERA_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    }
    else {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const updateCamera = async (_id, _data) => {
  _data.cameraId = "default"
  delete _data._id;
  console.log(_data)
  let data = await validateBeforCreate(_data);
  delete data.cameraId;
  delete data.createdAt;
  data.updatedAt = Date.now();

  try {
    const updateOperation = {
      $set: {
        ...data,
      },
    };

    const result = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(_id) }, updateOperation, { returnDocument: 'after' });
    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const removeCamera = async (_ids) => {
  // _data.cameraId = "default"
  // delete _data._id;
  // const data = await validateBeforCreate(_data);
  // delete data.cameraId;
  // delete data.createdAt;
  // data.updatedAt = Date.now();
  try {
    const updateOperation = {
      $unset: {
        location: 1,
        zone: 1,
      },
    };
    const objectIds = _ids.map((id) => new ObjectId(id))

    const result = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .updateMany({ _id: { $nin: objectIds } }, updateOperation, { returnDocument: 'after' });

    return result;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const findByFilter = async ({ pageSize, pageIndex, ...params }) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (let [key, value] of Object.entries(params)) {
    let regex;
    if (key == 'name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }
  try {
    const camera = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $match: {
            ...paramMatch,
          },
        },
      ])
      .toArray();

    let totalCount = camera.length;
    let totalPage = 1;
    let newCamera = camera;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      // eslint-disable-next-line use-isnan
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      totalPage = Math.ceil(totalCount / pageSize);
      if (pageIndex > totalPage) pageIndex = totalPage;
      newCamera = newCamera.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newCamera,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const findByFilterUnused = async ({ pageSize, pageIndex, ...params }, use) => {
  // Construct the regular expression pattern dynamically
  let paramMatch = {};
  for (let [key, value] of Object.entries(params)) {
    let regex;
    if (key == 'name') {
      regex = {
        [key]: new RegExp(`${value}`, 'i'),
      };
    } else {
      regex = {
        [key]: new RegExp(`^${value}`, 'i'),
      };
    }
    Object.assign(paramMatch, regex);
  }
  try {
    const camera = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .aggregate([
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        {
          $match: {
            ...paramMatch,
            "location": { $exists: use }
          },
        },
      ])
      .toArray();

    let totalCount = camera.length;
    let totalPage = 1;
    let newCamera = camera;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      // eslint-disable-next-line use-isnan
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      totalPage = Math.ceil(totalCount / pageSize);
      if (pageIndex > totalPage) pageIndex = totalPage;
      newCamera = newCamera.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newCamera,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCamera = async (_id) => {
  try {
    const result = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .deleteOne(
        { _id: new ObjectId(_id) },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteManyCamera = async (ids) => {
  try {
    const objectIds = ids.map((id) => new ObjectId(id))
    const result = await GET_DB()
      .collection(CAMERA_COLLECTION_NAME)
      .deleteMany(
        { _id: { $in: objectIds } },
        { returnDocument: 'after' },
        { locale: 'vi', strength: 1 },
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const checkCameraId = async (cameraId) => {
  try {
    const valid = await GET_DB().collection(CAMERA_COLLECTION_NAME).findOne({ 'cameraId': cameraId })
    if (valid) {
      return { valid: false }
    }
    else {
      return { valid: true }
    }
  } catch (error) {
    throw new Error(error);
  }
}

// const checkCameraId = async (cameraId) => {
//   try {
//     const valid = await GET_DB().collection(CAMERA_COLLECTION_NAME).findOne({ 'cameraId': cameraId })
//     if (valid) {
//       return { valid: false }
//     }
//     else {
//       return { valid: true }
//     }
//   } catch (error) {
//     throw new Error(error);
//   }
// }

const updateSlot = async (cameraId, data) => {
  try {
    const valid = await GET_DB().collection(CAMERA_COLLECTION_NAME).findOne({ 'cameraId': cameraId })
    if (!valid) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Khong tim thay camera', 'Not Found', 'BR_zone_1');
    }
    
    const parking = await parkingModel.findOne(valid.zone)
    data.slots.forEach(position => {
      const slot = parking.slots.find(slot => slot.position === position);
      if (!slot) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Vi tri khong ton tai trong bai do xe', 'Not Found', 'BR_zone_1');
      }
    });
    const update = await GET_DB().collection(CAMERA_COLLECTION_NAME).updateOne(
      { 'cameraId': cameraId},
      {
        $set: {
          'slots' : data.slots,
        },
      },
      
    )
    return update
  } catch (error) {
    if (error.type && error.code)
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
}


export const cameraModel = {
  CAMERA_COLLECTION_NAME,
  CAMENRA_COLLECTION_SCHEMA,
  createNew,
  updateCamera,
  findByFilter,
  deleteCamera,
  deleteManyCamera,
  checkCameraId,
  findByFilterUnused,
  removeCamera,
  updateSlot
};