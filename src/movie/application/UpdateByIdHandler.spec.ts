import { Sequelize } from "sequelize-typescript";
import IMovieRepository from "../repository/MovieRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../entity/Movie";
import UpdateByIdHandler from "./UpdateByIdHandler";

let movie: Movie;

let sequelize:       Sequelize;
let movieRepository: IMovieRepository;

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);

  const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };
  await movieRepository.create(new Movie(input));
  const movies = await movieRepository.findAll(1);
  movie = movies.registers[0];
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('update movie by id with all fields', async () => {
    const input = { name: 'new_name', director: 'new_director', durationInSeconds: 50 };
    const updateByIdHandler = new UpdateByIdHandler(movieRepository);
    const result = await updateByIdHandler.execute({ id: movie.id, ...input });
    expect(result.id).toEqual(movie.id);
    expect(result.name).toEqual(input.name);
    expect(result.director).toEqual(input.director);
    expect(result.durationInSeconds).toEqual(input.durationInSeconds);
  });
});

describe('fail', () => {
  test('fail on update movie by id with invalid id', async () => {
    const updateByIdHandler = new UpdateByIdHandler(movieRepository);
    await expect(() => updateByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on get movie by id invalid id');
  });
});
