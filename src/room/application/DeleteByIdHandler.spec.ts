import { Sequelize } from "sequelize-typescript";
import IRoomRepository from "../repository/RoomRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import RoomRepository from "../../infra/room/repository/Room.repository";
import Room from "../entity/Room";
import DeleteByIdHandler from "./DeleteByIdHandler";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../../movie/entity/Movie";
import IMovieRepository from "../../movie/repository/MovieRepository.interface";

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
  test('delete room by id', async () => {
    const deleteByIdHandler = new DeleteByIdHandler(roomRepository);
    const result = await deleteByIdHandler.execute({ id: roomInput.id });
    expect(result).toEqual(true);
    const rooms = await roomRepository.findAll(1);
    expect(rooms.total).toEqual(0);
  });
});

describe('fail', () => {
  test('fail on delete room by id with invalid id', async () => {
    const deleteByIdHandler = new DeleteByIdHandler(roomRepository);
    await expect(() => deleteByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on delete room by id invalid id');
  });
});
