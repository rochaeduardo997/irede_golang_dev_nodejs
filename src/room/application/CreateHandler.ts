import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import Room from "../entity/Room";
import IRoomRepository from "../repository/RoomRepository.interface";

type TRoomMovies = {
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};

type TInput = {
  id:            string;
  number:        number;
  description:   string;
  roomMoviesId?: string[];
};

type TOutput = { 
  id:          string;
  number:      number;
  description: string;
  roomMovies:  TRoomMovies[];
};

class CreateHandler {
  constructor(private roomRepository: IRoomRepository, private movieRepository :IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const id = crypto.randomUUID();
      const room = new Room({ ...input, id });
      for(const movieId of (input.roomMoviesId || [])){
        const movie = await this.movieRepository.findBy(movieId);
        room.addMovie(movie);
      }
      await this.roomRepository.create(room);
      const _room = await this.roomRepository.findBy(id);
      const roomMovies: TRoomMovies[] = [];
      for(const movie of _room.getAssociatedMovies()){
        roomMovies.push({
          id:                movie.id,
          name:              movie.name,
          director:          movie.director,
          durationInSeconds: movie.durationInSeconds,
          durationInHours:   movie.durationInHours()
        });
      }
      const result: TOutput = {
        id,
        description: _room.description,
        number:      _room.number,
        roomMovies
      };
      return result;
    }catch(err: any){
      throw new Error(err?.message);
    }
  }
}

export default CreateHandler;
