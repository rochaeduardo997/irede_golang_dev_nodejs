import { Sequelize } from "sequelize-typescript";
import Movie from "../../../movie/entity/Movie";
import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
import { QueryTypes } from "sequelize";
import { TFindAllResponse } from "../../../@shared/repository/repository.interface";

type TSelectOutput = { id: string; name: string; director: string; duration_in_seconds: number };
class MovieRepository implements IMovieRepository {
  constructor(private sequelize: Sequelize){}

  async create(input: Movie): Promise<boolean> {
    try{
      const query = `
        INSERT INTO movies(id, name, director, duration_in_seconds)
        VALUES('${input.id}', '${input.name}', '${input.director}', '${input.durationInSeconds}')
        RETURNING *
      `;
      const [ queryResponse ] = await this.sequelize.query(query, { type: QueryTypes.INSERT });
      const result = queryResponse > 0;
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on create new movie');
    }
  }

  async findAll(page: number): Promise<TFindAllResponse> {
    try{
      const movies = await this.getMoviesBy(page);
      const total = await this.getTotal();
      return { total, page, registers: movies };
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || 'failed on get all movie');
    }
  }
  private async getTotal(): Promise<number>{
    const moviesQuery = `SELECT COUNT(1) as total FROM movies`;
    const [ movies ] = await this.sequelize.query(moviesQuery, { type: QueryTypes.SELECT });
    const { total: result } = movies as { total: number };
    return +result;
  }

  private async getMoviesBy(page: number){
    const limit = 10;
    const offset = limit * (page - 1);
    const query = `
      SELECT *
      FROM movies
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const movies = await this.sequelize.query(query, { type: QueryTypes.SELECT });
    const result: Movie[] = [];
    for(const movie of movies as TSelectOutput[]){
      const m = new Movie({
        id:                movie.id,
        director:          movie.director,
        durationInSeconds: movie.duration_in_seconds,
        name:              movie.name
      });
      result.push(m);
    }
    return result;
  }

  async findBy(id: string): Promise<Movie> {
    try{
      const query = `
        SELECT *
        FROM movies
        WHERE id = '${id}'
      `;
      const movie: TSelectOutput[] = await this.sequelize.query(query, { type: QueryTypes.SELECT });
      const result = new Movie({
        id:                movie[0].id,
        name:              movie[0].name,
        director:          movie[0].director,
        durationInSeconds: movie[0].duration_in_seconds
      });
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0]?.message || `failed on get movie by id ${id}`);
    }
  }

  async updateBy(id: string, input: Movie): Promise<boolean> {
    try{
      const query = `
        UPDATE movies
          SET
            name = '${input.name}',
            director = '${input.director}',
            duration_in_seconds = '${input.durationInSeconds}'
          WHERE id = '${id}'
      `;
      const [ , queryResponse ] = await this.sequelize.query(query, { type: QueryTypes.UPDATE });
      await this.findBy(id);
      const result = queryResponse > 0;
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0].message || `failed on update movie by id ${id}`);
    }
  }

  async deleteBy(id: string): Promise<boolean> {
    try{
      await this.findBy(id);
      const query = `DELETE FROM movies WHERE id = '${id}'`;
      const [, queryResponse ] = await this.sequelize.query(query, { type: QueryTypes.UPDATE });
      const result = queryResponse > 0;
      return result;
    }catch(err: any){
      console.error(err);
      throw new Error(err?.errors?.[0].message || `failed on delete movie by id ${id}`);
    }
  }
}

export default MovieRepository;
