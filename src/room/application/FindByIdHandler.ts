import IRoomRepository from "../repository/RoomRepository.interface";

type TInput = { id: string };

type TRoomMovies = {
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};
type TOutput = { 
  id:          string;
  number:      number;
  description: string;
  roomMovies:  TRoomMovies[];
};

class FindByIdHandler {
  constructor(private roomRepository: IRoomRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const room = await this.roomRepository.findBy(input.id);
      const roomMovies: TRoomMovies[] = [];
      for(const movie of room.getAssociatedMovies()){
        roomMovies.push({
          id:                movie.id,
          name:              movie.name,
          director:          movie.director,
          durationInSeconds: movie.durationInSeconds,
          durationInHours:   movie.durationInHours()
        });
      }
      const result: TOutput = {
        id:          room.id,
        number:      room.number,
        description: room.description,
        roomMovies
      };
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default FindByIdHandler;
