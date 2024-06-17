import IRepository from "../../@shared/repository/repository.interface";
import Movie from "../entity/Movie";

interface IMovieRepository extends IRepository<Movie> {};

export default IMovieRepository;
