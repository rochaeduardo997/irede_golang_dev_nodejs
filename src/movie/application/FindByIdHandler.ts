import IMovieRepository from "../repository/MovieRepository.interface";

type TInput = { id: string };

type TOutput = { 
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};

class FindByIdHandler {
  constructor(private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const movie = await this.movieRepository.findBy(input.id);
      const result: TOutput = {
        id:                movie.id,
        name:              movie.name,
        director:          movie.director,
        durationInSeconds: movie.durationInSeconds,
        durationInHours:   movie.durationInHours()
      };
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default FindByIdHandler;
