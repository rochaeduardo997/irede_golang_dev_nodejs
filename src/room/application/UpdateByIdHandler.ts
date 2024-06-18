import IMovieRepository from "../../movie/repository/MovieRepository.interface";
import IRoomRepository from "../repository/RoomRepository.interface";
import { createHash } from 'crypto';

type TRoomMovies = {
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};

type TInput = {
  id:            string;
  number?:       number;
  description?:  string;
  roomMoviesId?: string[];
};

type TOutput = { 
  id:          string;
  number:      number;
  description: string;
  roomMovies:  TRoomMovies[];
};

class UpdateByIdHandler {
  constructor(private roomRepository: IRoomRepository, private movieRepository: IMovieRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const room = await this.getRoomWithNewMovies(input);
      await this.roomRepository.updateBy(input.id, room);
      const _room = await this.roomRepository.findBy(input.id);
      const roomMovies: TRoomMovies[] = [];
      for(const roomMovie of _room.getAssociatedMovies()){
        roomMovies.push({
          id:                roomMovie.id,
          name:              roomMovie.name,
          director:          roomMovie.director,
          durationInSeconds: roomMovie.durationInSeconds,
          durationInHours:   roomMovie.durationInHours()
        });
      }
      const result: TOutput = {
        id:          _room.id,
        number:      _room.number,
        description: _room.description,
        roomMovies
      };
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }

  private async getRoomWithNewMovies(input: TInput){
    const result = await this.roomRepository.findBy(input.id);
    result.update({ ...input });
    result.cleanupAssociatedMovies();
    for(const movieId of (input.roomMoviesId || [])){
      const movie = await this.movieRepository.findBy(movieId);
      result.addMovie(movie);
    }
    return result;
  }
}

export default UpdateByIdHandler;
