import { Sequelize } from "sequelize-typescript";
import Room from "../../../room/entity/Room";
import IRoomRepository from "../../../room/repository/RoomRepository.interface";
import RoomRepository from "./Room.repository";
import instanceSequelizeSQLite3 from '../../../@shared/sequelize/instance';
import * as dotenv from 'dotenv';
import Movie from "../../../movie/entity/Movie";
import MovieRepository from "../../movie/repository/Movie.repository";
import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
dotenv.config();

let sequelize: Sequelize;
let roomRepository:  IRoomRepository;
let movieRepository: IMovieRepository;

const roomInput   = { id: 'id', number: 100, description: 'description' };
const movieInput  = { id: 'id1', name: 'name', director: 'director', durationInSeconds: 3600 };
const movieInput2 = { id: 'id2', name: 'name', director: 'director', durationInSeconds: 3600 };

beforeEach(async () => {
  sequelize  = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  roomRepository  = new RoomRepository(sequelize, movieRepository);
  await movieRepository.create(new Movie(movieInput));
  await movieRepository.create(new Movie(movieInput2));
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('create room', async () => {
    const room = new Room(roomInput);
    room.addMovie(new Movie(movieInput));
    const result = await roomRepository.create(room);
    expect(result).toEqual(true);
  });

  test('find all rooms', async () => {
    const room1 = new Room(roomInput);
    room1.addMovie(new Movie(movieInput));
    const room2 = new Room({ id: 'id2', number: 200, description: 'description2' });
    room2.addMovie(new Movie(movieInput));
    await roomRepository.create(room1);
    await roomRepository.create(room2);
    const result = await roomRepository.findAll(1);
    expect(result.total).toEqual(2);
    expect(result.page).toEqual(1);
    expect(result.registers[0]).toEqual(room1);
    expect(result.registers[1]).toEqual(room2);
  });

  test('find room by id', async () => {
    const room = new Room(roomInput);
    await roomRepository.create(room);
    const result = await roomRepository.findBy(room.id);
    expect(result).toEqual(room);
  });

  test('update room by id', async () => {
    const room = new Room(roomInput);
    room.addMovie(new Movie(movieInput));
    await roomRepository.create(room);
    const updateInput = { number: 999, description: 'new_description' };
    room.update(updateInput);
    const result = await roomRepository.updateBy(room.id, room);
    expect(result).toEqual(true);
  });

  test('validate updated room with new associated movies', async () => {
    const room = new Room(roomInput);
    const movie1 = new Movie(movieInput);
    room.addMovie(movie1);
    await roomRepository.create(room);
    const movie2 = new Movie(movieInput2);
    room.addMovie(movie2);
    await roomRepository.updateBy(room.id, room);
    const result = await roomRepository.findBy(room.id);
    expect(result.getAssociatedMovies()).toHaveLength(2);
    expect(result.getAssociatedMovies()[0]).toEqual(movie1);
    expect(result.getAssociatedMovies()[1]).toEqual(movie2);
  });

  test('delete room by id', async () => {
    const room = new Room(roomInput);
    await roomRepository.create(room);
    const result = await roomRepository.deleteBy(room.id);
    expect(result).toEqual(true);
  });
});

describe('fail', () => {
  test('failed on create with same id', async () => {
    const room = new Room(roomInput);
    await roomRepository.create(room);
    await expect(() => roomRepository.create(room))
      .rejects
      .toThrow('id must be unique');
  });

  test('failed on find room by invalid id', async () => {
    await expect(() => roomRepository.findBy('invalid id'))
      .rejects
      .toThrow('failed on get room by id invalid id');
  });

  test('failed on update room by invalid id', async () => {
    await expect(() => roomRepository.updateBy('invalid id', new Room(roomInput)))
      .rejects
      .toThrow('failed on update room by id invalid id');
  });

  test('failed on delete room with invalid id', async () => {
    await expect(() => roomRepository.deleteBy('invalid id'))
      .rejects
      .toThrow('failed on delete room by id invalid id');
  });
});
