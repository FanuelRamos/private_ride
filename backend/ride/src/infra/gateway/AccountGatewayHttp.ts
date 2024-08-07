import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

export default class AccountGatewayHttp implements AccountGateway {

  constructor (readonly httpClient: HttpClient) {}

  async getById(accountId: string): Promise<any> {
    return this.httpClient.get(`http://localhost:3300/accounts/${accountId}`)
  }
  async signup(input: any): Promise<any> {
    return this.httpClient.post(`http://localhost:3300/signup`, input);
  }

}