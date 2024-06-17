type TInput = { 
  id:                string;
  name:              string;
  director:          string;
  durationInSeconds: number;
};
type TUpdateInput = {
  name:              string;
  director:          string;
  durationInSeconds: number;
};

class Movie {
  constructor(private input: TInput){
    this.isValid();
  }

  get id()                { return this.input.id; }
  get name()              { return this.input.name; }
  get director()          { return this.input.director; }
  get durationInSeconds() { return this.input.durationInSeconds; }

  public durationInHours(): string {
    let hours:   string|number = Math.floor(this.input.durationInSeconds / 3600);
    let minutes: string|number = Math.floor(this.input.durationInSeconds % 3600 / 60);
    let seconds: string|number = Math.floor(this.input.durationInSeconds % 3600 % 60);
    hours   = hours   < 10 ? `0${hours}`   : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${hours}:${minutes}:${seconds}`;
  }


  public update(x: TUpdateInput) {
    this.input = { ...this.input, ...x };
    this.isValid();
  }

  private isValid(): void{
    if(!this.name)                       throw new Error('name must be provided');
    if(!this.director)                   throw new Error('director name must be provided');
    if(!this.input.durationInSeconds)    throw new Error('duration must be provided');
    if(this.input.durationInSeconds < 0) throw new Error('duration must be greater 0');
  }
}

export default Movie;
