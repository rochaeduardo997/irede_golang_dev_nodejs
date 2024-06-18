import Movie from "../entity/Movie";
import IMovieRepository from "../repository/MovieRepository.interface";

type TInput = { 
  name:              string;
  director:          string;
  durationInSeconds: number;
};

type TOutput = { 
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
};

class CreateHandler {
  constructor(private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const id = crypto.randomUUID();
      const movie = new Movie({ ...input, id });
      await this.movieRepository.create(movie);
      const _movie = await this.movieRepository.findBy(id);
      const result: TOutput = {
        id:                _movie.id,
        name:              _movie.name,
        director:          _movie.director,
        durationInSeconds: _movie.durationInSeconds
      };
      return result;
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default CreateHandler;
