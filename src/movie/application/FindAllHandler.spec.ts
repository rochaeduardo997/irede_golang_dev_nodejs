import { Sequelize } from "sequelize-typescript";
import IMovieRepository from "../repository/MovieRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../entity/Movie";
import FindAllHandler from "./FindAllHandler";

const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };
let movie1: Movie;
let movie2: Movie;

let sequelize:      Sequelize;
let movieRepository: IMovieRepository;

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  await movieRepository.create(new Movie(input));
  await movieRepository.create(new Movie({ ...input, id: 'id2' }));
  const movies = await movieRepository.findAll(1);
  movie1 = movies.registers[0];
  movie2 = movies.registers[1];
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('find all movies', async () => {
    const findAllHandler = new FindAllHandler(movieRepository);
    const result = await findAllHandler.execute({ page: 1 });
    expect(result.total).toEqual(2);
    expect(result.page).toEqual(1);
    expect(result.registers).toHaveLength(2);
    expect(result.registers[0].id).toEqual(movie1.id);
    expect(result.registers[0].name).toEqual(movie1.name);
    expect(result.registers[0].director).toEqual(movie1.director);
    expect(result.registers[0].durationInSeconds).toEqual(movie1.durationInSeconds);
    expect(result.registers[0].durationInHours).toEqual(movie1.durationInHours());
    expect(result.registers[1].id).toEqual(movie2.id);
    expect(result.registers[1].name).toEqual(movie2.name);
    expect(result.registers[1].director).toEqual(movie2.director);
    expect(result.registers[1].durationInSeconds).toEqual(movie2.durationInSeconds);
    expect(result.registers[1].durationInHours).toEqual(movie2.durationInHours());
  });
});
