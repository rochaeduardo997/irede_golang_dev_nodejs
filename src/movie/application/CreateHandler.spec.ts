import { Sequelize } from "sequelize-typescript";
import IMovieRepository from "../repository/MovieRepository.interface";
import CreateHandler from "./CreateHandler";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import MovieRepository from "../../infra/movie/repository/Movie.repository";

const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };
let sequelize:      Sequelize;
let movieRepository: IMovieRepository;

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('create movie', async () => {
    const createHandler = new CreateHandler(movieRepository);
    const result = await createHandler.execute(input);
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.director).toEqual(input.director);
    expect(result.durationInSeconds).toEqual(input.durationInSeconds);
  });
});
