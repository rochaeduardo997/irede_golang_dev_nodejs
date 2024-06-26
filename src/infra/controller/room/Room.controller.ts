import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
import CreateHandler from "../../../room/application/CreateHandler";
import DeleteByIdHandler from "../../../room/application/DeleteByIdHandler";
import FindAllHandler from "../../../room/application/FindAllHandler";
import FindByIdHandler from "../../../room/application/FindByIdHandler";
import UpdateByIdHandler from "../../../room/application/UpdateByIdHandler";
import IRoomRepository from "../../../room/repository/RoomRepository.interface";
import IHttp from "../../http/http.interface";

/**
 * @swagger
 *  tags:
 *    name: Rooms
 */

type TRouteResponse = { statusCode: number, result: any }

class RoomController {
  constructor(httpAdapter: IHttp, private roomRepository: IRoomRepository, private movieRepository: IMovieRepository){
    const BASE_URL_PATH = '/rooms';

    httpAdapter.addRoute('post',   `${BASE_URL_PATH}`,           this.CreateRoute.bind(this));
    httpAdapter.addRoute('get',    `${BASE_URL_PATH}/all/:page`, this.FindAllRoute.bind(this));
    httpAdapter.addRoute('get',    `${BASE_URL_PATH}/:id`,       this.FindByIdRoute.bind(this));
    httpAdapter.addRoute('put',    `${BASE_URL_PATH}/:id`,       this.UpdateByIdRoute.bind(this));
    httpAdapter.addRoute('delete', `${BASE_URL_PATH}/:id`,       this.DeleteByIdRoute.bind(this));

    console.log('room controller successful loaded');
  }

  /**
   * @swagger
   * /rooms:
   *   post:
   *     summary: Create a new room
   *     tags: [Rooms]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Room'
   *     responses:
   *       201:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Room'
   */
  private async CreateRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const createHandler = new CreateHandler(this.roomRepository, this.movieRepository);
      const result = await createHandler.execute(req.body);
      return { statusCode: 201, result };
    }catch(err: any){
      console.error('failed on route: room create, ', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /rooms/all/{page}:
   *   get:
   *     summary: Get all rooms
   *     tags: [Rooms]
   *     parameters:
   *       - in : path
   *         name: page
   *         description: search page
   *         schema:
   *           type: integer
   *         required: true
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetRooms'
   */
  private async FindAllRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { page = 1 } = req.params;
      const findAll = new FindAllHandler(this.roomRepository);
      const result = await findAll.execute({ page });
      return { statusCode: 200, result };
    }catch(err: any){
      console.error('failed on route: room find all, ', err);
      return { statusCode: 400, result: err.message };
    }
  }

  /**
   * @swagger
   * /rooms/{id}:
   *   get:
   *     summary: Get room by id
   *     tags: [Rooms]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: room id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetRoom'
   */
  private async FindByIdRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { id } = req.params;
      const findById = new FindByIdHandler(this.roomRepository);
      const result = await findById.execute({ id });
      return { statusCode: 200, result };
    }catch(err: any){
      console.error('failed on route: room find by id, ', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /rooms/{id}:
   *   put:
   *     summary: Update room by id
   *     tags: [Rooms]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: room id
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Room'
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetRoom'
   */
  private async UpdateByIdRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { id } = req.params;
      const updateById = new UpdateByIdHandler(this.roomRepository, this.movieRepository);
      const result = await updateById.execute({ ...req.body, id });
      return { statusCode: 200, result }
    }catch(err: any){
      console.error('failed on route: update room by id', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /rooms/{id}:
   *   delete:
   *     summary: Delete room by id
   *     tags: [Rooms]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: room id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             type: boolean
   */
  private async DeleteByIdRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { id } = req.params;
      const deleteById = new DeleteByIdHandler(this.roomRepository);
      const result = await deleteById.execute({ id });
      return { statusCode: 200, result }
    }catch(err: any){
      console.error('failed on route: delete room by id', err);
      throw new Error(err.message);
    }
  }
}

export default RoomController;
