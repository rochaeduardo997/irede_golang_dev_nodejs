import Movie from "../entity/Movie";
import IMovieRepository from "../repository/MovieRepository.interface";

type TInput = { page: number };

type TMovieOutput = { 
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};

type TOutput = {
  total:     number;
  page:      number,
  registers: TMovieOutput[]
};

class FindAllHandler {
  constructor(private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const movies = await this.movieRepository.findAll(input.page);
      const registers: TMovieOutput[] = [];
      for(const movie of movies.registers as Movie[]){
        registers.push({
          id:                movie.id,
          name:              movie.name,
          director:          movie.director,
          durationInHours:   movie.durationInHours(),
          durationInSeconds: movie.durationInSeconds
        });
      }
      const result = {
        total: movies.total,
        page:  movies.page,
        registers
      };
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default FindAllHandler;
