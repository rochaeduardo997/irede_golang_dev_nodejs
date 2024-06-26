import IMovieRepository from "../repository/MovieRepository.interface";

type TInput = {
  id:                 string;
  name?:              string;
  director?:          string;
  durationInSeconds?: number;
};

type TOutput = {
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
};

class UpdateByIdHandler {
  constructor(private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const movie = await this.movieRepository.findBy(input.id);
      movie.update({ ...input });
      await this.movieRepository.updateBy(input.id, movie);
      const _movie = await this.movieRepository.findBy(input.id);
      const result: TOutput = {
        id:                _movie.id,
        name:              _movie.name,
        director:          _movie.director,
        durationInSeconds: _movie.durationInSeconds
      }
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default UpdateByIdHandler;
