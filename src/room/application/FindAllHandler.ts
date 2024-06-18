import Room from "../entity/Room";
import IRoomRepository from "../repository/RoomRepository.interface";

type TInput = { page: number };

type TRoomMovies = {
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
  durationInHours:   string;
};
type TRoomOutput = { 
  id:          string;
  number:      number;
  description: string;
  roomMovies:  TRoomMovies[];
};
type TOutput = {
  total:     number;
  page:      number,
  registers: TRoomOutput[]
};

class FindAllHandler {
  constructor(private roomRepository: IRoomRepository){}

  async execute(input: TInput): Promise<TOutput>{
    try{
      const rooms = await this.roomRepository.findAll(input.page);
      const registers: TRoomOutput[] = [];
      for(const room of (rooms.registers || []) as Room[]){
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
        registers.push({
          id:          room.id,
          number:      room.number,
          description: room.description,
          roomMovies
        });
      }
      const result: TOutput = {
        total: rooms.total,
        page: rooms.page,
        registers
      };
      return result;
    }catch(err: any){
      throw new Error(err.message);
    }
  }
}

export default FindAllHandler;
