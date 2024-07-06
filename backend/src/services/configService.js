import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { configModel } from '~/models/configModel';


const updateConfigCamera = async (type, data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const updateConfigCamera = await configModel.updateConfigCamera(type, data);
        if (updateConfigCamera == null) {

            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Config cập nhật không thành công',
                'Not Updated',
                'BR_person_3',
            );
        }
        return updateConfigCamera;
    } catch (error) {
        // console.log(error)
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}


const findConfigCamera = async (type) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const findConfigCamera = await configModel.findConfigCamera(type);
        console.log(findConfigCamera)
        if (findConfigCamera.length == 0) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Config khong tim thay',
                'Not Updated',
                'BR_person_3',
            );
        }
        return findConfigCamera[0];
    } catch (error) {
        // console.log(error)
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
const getAll = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const getAll = await configModel.getAll();
        if (getAll.length == 0) {
            throw new ApiError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                'Config khong tim thay',
                'Not Updated',
                'BR_person_3',
            );
        }
        return getAll;
    } catch (error) {
        // console.log(error)
        if (error.type && error.code)
            throw new ApiError(error.statusCode, error.message, error.type, error.code);
        else throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}
export const configService = {
    updateConfigCamera,
    findConfigCamera,
    getAll
}