import { Sequelize } from "sequelize-typescript";
import IRoomRepository from "../repository/RoomRepository.interface";
import CreateHandler from "./CreateHandler";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import RoomRepository from "../../infra/room/repository/Room.repository";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../../movie/entity/Movie";
import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import Room from "../entity/Room";

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
  test('create room without fullname', async () => {
    const createHandler = new CreateHandler(roomRepository, movieRepository);
    const result = await createHandler.execute({ ...roomInput, roomMoviesId: [ movieInput.id ] });
    expect(result.id).toBeDefined();
    expect(result.number).toEqual(roomInput.number);
    expect(result.description).toEqual(roomInput.description);
    expect(result.roomMovies[0]).toEqual({ ...movieInput, durationInHours: '01:00:00' });
  });
});
