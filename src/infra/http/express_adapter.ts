import IHttp, { TMethods } from "./http.interface";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from '../../swagger';

class ExpressAdapter implements IHttp {
  public app;
  private route;

  constructor(){
    this.app = express()
      .use(cors())
      .use(express.json())
      .use(helmet())
      .use(express.urlencoded());


    this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    this.route = express.Router();
  }

  addRoute(method: TMethods, url: string, callback: Function): void {
    this.route[method](url, async (req, res) => {
      try{
        const { statusCode, result } = await callback(req, res);
        return res.status(statusCode).json({ result });
      }catch(err: any){
        return res.status(400).json({ status: false, msg: err?.message });
      }
    });
  }

  init(): void {
    this.app.use('/api/v1', this.route);
  }

  listen(): void {
    const port = process.env.API_PORT || 3000;
    this.app.listen(port);
    console.log(`server running on ${port}`)
  }
}

export default ExpressAdapter;
