import IMovieRepository from "../repository/MovieRepository.interface";

type TInput = { id: string };

class DeleteByIdHandler {
  constructor(private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<boolean>{
    try{
      const result = await this.movieRepository.deleteBy(input.id);
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default DeleteByIdHandler;
