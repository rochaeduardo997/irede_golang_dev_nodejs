import Movie from "../../movie/entity/Movie";
import Room from "./Room";

let room: Room;
const input = { id: 'id', number: 100, description: 'description' };
let movie: Movie;
beforeEach(() => {
  room  = new Room(input)
  movie = new Movie({ id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 });
});

describe('success', () => {
  test('validate instance fields', () => {
    const room = new Room(input);
    room.addMovie(movie);
    expect(room.id).toEqual(input.id);
    expect(room.number).toEqual(input.number);
    expect(room.description).toEqual(input.description);
    expect(room.getAssociatedMovies()).toEqual([ movie ]);
  });

  test('validate instance after update', () => {
    const room = new Room(input);
    room.update({ number: 200, description: 'new_description' });
    expect(room.number).toEqual(200);
    expect(room.description).toEqual('new_description');
  });
});

describe('fail', () => {
  test('fail when room number is missing', () => {
    expect(() => new Room({ ...input, number: 0 }))
      .toThrow('room number must be provided');
  });

  test('fail when room number smaller than 0', () => {
    expect(() => new Room({ ...input, number: -1 }))
      .toThrow('room number must be greater or equal 0');
  });
});
