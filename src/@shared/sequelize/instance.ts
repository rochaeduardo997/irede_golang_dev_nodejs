import { Sequelize } from "sequelize-typescript";
import MovieModel from "../../infra/movie/repository/Movie.model";
import RoomModel from "../../infra/room/repository/Room.model";
import RoomMoviesModel from "../../infra/room/repository/RoomMovies.model";

const instanceSequelizeSQLite3 = async () => {
  const database = process.env.DB_DB!;

  const result = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    sync:    { force: true },
    database
  });

  await syncModels(result);

  return result;
}

const instanceSequelizeMySQL = async () => {
  const database = process.env.DB_DB!;
  const username = process.env.DB_USER!;
  const password = process.env.DB_PASSWORD!;
  const host     = process.env.DB_HOST!;

  const result = new Sequelize({
    username, password, database, host,
    dialect: 'mysql',
    logging: false
  });

  await syncModels(result);

  return result;
}

const syncModels = async (sequelize: Sequelize): Promise<void> => {
  sequelize.addModels([
    MovieModel,
    RoomModel, RoomMoviesModel
  ]);

  await sequelize.sync();

  return;
}

export { instanceSequelizeMySQL }

export default instanceSequelizeSQLite3;
