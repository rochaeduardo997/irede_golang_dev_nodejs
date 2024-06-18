import { Sequelize } from "sequelize-typescript";
import IRoomRepository from "../repository/RoomRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import RoomRepository from "../../infra/room/repository/Room.repository";
import Room from "../entity/Room";
import UpdateByIdHandler from "./UpdateByIdHandler";
import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../../movie/entity/Movie";

let sequelize: Sequelize;
let roomRepository:  IRoomRepository;
let movieRepository: IMovieRepository;

const roomInput   = { id: 'id', number: 100, description: 'description' };
const movieInput  = { id: 'id1', name: 'name', director: 'director', durationInSeconds: 3600 };
const movieInput2 = { id: 'id2', name: 'name', director: 'director', durationInSeconds: 3600 };

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  roomRepository  = new RoomRepository(sequelize, movieRepository);
  await movieRepository.create(new Movie(movieInput));
  await movieRepository.create(new Movie(movieInput2));
  const { registers } = await movieRepository.findAll(1);
  const _room = new Room(roomInput);
  _room.addMovie(registers[0]);
  await roomRepository.create(_room);
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('update room by id with all fields', async () => {
    const input = {
      id:           roomInput.id,
      number:       300,
      description:  'new_description',
      roomMoviesId: [ movieInput2.id ]
    };
    const updateByIdHandler = new UpdateByIdHandler(roomRepository, movieRepository);
    const result = await updateByIdHandler.execute(input);
    expect(result.id).toEqual(input.id);
    expect(result.number).toEqual(input.number);
    expect(result.description).toEqual(input.description);
    expect(result.roomMovies[0]).toEqual({ ...movieInput2, durationInHours: '01:00:00' });
  });
});

describe('fail', () => {
  test('fail on update room by id with invalid id', async () => {
    const updateByIdHandler = new UpdateByIdHandler(roomRepository, movieRepository);
    await expect(() => updateByIdHandler.execute({ id: 'invalid id' }))
      .rejects
      .toThrow('failed on get room by id invalid id');
  });
});
