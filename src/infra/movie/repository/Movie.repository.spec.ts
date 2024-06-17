import { Sequelize } from "sequelize-typescript";
import Movie from "../../../movie/entity/Movie";
import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
import MovieRepository from "./Movie.repository";
import instanceSequelizeSQLite3 from '../../../@shared/sequelize/instance';
import * as dotenv from 'dotenv';
dotenv.config();

let sequelize:  Sequelize;
let repository: IMovieRepository;

beforeEach(async () => {
  sequelize  = await instanceSequelizeSQLite3();
  repository = new MovieRepository(sequelize);
});
afterEach(async () => await sequelize.close());

const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };

describe('success', () => {
  test('create movie', async () => {
    const movie = new Movie(input);
    const result = await repository.create(movie);
    expect(result).toEqual(true);
  });

  test('find all movies', async () => {
    const movie1 = new Movie(input);
    const movie2 = new Movie({ ...input, id: 'id2', name: 'name2' });
    await repository.create(movie1);
    await repository.create(movie2);
    const result = await repository.findAll(1);
    expect(result.total).toEqual(2);
    expect(result.page).toEqual(1);
    expect(result.registers[0]).toEqual(movie1);
    expect(result.registers[1]).toEqual(movie2);
  });

  test('find movie by id', async () => {
    const movie = new Movie(input);
    await repository.create(movie);
    const result = await repository.findBy(movie.id);
    expect(result).toEqual(movie);
  });

  test('update movie by id', async () => {
    const movie = new Movie(input);
    await repository.create(movie);
    const updateInput = { name: 'new_name', director: 'new_director', durationInSeconds: 50 };
    movie.update(updateInput);
    const result = await repository.updateBy(movie.id, movie);
    expect(result).toEqual(true);
  });

  test('delete movie by id', async () => {
    const movie = new Movie(input);
    await repository.create(movie);
    const result = await repository.deleteBy(movie.id);
    expect(result).toEqual(true);
  });
});

describe('fail', () => {
  test('failed on create with same id', async () => {
    const movie = new Movie(input);
    await repository.create(movie);
    await expect(() => repository.create(movie))
      .rejects
      .toThrow('id must be unique');
  });

  test('failed on find movie by invalid id', async () => {
    await expect(() => repository.findBy('invalid id'))
      .rejects
      .toThrow('failed on get movie by id invalid id');
  });

  test('failed on update movie by invalid id', async () => {
    await expect(() => repository.updateBy('invalid id', new Movie(input)))
      .rejects
      .toThrow('failed on update movie by id invalid id');
  });

  test('failed on delete movie with invalid id', async () => {
    await expect(() => repository.deleteBy('invalid id'))
      .rejects
      .toThrow('failed on delete movie by id invalid id');
  });
});
