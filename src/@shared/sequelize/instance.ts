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

const syncModels = async (sequelize: Sequelize): Promise<void> => {
  sequelize.addModels([
    MovieModel,
    RoomModel, RoomMoviesModel
  ]);

  await sequelize.sync();

  return;
}

export default instanceSequelizeSQLite3;
