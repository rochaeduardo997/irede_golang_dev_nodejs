import Movie from "./Movie";

let movie: Movie;
const input = { id: 'id', name: 'name', director: 'director', durationInSeconds: 3600 };
beforeEach(() => movie = new Movie(input));

describe('success', () => {
  test('validate instance fields', () => {
    const movie = new Movie(input);
    expect(movie.id).toEqual(input.id);
    expect(movie.name).toEqual(input.name);
    expect(movie.director).toEqual(input.director);
    expect(movie.durationInSeconds).toEqual(input.durationInSeconds);
    expect(movie.durationInHours()).toEqual('01:00:00');
  });

  test('validate instance after update', () => {
    const movie = new Movie(input);
    movie.update({ name: 'new_name', director: 'new_director', durationInSeconds: 50 });
    expect(movie.name).toEqual('new_name');
    expect(movie.director).toEqual('new_director');
    expect(movie.durationInSeconds).toEqual(50);
    expect(movie.durationInHours()).toEqual('00:00:50');
  });
});

describe('fail', () => {
  test('fail when movie durationInSeconds is missing', () => {
    expect(() => new Movie({ ...input, durationInSeconds: 0 }))
      .toThrow('duration must be provided');
  });

  test('fail when movie number smaller than 0', () => {
    expect(() => new Movie({ ...input, durationInSeconds: -1 }))
      .toThrow('duration must be greater 0');
  });
});
