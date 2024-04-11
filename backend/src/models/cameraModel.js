import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import ApiError from '~/utils/ApiError';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';

import { parkingModel } from '~/models/parkingModel'

const CAMERA_COLLECTION_NAME = 'camera';
const CAMENRA_COLLECTION_SCHEMA = Joi.object({
  cameraId: Joi.string().required().min(1).max(50).trim().strict(),
  name: Joi.string().required().min(1).max(50).trim().strict(),
  images: Joi.array().items(Joi.string().optional()).default(null),
  type: Joi.string().valid('normal', 'cam360').required(),
  zone: Joi.string().optional().min(1).max(10).trim().strict(),
  slots: Joi.array().items({ position: Joi.string().min(4).max(6).trim().strict().required(), }),
  location: Joi.object({
    top: Joi.number().required().strict(),
    left: Joi.number().required().strict(),
    width: Joi.number().required().strict(),
    rotate: Joi.number().required().strict(),
    iconId: Joi.string().required().strict(),
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

    const validateData = await validateBeforCreate(data);

    const checkParking = await parkingModel.findOne(data.zone);
    if (!checkParking) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Khu vực không được tìm thấy', 'Not Found', 'BR_zone_1');
    }
    const createNew = await GET_DB().collection(CAMERA_COLLECTION_NAME).insertOne(validateData);
    return createNew;
  } catch (error) {
    if (error.type && error.code) {
      throw new ApiError(error.statusCode, error.message, error.type, error.code);
    }

    else {
      throw new Error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

const updateCamara = async (_id, _data) => {
  
  // _data.updatedAt = Date.now();
  // delete _data._id;
  
  const data = await validateBeforCreate(_data);
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
        // {
        //   $match: {
        //     driver: { $exists: true },
        //   },
        // },
        {
          $sort: {
            createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
          },
        },
        // {
        //   $lookup: {
        //     from: vehicleModel.VEHICLE_COLLECTION_NAME,
        //     localField: 'driver.vehicleId',
        //     foreignField: '_id',
        //     as: 'driver.vehicle',
        //   },
        // },
        {
          $match: {
            ...paramMatch,
          },
        },
      ])
      .toArray();

    let totalCount = camera.length;
    let totalPage = 1;
    let newCamara = camera;

    if (pageSize && pageIndex) {
      pageSize = Number(pageSize);
      pageIndex = Number(pageIndex);
      if (pageSize != 10 && pageSize != 20 && pageSize != 30) pageSize = 10;
      // eslint-disable-next-line use-isnan
      if (pageIndex < 1 || isNaN(pageIndex)) pageIndex = 1;
      totalPage = Math.ceil(totalCount / pageSize);
      if (pageIndex > totalPage) pageIndex = totalPage;
      newCamara = newCamara.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    }
    return {
      data: newCamara,
      totalCount,
      totalPage,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const cameraModel = {
  CAMERA_COLLECTION_NAME,
  CAMENRA_COLLECTION_SCHEMA,
  createNew,
  updateCamara,
  findByFilter,
};