import { Sequelize } from "sequelize-typescript";
import IMovieRepository from "../repository/MovieRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../entity/Movie";
import DeleteByIdHandler from "./DeleteByIdHandler";

const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };
let movie: Movie;

let sequelize:      Sequelize;
let movieRepository: IMovieRepository;

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  await movieRepository.create(new Movie(input));
  const movies = await movieRepository.findAll(1);
  movie = movies.registers[0];
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('delete movie by id', async () => {
    const deleteByIdHandler = new DeleteByIdHandler(movieRepository);
    const result = await deleteByIdHandler.execute({ id: movie.id });
    expect(result).toEqual(true);
    const movies = await movieRepository.findAll(1);
    expect(movies.total).toEqual(0);
  });
});

describe('fail', () => {
  test('fail on delete movie by id with invalid id', async () => {
    const deleteByIdHandler = new DeleteByIdHandler(movieRepository);
    await expect(() => deleteByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on delete movie by id invalid id');
  });
});
