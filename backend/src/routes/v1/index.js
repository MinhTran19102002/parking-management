import express from 'express'
import {authRoute} from '~/routes/v1/authRoute'
import {userRoute} from '~/routes/v1/personRoute'
import {parkingRoute} from '~/routes/v1/parkingRoute'
import {parkingTurnRoute} from '~/routes/v1/parkingTurnRoute'
import { vehicleRoute } from './vehicleRoute'
import { scheduleRoute } from './scheduleRoute'
import { stationRoute } from './stationRoute'
import { cameraRoute } from './cameraRoute'

const Router = express.Router()

// API user
Router.use('/user', userRoute)

// API auth
Router.use('/auth', authRoute)

// API parking
Router.use('/parking', parkingRoute)

// API parkingTurn
Router.use('/parkingTurn', parkingTurnRoute)

// API vehicle
Router.use('/vehicle', vehicleRoute)

// API schedule
Router.use('/schedule', scheduleRoute)


// API schedule
Router.use('/station', stationRoute)

// API camera
Router.use('/camera', cameraRoute)

export const APIs_V1 = Router