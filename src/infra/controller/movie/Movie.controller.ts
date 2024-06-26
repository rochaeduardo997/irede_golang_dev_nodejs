import CreateHandler from "../../../movie/application/CreateHandler";
import DeleteByIdHandler from "../../../movie/application/DeleteByIdHandler";
import FindAllHandler from "../../../movie/application/FindAllHandler";
import FindByIdHandler from "../../../movie/application/FindByIdHandler";
import UpdateByIdHandler from "../../../movie/application/UpdateByIdHandler";
import IMovieRepository from "../../../movie/repository/MovieRepository.interface";
import IHttp from "../../http/http.interface";

type TRouteResponse = { statusCode: number, result: any }

/**
 * @swagger
 *  tags:
 *    name: Movies
 */

class MovieController {
  constructor(httpAdapter: IHttp, private movieRepository: IMovieRepository){
    const BASE_URL_PATH = '/movies';

    httpAdapter.addRoute('post',   `${BASE_URL_PATH}`,           this.CreateRoute.bind(this));
    httpAdapter.addRoute('get',    `${BASE_URL_PATH}/all/:page`, this.FindAllRoute.bind(this));
    httpAdapter.addRoute('get',    `${BASE_URL_PATH}/:id`,       this.FindByIdRoute.bind(this));
    httpAdapter.addRoute('put',    `${BASE_URL_PATH}/:id`,       this.UpdateByIdRoute.bind(this));
    httpAdapter.addRoute('delete', `${BASE_URL_PATH}/:id`,       this.DeleteByIdRoute.bind(this));

    console.log('movie controller successful loaded');
  }

  /**
   * @swagger
   * /movies:
   *   post:
   *     summary: Create a new movie
   *     tags: [Movies]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       201:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Movie'
   */
  private async CreateRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const createHandler = new CreateHandler(this.movieRepository);
      const result = await createHandler.execute(req.body);
      return { statusCode: 201, result };
    }catch(err: any){
      console.error('failed on route: movie create, ', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /movies/all/{page}:
   *   get:
   *     summary: Get all movies
   *     tags: [Movies]
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
   *               $ref: '#/components/schemas/GetMovies'
   */
  private async FindAllRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { page = 1 } = req.params;
      const findAll = new FindAllHandler(this.movieRepository);
      const result = await findAll.execute({ page });
      return { statusCode: 200, result };
    }catch(err: any){
      console.error('failed on route: movie find all, ', err);
      return { statusCode: 400, result: err.message };
    }
  }

  /**
   * @swagger
   * /movies/{id}:
   *   get:
   *     summary: Get movie by id
   *     tags: [Movies]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: movie id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetMovie'
   */
  private async FindByIdRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { id } = req.params;
      const findById = new FindByIdHandler(this.movieRepository);
      const result = await findById.execute({ id });
      return { statusCode: 200, result };
    }catch(err: any){
      console.error('failed on route: movie find by id, ', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /movies/{id}:
   *   put:
   *     summary: Update movie by id
   *     tags: [Movies]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: movie id
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Movie'
   *     responses:
   *       200:
   *         description:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GetMovie'
   */
  private async UpdateByIdRoute(req: any, res: any): Promise<TRouteResponse>{
    try{
      const { id } = req.params;
      const updateById = new UpdateByIdHandler(this.movieRepository);
      const result = await updateById.execute({ ...req.body, id });
      return { statusCode: 200, result }
    }catch(err: any){
      console.error('failed on route: update movie by id', err);
      throw new Error(err.message);
    }
  }

  /**
   * @swagger
   * /movies/{id}:
   *   delete:
   *     summary: Delete movie by id
   *     tags: [Movies]
   *     parameters:
   *       - in : path
   *         name: id
   *         description: movie id
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
      const deleteById = new DeleteByIdHandler(this.movieRepository);
      const result = await deleteById.execute({ id });
      return { statusCode: 200, result }
    }catch(err: any){
      console.error('failed on route: delete movie by id', err);
      throw new Error(err.message);
    }
  }
}

export default MovieController;
