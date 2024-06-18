import supertest from 'supertest';
import ExpressAdapter from '../../http/express_adapter';
import TestAgent from 'supertest/lib/agent';
import RoomController from './Room.controller';
import instanceSequelizeSQLite3 from '../../../@shared/sequelize/instance';
import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import IMovieRepository from '../../../movie/repository/MovieRepository.interface';
import Room from '../../../room/entity/Room';
import IRoomRepository from '../../../room/repository/RoomRepository.interface';
import RoomRepository from '../../room/repository/Room.repository';
import MovieRepository from '../../movie/repository/Movie.repository';
import Movie from '../../../movie/entity/Movie';
dotenv.config();

let request: TestAgent;
let sequelize: Sequelize;
let roomRepository:  IRoomRepository;
let movieRepository: IMovieRepository;

const roomInput  = { id: 'id', number: 100, description: 'description' };
const movieInput1 = { id: 'id1', name: 'name', director: 'director', durationInSeconds: 3600 };
const movieInput2 = { id: 'id2', name: 'name', director: 'director', durationInSeconds: 3601 };

beforeEach(async () => {
  const httpAdapter = new ExpressAdapter();
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  roomRepository  = new RoomRepository(sequelize, movieRepository);
  await movieRepository.create(new Movie(movieInput1));
  await movieRepository.create(new Movie(movieInput2));
  const { registers } = await movieRepository.findAll(1);
  const _room = new Room(roomInput);
  _room.addMovie(registers[0]);
  await roomRepository.create(_room);
  new RoomController(httpAdapter, roomRepository, movieRepository);
  httpAdapter.init();
  request = supertest(httpAdapter.app);
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('create', async () => {
    const { status, body } = await request
      .post('/api/v1/rooms')
      .send({ ...roomInput, roomMoviesId: [ movieInput1.id ] });
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.number).toEqual(roomInput.number);
    expect(body?.result?.description).toEqual(roomInput.description);
    expect(body?.result?.roomMovies[0]).toEqual({ ...movieInput1, durationInHours: '01:00:00' });
    expect(status).toEqual(201);
  });

  test('find all', async () => {
    const { status, body } = await request
      .get('/api/v1/rooms/all/1');
    expect(+body.result?.total).toEqual(1);
    expect(+body.result?.page).toEqual(1);
    expect(body.result?.registers[0].id).toBeDefined();
    expect(body.result?.registers[0].number).toEqual(roomInput.number);
    expect(body.result?.registers[0].description).toEqual(roomInput.description);
    expect(body.result?.registers[0].roomMovies[0]).toEqual({ ...movieInput1, durationInHours: '01:00:00' });
    expect(status).toEqual(200);
  });

  test('find by id', async () => {
    const { status, body } = await request
      .get(`/api/v1/rooms/${roomInput.id}`);
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.number).toEqual(roomInput.number);
    expect(body?.result?.description).toEqual(roomInput.description);
    expect(body?.result?.roomMovies[0]).toEqual({ ...movieInput1, durationInHours: '01:00:00' });
    expect(status).toEqual(200);
  });

  test('update by id', async () => {
    const updateInput = { number: 300, description: 'new_description' };
    const { status, body } = await request
      .put(`/api/v1/rooms/${roomInput.id}`)
      .send({ ...updateInput, roomMoviesId: [ movieInput2.id ] });
    expect(body?.result?.id).toBeDefined();
    expect(body?.result?.number).toEqual(updateInput.number);
    expect(body?.result?.description).toEqual(updateInput.description);
    expect(body?.result?.roomMovies[0]).toEqual({ ...movieInput2, durationInHours: '01:00:01' });
    expect(status).toEqual(200);
  });

  test('delete by id', async () => {
    const { status, body } = await request
      .delete(`/api/v1/rooms/${roomInput.id}`);
    expect(body.result).toEqual(true);
    expect(status).toEqual(200);
    expect((await roomRepository.findAll(1)).total).toEqual(0);
  });
});

describe('fail', () => {
  test('fail on create without number', async () => {
    const { status, body } = await request
      .post('/api/v1/rooms')
      .send({});
    expect(body?.msg).toEqual('room number must be provided');
    expect(status).toEqual(400);
  });
   
  test('fail on create with number smaller than 0', async () => {
    const { status, body } = await request
      .post('/api/v1/rooms')
      .send({ number: -1 });
    expect(body?.msg).toEqual('room number must be greater or equal 0');
    expect(status).toEqual(400);
  });
});