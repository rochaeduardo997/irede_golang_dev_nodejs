export type TFindAllResponse = { total: number; page: number; registers: any };

interface IRepository<T> {
  create(input: T): Promise<boolean>;
  findAll(page: number): Promise<TFindAllResponse>;
  findBy(id: string): Promise<T>;
  updateBy(id: string, input: T): Promise<boolean>;
  deleteBy(id: string): Promise<boolean>;
}

export default IRepository;
