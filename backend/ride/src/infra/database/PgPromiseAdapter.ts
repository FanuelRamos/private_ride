import pgp from "pg-promise";
import Connection from "./Connection";


export default class PgPromiseAdapter implements Connection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:@localhost:5432/cccat13");
  }

  query(statement: string, data: any): Promise<any> {
    return this.connection.query(statement, data);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}