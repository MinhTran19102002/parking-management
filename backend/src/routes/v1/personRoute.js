import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userValidation } from '~/validations/personValidation';
import { userController } from '~/controllers/personController';
import { verifyTokenMidleware } from '~/middlewares/verifytokenMidleware';

const Router = express.Router();

Router.route('/')
  .post(userValidation.createNew, userController.createNew) //
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findUsers)
  .put(verifyTokenMidleware.verifyTokenAndAdminManager, userController.updateUser)
  .delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteUser);

Router.route('/addMany').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.createMany,
);
Router.route('/deleteMany').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteMany,
);
Router.route('/deleteAll').delete(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteAll,
);

Router.route('/addManyDriver').post(userController.createManyDriver); // tạo nhiều driver

Router.route('/addManyManager').post(userController.createMany); // tạo nhiều manager

Router.route('/driver')
  .post(
    // userValidation.createDriver,
    // verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.createDriver,
  ) //
  .get( userController.findDriver) //
  .put(
    // userValidation.updateDriver,
    // verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.updateDriver,
  ) //
  .delete(
    userValidation.deleteDriver,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.deleteDriver,
  ); //

Router.route('/driver/deletes').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteDrivers,
);

Router.route('/driver/filter').get(
  // verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.findDriverByFilter,
);

Router.route('/employee')
  .get(verifyTokenMidleware.verifyTokenAndAdminManager, userController.findEmployees)
  .post(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.createEmployee,
  )
  .put(
    userValidation.createEmployee,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.updateEmployee,
  )
  .delete(
    // verifyTokenMidleware.verifyTokenAndManager,
    userController.deleteEmployee,
  );

Router.route('/employee/deletes').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteEmployees,
);

//Sử lý crud của manager
Router.route('/manager')
  .post(
    userValidation.createUser,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.createUser,
  ) //
  .get(verifyTokenMidleware.verifyTokenAndAdmin, userController.findManagerByFilter)
  .put(
    userValidation.updateUser,
    verifyTokenMidleware.verifyTokenAndAdminManager,
    userController.updateUser,
  )
  .delete(verifyTokenMidleware.verifyTokenAndAdminManager, userController.deleteManager);

Router.route('/manager/deletes').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteManagers,
);

Router.route('/createManyEmployee').post(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.createManyEmployee,
);

Router.route('/deleteAllEmployee').delete(
  verifyTokenMidleware.verifyTokenAndAdminManager,
  userController.deleteAllEmployee,
);

Router.route('/changePassword').post(
  userValidation.changePassword,
  verifyTokenMidleware.verifyToken,
  userController.changePassword,
);


Router.route('/staff/filter')
  .get(
    // userValidation.changePassword,
    // verifyTokenMidleware.verifyToken,
    userController.findStaffByFilter
  );

Router.route('/staff')
  .post(
    userController.createUserStaff)
  .put(
    // userValidation.updateUser,
    // verifyTokenMidleware.verifyTokenAndAdmin,
    userController.updateUser
  )
  .delete(
    // verifyTokenMidleware.verifyTokenAndAdmin, 
    userController.deleteStaff);
Router.route('/staff/deletes').post(
  // verifyTokenMidleware.verifyTokenAndAdmin,
  userController.deleteStaffs
);

Router.route('/staff/updateAvatar').put(
  // verifyTokenMidleware.verifyTokenAndAdmin,
  userController.updateAvatar
);

Router.route('/getUser').post(
  userController.getUser
)



export const userRoute = Router;
