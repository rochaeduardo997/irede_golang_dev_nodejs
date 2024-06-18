import { Sequelize } from "sequelize-typescript";
import Room from "../../../room/entity/Room";
import IRoomRepository from "../../../room/repository/RoomRepository.interface";
import { QueryTypes, Transaction } from "sequelize";
import { TFindAllResponse } from "../../../@shared/repository/repository.interface";
import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
import Movie from "../../../movie/entity/Movie";

type TSelectOutput = { id: string; room_number: number; description: string; };
class RoomRepository implements IRoomRepository {
  constructor(private sequelize: Sequelize, private movieRepository: IMovieRepository){}

  async create(input: Room): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try{
      const roomQuery = `
        INSERT INTO rooms(id, room_number, description)
        VALUES('${input.id}', ${input.number}, '${input.description}')
      `;
      const [ queryResponse ] = await this.sequelize.query(roomQuery, { type: QueryTypes.INSERT, transaction });
      for(const movie of input.getAssociatedMovies()){
        const roomMovieQuery = `
          INSERT INTO room_movies(fk_movie_id, fk_room_id)
          VALUES('${movie.id}', '${input.id}')
        `;
        await this.sequelize.query(roomMovieQuery, { type: QueryTypes.INSERT, transaction });
      }
      const result = queryResponse > 0;
      await transaction.commit();
      return result;
    }catch(err: any){
      transaction.rollback();
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on create new room');
    }
  }

  async findAll(page: number): Promise<TFindAllResponse> {
    try{
      const rooms = await this.getRoomsBy(page);
      const total = await this.getTotal();
      return { total, page, registers: rooms };
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on get all rooms');
    }
  }
  private async getTotal(): Promise<number>{
    const roomsQuery = `SELECT COUNT(1) as total FROM rooms`;
    const [ rooms ] = await this.sequelize.query(roomsQuery, { type: QueryTypes.SELECT });
    const { total: result } = rooms as { total: number };
    return +result;
  }

  private async getRoomsBy(page: number){
    const limit = 10;
    const offset = limit * (page - 1);
    const query = `
      SELECT *
      FROM rooms
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const rooms = await this.sequelize.query(query, { type: QueryTypes.SELECT });
    const result: Room[] = [];
    for(const room of rooms as TSelectOutput[]){
      const r = new Room({ id: room.id, number: room.room_number, description: room.description });
      await this.insertMoviesInto(r);
      result.push(r);
    }
    return result;
  }

  async findBy(id: string): Promise<Room> {
    try{
      const query = `
        SELECT *
        FROM rooms
        WHERE id = '${id}'
      `;
      const rooms: TSelectOutput[] = await this.sequelize.query(query, { type: QueryTypes.SELECT });
      const result = new Room({ id: rooms[0].id, number: rooms[0].room_number, description: rooms[0].description });
      await this.insertMoviesInto(result);
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || `failed on get room by id ${id}`);
    }
  }

  private async insertMoviesInto(room: Room){
    const query = `SELECT * FROM room_movies WHERE fk_room_id = '${room.id}'`;
    const roomMovies = await this.sequelize.query(query, { type: QueryTypes.SELECT });
    for(const roomMovie of roomMovies as { fk_movie_id: string, fk_room_id: string }[]){
      const movie = await this.movieRepository.findBy(roomMovie.fk_movie_id);
      room.addMovie(movie);
    }
  }

  async updateBy(id: string, input: Room): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try{
      const query = `
        UPDATE rooms
          SET
            room_number = '${input.number}',
            description = '${input.description}'
          WHERE id = '${id}'
      `;
      const [ , queryResponse ] = await this.sequelize.query(query, { type: QueryTypes.UPDATE, transaction });
      await this.reinsertRoomMovies(input.id, input.getAssociatedMovies(), transaction);
      await this.findBy(id);
      await transaction.commit();
      const result = queryResponse > 0;
      return result;
    }catch(err: any){
      transaction.rollback();
      console.error(err);
      throw new Error(err?.errors?.[0].message || `failed on update room by id ${id}`);
    }
  }
  private async reinsertRoomMovies(roomId: string, roomMovies: Movie[], transaction: Transaction){
    const deleteQuery = `DELETE FROM room_movies WHERE fk_room_id = '${roomId}'`;
    await this.sequelize.query(deleteQuery, { type: QueryTypes.DELETE, transaction });
    for(const movie of roomMovies){
      const roomMovieQuery = `
        INSERT INTO room_movies(fk_movie_id, fk_room_id)
        VALUES('${movie.id}', '${roomId}')
      `;
      await this.sequelize.query(roomMovieQuery, { type: QueryTypes.INSERT, transaction });
    }
  }

  async deleteBy(id: string): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try{
      await this.findBy(id);
      const deleteRoomQuery = `DELETE FROM rooms WHERE id = '${id}'`;
      const [, queryResponse ] = await this.sequelize.query(deleteRoomQuery, { type: QueryTypes.UPDATE });
      const deleteRoomMoviesQuery = `DELETE FROM room_movies WHERE fk_room_id = '${id}'`;
      await this.sequelize.query(deleteRoomMoviesQuery, { type: QueryTypes.DELETE, transaction });
      await transaction.commit();
      const result = queryResponse > 0;
      return result;
    }catch(err: any){
      transaction.rollback();
      console.error(err);
      throw new Error(err?.errors?.[0].message || `failed on delete room by id ${id}`);
    }
  }
}

export default RoomRepository;
