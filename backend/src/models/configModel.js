import Joi, { array, object } from 'joi';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { cameraModel } from './cameraModel';


const CONFIG_COLLECTION_NAME = 'config';
const CONFIG_COLLECTION_SCHEMA = Joi.object({
    cameraId: Joi.string().optional().min(1).max(50).trim().strict(),
    type: Joi.string().valid('cameraIn', 'cameraOut', 'cameraSlot').optional(),
});

const validateBeforCreate = async (data) => {
    return await CONFIG_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const updateConfigCamera = async (type, _data) => {
    let data = await validateBeforCreate(_data);

    const check = await cameraModel.checkCameraId(data.cameraId)
    if (!check) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Camera khong ton tai', 'Not Found', 'BR_zone_1');
    }
    try {
        const updateOperation = {
            $set: {
                ...data,
            },
        };

        const result = await GET_DB()
            .collection(CONFIG_COLLECTION_NAME)
            .findOneAndUpdate({ type: type }, updateOperation, { returnDocument: 'after' });
        return result;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};


const findConfigCamera = async (type) => {
    try {
        const result = await GET_DB()
            .collection(CONFIG_COLLECTION_NAME)
            .aggregate([
                {
                  $sort: {
                    createdAt: -1, // sắp xếp theo thứ tự giảm dần của trường thoi_gian
                  },
                },
                {
                  $match: {
                    type: type
                  },
                },
                {
                    $lookup: {
                      from: cameraModel.CAMERA_COLLECTION_NAME,
                      localField: 'cameraId',
                      foreignField: 'cameraId',
                      as: 'camera',
                    },
                  },
                  {
                    $unwind: '$camera',
                  },
              ])
              .toArray();
        return result;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};


const getAll = async () => {
    try {
        const result = await GET_DB()
            .collection(CONFIG_COLLECTION_NAME)
            .find().toArray();
        return result;
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
};





export const configModel = {
    CONFIG_COLLECTION_NAME,
    CONFIG_COLLECTION_SCHEMA,
    updateConfigCamera,
    findConfigCamera,
    getAll
};