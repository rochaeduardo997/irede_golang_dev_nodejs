import { Sequelize } from "sequelize-typescript";
import IMovieRepository from "../repository/MovieRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../entity/Movie";
import FindByIdHandler from "./FindByIdHandler";

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
  test('find movie by id', async () => {
    const findByIdHandler = new FindByIdHandler(movieRepository);
    const result = await findByIdHandler.execute({ id: movie.id });
    expect(result.id).toEqual(movie.id);
    expect(result.name).toEqual(movie.name);
    expect(result.director).toEqual(movie.director);
    expect(result.durationInSeconds).toEqual(movie.durationInSeconds);
    expect(result.durationInHours).toEqual(movie.durationInHours());
  });
});

describe('fail', () => {
  test('fail on find movie by id with invalid id', async () => {
    const findByIdHandler = new FindByIdHandler(movieRepository);
    await expect(() => findByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on get movie by id invalid id');
  });
});
