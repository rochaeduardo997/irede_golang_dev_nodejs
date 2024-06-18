import supertest from 'supertest';
import ExpressAdapter from '../../http/express_adapter';
import TestAgent from 'supertest/lib/agent';
import MovieController from './Movie.controller';
import instanceSequelizeSQLite3 from '../../../@shared/sequelize/instance';
import { Sequelize } from 'sequelize-typescript';
import Movie from '../../../movie/entity/Movie';
import IMovieRepository from '../../../movie/repository/MovieRepository.interface';
import MovieRepository from '../../movie/repository/Movie.repository';
import * as dotenv from 'dotenv';
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let movieRepository: IMovieRepository;
const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };

beforeEach(async () => {
  const httpAdapter = new ExpressAdapter();
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  new MovieController(httpAdapter, movieRepository);
  httpAdapter.init();
  request = supertest(httpAdapter.app);
});
afterEach(() => sequelize.close());

describe('success', () => {
  test('create', async () => {
    const { status, body } = await request
      .post('/api/v1/movies')
      .send({ ...input, status: false });
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.name).toEqual(input.name);
    expect(body?.result?.director).toEqual(input.director);
    expect(body?.result?.durationInSeconds).toEqual(input.durationInSeconds);
    expect(status).toEqual(201);
  });

  test('find all', async () => {
    await movieRepository.create(new Movie(input));
    const { status, body } = await request
      .get('/api/v1/movies/all/1');
    expect(+body.result?.total).toEqual(1);
    expect(+body.result?.page).toEqual(1);
    expect(body.result?.registers[0].id).toEqual(input.id);
    expect(body.result?.registers[0].name).toEqual(input.name);
    expect(body.result?.registers[0].director).toEqual(input.director);
    expect(body.result?.registers[0].durationInSeconds).toEqual(input.durationInSeconds);
    expect(status).toEqual(200);
  });

  test('find by id', async () => {
    await movieRepository.create(new Movie(input));
    const { status, body } = await request
      .get(`/api/v1/movies/${input.id}`);
    expect(body.result?.id).toEqual(input.id);
    expect(body.result?.name).toEqual(input.name);
    expect(body.result?.director).toEqual(input.director);
    expect(body.result?.durationInSeconds).toEqual(input.durationInSeconds);
    expect(status).toEqual(200);
  });

  test('update by id', async () => {
    await movieRepository.create(new Movie(input));
    const updateInput = { name: 'new_name', director: 'new_director', durationInSeconds: 50 };
    const { status, body } = await request
      .put(`/api/v1/movies/${input.id}`)
      .send(updateInput);
    expect(body.result?.id).toEqual(input.id);
    expect(body.result?.name).toEqual(updateInput.name);
    expect(body.result?.director).toEqual(updateInput.director);
    expect(body.result?.durationInSeconds).toEqual(updateInput.durationInSeconds);
    expect(status).toEqual(200);
  });

  test('delete by id', async () => {
    movieRepository.create(new Movie(input));
    const { status, body } = await request
      .delete(`/api/v1/movies/${input.id}`);
    expect(body.result).toEqual(true);
    expect(status).toEqual(200);
    expect((await movieRepository.findAll(1)).total).toEqual(0);
  });
});


describe('fail', () => {
  test('fail on create without name', async () => {
    const { status, body } = await request
      .post('/api/v1/movies')
      .send({});
    expect(body?.msg).toEqual('name must be provided');
    expect(status).toEqual(400);
  });
});