import { StatusCodes } from 'http-status-codes';
import { parkingTurnService } from '~/services/parkingTurnService';
import { server } from '~/server'
import { uploadImageHandler } from '~/utils/uploads'


const createNew = async (req, res, next) => {
  try {
    // let licenePlate = req.body.licenePlate;
    // let zone = req.body.zone;
    // let position = req.body.position;


    const file = await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let licenePlate = req.body.licenePlate
    let zone = req.body.zone
    let position = req.body.position
    let image = file.filename;
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    server.io.emit('notification-parking', { message: 'Car enters the parking lot' })
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutPosition = async (req, res, next) => {
  try {
    // let licenePlate = req.body.licenePlate;
    // let zone = req.body.zone;

    const file = await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let licenePlate = req.body.licenePlate
    let zone = req.body.zone
    let position = '';
    let image = file.filename;

    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    server.io.emit('notification-parking', { message: 'Car enters the parking lot' })
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
};

const createNewWithoutZone = async (req, res, next) => {
  try {

    let file = await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let zone = '';
    let position = '';
    let image = file.filename;
    let licenePlate = req.body.licenePlate
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurn(licenePlate, zone, position, image);
    console.log('loi o day')
    server.io.emit('notification-parking', { message: 'Car enters the parking lot' })
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
}

const createNewZone = async (req, res, next) => {
  try {

    let file = await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
    let zone = 'O';
    let position = '';
    let image = file.filename;
    let licenePlate = req.body.licenePlate
    let datetime = ''
    if (req.body.datetime) {
      datetime = req.body.datetime
    }
    // Dieu huong sang tang Service
    const createUser = await parkingTurnService.createPakingTurnUpdate(licenePlate, zone, position, image, datetime);
    console.log('loi o day')
    server.io.emit('notification-parking', { message: 'Car enters the parking lot', id:  createUser.insertedId})
    res.status(StatusCodes.CREATED).json(createUser);
  } catch (error) {
    next(error);
  }
}


// const createPakingOrOut = async (req, res, next) => {
//   try {

//     let file= await uploadImageHandler.uploadImageSingle(req, res, 'parkingTurn')
//     let zone = 'O';
//     let position = '';
//     let image = file.filename;
//     let licenePlate = req.body.licenePlate
//     // Dieu huong sang tang Service
//     const createUser = await parkingTurnService.createPakingTurnUpdate(licenePlate, zone, position, image);
//     console.log('loi o day')
//     server.io.emit('notification-parking',{ message:  'Car enters the parking lot'})
//     res.status(StatusCodes.CREATED).json(createUser);
//   } catch (error) {
//     next(error);
//   }
// }


const outPaking = async (req, res, next) => {
  try {
    const licenePlate = req.body.licenePlate;
    console.log(licenePlate)

    let datetime = ''
    if (req.body.datetime) {
      datetime = req.body.datetime
    }
    // Dieu huong sang tang Service
    const outPaking = await parkingTurnService.outPaking(licenePlate, datetime);
    server.io.emit('notification-parking', { message: 'Car out Parking' , id : outPaking._id})
    res.status(StatusCodes.OK).json(outPaking);
  } catch (error) {
    next(error);
  }
};

const getVehicleInOutNumber = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getVehicleInOutNumber = await parkingTurnService.getVehicleInOutNumber(req, res);

    res.status(StatusCodes.OK).json(getVehicleInOutNumber);
  } catch (error) {
    next(error);
  }
};

const getVehicleInOutNumberByHour = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getVehicleInOutNumberByHour = await parkingTurnService.getVehicleInOutNumberByHour(req, res);

    res.status(StatusCodes.OK).json(getVehicleInOutNumberByHour);
  } catch (error) {
    next(error);
  }
};


