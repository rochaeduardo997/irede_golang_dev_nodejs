import { Sequelize } from "sequelize-typescript";
import IRoomRepository from "../repository/RoomRepository.interface";
import instanceSequelizeSQLite3 from "../../@shared/sequelize/instance";
import Room from "../entity/Room";
import FindAllHandler from "./FindAllHandler";
import MovieRepository from "../../infra/movie/repository/Movie.repository";
import Movie from "../../movie/entity/Movie";
import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import RoomRepository from "../../infra/room/repository/Room.repository";

let sequelize: Sequelize;
let roomRepository:  IRoomRepository;
let movieRepository: IMovieRepository;

const roomInput1  = { id: 'id1', number: 100, description: 'description' };
const roomInput2  = { id: 'id2', number: 200, description: 'description' };
const movieInput1 = { id: 'id1', name: 'name', director: 'director', durationInSeconds: 3600 };
const movieInput2 = { id: 'id2', name: 'name', director: 'director', durationInSeconds: 3601 };

beforeEach(async () => {
  sequelize = await instanceSequelizeSQLite3();
  movieRepository = new MovieRepository(sequelize);
  roomRepository  = new RoomRepository(sequelize, movieRepository);
  await movieRepository.create(new Movie(movieInput1));
  await movieRepository.create(new Movie(movieInput2));
  const { registers } = await movieRepository.findAll(1);
  const _room1 = new Room(roomInput1);
  const _room2 = new Room(roomInput2);
  _room1.addMovie(registers[0]);
  _room2.addMovie(registers[1]);
  await roomRepository.create(_room1);
  await roomRepository.create(_room2);
});
afterEach(async () => await sequelize.close());

describe('success', () => {
  test('find all rooms', async () => {
    const findAllHandler = new FindAllHandler(roomRepository);
    const result = await findAllHandler.execute({ page: 1 });
    expect(result.total).toEqual(2);
    expect(result.page).toEqual(1);
    expect(result.registers[0].id).toEqual(roomInput1.id);
    expect(result.registers[0].number).toEqual(roomInput1.number);
    expect(result.registers[0].description).toEqual(roomInput1.description);
    expect(result.registers[0].roomMovies[0]).toEqual({ ...movieInput1, durationInHours: '01:00:00' });
    expect(result.registers[1].id).toEqual(roomInput2.id);
    expect(result.registers[1].number).toEqual(roomInput2.number);
    expect(result.registers[1].description).toEqual(roomInput2.description);
    expect(result.registers[1].roomMovies[0]).toEqual({ ...movieInput2, durationInHours: '01:00:01' });
  });
});
