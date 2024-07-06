import { StatusCodes } from 'http-status-codes';
import { configService } from '~/services/configService';
import { uploadImageHandler } from '~/utils/uploads';

const updateConfigCamera = async (req, res, next) => {
    try {
        const data = req.body;
        const type = req.body.type;

        const updateConfigCamera = await configService.updateConfigCamera(type, data);

        res.status(StatusCodes.CREATED).json(updateConfigCamera);
    } catch (error) {
        next(error);
    }
};

const findConfigCamera = async (req, res, next) => {
    try {
        const type = req.body.type;

        const findConfigCamera = await configService.findConfigCamera(type);

        res.status(StatusCodes.CREATED).json(findConfigCamera);
    } catch (error) {
        next(error);
    }
};


const getAll = async (req, res, next) => {
    try {

        const getAll = await configService.getAll(type);

        res.status(StatusCodes.CREATED).json(getAll);
    } catch (error) {
        next(error);
    }
};



export const configController = {
    updateConfigCamera,
    findConfigCamera,
    getAll,
}
