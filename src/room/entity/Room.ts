import Movie from "../../movie/entity/Movie";

type TInput = { 
  id:          string;
  number:      number;
  description: string;
};
type TUpdateInput = {
  number?:      number;
  description?: string;
};

class Room {
  private _movies: Movie[];

  constructor(private input: TInput){
    this._movies = [];
    this.isValid();
  }

  get id()          { return this.input.id; }
  get number()      { return this.input.number; }
  get description() { return this.input.description; }

  public addMovie(x: Movie): void {
    this._movies.push(x);
    return;
  }

  public getAssociatedMovies(): Movie[] {
    return this._movies;
  }

  public cleanupAssociatedMovies(): void {
    this._movies = [];
    return;
  }

  public update(x: TUpdateInput) {
    this.input = { ...this.input, ...x };
    this.isValid();
  }

  private isValid(): void{
    if(!this.number)    throw new Error('room number must be provided');
    if(this.number < 0) throw new Error('room number must be greater or equal 0');
  }
}

export default Room;
