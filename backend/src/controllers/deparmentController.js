import { StatusCodes } from 'http-status-codes';
import { deparmentService } from '~/services/deparmentService';


const createDeparment = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        // console.log(req.body)
        const createNew = await cameraService.createCamera(req.body, imageName);

        res.status(StatusCodes.CREATED).json(createNew);
    } catch (error) {
        next(error);
    }
};


const createManyDeparment = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const createManyDeparment = await deparmentService.createMany(req.body);
        res.status(StatusCodes.CREATED).json(createManyDeparment);
    } catch (error) {
        next(error);
    }
};

const findAll = async (req, res, next) => {
    try {
        // Dieu huong sang tang Service
        const findAll = await deparmentService.findAll();
        res.status(StatusCodes.CREATED).json(findAll);
    } catch (error) {
        next(error);
    }
};
export const deparmentController = {
    createDeparment,
    createManyDeparment,
    findAll,
}