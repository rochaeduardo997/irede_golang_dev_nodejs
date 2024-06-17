import IRepository from "../../@shared/repository/repository.interface";
import Room from "../entity/Room";

interface IRoomRepository extends IRepository<Room> {};

export default IRoomRepository;
