import * as dotenv from 'dotenv';
import MovieRepository from './infra/movie/repository/Movie.repository';
import RoomRepository from './infra/room/repository/Room.repository';
import MovieController from './infra/controller/movie/Movie.controller';
import RoomController from './infra/controller/room/Room.controller';
import { instanceSequelizeMySQL } from './@shared/sequelize/instance';
import ExpressAdapter from './infra/http/express_adapter';
dotenv.config({ path: __dirname + '/./../.env' });

(async () => {
  const httpAdapter = new ExpressAdapter();

  const sequelize = await instanceSequelizeMySQL();
  const movieRepository = new MovieRepository(sequelize);
  const roomRepository  = new RoomRepository(sequelize, movieRepository);

  new MovieController(httpAdapter, movieRepository);
  new RoomController(httpAdapter, roomRepository, movieRepository);

  httpAdapter.init();
  httpAdapter.listen();
})();
