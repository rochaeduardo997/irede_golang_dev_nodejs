import { Sequelize } from "sequelize-typescript";
import IRoomRepository from "../repository/RoomRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import RoomRepository from "../../infra/room/repository/Room.repository";
import Room from "../entity/Room";
import FindByIdHandler from "./FindByIdHandler";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import Movie from "../../movie/entity/Movie";

let sequelize: Sequelize;
let roomRepository:  IRoomRepository;
let movieRepository: IMovieRepository;

const roomInput  = { id: 'id', number: 100, description: 'description' };
const movieInput = { id: 'id1', name: 'name', director: 'director', durationInSeconds: 3600 };

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  roomRepository  = new RoomRepository(sequelize, movieRepository);
  await movieRepository.create(new Movie(movieInput));
  const { registers } = await movieRepository.findAll(1);
  const _room = new Room(roomInput);
  _room.addMovie(registers[0]);
  await roomRepository.create(_room);
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('find room by id', async () => {
    const findByIdHandler = new FindByIdHandler(roomRepository);
    const result = await findByIdHandler.execute({ id: roomInput.id });
    expect(result.id).toEqual(roomInput.id);
    expect(result.number).toEqual(roomInput.number);
    expect(result.description).toEqual(roomInput.description);
    expect(result.roomMovies[0]).toEqual({ ...movieInput, durationInHours: '01:00:00' });
  });
});

describe('fail', () => {
  test('fail on find room by id with invalid id', async () => {
    const findByIdHandler = new FindByIdHandler(roomRepository);
    await expect(() => findByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on get room by id invalid id');
  });
});