const getRevenue = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getRevenue(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const GetRevenueByHour = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const GetRevenueByHour = await parkingTurnService.GetRevenueByHour(req, res);

    res.status(StatusCodes.OK).json(GetRevenueByHour);
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getEvent(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const getByDriver = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getByDriver(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const exportEvent = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    await parkingTurnService.exportEvent(req, res);
    // res.status(StatusCodes.OK).json('Thanh cong');
  } catch (error) {
    next(error);
  }
};


const carInSlot = async (req, res, next) => {
  try {
    // const zone = req.body.zone;
    // const position = req.body.position;

    let licenePlate = ''
    if (req.body.licenePlate) {
      licenePlate = req.body.licenePlate
    }
    
    let datetime = ''
    if (req.body.datetime) {
      datetime = req.body.datetime
    }


    let zone = ''
    if (req.body.zone) {
      zone = req.body.zone
    }


    let position = ''
    if (req.body.position) {
      position = req.body.position
    }
    // Dieu huong sang tang Service
    const carInSlot = await parkingTurnService.carInSlot(zone, position, licenePlate, datetime);
    let now = Date.now();
    server.io.emit('notification-parking',{ message:  'Car in slot', id: now})
    res.status(StatusCodes.OK).json(carInSlot);
  } catch (error) {
    next(error);
  }
};

const carOutSlot = async (req, res, next) => {
  try {
    let datetime = ''
    if (req.body.datetime) {
      datetime = req.body.datetime
    }


    let zone = ''
    if (req.body.zone) {
      zone = req.body.zone
    }

    let position = ''
    if (req.body.position) {
      position = req.body.position
    }

    let licenePlate = ''
    if (req.body.licenePlate) {
      licenePlate = req.body.licenePlate
    }
    let outPaking
    if(zone != '' && position != ''){
      outPaking = await parkingTurnService.carOutSlot(zone, position, datetime);
    }
    // Dieu huong sang tang Service
    else{
      outPaking = await parkingTurnService.carOutSlotByLicenePlate( licenePlate, datetime);
    }
    let now = Date.now();
    server.io.emit('notification-parking', { message: 'Car out slot', id: now })
    res.status(StatusCodes.OK).json(outPaking);
  } catch (error) {
    next(error);
  }
};

const getByFilter = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const getRevenue = await parkingTurnService.getByFilter(req, res);

    res.status(StatusCodes.OK).json(getRevenue);
  } catch (error) {
    next(error);
  }
};

const general = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const general = await parkingTurnService.general(req, res);

    res.status(StatusCodes.OK).json(general);
  } catch (error) {
    next(error);
  }
};


const visistorRate = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const GetRevenueByHour = await parkingTurnService.visistorRate(req, res);

    res.status(StatusCodes.OK).json(GetRevenueByHour);
  } catch (error) {
    next(error);
  }
};

const inoutByTime = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByTime = await parkingTurnService.inoutByTime(req, res);

    res.status(StatusCodes.OK).json(inoutByTime);
  } catch (error) {
    next(error);
  }
};


const inoutByJob = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByJob = await parkingTurnService.inoutByJob(req, res);

    res.status(StatusCodes.OK).json(inoutByJob);
  } catch (error) {
    next(error);
  }
};

const inoutByDepa = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const inoutByDepa = await parkingTurnService.inoutByDepa(req, res);

    res.status(StatusCodes.OK).json(inoutByDepa);
  } catch (error) {
    next(error);
  }
};

const mostParkedVehicle = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    const mostParkedVehicle = await parkingTurnService.mostParkedVehicle(req, res);

    res.status(StatusCodes.OK).json(mostParkedVehicle);
  } catch (error) {
    next(error);
  }
};


const exportReport = async (req, res, next) => {
  try {
    // Dieu huong sang tang Service
    await parkingTurnService.exportReport(req, res);
    // res.status(StatusCodes.OK).json('Thanh cong');
  } catch (error) {
    next(error);
  }
};



export const parkingTurnController = {
  createNew,
  createNewWithoutPosition,
  createNewWithoutZone,
  outPaking,
  getVehicleInOutNumber,
  getVehicleInOutNumberByHour,
  getRevenue,
  GetRevenueByHour,
  getEvent,
  exportEvent,
  getByDriver,
  createNewZone,
  carInSlot,
  carOutSlot,
  getByFilter,
  general,
  visistorRate,
  inoutByTime,
  inoutByJob,
  inoutByDepa,
  mostParkedVehicle,
  exportReport,
  // createPakingOrOut,
};
