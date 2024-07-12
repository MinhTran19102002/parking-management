/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { connectDB, GET_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1/index';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
//
let io;
app.use(express.json());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());

//Use API V1
app.use('/api', APIs_V1);

//Middleware xu ly loi tap trung
app.use(errorHandlingMiddleware);
app.timeout = 300000;
const httpServer = createServer(app);
io = new Server(httpServer, {
  path: "/my-custom-path/"
  // cors: {
  //   origin: ['http://localhost:5173', 'https://parking-management-iota.vercel.app', 'https://park.workon.space'],
  // },
});
const START_SEVER = () => {
  io.on('connection', (socket) => {
    console.log('connect !');
  });

  //mo lai
  // httpServer.listen(PORT);
  // httpServer.use(cors())
  // chay local
  if (env.BUILD_MODE == 'dev') {
    httpServer.listen(8010, 8010, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Hello Minh, I am running at ${env.APP_HOST}:${env.APP_PORT}, version ${process.env.APP_VERSION}`,
      );
    });
    // httpServer.listen(env.APP_PORT, env.APP_HOST, () => {
    //   // eslint-disable-next-line no-console
    //   console.log(`Hello Minh, I am running at ${env.APP_HOST}:${env.APP_PORT}/`);
    // });
  } else {
    httpServer.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Hello Minh, I am running hosting at ${process.env.PORT}/, version ${process.env.APP_VERSION}`,
      );
    });
  }

  app.get('/', (req, res) => res.send('Hello'));

  exitHook(() => {
    console.log('Disconnecting');
    CLOSE_DB();
    console.log('Disconnected');
  });
};

connectDB()
  .then(() => console.log('Connect to database'))
  .then(() => START_SEVER())
  .catch((error) => {
    console.error(error);
    process.exit();
  });

export const server = {
  io,
  app,
  START_SEVER,
  connectDB,
};
