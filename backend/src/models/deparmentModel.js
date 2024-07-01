
import Joi, { array } from 'joi';
import { ObjectId } from 'mongodb';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
import { GET_DB } from '~/config/mongodb';
import { StatusCodes } from 'http-status-codes';

const DEPARMENT_COLLECTION_NAME = 'deparment';
const DEPARMENT_COLLECTION_SCHEMA = Joi.object({
    id: Joi.string().required().min(1).max(50).trim().strict(),
    vi: Joi.string().required().min(1).max(50).trim().strict(),
    en: Joi.string().min(1).max(50).trim().strict(),
    createdAt: Joi.date().timestamp('javascript').default(Date.now).strict(),
    updatedAt: Joi.date().timestamp('javascript').default(null).strict(),
    _destroy: Joi.boolean().default(false),
});

const validateBeforCreate = async (data) => {
    return await DEPARMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};


const findOne = async (id) => {
    try {
        const findOne = await GET_DB().collection(DEPARMENT_COLLECTION_NAME).findOne({ id: id });
        return findOne;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByVi = async (vi) => {
    try {
        const findOne = await GET_DB().collection(DEPARMENT_COLLECTION_NAME).findOne({ vi: vi });
        return findOne;
    } catch (error) {
        throw new Error(error);
    }
};

const createNew = async (data) => {
    try {
        const validateData = await validateBeforCreate(data);
        const check = await findOne(data.id);
        if (check) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                'Khoa đã tồn tại',
                'Not Found',
                'BR_person_1',
            );
        }
        const createNew = await GET_DB().collection(DEPARMENT_COLLECTION_NAME).insertOne(validateData);
        return createNew;
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else if (error.message.includes('E11000 duplicate key')) {
            throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
        } else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, 'Email_1', 'Email_1');
    }
};

const findAll = async () => {
    try {
        const findAll = await GET_DB().collection(DEPARMENT_COLLECTION_NAME).find({}).toArray();
        return findAll;
    } catch (error) {
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else if (error.message.includes('E11000 duplicate key')) {
            throw new ApiError(error.statusCode, 'Trùng SĐT hoặc gmail', 'Email_1', 'Email_1');
        } else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, 'Email_1', 'Email_1');
    }
};


export const deparmentModel = {
    DEPARMENT_COLLECTION_NAME,
    DEPARMENT_COLLECTION_SCHEMA,
    createNew,
    findAll,
    findOneByVi,
} 